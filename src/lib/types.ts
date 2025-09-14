import type { User as FirebaseUser, Auth } from 'firebase/auth';

export type User = FirebaseUser;

export type FormalityLevel = 'english' | 'informal' | 'rigorous';

export type TheoremOwner = {
  id: string;
  name: string | null;
};

export type Theorem = {
  id: string;
  name:string;
  statement: string;
  owner: TheoremOwner;
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
