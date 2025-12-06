'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScenarioInputs } from '@/types/conversation';

interface ScenarioListProps {
    onSelect: (scenario: ScenarioInputs) => void;
    isLoading: boolean;
}

interface ScenarioData extends ScenarioInputs {
    id: string;
    description?: string;
}

export default function ScenarioList({ onSelect, isLoading }: ScenarioListProps) {
    const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const q = query(collection(db, 'scenarios'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedScenarios: ScenarioData[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Map Firestore data to ScenarioInputs
                    // Assuming 'inputs' field contains the ScenarioInputs structure, or mapping top-level fields
                    // Based on ScenarioForm, we saved 'inputs' as a nested object, but also some top-level fields.
                    // Let's try to use the 'inputs' field if it exists, otherwise map top-level.

                    let scenarioInputs: ScenarioInputs;
                    if (data.inputs) {
                        scenarioInputs = data.inputs as ScenarioInputs;
                        // Ensure title is present if it's in top-level but not in inputs
                        if (!scenarioInputs.title && data.title) {
                            scenarioInputs.title = data.title;
                        }
                    } else {
                        // Fallback for older data or different structure
                        scenarioInputs = {
                            title: data.title,
                            aiRole: data.aiRole || data.inputs?.aiRole,
                            userRole: data.userRole || data.inputs?.userRole,
                            situation: data.description || data.situation || data.inputs?.situation,
                            objective: data.objective || data.inputs?.objective,
                            difficulty: data.difficulty || 'Medium',
                            voice: data.voiceId || data.voice,
                        } as ScenarioInputs;
                    }

                    fetchedScenarios.push({
                        id: doc.id,
                        description: data.description,
                        ...scenarioInputs
                    });
                });
                setScenarios(fetchedScenarios);
            } catch (err) {
                console.error('Error fetching scenarios:', err);
                setError('Failed to load scenarios.');
            } finally {
                setLoading(false);
            }
        };

        fetchScenarios();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <svg className="animate-spin h-12 w-12 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400 text-lg">Loading scenarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card max-w-md mx-auto p-8 text-center animate-fade-in">
                <div className="text-red-400 text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-white mb-2">Error Loading Scenarios</h3>
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (scenarios.length === 0) {
        return (
            <div className="glass-card max-w-md mx-auto p-12 text-center animate-fade-in">
                <div className="text-gray-500 text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Scenarios Yet</h3>
                <p className="text-gray-400 mb-4">Create your first scenario to get started!</p>
                <div className="text-sm text-gray-500">
                    Switch to "Create New" tab above ↑
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl animate-fade-in">
            {scenarios.map((scenario, index) => (
                <button
                    key={scenario.id}
                    onClick={() => onSelect(scenario)}
                    disabled={isLoading}
                    className="card-interactive text-left p-6 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Header with Title and Difficulty Badge */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-gradient-primary transition-all flex-1 pr-2">
                            {scenario.title || 'Untitled Scenario'}
                        </h3>
                        <span className={`
                            px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1
                            ${scenario.difficulty === 'Hard'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : scenario.difficulty === 'Medium'
                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                            }
                        `}>
                            {scenario.difficulty === 'Hard' && '😤'}
                            {scenario.difficulty === 'Medium' && '😐'}
                            {scenario.difficulty === 'Easy' && '😊'}
                            {scenario.difficulty}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {scenario.description || scenario.situation}
                    </p>

                    {/* Roles */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-purple-400">🤖</span>
                            <span className="text-gray-500">AI:</span>
                            <span className="text-gray-300 font-medium">{scenario.aiRole}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-blue-400">👤</span>
                            <span className="text-gray-500">You:</span>
                            <span className="text-gray-300 font-medium">{scenario.userRole}</span>
                        </div>
                    </div>

                    {/* CTA Indicator */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700/50 mt-auto">
                        <span className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
                            Click to start →
                        </span>
                        <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </button>
            ))}
        </div>
    );
}
