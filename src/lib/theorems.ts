export type FormalityLevel = 'plainEnglish' | 'englishDescription' | 'semiFormal' | 'rigorousFormal';

export type Theorem = {
  id: string;
  name: string;
  statement: string;
};

export const theorems: Theorem[] = [
  {
    id: 'pythagorean',
    name: 'Pythagorean Theorem',
    statement: 'In a right-angled triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides.',
  },
  {
    id: 'ftc',
    name: 'Fundamental Theorem of Calculus',
    statement: 'The fundamental theorem of calculus relates the concept of differentiating a function with the concept of integrating a function. The first part states that the definite integration of a function is related to its antiderivative, and can be reversed by differentiation. The second part states that the definite integral of a function can be computed by using any one of its infinitely many antiderivatives.',
  },
  {
    id: 'goedel',
    name: "Gödel's Incompleteness Theorems",
    statement: "The first incompleteness theorem states that for any self-consistent recursive axiomatic system powerful enough to describe the arithmetic of the natural numbers (for example, Peano arithmetic), there are true propositions about the naturals that cannot be proved from the axioms. The second incompleatness theorem, an extension of the first, shows that the system cannot prove its own consistency.",
  },
];
