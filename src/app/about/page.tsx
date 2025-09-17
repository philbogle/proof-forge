// src/app/about/page.tsx
import AppHeader from '@/components/proof-explorer/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <AppHeader />
      <main className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">About Proof Forge</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed">
            <p>
              Proof Forge is an interactive application designed to make complex mathematical proofs more accessible and understandable. It empowers users to explore proofs at various levels of formality—from plain English explanations to rigorous mathematical notation.
            </p>
            <p>
              Our goal is to demystify mathematics by providing tools that aid comprehension. Key features include:
            </p>
            <ul>
              <li><strong>Multiple Formality Levels:</strong> Switch between different styles of a proof to build intuition and connect concepts to formal notation.</li>
              <li><strong>Interactive AI Assistant:</strong> Ask questions in natural language to get clarifications on any part of a proof, right when you need it.</li>
              <li><strong>AI-Powered Editing:</strong> For administrators, Proof Forge offers the ability to edit and refine proofs using simple, conversational requests.</li>
              <li><strong>Content Management:</strong> A dedicated admin dashboard allows for easy management of theorems, including adding, approving, and organizing content.</li>
            </ul>
            <p>
              This application is built with Next.js, Firebase, and Google's Genkit, showcasing a modern approach to building intelligent and responsive web applications.
            </p>
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
