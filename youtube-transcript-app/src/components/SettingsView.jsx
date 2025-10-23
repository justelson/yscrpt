import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { User, Database, Trash2, LogOut, Brain, HardDrive } from 'lucide-react';
import { AIConfigModal } from './AIConfigModal';
import { UserProfileSettings } from './UserProfileSettings';
import { ConfirmModal, InfoModal } from './ui/modal';
import api from '../lib/api';
import { cacheManager, localCache } from '../lib/cache';

export function SettingsView({ user, onSignOut }) {
    const [showAIConfig, setShowAIConfig] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [cacheInfo, setCacheInfo] = useState({ videoCount: 0, channelCount: 0 });
    const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getTranscripts();
                setTranscripts(data);
                
                const info = await cacheManager.getCacheInfo();
                setCacheInfo(info);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const transcriptCount = transcripts.length;

    const handleDeleteAll = async () => {
        try {
            await api.deleteAllTranscripts();
            setTranscripts([]);
            setShowDeleteConfirm(false);
            setShowDeleteSuccess(true);
        } catch (error) {
            console.error('Failed to delete transcripts:', error);
        }
    };

    const handleClearCache = async () => {
        try {
            await cacheManager.clearAll();
            localCache.clear();
            setCacheInfo({ videoCount: 0, channelCount: 0 });
            setShowClearCacheConfirm(false);
            setShowDeleteSuccess(true);
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Profile Settings */}
                <UserProfileSettings user={user} />

                {/* AI Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="h-5 w-5 text-primary" />
                                <CardTitle>AI Features</CardTitle>
                            </div>
                            <Button variant="outline" onClick={() => setShowAIConfig(true)}>
                                Configure
                            </Button>
                        </div>
                        <CardDescription>
                            Unlock AI-powered tools for transcript analysis
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <CardTitle>Account Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="font-mono text-sm">{user.id}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        <CardTitle>Storage</CardTitle>
                    </div>
                    <CardDescription>Manage your saved transcripts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Transcripts</p>
                        <p className="text-2xl font-bold">{transcriptCount}</p>
                    </div>
                    {transcriptCount > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete All Transcripts
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5" />
                        <CardTitle>Browser Cache</CardTitle>
                    </div>
                    <CardDescription>Cached data for faster loading</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Cached Videos</p>
                            <p className="text-2xl font-bold">{cacheInfo.videoCount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cached Channels</p>
                            <p className="text-2xl font-bold">{cacheInfo.channelCount}</p>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Cache automatically expires after 24 hours. Clearing cache will require re-fetching data.
                    </p>
                    {(cacheInfo.videoCount > 0 || cacheInfo.channelCount > 0) && (
                        <Button
                            variant="outline"
                            onClick={() => setShowClearCacheConfirm(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Browser Cache
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full" onClick={onSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>YouTube Transcript Fetcher v1.0</p>
                    <p>Built with React, Vite, InstantDB, and shadcn/ui</p>
                    <p>Extract and manage YouTube video transcripts with ease</p>
                </CardContent>
            </Card>
        </div>

        {/* Modals */}
        <AIConfigModal isOpen={showAIConfig} onClose={() => setShowAIConfig(false)} user={user} />
        <ConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteAll}
            title="Delete All Transcripts?"
            message={`Are you sure you want to delete all ${transcriptCount} transcripts? This action cannot be undone.`}
        />
        <InfoModal
            isOpen={showDeleteSuccess}
            onClose={() => setShowDeleteSuccess(false)}
            title="Success!"
            message="All transcripts have been deleted."
        />
        <ConfirmModal
            isOpen={showClearCacheConfirm}
            onClose={() => setShowClearCacheConfirm(false)}
            onConfirm={handleClearCache}
            title="Clear Browser Cache?"
            message="This will clear all cached videos and channel data. You'll need to re-fetch them next time."
        />
    </>
    );
}
