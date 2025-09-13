import { Theorem } from './types';

export const theorems: Theorem[] = [
  {
    id: 'goedels_incompleteness_theorems',
    name: 'Gödel\'s Incompleteness Theorems',
    statement: 'The first incompleteness theorem states that in any consistent formal system F within which a certain amount of elementary arithmetic can be carried out, there are statements of the language of F which can neither be proved nor disproved in F. The second incompleteness theorem, an extension of the first, shows that the system cannot prove its own consistency.',
  },
  {
    id: 'diagonal_lemma',
    name: 'Diagonal Lemma',
    statement: 'The diagonal lemma states that for any formula F(x) in a formal system that can represent all computable functions, there is a sentence S such that S is provably equivalent to F(⌈S⌉), where ⌈S⌉ is the Gödel number of S. This is a key result used in proving Gödel\'s incompleteness theorems.'
  },
  {
    id: 'ftc',
    name: 'Fundamental Theorem of Calculus',
    statement: 'The fundamental theorem of calculus relates the concept of differentiating a function with the concept of integrating a function. The first part states that the definite integration of a function is related to its antiderivative, and can be reversed by differentiation. The second part states that the definite integral of a function can be computed by using any one of its infinitely many antiderivatives.',
  },
  {
    id: 'fundamental_theorem_of_arithmetic',
    name: 'Fundamental Theorem of Arithmetic',
    statement: 'The fundamental theorem of arithmetic states that every integer greater than 1 either is a prime number itself or can be represented as the product of prime numbers and that, moreover, this representation is unique, up to the order of the factors.'
  },
  {
    id: 'mean_value_theorem',
    name: 'Mean Value Theorem',
    statement: 'The mean value theorem states that for a given planar arc between two endpoints, there is at least one point at which the tangent to the arc is parallel to the secant through its endpoints.'
  },
  {
    id: 'intermediate_value_theorem',
    name: 'Intermediate Value Theorem',
    statement: 'In mathematical analysis, the intermediate value theorem states that if a continuous function, f, with an interval, [a, b], as its domain, takes values f(a) and f(b) at each end of the interval, then it also takes any value between f(a) and f(b) at some point within the interval.'
  },
  {
    id: 'rank_nullity_theorem',
    name: 'Rank-Nullity Theorem',
    statement: 'In mathematics, the rank-nullity theorem is a theorem in linear algebra, which asserts that the dimension of the domain of a linear map is the sum of its rank and its nullity.'
  },
];
