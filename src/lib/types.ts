export type FormalityLevel =
  | 'plainEnglish'
  | 'englishDescription'
  | 'semiFormal'
  | 'rigorousFormal';

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
};

export type GenerateProofOutput = {
  proof: string;
};
