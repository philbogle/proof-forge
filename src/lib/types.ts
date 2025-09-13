import type { User } from 'firebase/auth';

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
  loading: boolean;
}
