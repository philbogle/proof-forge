export type FormalityLevel = 'informalEnglish' | 'semiFormal' | 'rigorous';

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
