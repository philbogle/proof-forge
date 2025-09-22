# Proof Forge

Proof Forge is an interactive application for exploring and understanding mathematical proofs. It allows users to view proofs at different levels of formality (from plain English to rigorous mathematical notation), ask questions about the proofs using a built-in AI assistant, and for administrators, to edit and manage the content.

This application is built with Next.js and Firebase, and utilizes Genkit for its AI capabilities.

## Key Features

*   **Multiple Formality Levels:** Understand complex proofs by switching between English, Semiformal, and Rigorous explanations.
*   **Interactive AI Assistant:** Ask questions in natural language to get clarifications on any part of a proof.
*   **AI-Powered Editing:** Administrators can request edits to proofs using natural language.
*   **Content Management:** A dedicated admin page for adding, editing, approving, and organizing theorems.
*   **Version Control:** Rollback proofs to previous versions.
*   **Authentication:** User authentication is handled by Firebase Authentication.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) components.
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication).
*   **AI/Generative:** Google's [Genkit](https://firebase.google.com/docs/genkit).


## Sample deployment

This app is deployed to https://proof-forge.vercel.app/.

## Vercel Deployment

You can easily deploy this to Vercel by point Vercel at this repo and setting the GEMINI_APP_KEY environment variable to a valid key.

## Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Run the Genkit development server (in a separate terminal):**
    ```bash
    npm run genkit:dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

The main application starts on `src/app/page.tsx`. The AI flows are located in `src/ai/flows/`.
