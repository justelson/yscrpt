import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Search, Loader2, Video, FileText, Download, Save, List, Database } from 'lucide-react';
import { downloadAsSRT, downloadAsTXT, downloadAsJSON } from '../lib/download';
import { InfoModal } from './ui/modal';
import api from '../lib/api';
import { cacheManager, extractVideoId } from '../lib/cache';

export function FetchView({ onTranscriptFetched }) {
    const [mode, setMode] = useState('video'); // 'video' or 'channel'
    const [url, setUrl] = useState('');
    const [videoLimit, setVideoLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState(null);
    const [transcript, setTranscript] = useState(null);
    const [channelVideos, setChannelVideos] = useState(null);
    const [errorModal, setErrorModal] = useState({ show: false, message: '' });
    const [successModal, setSuccessModal] = useState({ show: false, message: '' });
    const [saving, setSaving] = useState(false);
    const [fromCache, setFromCache] = useState(false);

    const handleFetch = async () => {
        if (!url.trim()) {
            setErrorModal({ show: true, message: 'Please enter a YouTube URL' });
            return;
        }

        setLoading(true);
        setVideoInfo(null);
        setTranscript(null);
        setChannelVideos(null);

        try {
            if (mode === 'video') {
                await fetchSingleVideo(url);
            } else {
                await fetchChannelVideos(url);
            }
        } catch (err) {
            setErrorModal({ show: true, message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const fetchSingleVideo = async (videoUrl) => {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        // Check cache first
        const cached = await cacheManager.getVideo(videoId);
        if (cached) {
            setVideoInfo(cached.videoInfo);
            setTranscript(cached.transcript);
            setFromCache(true);

            if (onTranscriptFetched) {
                onTranscriptFetched(cached.transcript, cached.videoInfo);
            }
            return;
        }

        setFromCache(false);

        // Fetch from server using API client
        const info = await api.getVideoInfo(videoUrl);
        setVideoInfo(info);

        try {
            const transcriptData = await api.getTranscript(videoUrl);
            setTranscript(transcriptData.transcript);

            // Cache the video data
            await cacheManager.cacheVideo(videoId, info, transcriptData.transcript);

            if (onTranscriptFetched) {
                onTranscriptFetched(transcriptData.transcript, info);
            }
        } catch (transcriptError) {
            setErrorModal({
                show: true,
                message: transcriptError.message || 'This video does not have captions/transcripts available.',
            });
            return;
        }
    };

    const fetchChannelVideos = async (channelUrl) => {
        // Check cache first
        const cached = await cacheManager.getChannel(channelUrl);
        if (cached) {
            setChannelVideos(cached.channelData);
            setFromCache(true);
            return;
        }

        setFromCache(false);

        const data = await api.getChannelVideos(channelUrl, videoLimit);
        setChannelVideos(data);

        // Cache the channel data
        await cacheManager.cacheChannel(channelUrl, data);
    };

    const handleVideoClick = async (video) => {
        setLoading(true);
        setChannelVideos(null);
        try {
            const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
            await fetchSingleVideo(videoUrl);
        } catch (err) {
            setErrorModal({ show: true, message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!videoInfo || !transcript) return;

        setSaving(true);
        try {
            await api.saveTranscript({
                videoId: videoInfo.videoId,
                title: videoInfo.title,
                author: videoInfo.author,
                lengthSeconds: videoInfo.lengthSeconds,
                viewCount: videoInfo.viewCount,
                uploadDate: videoInfo.uploadDate,
                description: videoInfo.description,
                thumbnails: videoInfo.thumbnails,
                transcript: transcript,
            });
            setSuccessModal({ show: true, message: 'Transcript saved to your library!' });
        } catch (error) {
            console.error('Save error:', error);
            setErrorModal({ show: true, message: error.message || 'Failed to save transcript' });
        } finally {
            setSaving(false);
        }
    };

    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hrs > 0
            ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num) => new Intl.NumberFormat().format(num);

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Fetch YouTube Content</CardTitle>
                        <CardDescription>
                            Fetch a single video transcript or browse channel videos. Note: YouTube Shorts rarely have transcripts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Mode Toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant={mode === 'video' ? 'default' : 'outline'}
                                onClick={() => {
                                    setMode('video');
                                    setChannelVideos(null);
                                }}
                                className="flex-1"
                            >
                                <Video className="mr-2 h-4 w-4" />
                                Single Video
                            </Button>
                            <Button
                                variant={mode === 'channel' ? 'default' : 'outline'}
                                onClick={() => {
                                    setMode('channel');
                                    setVideoInfo(null);
                                    setTranscript(null);
                                }}
                                className="flex-1"
                            >
                                <List className="mr-2 h-4 w-4" />
                                Channel Videos
                            </Button>
                        </div>

                        {/* Input Section */}
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder={
                                        mode === 'video'
                                            ? 'https://www.youtube.com/watch?v=... or /shorts/...'
                                            : 'https://www.youtube.com/@channelname or /channel/...'
                                    }
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
                                    className="flex-1"
                                />
                                {mode === 'channel' && (
                                    <Input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={videoLimit}
                                        onChange={(e) => setVideoLimit(parseInt(e.target.value) || 10)}
                                        className="w-20"
                                        placeholder="10"
                                    />
                                )}
                                <Button onClick={handleFetch} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" /> Fetch
                                        </>
                                    )}
                                </Button>
                            </div>
                            {mode === 'channel' && (
                                <p className="text-xs text-muted-foreground">
                                    Enter number of videos to fetch (1-50)
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Channel Videos List */}
                {channelVideos && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{channelVideos.channelName}</CardTitle>
                            <CardDescription>
                                {channelVideos.videos.length} videos - Click any video to fetch its transcript
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {channelVideos.videos.map((video) => (
                                    <Card
                                        key={video.videoId}
                                        className="cursor-pointer hover:shadow-lg transition-all"
                                        onClick={() => handleVideoClick(video)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex gap-4">
                                                {video.thumbnails && video.thumbnails.length > 0 && (
                                                    <img
                                                        src={video.thumbnails[0].url}
                                                        alt={video.title}
                                                        className="w-40 h-24 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1">{video.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {video.author}
                                                    </p>
                                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                                        <span>{video.viewCount} views</span>
                                                        <span>{video.uploadDate}</span>
                                                        {video.lengthSeconds && (
                                                            <span>{formatDuration(video.lengthSeconds)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {videoInfo && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Video className="h-5 w-5" />
                                    <CardTitle>Video Information</CardTitle>
                                    {fromCache && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                                            <Database className="h-3 w-3" />
                                            Cached
                                        </span>
                                    )}
                                </div>
                                {transcript && (
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                downloadAsSRT(transcript, videoInfo.title)
                                            }
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Download className="mr-2 h-4 w-4" /> SRT
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                downloadAsTXT(transcript, videoInfo.title)
                                            }
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Download className="mr-2 h-4 w-4" /> TXT
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                downloadAsJSON(transcript, videoInfo, videoInfo.title)
                                            }
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Download className="mr-2 h-4 w-4" /> JSON
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full sm:w-auto"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {saving ? 'Saving...' : 'Save'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {videoInfo.thumbnails && videoInfo.thumbnails.length > 0 && (
                                    <img
                                        src={videoInfo.thumbnails[videoInfo.thumbnails.length - 1].url}
                                        alt={videoInfo.title}
                                        className="w-full md:w-80 rounded-lg shadow-md"
                                    />
                                )}
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">{videoInfo.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            by {videoInfo.author}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="font-medium">Duration:</span>{' '}
                                            {formatDuration(videoInfo.lengthSeconds)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Views:</span>{' '}
                                            {formatNumber(videoInfo.viewCount)}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium">Upload Date:</span>{' '}
                                            {videoInfo.uploadDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {transcript && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                <CardTitle>Transcript</CardTitle>
                            </div>
                            <CardDescription>{transcript.length} segments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-96 overflow-y-auto space-y-2 bg-muted p-4 rounded-lg">
                                {transcript.map((item, index) => (
                                    <div key={index} className="flex gap-3 text-sm">
                                        <span className="text-muted-foreground font-mono min-w-[60px]">
                                            {formatDuration(Math.floor(item.offset / 1000))}
                                        </span>
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modals */}
            <InfoModal
                isOpen={errorModal.show}
                onClose={() => setErrorModal({ show: false, message: '' })}
                title="Error"
                message={errorModal.message}
            />
            <InfoModal
                isOpen={successModal.show}
                onClose={() => setSuccessModal({ show: false, message: '' })}
                title="Success!"
                message={successModal.message}
            />
        </>
    );
}
