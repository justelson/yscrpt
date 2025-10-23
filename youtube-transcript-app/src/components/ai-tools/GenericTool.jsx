import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Markdown } from '../ui/markdown';
import { Loader2, ArrowLeft, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    generateQuestions,
    generateFlashcards,
    summarizeTranscript,
    generateNewScript,
    extractKeyPoints,
    translateTranscript,
} from '../../lib/aiService';
import { InfoModal } from '../ui/modal';
import api from '../../lib/api';

export function GenericTool({ transcript, provider, apiKey, toolConfig }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [options, setOptions] = useState(toolConfig.defaultOptions || {});
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setResult('');

        try {
            let response = '';
            let input = '';

            switch (toolConfig.id) {
                case 'questions':
                    input = `${options.count} questions`;
                    response = await generateQuestions(
                        provider,
                        apiKey,
                        transcript.transcript,
                        options.count
                    );
                    break;

                case 'flashcards':
                    input = `${options.count} flashcards`;
                    response = await generateFlashcards(
                        provider,
                        apiKey,
                        transcript.transcript,
                        options.count
                    );
                    break;

                case 'summary':
                    input = 'Summary request';
                    response = await summarizeTranscript(provider, apiKey, transcript.transcript);
                    break;

                case 'keypoints':
                    input = 'Key points request';
                    response = await extractKeyPoints(provider, apiKey, transcript.transcript);
                    break;

                case 'rewrite':
                    input = `Rewrite in ${options.style} style`;
                    response = await generateNewScript(
                        provider,
                        apiKey,
                        transcript.transcript,
                        options.style
                    );
                    break;

                case 'translate':
                    input = `Translate to ${options.language}`;
                    response = await translateTranscript(
                        provider,
                        apiKey,
                        transcript.transcript,
                        options.language
                    );
                    break;

                default:
                    break;
            }

            // History saving removed - can be added back if needed

            setResult(response);
        } catch (error) {
            setErrorModal({ show: true, message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToMemories = async () => {
        try {
            const memoryData = {
                type: toolConfig.id,
                title: `${toolConfig.name} - ${transcript.title}`,
                videoTitle: transcript.title,
                toolName: toolConfig.name,
                transcriptId: transcript._id || transcript.id,
                metadata: {
                    provider,
                    options,
                },
            };

            if (toolConfig.id === 'flashcards' || toolConfig.id === 'questions') {
                // Parse JSON cards
                const cards = JSON.parse(result);
                memoryData.cards = cards;
                memoryData.result = result; // Keep original JSON string
            } else {
                // Save other AI outputs as text
                memoryData.result = result;
            }

            await api.saveMemory(memoryData);
            setErrorModal({ show: true, message: 'Saved to Memories!' });
        } catch (error) {
            setErrorModal({ show: true, message: 'Failed to save: ' + error.message });
        }
    };

    const handleDownload = () => {


        // Create download options modal
        const format = prompt(`Choose format:\n1. Text (.txt)\n2. JSON (.json)\n3. Markdown (.md)\n\nEnter 1, 2, or 3:`);

        let content = result;
        let filename = `${toolConfig.id}_${transcript.title.replace(/[^a-z0-9]/gi, '_')}`;
        let mimeType = 'text/plain';

        switch (format) {
            case '1':
                content = result;
                filename += '.txt';
                mimeType = 'text/plain';
                break;
            case '2':
                if (toolConfig.id === 'flashcards' || toolConfig.id === 'questions') {
                    content = result; // Already JSON
                } else {
                    content = JSON.stringify({ content: result, type: toolConfig.id, timestamp: Date.now() }, null, 2);
                }
                filename += '.json';
                mimeType = 'application/json';
                break;
            case '3':
                content = `# ${toolConfig.name}\n\n${result}`;
                filename += '.md';
                mimeType = 'text/markdown';
                break;
            default:
                return; // Cancel download
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const Icon = toolConfig.icon;

    return (
        <>
            <div className="mb-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/ai-tools')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tools
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className="h-5 w-5 text-primary" />
                                <CardTitle>{toolConfig.name}</CardTitle>
                            </div>
                            <CardDescription>{toolConfig.description}</CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/ai-tools/${toolConfig.id}`)}
                        >
                            Change Transcript
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{transcript.title}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Options */}
                    {toolConfig.options && (
                        <div className="space-y-4">
                            {toolConfig.options.map((option) => (
                                <div key={option.key}>
                                    <label className="text-sm font-medium">{option.label}</label>
                                    {option.type === 'number' && (
                                        <Input
                                            type="number"
                                            min={option.min}
                                            max={option.max}
                                            value={options[option.key]}
                                            onChange={(e) =>
                                                setOptions({
                                                    ...options,
                                                    [option.key]: parseInt(e.target.value),
                                                })
                                            }
                                        />
                                    )}
                                    {option.type === 'text' && (
                                        <Input
                                            type="text"
                                            placeholder={option.placeholder}
                                            value={options[option.key]}
                                            onChange={(e) =>
                                                setOptions({
                                                    ...options,
                                                    [option.key]: e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                    {option.type === 'select' && (
                                        <select
                                            className="w-full p-2 border rounded bg-background"
                                            value={options[option.key]}
                                            onChange={(e) =>
                                                setOptions({
                                                    ...options,
                                                    [option.key]: e.target.value,
                                                })
                                            }
                                        >
                                            {option.choices.map((choice) => (
                                                <option key={choice} value={choice}>
                                                    {choice}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Generate Button */}
                    <Button onClick={handleGenerate} disabled={loading} className="w-full">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                            </>
                        ) : (
                            toolConfig.buttonText
                        )}
                    </Button>

                    {/* Result */}
                    {result && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium">Result</label>

                            {(toolConfig.id === 'flashcards' || toolConfig.id === 'questions') ? (
                                <FlashcardPreview
                                    result={result}
                                    currentCardIndex={currentCardIndex}
                                    setCurrentCardIndex={setCurrentCardIndex}
                                    showAnswer={showAnswer}
                                    setShowAnswer={setShowAnswer}
                                />
                            ) : (
                                <div className="bg-muted p-4 rounded max-h-96 overflow-y-auto text-sm">
                                    <Markdown>{result}</Markdown>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(result);
                                        setErrorModal({ show: true, message: 'Copied to clipboard!' });
                                    }}
                                >
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDownload}
                                >
                                    Download
                                </Button>
                                <Button
                                    onClick={handleSaveToMemories}
                                >
                                    Save to Memories
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <InfoModal
                isOpen={errorModal.show}
                onClose={() => setErrorModal({ show: false, message: '' })}
                title="Info"
                message={errorModal.message}
            />
        </>
    );
}

function FlashcardPreview({ result, currentCardIndex, setCurrentCardIndex, showAnswer, setShowAnswer }) {
    let cards = [];
    try {
        cards = JSON.parse(result);
    } catch {
        return (
            <div className="bg-muted p-4 rounded text-sm">
                <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
        );
    }

    if (!Array.isArray(cards) || cards.length === 0) {
        return (
            <div className="bg-muted p-4 rounded text-sm">
                <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
        );
    }

    const currentCard = cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / cards.length) * 100;

    const handleNextCard = () => {
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        }
    };

    const handlePreviousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setShowAnswer(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Card {currentCardIndex + 1} of {cards.length}</span>
                <div className="w-32 bg-muted rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Flip Card */}
            <div className="perspective-1000">
                <div
                    className={`relative w-full min-h-[250px] transition-transform duration-700 transform-style-3d`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {/* Front - Question */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg min-h-[250px] flex flex-col items-center justify-center border-2 border-primary/20"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                    >
                        <div className="text-xs font-medium text-primary mb-3 uppercase tracking-wide">
                            Question
                        </div>
                        <p className="text-lg font-semibold text-center">
                            {currentCard.question}
                        </p>
                    </div>

                    {/* Back - Answer */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-lg min-h-[250px] flex flex-col items-center justify-center border-2 border-green-500/20"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="text-xs font-medium text-green-600 mb-3 uppercase tracking-wide">
                            Answer
                        </div>
                        <p className="text-base text-center">{currentCard.answer}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <Button
                    onClick={handlePreviousCard}
                    disabled={currentCardIndex === 0}
                    variant="outline"
                    size="sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                    onClick={() => setShowAnswer(!showAnswer)}
                    variant="outline"
                    className="flex-1"
                >
                    <RotateCw className="mr-2 h-4 w-4" />
                    {showAnswer ? 'Show Question' : 'Flip to Answer'}
                </Button>

                <Button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === cards.length - 1}
                    variant="outline"
                    size="sm"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
