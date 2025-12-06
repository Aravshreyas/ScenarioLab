'use client';

import React, { useState } from 'react';
import { ScenarioInputs } from '@/types/conversation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateSystemPrompt } from '@/utils/promptGenerator';
import { selectVoiceForScenario } from '@/utils/voiceSelector';

interface ScenarioFormProps {
    onSubmit: (inputs: ScenarioInputs) => void;
    isLoading: boolean;
    onSaveSuccess?: () => void; // New callback for save success
}

export default function ScenarioForm({ onSubmit, isLoading, onSaveSuccess }: ScenarioFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<ScenarioInputs>({
        title: '',
        aiRole: '',
        userRole: '',
        situation: '',
        objective: '',
        difficulty: 'Medium',
        voice: 'en-US-AndrewMultilingualNeural',
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setShowSuccess(false);

        try {
            // Automatically select appropriate voice based on scenario
            const selectedVoice = selectVoiceForScenario(formData.aiRole, formData.situation);

            // Update formData with selected voice
            const dataWithVoice = {
                ...formData,
                voice: selectedVoice
            };

            // Generate system prompt
            const systemPrompt = generateSystemPrompt(dataWithVoice);

            // Save to Firebase
            await addDoc(collection(db, 'scenarios'), {
                title: dataWithVoice.title || 'Untitled Scenario',
                description: dataWithVoice.situation,
                type: 'custom',
                inputs: dataWithVoice,
                generatedSystemPrompt: systemPrompt,
                voiceId: dataWithVoice.voice,
                voiceName: dataWithVoice.voice, // Simplified for now
                createdAt: new Date().toISOString(),
                platform: 'web'
            });
            console.log('Scenario saved to Firebase with auto-selected voice:', selectedVoice);

            // Show success message
            setShowSuccess(true);

            // Reset form
            setFormData({
                title: '',
                aiRole: '',
                userRole: '',
                situation: '',
                objective: '',
                difficulty: 'Medium',
                voice: 'en-US-AndrewMultilingualNeural',
            });

            // Call success callback if provided
            if (onSaveSuccess) {
                setTimeout(() => {
                    onSaveSuccess();
                }, 1500);
            }

        } catch (error) {
            console.error('Error saving scenario:', error);
            alert('Failed to save scenario. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-3xl glass-card animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gradient-primary">
                    ✨ Create Custom Scenario
                </h2>
                <p className="text-gray-400 text-sm">
                    Design your perfect practice conversation
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Scenario Title */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="text-blue-400">🎯</span>
                        Scenario Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g., Refund Negotiation, Conflict Resolution..."
                        required
                    />
                </div>

                {/* Roles Section */}
                <div className="glass p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <span className="text-purple-400">👥</span>
                        Conversation Roles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-400">
                                AI Will Play
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <span>🤖</span>
                                </div>
                                <input
                                    type="text"
                                    name="aiRole"
                                    value={formData.aiRole}
                                    onChange={handleChange}
                                    className="input pl-12"
                                    placeholder="e.g., Customer Support"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-400">
                                You Will Play
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <span>👤</span>
                                </div>
                                <input
                                    type="text"
                                    name="userRole"
                                    value={formData.userRole}
                                    onChange={handleChange}
                                    className="input pl-12"
                                    placeholder="e.g., Frustrated Customer"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Context Section */}
                <div className="glass p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <span className="text-cyan-400">📝</span>
                        Scenario Context
                    </h3>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-400">
                            Situation / Background
                        </label>
                        <textarea
                            name="situation"
                            value={formData.situation}
                            onChange={handleChange}
                            rows={4}
                            className="input resize-none"
                            placeholder="Describe the scenario context and background..."
                            required
                        />
                        <p className="text-xs text-gray-500">
                            {formData.situation.length} characters
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-400">
                            Your Objective
                        </label>
                        <input
                            type="text"
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            className="input"
                            placeholder="What do you want to achieve?"
                            required
                        />
                    </div>
                </div>

                {/* Settings Section */}
                <div className="glass p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                        <span className="text-pink-400">⚙️</span>
                        Scenario Settings
                    </h3>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-400">
                            Difficulty Level
                        </label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="input cursor-pointer w-full"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="animate-fade-in bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                        <div className="text-3xl">✅</div>
                        <div>
                            <p className="text-green-300 font-semibold">Scenario Created Successfully!</p>
                            <p className="text-gray-400 text-sm">Go to "Browse Scenarios" to start practicing.</p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || isSaving}
                    className="btn-primary w-full text-lg py-4 mt-8 relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading || isSaving ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                ✨ Create Scenario
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </form>
        </div>
    );
}
