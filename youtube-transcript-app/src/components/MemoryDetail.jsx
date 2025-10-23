import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Markdown } from './ui/markdown';
import { ChevronLeft, ChevronRight, RotateCw, X, Check, Download, Share2, Printer } from 'lucide-react';
import { Modal, InfoModal } from './ui/modal';
import api from '../lib/api';

export function MemoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memory, setMemory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [downloadModal, setDownloadModal] = useState(false);
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Define navigation handlers first
    const handleNextCard = useCallback((wasCorrect) => {
        if (wasCorrect !== undefined) {
            setScore(prev => ({
                correct: prev.correct + (wasCorrect ? 1 : 0),
                total: prev.total + 1,
            }));
        }

        setCurrentCardIndex(prev => {
            if (memory && prev < memory.cards.length - 1) {
                setShowAnswer(false);
                return prev + 1;
            }
            return prev;
        });
    }, [memory]);

    const handlePreviousCard = useCallback(() => {
        setCurrentCardIndex(prev => {
            if (prev > 0) {
                setShowAnswer(false);
                return prev - 1;
            }
            return prev;
        });
    }, []);

    useEffect(() => {
        const fetchMemory = async () => {
            try {
                const memories = await api.getMemories();
                let foundMemory = memories.find(m => m._id === id);

                if (foundMemory) {
                    // Normalize memory format - parse result if it's JSON string
                    if (foundMemory.result && typeof foundMemory.result === 'string') {
                        try {
                            const parsed = JSON.parse(foundMemory.result);
                            console.log('Parsed result:', parsed);

                            // Check if it's an array of cards
                            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
                                console.log('Found cards array in result');
                                foundMemory = {
                                    ...foundMemory,
                                    cards: parsed,
                                };
                            }
                            // Check if it's an object with cards property
                            else if (parsed.cards && Array.isArray(parsed.cards)) {
                                console.log('Found cards in parsed object');
                                foundMemory = {
                                    ...foundMemory,
                                    cards: parsed.cards,
                                    type: parsed.type || foundMemory.type,
                                };
                            }
                        } catch (e) {
                            console.log('Failed to parse result:', e);
                            // Not JSON or parsing failed, keep as is
                        }
                    }

                    console.log('Final memory:', foundMemory);
                    console.log('Memory type:', foundMemory.type);
                    console.log('Has messages field:', 'messages' in foundMemory);
                    console.log('Messages value:', foundMemory.messages);
                    console.log('Messages is array:', Array.isArray(foundMemory.messages));
                    console.log('Messages length:', foundMemory.messages?.length);
                    
                    setMemory(foundMemory);
                } else {
                    navigate('/memories');
                }
            } catch (error) {
                console.error('Failed to fetch memory:', error);
                navigate('/memories');
            } finally {
                setLoading(false);
            }
        };

        fetchMemory();

        // Set up polling for live updates every 30 seconds
        const interval = setInterval(fetchMemory, 30000);
        return () => clearInterval(interval);
    }, [id, navigate]);

    // Keyboard navigation for flashcards
    useEffect(() => {
        if (!memory || memory.type === 'chat' || (!memory.cards || memory.cards.length === 0)) {
            return;
        }

        const handleKeyPress = (e) => {
            // Space or Enter to flip
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setShowAnswer(prev => !prev);
            }
            // Arrow keys for navigation
            else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePreviousCard();
            }
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNextCard();
            }
            // Number keys for correct/wrong (only when answer is shown)
            else if (showAnswer && memory.type === 'flashcards') {
                if (e.key === '1') {
                    e.preventDefault();
                    handleNextCard(false); // Wrong
                }
                else if (e.key === '2') {
                    e.preventDefault();
                    handleNextCard(true); // Correct
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [memory, showAnswer, handleNextCard, handlePreviousCard]);

    // Touch swipe handlers for mobile
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNextCard();
        }
        if (isRightSwipe) {
            handlePreviousCard();
        }
    };

    const handleDownloadFormat = (format) => {
        if (!memory) return;

        let content = '';
        let filename = `${memory.title.replace(/[^a-z0-9]/gi, '_')}_memory`;
        let mimeType = 'text/plain';

        switch (format) {
            case 'txt':
                if (memory.type === 'flashcards' || memory.type === 'questions') {
                    content = memory.cards.map((card, i) => `${i + 1}. Q: ${card.question}\n   A: ${card.answer}\n\n`).join('');
                } else if (memory.type === 'chat' && memory.messages) {
                    content = memory.messages.map(msg =>
                        `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}\n\n`
                    ).join('---\n\n');
                } else {
                    content = memory.result || memory.content || JSON.stringify(memory, null, 2);
                }
                filename += '.txt';
                mimeType = 'text/plain';
                break;
            case 'json':
                content = JSON.stringify(memory, null, 2);
                filename += '.json';
                mimeType = 'application/json';
                break;
            case 'md':
                if (memory.type === 'flashcards' || memory.type === 'questions') {
                    content = `# ${memory.title}\n\n` +
                        memory.cards.map((card, i) => `## ${i + 1}. ${card.question}\n\n${card.answer}\n\n`).join('');
                } else if (memory.type === 'chat' && memory.messages) {
                    content = `# ${memory.title}\n\n` +
                        memory.messages.map(msg =>
                            `**${msg.role === 'user' ? 'You' : 'AI'}:** ${msg.content}\n\n`
                        ).join('---\n\n');
                } else {
                    content = `# ${memory.title}\n\n${memory.result || memory.content || JSON.stringify(memory, null, 2)}`;
                }
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

        setDownloadModal(false);
    };

    const handleShare = () => {
        let shareText = memory.title + '\n\n';

        // Format based on memory type
        if (memory.type === 'flashcards' || memory.type === 'questions') {
            if (memory.cards && memory.cards.length > 0) {
                shareText += memory.cards.map((card, i) =>
                    `${i + 1}. Q: ${card.question}\n   A: ${card.answer}`
                ).join('\n\n');
            }
        } else if (memory.type === 'chat' && memory.messages) {
            shareText += memory.messages.map(msg =>
                `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
            ).join('\n\n---\n\n');
        } else {
            shareText += memory.result || memory.content || '';
        }

        const shareUrl = window.location.href;
        shareText += `\n\n${shareUrl}`;

        if (navigator.share) {
            navigator.share({
                title: memory.title,
                text: shareText,
            }).catch(() => {
                navigator.clipboard.writeText(shareText);
                setInfoModal({ show: true, title: 'Success', message: 'Content copied to clipboard!' });
            });
        } else {
            navigator.clipboard.writeText(shareText);
            setInfoModal({ show: true, title: 'Success', message: 'Content copied to clipboard!' });
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        
        let content = '';
        if (memory.type === 'chat' && memory.messages) {
            content = memory.messages.map(m => 
                `<div style="margin: 15px 0; padding: 10px; background: ${m.role === 'user' ? '#e3f2fd' : '#f5f5f5'}; border-left: 4px solid ${m.role === 'user' ? '#2196f3' : '#757575'};">
                    <strong style="color: ${m.role === 'user' ? '#1976d2' : '#424242'};">${m.role === 'user' ? 'You' : 'AI'}:</strong>
                    <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${m.content}</p>
                </div>`
            ).join('');
        } else if (memory.cards && memory.cards.length > 0) {
            content = memory.cards.map((c, i) => 
                `<div style="margin: 20px 0; padding: 15px; border: 2px solid #e0e0e0; page-break-inside: avoid;">
                    <div style="background: #2196f3; color: white; padding: 8px; margin: -15px -15px 10px -15px; font-weight: bold;">
                        Question ${i + 1}
                    </div>
                    <p style="font-size: 16px; font-weight: 500; margin: 10px 0;">${c.question}</p>
                    <div style="background: #4caf50; color: white; padding: 8px; margin: 10px -15px 10px -15px; font-weight: bold;">
                        Answer
                    </div>
                    <p style="margin: 10px 0;">${c.answer}</p>
                </div>`
            ).join('');
        } else {
            content = `<pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; background: #f5f5f5; padding: 15px; border-radius: 4px;">${memory.result || memory.content || 'No content'}</pre>`;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${memory.title}</title>
                    <style>
                        @media print {
                            body { margin: 0; }
                            @page { margin: 1cm; }
                        }
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                            padding: 20px;
                            max-width: 800px;
                            margin: 0 auto;
                            line-height: 1.6;
                        }
                        h1 { 
                            color: #1976d2;
                            border-bottom: 3px solid #2196f3;
                            padding-bottom: 10px;
                            margin-bottom: 20px;
                        }
                        .meta {
                            color: #757575;
                            font-size: 14px;
                            margin-bottom: 30px;
                        }
                    </style>
                </head>
                <body>
                    <h1>${memory.title}</h1>
                    <div class="meta">
                        <strong>Type:</strong> ${memory.type ? memory.type.charAt(0).toUpperCase() + memory.type.slice(1) : 'Memory'} | 
                        <strong>Created:</strong> ${new Date(memory.createdAt).toLocaleDateString()} |
                        <strong>Items:</strong> ${memory.cards?.length || memory.messages?.length || 1}
                    </div>
                    ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Loading memory...</p>
            </div>
        );
    }

    if (!memory) {
        return null;
    }

    // Chat display mode
    if (memory.type === 'chat') {
        // Debug logging
        console.log('Chat memory:', {
            hasMessages: !!memory.messages,
            messagesLength: memory.messages?.length,
            messagesType: typeof memory.messages,
            fullMemory: memory
        });

        if (!memory.messages || memory.messages.length === 0) {
            return (
                <div className="space-y-6">
                    <Button variant="outline" onClick={() => navigate('/memories')}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Memories
                    </Button>
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No messages in this chat conversation.</p>
                            <p className="text-xs text-muted-foreground mt-2">Debug: {JSON.stringify({ hasMessages: !!memory.messages, length: memory.messages?.length })}</p>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => navigate('/memories')}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Memories
                    </Button>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDownloadModal(true)}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handlePrint} className="hidden sm:flex">
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{memory.title}</CardTitle>
                        <CardDescription>
                            {memory.messages.length} messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto bg-muted p-4 rounded-lg">
                            {memory.messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={msg.role === 'user' ? 'text-right' : 'text-left'}
                                >
                                    <div className={`inline-block p-3 rounded-lg text-sm max-w-[80%] break-words ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground text-left'
                                        : 'bg-card border'
                                        }`}>
                                        <div className="font-semibold text-xs mb-1 opacity-70">
                                            {msg.role === 'user' ? 'You' : 'AI'}
                                        </div>
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            {msg.role === 'user' ? (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            ) : (
                                                <Markdown>{msg.content}</Markdown>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Flashcard/Question display mode - check for cards first!
    if ((memory.type === 'flashcards' || memory.type === 'questions') && memory.cards && memory.cards.length > 0) {
        const currentCard = memory.cards[currentCardIndex];
        const progress = ((currentCardIndex + 1) / memory.cards.length) * 100;

        return (
            <>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={() => navigate('/memories')}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Memories
                        </Button>
                        <div className="flex gap-2">
                            <div className="text-sm text-muted-foreground">
                                Score: {score.correct}/{score.total}
                            </div>
                            <Button size="sm" variant="outline" onClick={handleShare}>
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setDownloadModal(true)}>
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{memory.title}</CardTitle>
                            <CardDescription>
                                Card {currentCardIndex + 1} of {memory.cards.length}
                            </CardDescription>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Flip Card Container */}
                            <div
                                className="relative w-full cursor-pointer select-none"
                                style={{ perspective: '1000px' }}
                                onClick={() => setShowAnswer(!showAnswer)}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                <div
                                    className="relative w-full min-h-[350px] sm:min-h-[400px] transition-transform duration-700"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: showAnswer ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                    }}
                                >
                                    {/* Front - Question Card */}
                                    <div
                                        className="absolute inset-0 w-full h-full rounded-xl shadow-2xl"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                        }}
                                    >
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl border-4 border-blue-200 dark:border-blue-800 p-8 sm:p-12 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
                                            {/* Decorative corner pattern */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-bl-full"></div>
                                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-tr-full"></div>

                                            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md z-10">
                                                Question
                                            </div>
                                            <div className="absolute top-4 right-4 bg-blue-500/80 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md z-10">
                                                {currentCardIndex + 1}/{memory.cards.length}
                                            </div>
                                            <div className="w-full max-h-[250px] sm:max-h-[300px] overflow-y-auto flex items-center justify-center z-10">
                                                <div className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 prose prose-lg dark:prose-invert max-w-none">
                                                    <Markdown>{currentCard.question}</Markdown>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 right-4 text-blue-400 dark:text-blue-600 z-10">
                                                <RotateCw className="h-6 w-6 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back - Answer Card */}
                                    <div
                                        className="absolute inset-0 w-full h-full rounded-xl shadow-2xl"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateX(180deg)',
                                        }}
                                    >
                                        <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 rounded-xl border-4 border-green-200 dark:border-green-800 p-8 sm:p-12 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
                                            {/* Decorative corner pattern */}
                                            <div className="absolute top-0 left-0 w-32 h-32 bg-green-200/20 dark:bg-green-800/20 rounded-br-full"></div>
                                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-200/20 dark:bg-green-800/20 rounded-tl-full"></div>

                                            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md z-10">
                                                Answer
                                            </div>
                                            <div className="absolute top-4 right-4 bg-green-500/80 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md z-10">
                                                {currentCardIndex + 1}/{memory.cards.length}
                                            </div>
                                            <div className="w-full max-h-[250px] sm:max-h-[300px] overflow-y-auto flex items-center justify-center z-10">
                                                <div className="text-lg sm:text-xl text-center text-gray-800 dark:text-gray-100 prose dark:prose-invert max-w-none">
                                                    <Markdown>{currentCard.answer}</Markdown>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 right-4 text-green-400 dark:text-green-600 z-10">
                                                <Check className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Flip Instruction */}
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                    <RotateCw className="h-4 w-4" />
                                    Click card to flip • {showAnswer ? 'Showing Answer' : 'Showing Question'}
                                </p>
                                <div className="text-xs text-muted-foreground/70 flex flex-wrap items-center justify-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Space</kbd> Flip
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-0.5 bg-muted rounded text-xs">←</kbd>
                                        <kbd className="px-2 py-0.5 bg-muted rounded text-xs">→</kbd> Navigate
                                    </span>
                                    {memory.type === 'flashcards' && showAnswer && (
                                        <>
                                            <span className="flex items-center gap-1">
                                                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">1</kbd> Wrong
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">2</kbd> Correct
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Controls - Always visible but disabled until answer is shown */}
                            {memory.type === 'flashcards' && (
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => handleNextCard(false)}
                                        variant="outline"
                                        className="flex-1"
                                        size="lg"
                                        disabled={!showAnswer}
                                    >
                                        <X className="mr-2 h-5 w-5" />
                                        Wrong
                                    </Button>
                                    <Button
                                        onClick={() => handleNextCard(true)}
                                        className="flex-1"
                                        size="lg"
                                        disabled={!showAnswer}
                                    >
                                        <Check className="mr-2 h-5 w-5" />
                                        Correct
                                    </Button>
                                </div>
                            )}

                            {/* Questions mode - just navigation */}
                            {memory.type === 'questions' && (
                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => handleNextCard()}
                                        className="flex-1"
                                        size="lg"
                                        disabled={!showAnswer}
                                    >
                                        Next Question
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={handlePreviousCard}
                                    disabled={currentCardIndex === 0}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleNextCard()}
                                    disabled={currentCardIndex === memory.cards.length - 1}
                                >
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Download Format Modal */}
                <Modal
                    isOpen={downloadModal}
                    onClose={() => setDownloadModal(false)}
                    title="Choose Download Format"
                    size="sm"
                >
                    <div className="space-y-3">
                        <Button
                            onClick={() => handleDownloadFormat('txt')}
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <div className="text-left">
                                <div className="font-medium">Text (.txt)</div>
                                <div className="text-xs text-muted-foreground">Plain text format</div>
                            </div>
                        </Button>

                        <Button
                            onClick={() => handleDownloadFormat('json')}
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <div className="text-left">
                                <div className="font-medium">JSON (.json)</div>
                                <div className="text-xs text-muted-foreground">Structured data format</div>
                            </div>
                        </Button>

                        <Button
                            onClick={() => handleDownloadFormat('md')}
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <div className="text-left">
                                <div className="font-medium">Markdown (.md)</div>
                                <div className="text-xs text-muted-foreground">Formatted text</div>
                            </div>
                        </Button>
                    </div>
                </Modal>

                {/* Info Modal */}
                <InfoModal
                    isOpen={infoModal.show}
                    onClose={() => setInfoModal({ show: false, title: '', message: '' })}
                    title={infoModal.title}
                    message={infoModal.message}
                />
            </>
        );
    }

    // Text-based memory display (summary, keypoints, translate, rewrite, etc.)
    // This is the fallback for all other memory types
    const content = memory.result || memory.content || 'No content available';

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <Button variant="outline" onClick={() => navigate('/memories')}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Memories
                    </Button>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button size="sm" variant="outline" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDownloadModal(true)}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handlePrint} className="hidden sm:flex">
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{memory.title}</CardTitle>
                        <CardDescription>
                            {memory.type ? memory.type.charAt(0).toUpperCase() + memory.type.slice(1) : 'Memory'}
                            {memory.videoTitle && ` - ${memory.videoTitle}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 sm:p-6 rounded-lg max-h-[70vh] overflow-y-auto">
                            <div className="text-sm leading-relaxed">
                                <Markdown>{content}</Markdown>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Download Format Modal */}
            <Modal
                isOpen={downloadModal}
                onClose={() => setDownloadModal(false)}
                title="Choose Download Format"
                size="sm"
            >
                <div className="space-y-3">
                    <Button
                        onClick={() => handleDownloadFormat('txt')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <div className="text-left">
                            <div className="font-medium">Text (.txt)</div>
                            <div className="text-xs text-muted-foreground">Plain text format</div>
                        </div>
                    </Button>

                    <Button
                        onClick={() => handleDownloadFormat('json')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <div className="text-left">
                            <div className="font-medium">JSON (.json)</div>
                            <div className="text-xs text-muted-foreground">Structured data format</div>
                        </div>
                    </Button>

                    <Button
                        onClick={() => handleDownloadFormat('md')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <div className="text-left">
                            <div className="font-medium">Markdown (.md)</div>
                            <div className="text-xs text-muted-foreground">Formatted text</div>
                        </div>
                    </Button>
                </div>
            </Modal>

            {/* Info Modal */}
            <InfoModal
                isOpen={infoModal.show}
                onClose={() => setInfoModal({ show: false, title: '', message: '' })}
                title={infoModal.title}
                message={infoModal.message}
            />
        </>
    );
}
