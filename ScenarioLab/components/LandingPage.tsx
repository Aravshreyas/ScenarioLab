'use client';

import { useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ParticleBackground from './ParticleBackground';
import ScenarioForm from './ScenarioForm';
import ScenarioList from './ScenarioList';
import type {
  AgoraTokenData,
  ClientStartRequest,
  AgentResponse,
  ScenarioInputs,
} from '../types/conversation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from './Login';

// Dynamically import the ConversationComponent with ssr disabled
const ConversationComponent = dynamic(() => import('./ConversationComponent'), {
  ssr: false,
});

// Dynamically import AgoraRTC and AgoraRTCProvider
const AgoraProvider = dynamic(
  async () => {
    const { AgoraRTCProvider, default: AgoraRTC } = await import(
      'agora-rtc-react'
    );

    return {
      default: ({ children }: { children: React.ReactNode }) => {
        const client = useMemo(
          () => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
          []
        );
        return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
      },
    };
  },
  { ssr: false }
);

function LandingPageContent() {
  const { user, loading, logout } = useAuth();
  const [showConversation, setShowConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agoraData, setAgoraData] = useState<AgoraTokenData | null>(null);
  const [agentJoinError, setAgentJoinError] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'browse'>('create');

  const handleStartConversation = async (scenarioInputs: ScenarioInputs) => {
    setIsLoading(true);
    setError(null);
    setAgentJoinError(false);

    try {
      // First, get the Agora token
      console.log('Fetching Agora token...');
      const agoraResponse = await fetch('/api/generate-agora-token');
      const responseData = await agoraResponse.json();
      console.log('Agora API response:', responseData);

      if (!agoraResponse.ok) {
        throw new Error(
          `Failed to generate Agora token: ${JSON.stringify(responseData)}`
        );
      }

      // Send the channel name when starting the conversation
      const startRequest: ClientStartRequest = {
        requester_id: responseData.uid,
        channel_name: responseData.channel,
        input_modalities: ['text'],
        output_modalities: ['text', 'audio'],
        scenario: scenarioInputs,
      };

      try {
        const response = await fetch('/api/invite-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(startRequest),
        });

        if (!response.ok) {
          setAgentJoinError(true);
        } else {
          const agentData: AgentResponse = await response.json();
          setAgoraData({
            ...responseData,
            agentId: agentData.agent_id,
          });
        }
      } catch (err) {
        console.error('Failed to start conversation with agent:', err);
        setAgentJoinError(true);
      }

      setShowConversation(true);
    } catch (err) {
      setError('Failed to start conversation. Please try again.');
      console.error('Error starting conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenWillExpire = async (uid: string) => {
    try {
      const response = await fetch(
        `/api/generate-agora-token?channel=${agoraData?.channel}&uid=${uid}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to generate new token');
      }

      return data.token;
    } catch (error) {
      console.error('Error renewing token:', error);
      throw error;
    }
  };

  const handleEndConversation = () => {
    setShowConversation(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
        <ParticleBackground />
        <div className="z-10 w-full px-4 flex flex-col items-center">
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden py-10">
      <ParticleBackground />

      {/* Header with User Info and Logout */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <div className="glass px-4 py-2 rounded-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
            {user.isAnonymous ? '👤' : (user.email?.[0]?.toUpperCase() || '👤')}
          </div>
          <span className="text-sm text-gray-300 font-medium">
            {user.isAnonymous ? 'Guest' : user.email || user.displayName}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="glass px-4 py-2 rounded-full hover:bg-red-500/20 transition-smooth text-sm font-medium flex items-center gap-2 group"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="group-hover:text-red-300 transition-colors">Logout</span>
        </button>
      </div>

      <div className="z-10 w-full max-w-6xl px-4 flex flex-col items-center">
        {!showConversation ? (
          <>
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="text-6xl font-bold mb-3 text-gradient-primary">
                ScenarioLab
              </h1>
              <p className="text-xl text-gray-400">
                Master difficult conversations through AI-powered practice
              </p>
            </div>

            {/* View Toggle */}
            <div className="glass p-2 rounded-2xl mb-10 flex gap-2">
              <button
                onClick={() => setViewMode('create')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-smooth flex items-center gap-2 relative overflow-hidden ${viewMode === 'create'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-lg">✨</span>
                Create New
              </button>
              <button
                onClick={() => setViewMode('browse')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-smooth flex items-center gap-2 ${viewMode === 'browse'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-lg">📚</span>
                Browse Scenarios
              </button>
            </div>

            {viewMode === 'create' ? (
              <ScenarioForm
                onSubmit={handleStartConversation}
                isLoading={isLoading}
                onSaveSuccess={() => setViewMode('browse')}
              />
            ) : (
              <ScenarioList
                onSelect={handleStartConversation}
                isLoading={isLoading}
              />
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}
          </>
        ) : agoraData ? (
          <div className="w-full h-[80vh] bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden relative">
            {agentJoinError && (
              <div className="p-3 bg-red-600/20 text-red-400 text-center border-b border-red-500/30">
                Failed to connect with AI agent. The conversation may not work as expected.
              </div>
            )}
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading conversation...</div>}>
              <AgoraProvider>
                <ConversationComponent
                  agoraData={agoraData}
                  onTokenWillExpire={handleTokenWillExpire}
                  onEndConversation={handleEndConversation}
                />
              </AgoraProvider>
            </Suspense>
          </div>
        ) : (
          <p>Failed to load conversation data.</p>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <AuthProvider>
      <LandingPageContent />
    </AuthProvider>
  );
}
