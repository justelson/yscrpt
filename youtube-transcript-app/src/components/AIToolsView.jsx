import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Brain,
    MessageSquare,
    HelpCircle,
    BookOpen,
    FileText,
    Sparkles,
    Languages,
    Loader2,
} from 'lucide-react';
import {
    chatAboutTranscript,
    generateQuestions,
    generateFlashcards,
    summarizeTranscript,
    generateNewScript,
    extractKeyPoints,
    translateTranscript,
} from '../lib/aiService';
import { InfoModal } from './ui/modal';
// InstantDB removed - using MongoDB API

export function AIToolsView({ user }) {
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [activeTool, setActiveTool] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [scriptStyle, setScriptStyle] = useState('professional');
    const [targetLanguage, setTargetLanguage] = useState('Spanish');
    const [questionCount, setQuestionCount] = useState(5);
    const [flashcardCount, setFlashcardCount] = useState(10);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });

    // Get saved transcripts
    const { data: transcriptsData } = db.useQuery({
        transcripts: {
            $: {
                where: {
                    userId: user.id,
                },
            },
        },
    });

    // Get AI settings
    const { data: aiData } = db.useQuery({
        aiSettings: {
            $: {
                where: {
                    userId: user.id,
                },
            },
        },
    });

    // Get AI history for selected transcript
    const { data: historyData } = db.useQuery(
        selectedTranscript
            ? {
                aiHistory: {
                    $: {
                        where: {
                            userId: user.id,
                            transcriptId: selectedTranscript.id,
                        },
                    },
                },
            }
            : null
    );

    const transcripts = transcriptsData?.transcripts || [];
    const aiSettings = aiData?.aiSettings?.[0];
    const chatHistory = historyData?.aiHistory || [];
    const provider = aiSettings?.selectedProvider || 'groq';
    const apiKey =
        provider === 'groq' ? aiSettings?.groqCustomKey : aiSettings?.geminiCustomKey;
    const isUnlocked =
        provider === 'groq' ? aiSettings?.groqUnlocked : aiSettings?.geminiUnlocked;

    const tools = [
        {
            id: 'chat',
            name: 'Chat About Transcript',
            icon: MessageSquare,
            description: 'Ask questions about the transcript',
        },
        {
            id: 'questions',
            name: 'Generate Questions',
            icon: HelpCircle,
            description: 'Create study questions',
        },
        {
            id: 'flashcards',
            name: 'Create Flashcards',
            icon: BookOpen,
            description: 'Generate flashcards for studying',
        },
        {
            id: 'summary',
            name: 'Summarize',
            icon: FileText,
            description: 'Get a concise summary',
        },
        {
            id: 'keypoints',
            name: 'Extract Key Points',
            icon: Sparkles,
            description: 'Identify main ideas',
        },
        {
            id: 'rewrite',
            name: 'Rewrite Script',
            icon: FileText,
            description: 'Generate new script in different style',
        },
        {
            id: 'translate',
            name: 'Translate',
            icon: Languages,
            description: 'Translate to another language',
        },
    ];

    const saveToHistory = async (tool, input, output) => {
        const historyId = crypto.randomUUID();
        await db.transact([
            db.tx.aiHistory[historyId].update({
                userId: user.id,
                transcriptId: selectedTranscript.id,
                tool: tool,
                input: input,
                output: output,
                provider: provider,
                createdAt: Date.now(),
            }),
        ]);
    };

    const handleToolAction = async (toolId) => {
        setLoading(true);
        setResult('');

        try {
            let response = '';
            let input = '';

            switch (toolId) {
                case 'chat': {
                    if (!chatMessage.trim()) {
                        setErrorModal({ show: true, message: 'Please enter a message' });
                        setLoading(false);
                        return;
                    }
                    input = chatMessage;
                    const formattedHistory = chatHistory.map((h) => ({
                        role: h.input ? 'user' : 'assistant',
                        content: h.input || h.output,
                    }));
                    response = await chatAboutTranscript(
                        provider,
                        apiKey,
                        selectedTranscript.transcript,
                        chatMessage,
                        formattedHistory
                    );
                    await saveToHistory('chat', chatMessage, response);
                    setChatMessage('');
                    break;
                }

                case 'questions':
                    input = `${questionCount} questions`;
                    response = await generateQuestions(
                        provider,
                        apiKey,
                        selectedTranscript.transcript,
                        questionCount
                    );
                    await saveToHistory('questions', input, response);
                    break;

                case 'flashcards':
                    input = `${flashcardCount} flashcards`;
                    response = await generateFlashcards(
                        provider,
                        apiKey,
                        selectedTranscript.transcript,
                        flashcardCount
                    );
                    await saveToHistory('flashcards', input, response);
                    break;

                case 'summary':
                    response = await summarizeTranscript(
                        provider,
                        apiKey,
                        selectedTranscript.transcript
                    );
                    await saveToHistory('summary', 'Summary request', response);
                    break;

                case 'keypoints':
                    response = await extractKeyPoints(
                        provider,
                        apiKey,
                        selectedTranscript.transcript
                    );
                    await saveToHistory('keypoints', 'Key points request', response);
                    break;

                case 'rewrite':
                    input = `Rewrite in ${scriptStyle} style`;
                    response = await generateNewScript(
                        provider,
                        apiKey,
                        selectedTranscript.transcript,
                        scriptStyle
                    );
                    await saveToHistory('rewrite', input, response);
                    break;

                case 'translate':
                    input = `Translate to ${targetLanguage}`;
                    response = await translateTranscript(
                        provider,
                        apiKey,
                        selectedTranscript.transcript,
                        targetLanguage
                    );
                    await saveToHistory('translate', input, response);
                    break;

                default:
                    break;
            }

            setResult(response);
        } catch (error) {
            setErrorModal({ show: true, message: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isUnlocked) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                        AI features are locked. Please configure them in Settings.
                    </p>
                    <Button onClick={() => (window.location.href = '/settings')}>
                        Go to Settings
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!selectedTranscript) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            <CardTitle>AI Tools</CardTitle>
                        </div>
                        <CardDescription>
                            Select a saved transcript to use AI features
                        </CardDescription>
                    </CardHeader>
                </Card>

                {transcripts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground mb-4">
                                No saved transcripts. Fetch and save a transcript first.
                            </p>
                            <Button onClick={() => (window.location.href = '/fetch')}>
                                Fetch Transcript
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {transcripts.map((transcript) => (
                            <Card
                                key={transcript.id}
                                className="cursor-pointer hover:shadow-lg transition-all"
                                onClick={() => setSelectedTranscript(transcript)}
                            >
                                <CardContent className="p-4">
                                    <h3 className="font-semibold mb-1">{transcript.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        by {transcript.author}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="h-5 w-5 text-primary" />
                                <CardTitle>AI Tools</CardTitle>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTranscript(null)}
                            >
                                Change Transcript
                            </Button>
                        </div>
                        <CardDescription>
                            Using {provider === 'groq' ? 'Groq' : 'Gemini'} AI •{' '}
                            {selectedTranscript.title}
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Tool Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Card
                                key={tool.id}
                                className={`cursor-pointer transition-all hover:shadow-lg ${activeTool === tool.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => setActiveTool(tool.id)}
                            >
                                <CardContent className="p-4">
                                    <Icon className="h-8 w-8 text-primary mb-2" />
                                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {tool.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tool Interface */}
                {activeTool && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{tools.find((t) => t.id === activeTool)?.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Chat Interface */}
                            {activeTool === 'chat' && (
                                <div className="space-y-4">
                                    {chatHistory.length > 0 && (
                                        <div className="max-h-64 overflow-y-auto space-y-2 bg-muted p-4 rounded">
                                            {chatHistory.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`${msg.input ? 'text-right' : 'text-left'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block p-2 rounded text-sm ${msg.input
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-card'
                                                            }`}
                                                    >
                                                        {msg.input || msg.output}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ask a question about the transcript..."
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            onKeyPress={(e) =>
                                                e.key === 'Enter' && handleToolAction('chat')
                                            }
                                        />
                                        <Button
                                            onClick={() => handleToolAction('chat')}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Send'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Questions */}
                            {activeTool === 'questions' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Number of Questions
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={questionCount}
                                            onChange={(e) =>
                                                setQuestionCount(parseInt(e.target.value))
                                            }
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handleToolAction('questions')}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                                Generating...
                                            </>
                                        ) : (
                                            'Generate Questions'
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Flashcards */}
                            {activeTool === 'flashcards' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Number of Flashcards
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={flashcardCount}
                                            onChange={(e) =>
                                                setFlashcardCount(parseInt(e.target.value))
                                            }
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handleToolAction('flashcards')}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Flashcards'
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Rewrite Script */}
                            {activeTool === 'rewrite' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Writing Style</label>
                                        <select
                                            className="w-full p-2 border rounded bg-background"
                                            value={scriptStyle}
                                            onChange={(e) => setScriptStyle(e.target.value)}
                                        >
                                            <option value="professional">Professional</option>
                                            <option value="casual">Casual</option>
                                            <option value="academic">Academic</option>
                                            <option value="simple">Simple/ELI5</option>
                                            <option value="storytelling">Storytelling</option>
                                        </select>
                                    </div>
                                    <Button
                                        onClick={() => handleToolAction('rewrite')}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                                Rewriting...
                                            </>
                                        ) : (
                                            'Rewrite Script'
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Translate */}
                            {activeTool === 'translate' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Target Language
                                        </label>
                                        <Input
                                            placeholder="e.g., Spanish, French, Japanese"
                                            value={targetLanguage}
                                            onChange={(e) => setTargetLanguage(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => handleToolAction('translate')}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                                Translating...
                                            </>
                                        ) : (
                                            'Translate'
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Simple Actions */}
                            {['summary', 'keypoints'].includes(activeTool) && (
                                <Button
                                    onClick={() => handleToolAction(activeTool)}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                            Processing...
                                        </>
                                    ) : (
                                        `Generate ${activeTool === 'summary' ? 'Summary' : 'Key Points'
                                        }`
                                    )}
                                </Button>
                            )}

                            {/* Result Display */}
                            {result && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium mb-2 block">Result</label>
                                    <div className="bg-muted p-4 rounded max-h-96 overflow-y-auto whitespace-pre-wrap">
                                        {result}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="mt-2 w-full"
                                        onClick={() => {
                                            navigator.clipboard.writeText(result);
                                            setErrorModal({
                                                show: true,
                                                message: 'Copied to clipboard!',
                                            });
                                        }}
                                    >
                                        Copy to Clipboard
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <InfoModal
                isOpen={errorModal.show}
                onClose={() => setErrorModal({ show: false, message: '' })}
                title="Info"
                message={errorModal.message}
            />
        </>
    );
}
