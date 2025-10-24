import { localCache } from './cache';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIClient {
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Important for session cookies
        };

        try {
            const response = await fetch(url, config);

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Backend server is not responding. Make sure to run: npm run server');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error(`Cannot connect to server. Make sure backend is running on ${API_URL}`);
            }
            throw error;
        }
    }

    // Auth
    async signUp(email, password, name) {
        return this.request('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async signIn(email, password) {
        return this.request('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async googleSignIn(userData) {
        return this.request('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getCurrentUser() {
        return this.request('/api/auth/me');
    }

    async signOut() {
        return this.request('/api/auth/signout', { method: 'POST' });
    }

    // User Profile
    async getProfile() {
        return this.request('/api/user/profile');
    }

    async updateProfile(data) {
        return this.request('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Transcripts
    async saveTranscript(data) {
        const result = await this.request('/api/transcripts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // Clear transcripts cache when saving new one
        localCache.remove('transcripts');
        return result;
    }

    async getTranscripts() {
        // Check cache first
        const cached = localCache.get('transcripts');
        if (cached) return cached;
        
        const data = await this.request('/api/transcripts');
        // Cache for 5 minutes
        localCache.set('transcripts', data, 5 * 60 * 1000);
        return data;
    }

    async deleteTranscript(id) {
        const result = await this.request(`/api/transcripts/${id}`, { method: 'DELETE' });
        // Clear transcripts cache
        localCache.remove('transcripts');
        return result;
    }

    async deleteAllTranscripts() {
        const result = await this.request('/api/transcripts', { method: 'DELETE' });
        // Clear transcripts cache
        localCache.remove('transcripts');
        return result;
    }

    // AI Settings
    async getAISettings() {
        // Check cache first
        const cached = localCache.get('ai-settings');
        if (cached) return cached;
        
        const data = await this.request('/api/ai-settings');
        // Cache for 10 minutes
        localCache.set('ai-settings', data, 10 * 60 * 1000);
        return data;
    }

    async updateAISettings(data) {
        const result = await this.request('/api/ai-settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        // Update cache
        localCache.set('ai-settings', result, 10 * 60 * 1000);
        return result;
    }

    // Memories
    async saveMemory(data) {
        const result = await this.request('/api/memories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // Clear memories cache when saving new one
        localCache.remove('memories');
        return result;
    }

    async getMemories() {
        // Check cache first
        const cached = localCache.get('memories');
        if (cached) return cached;
        
        const data = await this.request('/api/memories');
        // Cache for 5 minutes
        localCache.set('memories', data, 5 * 60 * 1000);
        return data;
    }

    async deleteMemory(id) {
        const result = await this.request(`/api/memories/${id}`, { method: 'DELETE' });
        // Clear memories cache
        localCache.remove('memories');
        return result;
    }

    // Video and Channel
    async getVideoInfo(url) {
        return this.request('/api/video-info', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    }

    async getTranscript(url) {
        return this.request('/api/transcript', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    }

    async getChannelVideos(channelUrl, limit = 10) {
        return this.request('/api/channel-videos', {
            method: 'POST',
            body: JSON.stringify({ channelUrl, limit }),
        });
    }
}

export default new APIClient();
