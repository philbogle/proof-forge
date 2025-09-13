import type { User, Auth } from 'firebase/auth';

export type FormalityLevel = 'english' | 'informal' | 'rigorous';

export type Theorem = {
  id: string;
  name: string;
  statement: string;
};

export type GenerateProofInput = {
  theoremName: string;
  theoremStatement: string;
  formality: FormalityLevel;
  userBackground?: string;
  structuralProof?: string;
};

export type GenerateProofOutput = {
  proof: string;
};

export type ProofVersion = {
  proof: string;
  timestamp: string;
  user?: {
    name: string | null;
    id: string;
  };
};

export interface AuthContextType {
  user: User | null;
  auth: Auth | null;
  loading: boolean;
}

export type ConversationTurn = {
  question: string;
  answer: string;
};
