import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Markdown } from '../ui/markdown';
import { Loader2, MessageSquare, ArrowLeft, Save } from 'lucide-react';
import { chatAboutTranscript } from '../../lib/aiService';
import { InfoModal } from '../ui/modal';
import api from '../../lib/api';

export function ChatTool({  transcript, provider, apiKey }) {
    const navigate = useNavigate();
    const [chatMessage, setChatMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });
    const [chatHistory, setChatHistory] = useState([]);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [thinkingPun, setThinkingPun] = useState('');
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, typingText, loading]);

    const thinkingPuns = [
        "🤔 Consulting my neural networks...",
        "🧠 Processing at the speed of thought...",
        "⚡ Firing up the neurons...",
        "🎯 Analyzing the transcript matrix...",
        "🔮 Channeling my inner AI wisdom...",
        "💭 Computing the perfect response...",
        "🚀 Launching thought rockets...",
        "🎨 Painting with words and data...",
        "🔍 Searching the knowledge base...",
        "✨ Sprinkling some AI magic...",
    ];

    const typeText = async (text, callback) => {
        setIsTyping(true);
        setTypingText('');
        
        const words = text.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            setTypingText(currentText);
            // Fast typing: 30ms per word
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        
        setIsTyping(false);
        callback();
    };

    const handleSend = async () => {
        if (!chatMessage.trim()) {
            setErrorModal({ show: true, message: 'Please enter a message' });
            return;
        }

        const userMessage = chatMessage;
        setChatMessage('');

        // Immediately show user message
        const userMsg = { role: 'user', content: userMessage, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);

        // Show thinking animation
        setLoading(true);
        const randomPun = thinkingPuns[Math.floor(Math.random() * thinkingPuns.length)];
        setThinkingPun(randomPun);

        try {
            const formattedHistory = chatHistory.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await chatAboutTranscript(
                provider,
                apiKey,
                transcript.transcript,
                userMessage,
                formattedHistory
            );

            setLoading(false);

            // Type out the response
            await typeText(response, () => {
                const assistantMsg = { role: 'assistant', content: response, timestamp: new Date() };
                setChatHistory(prev => [...prev, assistantMsg]);
                setTypingText('');
            });

        } catch (error) {
            setLoading(false);
            setErrorModal({ show: true, message: error.message });
        }
    };

    const handleSaveToMemories = async () => {
        try {
            if (chatHistory.length === 0) {
                setErrorModal({ show: true, message: 'No chat history to save' });
                return;
            }

            console.log('Saving chat with messages:', chatHistory);

            const memoryData = {
                type: 'chat',
                title: `Chat - ${transcript.title}`,
                videoTitle: transcript.title,
                toolName: 'Chat',
                transcriptId: transcript._id || transcript.id,
                messages: chatHistory,
                metadata: {
                    provider,
                },
            };

            console.log('Memory data to save:', memoryData);

            const result = await api.saveMemory(memoryData);
            console.log('Save result:', result);
            
            setErrorModal({ show: true, message: `Chat saved to Memories! (${chatHistory.length} messages)` });
        } catch (error) {
            console.error('Save error:', error);
            setErrorModal({ show: true, message: 'Failed to save: ' + error.message });
        }
    };

    const handleDownloadMessage = (userMsg, assistantMsg) => {
        const format = prompt(`Choose format:\n1. Text (.txt)\n2. JSON (.json)\n3. Markdown (.md)\n\nEnter 1, 2, or 3:`);

        let content = `Q: ${userMsg.content}\n\nA: ${assistantMsg.content}`;
        let filename = `chat_${transcript.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
        let mimeType = 'text/plain';

        switch (format) {
            case '1':
                filename += '.txt';
                mimeType = 'text/plain';
                break;
            case '2':
                content = JSON.stringify({
                    question: userMsg.content,
                    answer: assistantMsg.content,
                    transcript: transcript.title,
                    timestamp: userMsg.timestamp
                }, null, 2);
                filename += '.json';
                mimeType = 'application/json';
                break;
            case '3':
                content = `# Chat - ${transcript.title}\n\n**Q:** ${userMsg.content}\n\n**A:** ${assistantMsg.content}`;
                filename += '.md';
                mimeType = 'text/markdown';
                break;
            default:
                return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadFullChat = () => {
        if (chatHistory.length === 0) {
            setErrorModal({ show: true, message: 'No chat history to download' });
            return;
        }

        const format = prompt(`Choose format:\n1. Text (.txt)\n2. JSON (.json)\n3. Markdown (.md)\n\nEnter 1, 2, or 3:`);

        let content = '';
        let filename = `full_chat_${transcript.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}`;
        let mimeType = 'text/plain';

        switch (format) {
            case '1':
                content = chatHistory.map(msg =>
                    `${msg.role === 'user' ? 'Q' : 'A'}: ${msg.content}\n\n`
                ).join('---\n\n');
                filename += '.txt';
                mimeType = 'text/plain';
                break;
            case '2':
                content = JSON.stringify({
                    transcript: transcript.title,
                    messages: chatHistory,
                    exportedAt: Date.now()
                }, null, 2);
                filename += '.json';
                mimeType = 'application/json';
                break;
            case '3':
                content = `# Chat History - ${transcript.title}\n\n` +
                    chatHistory.map(msg =>
                        `**${msg.role === 'user' ? 'Q' : 'A'}:** ${msg.content}\n\n`
                    ).join('---\n\n');
                filename += '.md';
                mimeType = 'text/markdown';
                break;
            default:
                return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <div className="mb-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/ai-tools')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tools
                </Button>
            </div>

            <Card className="flex flex-col h-[calc(100vh-12rem)] md:h-auto">
                <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <CardTitle>Chat About Transcript</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/ai-tools/chat')}
                            className="hidden sm:flex"
                        >
                            Change Transcript
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 truncate">
                        {transcript.title}
                    </p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto space-y-3 bg-muted p-4 rounded">
                        {chatHistory.length === 0 && !loading && !isTyping ? (
                            <p className="text-center text-muted-foreground text-sm">
                                Start a conversation about this transcript
                            </p>
                        ) : (
                            <>
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={msg.role === 'user' ? 'text-right mb-2' : 'text-left mb-2'}>
                                        <div className={`inline-block p-3 rounded text-sm max-w-[80%] break-words animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground text-left'
                                                : 'bg-card border'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                msg.content
                                            ) : (
                                                <Markdown>{msg.content}</Markdown>
                                            )}
                                        </div>
                                        {msg.role === 'assistant' && idx > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDownloadMessage(chatHistory[idx - 1], msg)}
                                                    className="text-xs h-6"
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {/* AI Thinking Animation */}
                                {loading && (
                                    <div className="text-left mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="inline-block p-3 rounded text-sm max-w-[80%] bg-card border">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                                <span className="text-muted-foreground text-xs">{thinkingPun}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Typing Animation */}
                                {isTyping && typingText && (
                                    <div className="text-left mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="inline-block p-3 rounded text-sm max-w-[80%] bg-card border">
                                            <Markdown>{typingText}</Markdown>
                                            <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse"></span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input - Fixed at bottom */}
                    {/* Download Full Chat Button */}
                    {chatHistory.length > 0 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveToMemories}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save to Memories
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadFullChat}
                            >
                                Download Full Chat
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2 flex-shrink-0">
                        <Input
                            placeholder="Ask a question..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                            className="flex-1"
                        />
                        <Button onClick={handleSend} disabled={loading} className="flex-shrink-0">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Send'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <InfoModal
                isOpen={errorModal.show}
                onClose={() => setErrorModal({ show: false, message: '' })}
                title="Error"
                message={errorModal.message}
            />
        </>
    );
}
