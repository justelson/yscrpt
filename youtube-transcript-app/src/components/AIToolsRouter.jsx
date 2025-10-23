import React from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
    Brain,
    MessageSquare,
    HelpCircle,
    BookOpen,
    FileText,
    Sparkles,
    Languages,
    ArrowLeft,
} from 'lucide-react';
import { ChatTool } from './ai-tools/ChatTool';
import { GenericTool } from './ai-tools/GenericTool';
import api from '../lib/api';

export function AIToolsRouter({ user }) {
    const navigate = useNavigate();
    const [transcripts, setTranscripts] = React.useState([]);
    const [aiSettings, setAiSettings] = React.useState(null);
    const [, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [transcriptsData, settingsData] = await Promise.all([
                    api.getTranscripts(),
                    api.getAISettings()
                ]);
                setTranscripts(transcriptsData);
                setAiSettings(settingsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Set up polling for live updates every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const provider = aiSettings?.selectedProvider || 'groq';
    const apiKey =
        provider === 'groq' ? aiSettings?.groqCustomKey : aiSettings?.geminiCustomKey;
    const isUnlocked =
        provider === 'groq' ? aiSettings?.groqUnlocked : aiSettings?.geminiUnlocked;

    const tools = [
        {
            id: 'chat',
            name: 'Chat',
            icon: MessageSquare,
            description: 'Ask questions',
            path: '/ai-tools/chat',
        },
        {
            id: 'questions',
            name: 'Questions',
            icon: HelpCircle,
            description: 'Generate questions',
            path: '/ai-tools/questions',
        },
        {
            id: 'flashcards',
            name: 'Flashcards',
            icon: BookOpen,
            description: 'Create flashcards',
            path: '/ai-tools/flashcards',
        },
        {
            id: 'summary',
            name: 'Summary',
            icon: FileText,
            description: 'Summarize content',
            path: '/ai-tools/summary',
        },
        {
            id: 'keypoints',
            name: 'Key Points',
            icon: Sparkles,
            description: 'Extract key points',
            path: '/ai-tools/keypoints',
        },
        {
            id: 'rewrite',
            name: 'Rewrite',
            icon: FileText,
            description: 'Rewrite script',
            path: '/ai-tools/rewrite',
        },
        {
            id: 'translate',
            name: 'Translate',
            icon: Languages,
            description: 'Translate text',
            path: '/ai-tools/translate',
        },
    ];

    const toolConfigs = {
        questions: {
            id: 'questions',
            name: 'Generate Questions',
            icon: HelpCircle,
            description: 'Create study questions from the transcript',
            buttonText: 'Generate Questions',
            options: [
                {
                    key: 'count',
                    label: 'Number of Questions',
                    type: 'number',
                    min: 1,
                    max: 20,
                },
            ],
            defaultOptions: { count: 5 },
        },
        flashcards: {
            id: 'flashcards',
            name: 'Create Flashcards',
            icon: BookOpen,
            description: 'Generate flashcards for studying',
            buttonText: 'Create Flashcards',
            options: [
                {
                    key: 'count',
                    label: 'Number of Flashcards',
                    type: 'number',
                    min: 1,
                    max: 30,
                },
            ],
            defaultOptions: { count: 10 },
        },
        summary: {
            id: 'summary',
            name: 'Summarize Transcript',
            icon: FileText,
            description: 'Get a comprehensive summary',
            buttonText: 'Generate Summary',
            defaultOptions: {},
        },
        keypoints: {
            id: 'keypoints',
            name: 'Extract Key Points',
            icon: Sparkles,
            description: 'Identify main ideas and concepts',
            buttonText: 'Extract Key Points',
            defaultOptions: {},
        },
        rewrite: {
            id: 'rewrite',
            name: 'Rewrite Script',
            icon: FileText,
            description: 'Transform the script into different styles',
            buttonText: 'Rewrite Script',
            options: [
                {
                    key: 'style',
                    label: 'Writing Style',
                    type: 'select',
                    choices: ['professional', 'casual', 'academic', 'simple', 'storytelling'],
                },
            ],
            defaultOptions: { style: 'professional' },
        },
        translate: {
            id: 'translate',
            name: 'Translate Transcript',
            icon: Languages,
            description: 'Translate to another language',
            buttonText: 'Translate',
            options: [
                {
                    key: 'language',
                    label: 'Target Language',
                    type: 'text',
                    placeholder: 'e.g., Spanish, French, Japanese',
                },
            ],
            defaultOptions: { language: 'Spanish' },
        },
    };

    if (!isUnlocked) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                        AI features are locked. Please configure them in Settings.
                    </p>
                    <Button onClick={() => navigate('/settings')}>Go to Settings</Button>
                </CardContent>
            </Card>
        );
    }

    if (transcripts.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                        No saved transcripts. Fetch and save a transcript first.
                    </p>
                    <Button onClick={() => navigate('/fetch')}>Fetch Transcript</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-primary" />
                                    <CardTitle>AI Tools</CardTitle>
                                </div>
                                <CardDescription>
                                    Select a tool to analyze your transcripts
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tools.map((tool) => {
                                const Icon = tool.icon;
                                return (
                                    <Card
                                        key={tool.id}
                                        className="cursor-pointer hover:shadow-lg transition-all"
                                        onClick={() => navigate(tool.path)}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                                            <h3 className="font-semibold text-sm mb-1">
                                                {tool.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {tool.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                }
            />

            {/* Individual Tool Routes */}
            {tools.map((tool) => (
                <Route
                    key={tool.id}
                    path={`/${tool.id}/:transcriptId`}
                    element={
                        tool.id === 'chat' ? (
                            <ChatToolWrapper
                                user={user}
                                transcripts={transcripts}
                                provider={provider}
                                apiKey={apiKey}
                            />
                        ) : (
                            <GenericToolWrapper
                                user={user}
                                transcripts={transcripts}
                                provider={provider}
                                apiKey={apiKey}
                                toolConfig={toolConfigs[tool.id]}
                            />
                        )
                    }
                />
            ))}

            {/* Transcript Selection Routes */}
            {tools.map((tool) => (
                <Route
                    key={`${tool.id}-select`}
                    path={`/${tool.id}`}
                    element={
                        <TranscriptSelector
                            transcripts={transcripts}
                            toolName={tool.name}
                            toolPath={tool.path}
                        />
                    }
                />
            ))}

            <Route path="*" element={<Navigate to="/ai-tools" replace />} />
        </Routes>
    );
}

function TranscriptSelector({ transcripts, toolName, toolPath }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div>
                <Button variant="outline" size="sm" onClick={() => navigate('/ai-tools')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tools
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select a Transcript</CardTitle>
                    <CardDescription>Choose a transcript to use with {toolName}</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-4">
                {transcripts.map((transcript) => {
                    const transcriptId = transcript._id || transcript.id;
                    return (
                        <Card
                            key={transcriptId}
                            className="cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => navigate(`${toolPath}/${transcriptId}`)}
                        >
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-1">{transcript.title}</h3>
                                <p className="text-sm text-muted-foreground">by {transcript.author}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

function ChatToolWrapper({ user, transcripts, provider, apiKey }) {
    const { transcriptId } = useParams();
    const transcript = transcripts.find((t) => (t._id || t.id) === transcriptId);

    if (!transcript) return <Navigate to="/ai-tools/chat" replace />;

    return <ChatTool user={user} transcript={transcript} provider={provider} apiKey={apiKey} />;
}

function GenericToolWrapper({ user, transcripts, provider, apiKey, toolConfig }) {
    const { transcriptId } = useParams();
    const transcript = transcripts.find((t) => (t._id || t.id) === transcriptId);

    if (!transcript) return <Navigate to={`/ai-tools/${toolConfig.id}`} replace />;

    return (
        <GenericTool
            user={user}
            transcript={transcript}
            provider={provider}
            apiKey={apiKey}
            toolConfig={toolConfig}
        />
    );
}


