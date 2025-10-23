import { useState, useEffect } from 'react';
import { Modal, InfoModal } from './ui/modal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Brain, CheckCircle } from 'lucide-react';
import { verifyAccessCode } from '../lib/aiService';
import api from '../lib/api';

export function AIConfigModal({ isOpen, onClose }) {
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [customKey, setCustomKey] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [aiSettings, setAiSettings] = useState(null);
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        if (isOpen) {
            const fetchSettings = async () => {
                try {
                    const settings = await api.getAISettings();
                    setAiSettings(settings);
                } catch (error) {
                    console.error('Failed to fetch AI settings:', error);
                }
            };
            fetchSettings();
        }
    }, [isOpen]);

    const handleUnlock = async () => {
        if (!selectedProvider) {
            setInfoModal({ show: true, title: 'Warning', message: 'Please select a provider' });
            return;
        }

        let success = false;
        let useCustomKey = false;

        // Check if using custom key
        if (customKey.trim()) {
            success = true;
            useCustomKey = true;
        } else if (code1 && code2) {
            // Verify access codes
            success = verifyAccessCode(selectedProvider, code1, code2);
            if (!success) {
                setInfoModal({ show: true, title: 'Error', message: 'Invalid access codes. Please try again.' });
                return;
            }
        } else {
            setInfoModal({ show: true, title: 'Warning', message: 'Please enter access codes or a custom API key' });
            return;
        }

        // Save to database
        await api.updateAISettings({
            selectedProvider: selectedProvider,
            [`${selectedProvider}Unlocked`]: true,
            [`${selectedProvider}ApiKey`]: useCustomKey ? customKey : null,
        });

        setSuccessMessage(
            `${selectedProvider === 'groq' ? 'Groq' : 'Gemini'} AI unlocked successfully!`
        );
        setShowSuccess(true);
        setCode1('');
        setCode2('');
        setCustomKey('');
        setSelectedProvider(null);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Configure AI Service" size="md">
                <div className="space-y-6">
                    {/* Provider Selection */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Select AI Provider
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setSelectedProvider('groq')}
                                className={`p-4 border-2 rounded transition-all ${selectedProvider === 'groq'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="text-left">
                                    <div className="font-semibold">Groq</div>
                                    <div className="text-xs text-muted-foreground">
                                        Fast inference
                                    </div>
                                    {aiSettings?.groqUnlocked && (
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-2" />
                                    )}
                                </div>
                            </button>
                            <button
                                onClick={() => setSelectedProvider('gemini')}
                                className={`p-4 border-2 rounded transition-all ${selectedProvider === 'gemini'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="text-left">
                                    <div className="font-semibold">Gemini</div>
                                    <div className="text-xs text-muted-foreground">Google AI</div>
                                    {aiSettings?.geminiUnlocked && (
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-2" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {selectedProvider && (
                        <>
                            {/* Access Codes */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Access Codes (Free)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="password"
                                        placeholder="Code 1"
                                        value={code1}
                                        onChange={(e) => setCode1(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Code 2"
                                        value={code2}
                                        onChange={(e) => setCode2(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            {/* Custom API Key */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Custom API Key (Optional)
                                </label>
                                <Input
                                    type="password"
                                    placeholder={
                                        selectedProvider === 'groq' ? 'gsk_...' : 'AIza...'
                                    }
                                    value={customKey}
                                    onChange={(e) => setCustomKey(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use your own API key for unlimited access
                                </p>
                            </div>

                            <Button onClick={handleUnlock} className="w-full">
                                <Brain className="mr-2 h-4 w-4" />
                                Unlock {selectedProvider === 'groq' ? 'Groq' : 'Gemini'}
                            </Button>
                        </>
                    )}
                </div>
            </Modal>

            <InfoModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                title="Success!"
                message={successMessage}
            />

            <InfoModal
                isOpen={infoModal.show}
                onClose={() => setInfoModal({ show: false, title: '', message: '' })}
                title={infoModal.title}
                message={infoModal.message}
            />
        </>
    );
}
