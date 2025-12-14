# AI Interview Bot (POC)

An AI-powered mock interview application that simulates a technical interview using your Resume and a Job Description. Built with Next.js, Google Gemini, and Web Speech API.

## 🚀 Overview

This project is a Proof of Concept (POC) designed to help candidates prepare for interviews by conducting realistic, voice-based technical interviews. It parses your resume, analyzes the job description you are applying for, and generates tailored questions to assess your fit.

## ✨ Features

-   **Resume Parsing**: Supports PDF and DOCX uploads to extract candidate details automatically.
-   **Contextual Questions**: Uses Google's **Gemini 1.5 Flash** to generate relevant technical and behavioral questions based on your profile and the JD.
-   **Voice Interaction**:
    -   **Speech-to-Text**: Transcribes your spoken answers in real-time.
    -   **Text-to-Speech**: The AI interviewer speaks the questions aloud.
-   **Difficulty Levels**: Choose between **Easy**, **Medium**, or **Hard** interview modes.
-   **Automated Evaluation**: Receives a detailed performance scorecard with:
    -   Overall Rating (0-10)
    -   Key Strengths
    -   Areas for Improvement
    -   Constructive Feedback
-   **No Login Required**: Stateless design using `localStorage` for privacy and ease of use.

## 🛠️ Tech Stack

-   **Frontend/Backend**: [Next.js](https://nextjs.org/) (App Router)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-1.5-flash`)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persistence)
-   **Speech APIs**: Native Browser Web Speech API (SpeechRecognition & SpeechSynthesis)
-   **Styling**: Tailwind CSS
-   **File Parsing**: `pdf-parse`, `mammoth`

## ⚙️ Prerequisites

-   **Node.js**: v18 or higher.
-   **Google Gemini API Key**: Get one for free at [Google AI Studio](https://aistudio.google.com/).
-   **Browser**: **Google Chrome** or **Microsoft Edge** (Required for Speech Recognition support).

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/ai-interview-poc.git
    cd ai-interview-poc
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` file in the root directory and add your API Key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

1.  **Setup Interview**:
    -   Upload your Resume (PDF or DOCX).
    -   Paste the Job Description (JD) you are preparing for.
    -   Select your desired **Difficulty Level**.
    -   Click **Start Interview**.

2.  ** The Interview**:
    -   Allow microphone access when prompted.
    -   The AI will introduce itself.
    -   Tap the **Microphone** button to start answering.
    -   Tap it again to submit your answer.
    -   The AI will respond vocally and via text.

3.  **Evaluation**:
    -   Click **End Interview** whenever you are done.
    -   Wait for the AI to generate your detailed evaluation report.

## 📂 Project Structure

```
.
├── app/
│   ├── api/             # Backend API routes (Interview, Parse, Verify)
│   ├── interview/       # Interview interface page
│   ├── result/          # Evaluation result page
│   └── page.js          # Home page (Upload & Setup)
├── components/          # Reusable UI components (InterviewScreen, FileUpload)
├── lib/                 # Utilities (Gemini client configuration)
├── store/               # Zustand state management
├── hooks/               # Custom hooks (SpeechRecognition, SpeechSynthesis)
└── public/              # Static assets
```

## ⚠️ Known Issues

-   **Browser Support**: Speech Recognition is primarily supported in Chrome and Edge. Firefox and Safari implementation varies or requires configuration.
-   **Mobile Support**: Voice features may behave inconsistently on mobile browsers depending on OS restrictions.

## 📄 License

This project is open-source and available under the MIT License.
