// Browser caching utility for faster loading

const CACHE_VERSION = 'v1';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

class CacheManager {
    constructor() {
        this.dbName = 'youtube-transcript-cache';
        this.dbVersion = 1;
        this.db = null;
    }

    // Initialize IndexedDB
    async init() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Store for video info and transcripts
                if (!db.objectStoreNames.contains('videos')) {
                    const videoStore = db.createObjectStore('videos', { keyPath: 'videoId' });
                    videoStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Store for channel videos
                if (!db.objectStoreNames.contains('channels')) {
                    const channelStore = db.createObjectStore('channels', { keyPath: 'channelUrl' });
                    channelStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Store for AI settings
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    // Video cache methods
    async cacheVideo(videoId, videoInfo, transcript) {
        await this.init();
        const transaction = this.db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');

        const data = {
            videoId,
            videoInfo,
            transcript,
            timestamp: Date.now(),
            version: CACHE_VERSION,
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getVideo(videoId) {
        await this.init();
        const transaction = this.db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');

        return new Promise((resolve, reject) => {
            const request = store.get(videoId);
            request.onsuccess = () => {
                const data = request.result;
                if (!data) {
                    resolve(null);
                    return;
                }

                // Check if cache is expired
                if (Date.now() - data.timestamp > CACHE_EXPIRY) {
                    this.deleteVideo(videoId);
                    resolve(null);
                    return;
                }

                resolve(data);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteVideo(videoId) {
        await this.init();
        const transaction = this.db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        store.delete(videoId);
    }

    // Channel cache methods
    async cacheChannel(channelUrl, channelData) {
        await this.init();
        const transaction = this.db.transaction(['channels'], 'readwrite');
        const store = transaction.objectStore('channels');

        const data = {
            channelUrl,
            channelData,
            timestamp: Date.now(),
            version: CACHE_VERSION,
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getChannel(channelUrl) {
        await this.init();
        const transaction = this.db.transaction(['channels'], 'readonly');
        const store = transaction.objectStore('channels');

        return new Promise((resolve, reject) => {
            const request = store.get(channelUrl);
            request.onsuccess = () => {
                const data = request.result;
                if (!data) {
                    resolve(null);
                    return;
                }

                // Check if cache is expired (shorter expiry for channel lists)
                if (Date.now() - data.timestamp > CACHE_EXPIRY / 2) {
                    this.deleteChannel(channelUrl);
                    resolve(null);
                    return;
                }

                resolve(data);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteChannel(channelUrl) {
        await this.init();
        const transaction = this.db.transaction(['channels'], 'readwrite');
        const store = transaction.objectStore('channels');
        store.delete(channelUrl);
    }

    // Clear all cache
    async clearAll() {
        await this.init();
        const transaction = this.db.transaction(['videos', 'channels'], 'readwrite');
        transaction.objectStore('videos').clear();
        transaction.objectStore('channels').clear();
    }

    // Get cache size info
    async getCacheInfo() {
        await this.init();
        const videoTransaction = this.db.transaction(['videos'], 'readonly');
        const channelTransaction = this.db.transaction(['channels'], 'readonly');

        const videoCount = await new Promise((resolve) => {
            const request = videoTransaction.objectStore('videos').count();
            request.onsuccess = () => resolve(request.result);
        });

        const channelCount = await new Promise((resolve) => {
            const request = channelTransaction.objectStore('channels').count();
            request.onsuccess = () => resolve(request.result);
        });

        return { videoCount, channelCount };
    }
}

// LocalStorage cache for smaller data (AI settings, user preferences)
class LocalStorageCache {
    constructor(prefix = 'yt-transcript') {
        this.prefix = prefix;
    }

    set(key, value, expiryMs = CACHE_EXPIRY) {
        const data = {
            value,
            timestamp: Date.now(),
            expiry: expiryMs,
            version: CACHE_VERSION,
        };
        localStorage.setItem(`${this.prefix}:${key}`, JSON.stringify(data));
    }

    get(key) {
        const item = localStorage.getItem(`${this.prefix}:${key}`);
        if (!item) return null;

        try {
            const data = JSON.parse(item);
            
            // Check expiry
            if (Date.now() - data.timestamp > data.expiry) {
                this.remove(key);
                return null;
            }

            return data.value;
        } catch (e) {
            this.remove(key);
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(`${this.prefix}:${key}`);
    }

    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(`${this.prefix}:`)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Export singleton instances
export const cacheManager = new CacheManager();
export const localCache = new LocalStorageCache();

// Helper function to extract video ID from URL (including Shorts)
export function extractVideoId(url) {
    // Handle regular YouTube URLs
    const regularRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const regularMatch = url.match(regularRegex);
    if (regularMatch) return regularMatch[1];
    
    // Handle YouTube Shorts URLs (youtube.com/shorts/VIDEO_ID)
    const shortsRegex = /youtube\.com\/shorts\/([^"&?/\s]{11})/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch) return shortsMatch[1];
    
    return null;
}
