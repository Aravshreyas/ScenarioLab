# ScenarioLab

ScenarioLab is an AI-powered roleplay scenario practice platform that helps users improve their communication skills through realistic conversational scenarios. Built with Next.js, Firebase, and Agora RTC.

## Features

- **AI-Powered Conversations**: Practice difficult conversations with AI agents using real-time voice communication
- **Custom Scenarios**: Create and save your own roleplay scenarios
- **Scenario Library**: Browse and practice from saved scenarios
- **Authentication**: Secure login with Google or email/password
- **Real-time Communication**: Voice-based conversations powered by Agora RTC
- **Firebase Integration**: Store and manage scenarios in the cloud
- **Modern UI**: Beautiful, responsive interface with glass morphism design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Custom CSS with glass morphism effects
- **Authentication**: Firebase Auth (Google Sign-In, Email/Password)
- **Database**: Firestore
- **Real-time Audio**: Agora RTC
- **AI**: Groq LLM for conversational AI
- **TTS**: Microsoft Azure Text-to-Speech

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project setup
- Agora account
- Groq API key
- Microsoft Azure Speech Services account

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd ScenarioLab
```

2. Install dependencies:
```

bash
npm install
```

3. Create `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Agora Configuration
NEXT_PUBLIC_AGORA_APP_ID=
NEXT_PUBLIC_AGORA_APP_CERTIFICATE=
NEXT_PUBLIC_AGORA_CUSTOMER_ID=
NEXT_PUBLIC_AGORA_CUSTOMER_SECRET=

NEXT_PUBLIC_AGORA_CONVO_AI_BASE_URL=https://api.agora.io/api/conversational-ai-agent/v2/projects/
NEXT_PUBLIC_AGENT_UID=

# LLM Configuration
NEXT_PUBLIC_LLM_URL=https://api.openai.com/v1/chat/completions
NEXT_PUBLIC_LLM_MODEL=gpt-4
NEXT_PUBLIC_LLM_API_KEY=

# TTS Configuration
NEXT_PUBLIC_TTS_VENDOR=microsoft

# Text-to-Speech Configuration
NEXT_PUBLIC_MICROSOFT_TTS_KEY=
NEXT_PUBLIC_MICROSOFT_TTS_REGION=eastus
NEXT_PUBLIC_MICROSOFT_TTS_VOICE_NAME=en-US-AndrewMultilingualNeural
NEXT_PUBLIC_MICROSOFT_TTS_RATE=1.1
NEXT_PUBLIC_MICROSOFT_TTS_VOLUME=70

# ElevenLabs Configuration
NEXT_PUBLIC_ELEVENLABS_API_KEY=
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=XrExE9yKIg1WjnnlVkGX
NEXT_PUBLIC_ELEVENLABS_MODEL_ID=eleven_flash_v2_5

# Modalities Configuration
NEXT_PUBLIC_INPUT_MODALITIES=text
NEXT_PUBLIC_OUTPUT_MODALITIES=text,audio
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy!

### Other Platforms

Build the production bundle:
```bash
npm run build
npm start
```

## Project Structure

```
conversational-ai-nextjs-client/
├── app/                     # Next.js app directory
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   └── page.tsx            # Main page
├── components/             # React components
│   ├── Login.tsx          # Authentication component
│   ├── LandingPage.tsx    # Main landing page
│   ├── ScenarioForm.tsx   # Scenario creation form
│   ├── ScenarioList.tsx   # Scenario browser
│   └── ConversationComponent.tsx  # Real-time conversation UI
├── context/               # React context providers
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities
```

## Usage

1. **Sign In**: Use Google authentication or email/password
2. **Create Scenario**: 
   - Fill in scenario details (title, roles, situation, objective)
   - Select difficulty level
   - Choose AI voice
   - Click "Create Scenario"
3. **Browse Scenarios**: Switch to "Browse Scenarios" tab to see saved scenarios
4. **Start Practice**: Select a scenario to begin the conversation
5. **Have Conversation**: Speak with the AI agent in real-time
6. **End Session**: Click the red dot to stop the conversation

## API Endpoints

- `POST /api/generate-agora-token` - Generate Agora RTC token
- `POST /api/invite-agent` - Initialize AI agent for conversation

## Configuration

### Scenario Difficulty Levels
- **Easy** 😊: Cooperative scenarios
- **Medium** 😐: Challenging situations
- **Hard** 😤: Very difficult conversations

### Available AI Voices
- Andrew (Male)
- Ava (Female)
- Brian (Male)
- Emma (Female)


---

**Built with ❤️ using Next.js and AI**
