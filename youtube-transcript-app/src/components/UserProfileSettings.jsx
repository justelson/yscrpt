import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, Upload, Save } from 'lucide-react';
import { InfoModal } from './ui/modal';
import api from '../lib/api';

export function UserProfileSettings({ user }) {
    const [name, setName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '' });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhotoURL(user.photoURL || '');
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result);
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload error:', error);
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.updateProfile({
                name: name,
                photoURL: photoURL,
            });
            setShowSuccess(true);
            // Update localStorage for immediate UI update
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_photoURL', photoURL);
        } catch (err) {
            console.error('Profile update error:', err);
            setInfoModal({ show: true, title: 'Error', message: 'Failed to update profile' });
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <CardTitle>Profile Settings</CardTitle>
                    </div>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                {photoURL ? (
                                    <img
                                        src={photoURL}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-12 w-12 text-muted-foreground" />
                                )}
                            </div>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('avatar-upload').click()}
                                disabled={uploading}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Avatar
                            </Button>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Display Name</label>
                        <Input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" value={user?.email} disabled />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                        </p>
                    </div>

                    <Button onClick={handleSave} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            <InfoModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Success!"
                message="Your profile has been updated successfully."
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
