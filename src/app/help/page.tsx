// src/app/help/page.tsx
import AppHeader from '@/components/proof-explorer/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Pencil, MessageSquare, Shield, History } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <AppHeader />
      <main className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Help Center</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed">
            <p>
              Welcome to Proof Forge! This guide will help you understand the features of the application.
            </p>
            
            <h3 className="flex items-center gap-2"><Sparkles className="h-5 w-5" />AI Assistant</h3>
            <p>
              The AI Assistant is your interactive guide to understanding proofs. You can ask it questions or, if you have permission, ask it to edit a proof.
            </p>
            <ul>
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
