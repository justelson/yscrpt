import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Brain, Key, Lock, CheckCircle } from 'lucide-react';
import { verifyAccessCode } from '../lib/aiService';
import { InfoModal } from './ui/modal';
import api from '../lib/api';

export function AISettings() {
    const [groqCode1, setGroqCode1] = useState('');
    const [groqCode2, setGroqCode2] = useState('');
    const [geminiCode1, setGeminiCode1] = useState('');
    const [geminiCode2, setGeminiCode2] = useState('');
    const [customGroqKey, setCustomGroqKey] = useState('');
    const [customGeminiKey, setCustomGeminiKey] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('groq');
    const [groqUnlocked, setGroqUnlocked] = useState(false);
    const [geminiUnlocked, setGeminiUnlocked] = useState(false);
    const [aiSettings, setAiSettings] = useState(null);
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await api.getAISettings();
                setAiSettings(settings);
                setGroqUnlocked(settings.groqUnlocked || false);
                setGeminiUnlocked(settings.geminiUnlocked || false);
                setSelectedProvider(settings.selectedProvider || 'groq');
                setCustomGroqKey(settings.groqApiKey || '');
                setCustomGeminiKey(settings.geminiApiKey || '');
            } catch (error) {
                console.error('Failed to fetch AI settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleUnlockGroq = () => {
        if (verifyAccessCode('groq', groqCode1, groqCode2)) {
            setGroqUnlocked(true);
            saveAISettings('groq', true, null);
            setInfoModal({ show: true, title: 'Success', message: 'Groq AI unlocked successfully!' });
        } else {
            setInfoModal({ show: true, title: 'Error', message: 'Invalid access codes. Please try again.' });
        }
    };

    const handleUnlockGemini = () => {
        if (verifyAccessCode('gemini', geminiCode1, geminiCode2)) {
            setGeminiUnlocked(true);
            saveAISettings('gemini', true, null);
            setInfoModal({ show: true, title: 'Success', message: 'Gemini AI unlocked successfully!' });
        } else {
            setInfoModal({ show: true, title: 'Error', message: 'Invalid access codes. Please try again.' });
        }
    };

    const handleSaveCustomGroqKey = () => {
        if (!customGroqKey.trim()) {
            setInfoModal({ show: true, title: 'Warning', message: 'Please enter a valid API key' });
            return;
        }
        saveAISettings('groq', true, customGroqKey);
        setGroqUnlocked(true);
        setInfoModal({ show: true, title: 'Success', message: 'Custom Groq API key saved!' });
    };

    const handleSaveCustomGeminiKey = () => {
        if (!customGeminiKey.trim()) {
            setInfoModal({ show: true, title: 'Warning', message: 'Please enter a valid API key' });
            return;
        }
        saveAISettings('gemini', true, customGeminiKey);
        setGeminiUnlocked(true);
        setInfoModal({ show: true, title: 'Success', message: 'Custom Gemini API key saved!' });
    };

    const saveAISettings = async (provider, unlocked, customKey) => {
        const updates = {
            selectedProvider: provider,
            [`${provider}Unlocked`]: unlocked,
            [`${provider}ApiKey`]: customKey,
        };

        try {
            const settings = await api.updateAISettings(updates);
            setAiSettings(settings);
        } catch (error) {
            console.error('Failed to save AI settings:', error);
            setInfoModal({ show: true, title: 'Error', message: 'Failed to save settings' });
        }
    };

    const handleSelectProvider = async (provider) => {
        setSelectedProvider(provider);
        try {
            const settings = await api.updateAISettings({ selectedProvider: provider });
            setAiSettings(settings);
        } catch (error) {
            console.error('Failed to update provider:', error);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <CardTitle>AI Features Configuration</CardTitle>
                    </div>
                    <CardDescription>
                        Unlock AI-powered features to enhance your transcript experience
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Provider Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select AI Provider</CardTitle>
                    <CardDescription>Choose which AI service to use for features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                            variant={selectedProvider === 'groq' ? 'default' : 'outline'}
                            className="h-auto py-4"
                            onClick={() => handleSelectProvider('groq')}
                        >
                            <div className="text-left w-full">
                                <div className="font-semibold">Groq</div>
                                <div className="text-xs opacity-80">Fast inference</div>
                            </div>
                        </Button>
                        <Button
                            variant={selectedProvider === 'gemini' ? 'default' : 'outline'}
                            className="h-auto py-4"
                            onClick={() => handleSelectProvider('gemini')}
                        >
                            <div className="text-left w-full">
                                <div className="font-semibold">Gemini</div>
                                <div className="text-xs opacity-80">Google AI</div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Groq Unlock */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Groq AI Access</CardTitle>
                            <CardDescription>Unlock with access codes or use your own key</CardDescription>
                        </div>
                        {(groqUnlocked || aiSettings?.groqUnlocked) && (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!(groqUnlocked || aiSettings?.groqUnlocked) && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Access Codes</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                        type="password"
                                        placeholder="Code 1"
                                        value={groqCode1}
                                        onChange={(e) => setGroqCode1(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Code 2"
                                        value={groqCode2}
                                        onChange={(e) => setGroqCode2(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleUnlockGroq} className="w-full">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Unlock with Codes
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Custom API Key</label>
                                <Input
                                    type="password"
                                    placeholder="gsk_..."
                                    value={customGroqKey}
                                    onChange={(e) => setCustomGroqKey(e.target.value)}
                                />
                                <Button
                                    onClick={handleSaveCustomGroqKey}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Key className="mr-2 h-4 w-4" />
                                    Use Custom Key
                                </Button>
                            </div>
                        </>
                    )}
                    {(groqUnlocked || aiSettings?.groqUnlocked) && (
                        <div className="text-center py-4 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                            <p className="font-semibold">Groq AI Unlocked!</p>
                            <p className="text-sm text-muted-foreground">
                                You can now use all AI features with Groq
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Gemini Unlock */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Gemini AI Access</CardTitle>
                            <CardDescription>Unlock with access codes or use your own key</CardDescription>
                        </div>
                        {(geminiUnlocked || aiSettings?.geminiUnlocked) && (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!(geminiUnlocked || aiSettings?.geminiUnlocked) && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Access Codes</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                        type="password"
                                        placeholder="Code 1"
                                        value={geminiCode1}
                                        onChange={(e) => setGeminiCode1(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Code 2"
                                        value={geminiCode2}
                                        onChange={(e) => setGeminiCode2(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleUnlockGemini} className="w-full">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Unlock with Codes
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Custom API Key</label>
                                <Input
                                    type="password"
                                    placeholder="AIza..."
                                    value={customGeminiKey}
                                    onChange={(e) => setCustomGeminiKey(e.target.value)}
                                />
                                <Button
                                    onClick={handleSaveCustomGeminiKey}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Key className="mr-2 h-4 w-4" />
                                    Use Custom Key
                                </Button>
                            </div>
                        </>
                    )}
                    {(geminiUnlocked || aiSettings?.geminiUnlocked) && (
                        <div className="text-center py-4 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                            <p className="font-semibold">Gemini AI Unlocked!</p>
                            <p className="text-sm text-muted-foreground">
                                You can now use all AI features with Gemini
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Modal */}
            <InfoModal
                isOpen={infoModal.show}
                onClose={() => setInfoModal({ show: false, title: '', message: '' })}
                title={infoModal.title}
                message={infoModal.message}
            />
        </div>
    );
}
