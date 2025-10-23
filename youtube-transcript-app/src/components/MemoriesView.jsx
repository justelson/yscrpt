import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Brain, Download, Play, Trash2, ChevronLeft, ChevronRight, RotateCw, X, Check, Search, Filter, SortAsc, Edit, Share2, Printer, FolderPlus, Eye, FileText, FileJson, FileCode } from 'lucide-react';
import { Modal, InfoModal } from './ui/modal';
import api from '../lib/api';

export function MemoriesView() {
    const navigate = useNavigate();
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    // New filter/search/sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [selectedMemories, setSelectedMemories] = useState([]);
    const [downloadModal, setDownloadModal] = useState({ show: false, memory: null });
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });


    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const data = await api.getMemories();
                // Normalize old memory formats
                const normalizedMemories = data.map(memory => {
                    let normalized = { ...memory };
                    
                    // If memory has result as JSON string, try to parse it
                    if (memory.result && typeof memory.result === 'string') {
                        try {
                            const parsed = JSON.parse(memory.result);
                            
                            // Check if it's an array of cards
                            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
                                normalized.cards = parsed;
                            }
                            // Check if it's an object with type and cards
                            else if (parsed.type && parsed.cards) {
                                normalized.type = parsed.type;
                                normalized.cards = parsed.cards;
                            }
                        } catch {
                            // Not JSON, keep as is
                        }
                    }
                    
                    // Ensure title exists
                    if (!normalized.title) {
                        normalized.title = memory.videoTitle || memory.toolName || 'Untitled Memory';
                    }
                    
                    // Ensure type exists
                    if (!normalized.type) {
                        normalized.type = memory.toolName?.toLowerCase() || 'memory';
                    }
                    
                    return normalized;
                });
                setMemories(normalizedMemories);
            } catch (error) {
                console.error('Failed to fetch memories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();

        // Set up polling for live updates every 30 seconds
        const interval = setInterval(fetchMemories, 30000);
        return () => clearInterval(interval);
    }, []);

    // Filter, sort, and search logic
    const filteredAndSortedMemories = memories
        .filter(memory => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                memory.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                memory.videoTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                memory.type?.toLowerCase().includes(searchQuery.toLowerCase());

            // Type filter
            const matchesType = filterType === 'all' || memory.type === filterType;

            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'date-asc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name-asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'name-desc':
                    return (b.title || '').localeCompare(a.title || '');
                default:
                    return 0;
            }
        });

    const memoryTypes = ['all', ...new Set(memories.map(m => m.type).filter(Boolean))];

    const handlePlayMemory = (memory) => {
        // Navigate to the detail page instead of showing inline
        navigate(`/memories/${memory._id}`);
    };

    const handleDownloadMemory = (memory) => {
        setDownloadModal({ show: true, memory });
    };

    const handleDownloadFormat = (format) => {
        const memory = downloadModal.memory;
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

        setDownloadModal({ show: false, memory: null });
    };

    const handleDeleteMemory = async (memoryId) => {
        if (confirm('Are you sure you want to delete this memory?')) {
            try {
                // Optimistic update
                setMemories(memories.filter(m => m._id !== memoryId));
                await api.deleteMemory(memoryId);
            } catch (error) {
                console.error('Failed to delete memory:', error);
                setInfoModal({ show: true, title: 'Error', message: 'Failed to delete memory' });
                // Refresh on error
                const data = await api.getMemories();
                setMemories(data);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedMemories.length === 0) {
            setInfoModal({ show: true, title: 'Warning', message: 'No memories selected' });
            return;
        }
        if (confirm(`Delete ${selectedMemories.length} selected memories?`)) {
            try {
                // Optimistic update
                setMemories(memories.filter(m => !selectedMemories.includes(m._id)));
                setSelectedMemories([]);
                await Promise.all(selectedMemories.map(id => api.deleteMemory(id)));
            } catch (error) {
                console.error('Failed to delete memories:', error);
                setInfoModal({ show: true, title: 'Error', message: 'Failed to delete some memories' });
                // Refresh on error
                const data = await api.getMemories();
                setMemories(data);
            }
        }
    };

    const handleBulkExport = () => {
        if (selectedMemories.length === 0) {
            setInfoModal({ show: true, title: 'Warning', message: 'No memories selected' });
            return;
        }
        const selected = memories.filter(m => selectedMemories.includes(m._id));
        const content = JSON.stringify(selected, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `memories_export_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleToggleSelect = (memoryId) => {
        setSelectedMemories(prev =>
            prev.includes(memoryId)
                ? prev.filter(id => id !== memoryId)
                : [...prev, memoryId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMemories.length === filteredAndSortedMemories.length) {
            setSelectedMemories([]);
        } else {
            setSelectedMemories(filteredAndSortedMemories.map(m => m._id));
        }
    };

    const handleShare = (memory) => {
        let shareText = memory.title + '\n\n';
        
        // Format based on memory type
        if (memory.type === 'flashcards' || memory.type === 'questions') {
            if (memory.cards && memory.cards.length > 0) {
                shareText += memory.cards.map((card, i) => 
                    `${i + 1}. Q: ${card.question}\n   A: ${card.answer}`
                ).join('\n\n');
            } else {
                shareText += memory.result || 'No content';
            }
        } else if (memory.type === 'chat' && memory.messages) {
            shareText += memory.messages.map(msg =>
                `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
            ).join('\n\n---\n\n');
        } else {
            shareText += memory.result || memory.content || 'No content';
        }
        
        if (navigator.share) {
            navigator.share({
                title: memory.title,
                text: shareText,
            }).catch(() => {
                // Fallback to clipboard
                navigator.clipboard.writeText(shareText);
                setInfoModal({ show: true, title: 'Success', message: 'Content copied to clipboard!' });
            });
        } else {
            navigator.clipboard.writeText(shareText);
            setInfoModal({ show: true, title: 'Success', message: 'Content copied to clipboard!' });
        }
    };

    const handlePrint = (memory) => {
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
            content = `<pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; background: #f5f5f5; padding: 15px; border-radius: 4px;">${memory.result || 'No content'}</pre>`;
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

    // List view
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            <CardTitle>Memories</CardTitle>
                        </div>
                        {selectedMemories.length > 0 && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button size="sm" variant="outline" onClick={handleBulkExport} className="w-full sm:w-auto">
                                    <Download className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Export</span> ({selectedMemories.length})
                                </Button>
                                <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="w-full sm:w-auto">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Delete</span> ({selectedMemories.length})
                                </Button>
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        {memories.length} total memories
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search memories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filters and Sort - Mobile Optimized */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        <div className="flex items-center gap-1 col-span-1">
                            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="text-sm border border-border px-3 py-2 bg-background w-full font-medium hover:bg-muted transition-colors cursor-pointer"
                                style={{ borderRadius: '0px' }}
                            >
                                {memoryTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1 col-span-1">
                            <SortAsc className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-border px-3 py-2 bg-background w-full font-medium hover:bg-muted transition-colors cursor-pointer"
                                style={{ borderRadius: '0px' }}
                            >
                                <option value="date-desc">Newest</option>
                                <option value="date-asc">Oldest</option>
                                <option value="name-asc">A-Z</option>
                                <option value="name-desc">Z-A</option>
                            </select>
                        </div>

                        {filteredAndSortedMemories.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSelectAll}
                                className="col-span-2 sm:col-span-1 text-xs sm:text-sm"
                            >
                                {selectedMemories.length === filteredAndSortedMemories.length ? 'Deselect' : 'Select All'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Loading memories...</p>
                    </CardContent>
                </Card>
            ) : filteredAndSortedMemories.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                            {memories.length === 0
                                ? 'No memories saved yet. Create flashcards using AI Tools to get started.'
                                : 'No memories match your search or filter.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredAndSortedMemories.map((memory) => (
                        <Card key={memory._id} className={`hover:shadow-lg transition-all ${selectedMemories.includes(memory._id) ? 'ring-2 ring-primary' : ''}`}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col gap-3">
                                    {/* Header with checkbox and title */}
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedMemories.includes(memory._id)}
                                            onChange={() => handleToggleSelect(memory._id)}
                                            className="mt-1 flex-shrink-0 w-5 h-5 rounded-none cursor-pointer"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">
                                                {memory.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                                                {memory.type === 'flashcards'
                                                    ? `${memory.cards?.length || 0} flashcards`
                                                    : memory.type === 'questions'
                                                        ? `${memory.cards?.length || 0} questions`
                                                        : memory.type === 'chat'
                                                            ? `${memory.messages?.length || 0} messages`
                                                            : memory.type
                                                                ? memory.type.charAt(0).toUpperCase() + memory.type.slice(1)
                                                                : 'Memory'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(memory.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {/* Primary Action */}
                                        <Button
                                            size="sm"
                                            onClick={() => handlePlayMemory(memory)}
                                            title="View"
                                            className="w-full sm:w-auto justify-center"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            {memory.type === 'flashcards' ? 'Play' :
                                                memory.type === 'questions' ? 'Study' : 'View'}
                                        </Button>

                                        {/* Secondary Actions - Grid on mobile */}
                                        <div className="grid grid-cols-4 sm:flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleShare(memory)}
                                                title="Share"
                                                className="p-2 justify-center"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handlePrint(memory)}
                                                title="Print"
                                                className="p-2 justify-center hidden sm:flex"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDownloadMemory(memory)}
                                                title="Download"
                                                className="p-2 justify-center"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteMemory(memory._id)}
                                                title="Delete"
                                                className="p-2 justify-center"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Download Format Modal */}
            <Modal
                isOpen={downloadModal.show}
                onClose={() => setDownloadModal({ show: false, memory: null })}
                title="Choose Download Format"
                size="sm"
            >
                <div className="space-y-3">
                    <Button
                        onClick={() => handleDownloadFormat('txt')}
                        variant="outline"
                        className="w-full justify-start"
                    >
                        <FileText className="mr-3 h-5 w-5" />
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
                        <FileJson className="mr-3 h-5 w-5" />
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
                        <FileCode className="mr-3 h-5 w-5" />
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
        </div>
    );
}
