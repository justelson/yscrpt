import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Trash2, Download, Eye } from 'lucide-react';
import { downloadAsSRT, downloadAsTXT, downloadAsJSON } from '../lib/download';
import { InfoModal } from './ui/modal';
import api from '../lib/api';

export function LibraryView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [transcripts, setTranscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        const fetchTranscripts = async () => {
            try {
                const data = await api.getTranscripts();
                setTranscripts(data);
            } catch (error) {
                console.error('Failed to fetch transcripts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTranscripts();

        // Set up polling for live updates every 30 seconds
        const interval = setInterval(fetchTranscripts, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredTranscripts = transcripts.filter(
        (t) =>
            t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this transcript?')) return;
        try {
            // Optimistic update
            setTranscripts(transcripts.filter(t => t._id !== id));
            await api.deleteTranscript(id);
        } catch (error) {
            console.error('Failed to delete transcript:', error);
            setInfoModal({ show: true, title: 'Error', message: 'Failed to delete transcript' });
            // Refresh on error
            const data = await api.getTranscripts();
            setTranscripts(data);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (selectedTranscript) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Button variant="outline" onClick={() => setSelectedTranscript(null)}>
                        ← Back to Library
                    </Button>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                downloadAsSRT(
                                    selectedTranscript.transcript,
                                    selectedTranscript.title
                                )
                            }
                            className="flex-1 sm:flex-none"
                        >
                            <Download className="mr-2 h-4 w-4" /> SRT
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                downloadAsTXT(
                                    selectedTranscript.transcript,
                                    selectedTranscript.title
                                )
                            }
                            className="flex-1 sm:flex-none"
                        >
                            <Download className="mr-2 h-4 w-4" /> TXT
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                downloadAsJSON(
                                    selectedTranscript.transcript,
                                    selectedTranscript.videoInfo,
                                    selectedTranscript.title
                                )
                            }
                            className="flex-1 sm:flex-none"
                        >
                            <Download className="mr-2 h-4 w-4" /> JSON
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{selectedTranscript.title}</CardTitle>
                        <CardDescription>by {selectedTranscript.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[600px] overflow-y-auto space-y-2 bg-muted p-4 rounded-lg">
                            {selectedTranscript.transcript.map((item, index) => (
                                <div key={index} className="flex gap-3 text-sm">
                                    <span className="text-muted-foreground font-mono min-w-[60px]">
                                        {Math.floor(item.offset / 1000)}s
                                    </span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Loading transcripts...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>My Transcript Library</CardTitle>
                        <CardDescription>
                            {transcripts.length} saved transcript{transcripts.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Search transcripts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Button variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {filteredTranscripts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? 'No transcripts found matching your search'
                                    : 'No saved transcripts yet. Fetch and save your first transcript!'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredTranscripts.map((transcript) => (
                            <Card key={transcript._id}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                        <div className="flex-1 w-full">
                                            <h3 className="font-semibold text-base sm:text-lg mb-1">
                                                {transcript.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                by {transcript.author}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Saved on {formatDate(transcript.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedTranscript(transcript)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Eye className="h-4 w-4 sm:mr-0" />
                                                <span className="sm:hidden ml-2">View</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(transcript._id)}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <Trash2 className="h-4 w-4 sm:mr-0" />
                                                <span className="sm:hidden ml-2">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

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
