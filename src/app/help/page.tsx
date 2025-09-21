// src/app/help/page.tsx
import AppHeader from '@/components/proof-explorer/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Pencil, MessageSquare, Shield, History, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <AppHeader />
      <main className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Help </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed">
          <h2 className="flex items-center gap-2">Introduction</h2>
          <p>
              Welcome to Proof Forge! Proof Forge is an experiment in making proofs easier to 
              create and understand. Each proof is presented a multiple levels of formality, with
              the same structure at each formality level. This makes it easy to pop up an down
              to the level of formality that speaks to you, and, if you want, eventually work
              your wa up to the rigorously formal version. You can click on the chat icon
              to ask questions about the proof from the AI assistant.
            </p>
            <p>
              Proof Forge supports rich formatting include Markdown, LaTeX style math expressions, add
              raw HTML when you need full control or to embed a video.
            </p>
            <p>
              Proof Forge lets you edit proofs collaboratively with the AI and makes it easy to keep
              formality levels in sync.
              The AI assistant populates an initial version of a proof at a given formality level based
              on the existing proof at other formality levels, or just the title of the theorem if nothing
              else is available. You can also edit the raw markdown to have total control or request edits
              from the AI assistant using the chat window.
            </p>
            <h2 className="flex items-center gap-2">Features</h2>

            <h3 className="flex items-center gap-2"><Navigation className="h-5 w-5" />Navigating Proofs</h3>
            <p>
              Understanding a proof is easier when you can explore it at your own pace.
            </p>
            <ul>
              <li><strong>Formality Levels:</strong> At the top of the proof, you'll find buttons for "English", "Semiformal", and "Rigorous". Click these to instantly switch between different explanation styles without losing your place.</li>
              <li><strong>Step-by-Step Navigation:</strong> Each proof is divided into logical steps. Use the arrow buttons in the top right to move between these steps one at a time, allowing you to focus on a single part of the argument.</li>
            </ul>

            <h3 className="flex items-center gap-2"><Sparkles className="h-5 w-5" />AI Assistant</h3>
            <p>
              The AI Assistant is your interactive guide to understanding proofs. You can ask it questions or, if you have permission, ask it to edit a proof.
            </p>
            <ul>
              <li><strong>Explain a selection:</strong> Highlight any part of the proof text, and an "Explain" button will appear. Click it to ask the AI to clarify that specific snippet in the context of the current proof step.</li>
              <li><strong>Ask a question:</strong> Simply type your question into the chat panel (e.g., "Can you explain what a 'base case' is?"). The AI will provide an explanation based on the context of the current proof.</li>
              <li><strong>Request an edit:</strong> If you are an administrator or the owner of an unapproved theorem, you can ask the AI to make changes. For example: "Make the first step more detailed," or "Add a collapsible section defining what a set is."</li>
            </ul>

            <h3 className="flex items-center gap-2"><Pencil className="h-5 w-5" />Editing Proofs</h3>
            <p>
              Owners of unapproved theorems and administrators can directly edit proof content.
            </p>
            <ul>
              <li><strong>AI Edit:</strong> Click the "AI Edit" button to bring up the chat and make a request, as described above. This is the recommended way to make changes.</li>
              <li><strong>Manual Edit:</strong> Click the "Edit" button to enter direct editing mode. You can switch between a raw Markdown editor and a live preview. Remember to save your changes.</li>
            </ul>
            
            <h3 className="flex items-center gap-2"><Shield className="h-5 w-5" />Admin & Ownership Features</h3>
            <p>
              Administrators have full control over all theorems. Regular users can submit their own theorems and edit them until they are approved by an admin.
            </p>
            <ul>
                <li><strong>Admin Page:</strong> The <Link href="/admin">Admin Page</Link> allows for adding, editing, deleting, reordering, and approving theorems.</li>
                <li><strong>Adding Theorems:</strong> Any logged-in user can add a new theorem from the homepage. It will appear under "My Theorems" until an admin approves it.</li>
            </ul>

            <h3 className="flex items-center gap-2"><History className="h-5 w-5" />Advanced Settings</h3>
             <p>
              On each proof page, admins can access advanced settings.
            </p>
            <ul>
              <li><strong>Version History:</strong> Roll back a proof to any of its last 10 saved versions for a specific formality level.</li>
              <li><strong>Clear Cache:</strong> Permanently delete all proof versions for a theorem, forcing them to be regenerated from scratch the next time they are viewed.</li>
            </ul>

            <div className="mt-6">
                <Link href="/" className="text-primary hover:underline">
                    &larr; Back to Theorems
                </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
