import { Theorem } from './types';

export const theorems: Theorem[] = [
  {
    id: 'goedels_incompleteness_theorems',
    name: 'Gödel\'s Incompleteness Theorems',
    statement: 'The first incompleteness theorem states that in any consistent formal system F within which a certain amount of elementary arithmetic can be carried out, there are statements of the language of F which can neither be proved nor disproved in F. The second incompleteness theorem, an extension of the first, shows that the system cannot prove its own consistency.',
  },
  {
    id: 'ftc',
    name: 'Fundamental Theorem of Calculus',
    statement: 'The fundamental theorem of calculus relates the concept of differentiating a function with the concept of integrating a function. The first part states that the definite integration of a function is related to its antiderivative, and can be reversed by differentiation. The second part states that the definite integral of a function can be computed by using any one of its infinitely many antiderivatives.',
  },
  {
    id: 'central_limit_theorem',
    name: 'Central Limit Theorem',
    statement: 'The central limit theorem states that the distribution of the sum (or average) of a large number of independent, identically distributed variables will be approximately normal, regardless of the underlying distribution.'
  },
  {
    id: 'law_of_large_numbers',
    name: 'Law of Large Numbers',
    statement: 'The law of large numbers is a theorem that describes the result of performing the same experiment a large number of times. According to the law, the average of the results obtained from a large number of trials should be close to the expected value, and will tend to become closer as more trials are performed.'
  },
  {
    id: 'bayes_theorem',
    name: 'Bayes\' Theorem',
    statement: 'Bayes\' theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event.'
  },
  {
    id: 'pigeonhole_principle',
    name: 'Pigeonhole Principle',
    statement: 'The pigeonhole principle states that if n items are put into m containers, with n > m, then at least one container must contain more than one item.'
  },
  {
    id: 'fermat_little_theorem',
    name: 'Fermat\'s Little Theorem',
    statement: 'Fermat\'s little theorem states that if p is a prime number, then for any integer a, the number a^p - a is an integer multiple of p.'
  },
  {
    id: 'euclids_theorem',
    name: 'Euclid\'s Theorem on Infinitude of Primes',
    statement: 'Euclid\'s theorem is a fundamental statement in number theory that asserts that there are infinitely many prime numbers.'
  },
  {
    id: 'fundamental_theorem_of_arithmetic',
    name: 'Fundamental Theorem of Arithmetic',
    statement: 'The fundamental theorem of arithmetic states that every integer greater than 1 either is a prime number itself or can be represented as the product of prime numbers and that, moreover, this representation is unique, up to the order of the factors.'
  },
  {
    id: 'cauchy_schwarz_inequality',
    name: 'Cauchy-Schwarz Inequality',
    statement: 'The Cauchy-Schwarz inequality is a useful inequality encountered in many different settings, such as linear algebra, analysis, and probability theory. It states that for all vectors x and y of an inner product space, the absolute value of the inner product is less than or equal to the product of the norms.'
  },
  {
    id: 'mean_value_theorem',
    name: 'Mean Value Theorem',
    statement: 'The mean value theorem states that for a given planar arc between two endpoints, there is at least one point at which the tangent to the arc is parallel to the secant through its endpoints.'
  },
  {
    id: 'lagrange_theorem',
    name: 'Lagrange\'s Theorem (Group Theory)',
    statement: 'In the mathematical field of group theory, Lagrange\'s theorem is a theorem that states that for any finite group G, the order (number of elements) of every subgroup H of G divides the order of G.'
  },
  {
    id: 'cayley_hamilton_theorem',
    name: 'Cayley-Hamilton Theorem',
    statement: 'In linear algebra, the Cayley-Hamilton theorem states that every square matrix over a commutative ring (such as the real or complex numbers) satisfies its own characteristic equation.'
  },
  {
    id: 'spectral_theorem',
    name: 'Spectral Theorem',
    statement: 'The spectral theorem provides conditions under which a linear operator or a matrix can be diagonalized. This is extremely useful in applications in both pure and applied mathematics.'
  },
  {
    id: 'hairy_ball_theorem',
    name: 'Hairy Ball Theorem',
    statement: 'The hairy ball theorem of algebraic topology states that there is no non-vanishing continuous tangent vector field on even-dimensional n-spheres.'
  },
  {
    id: 'fixed_point_theorem',
    name: 'Brouwer Fixed-Point Theorem',
    statement: 'Brouwer\'s fixed-point theorem is a fixed-point theorem in topology, which states that for any continuous function f mapping a compact convex set into itself, there is a point x0 such that f(x0) = x0.'
  },
  {
    id: 'cantor_theorem',
    name: 'Cantor\'s Theorem',
    statement: 'In mathematical set theory, Cantor\'s theorem is a fundamental result which states that, for any set A, the set of all subsets of A (the power set of A) has a strictly greater cardinality than A itself.'
  },
  {
    id: 'intermediate_value_theorem',
    name: 'Intermediate Value Theorem',
    statement: 'In mathematical analysis, the intermediate value theorem states that if a continuous function, f, with an interval, [a, b], as its domain, takes values f(a) and f(b) at each end of the interval, then it also takes any value between f(a) and f(b) at some point within the interval.'
  },
  {
    id: 'extreme_value_theorem',
    name: 'Extreme Value Theorem',
    statement: 'In calculus, the extreme value theorem states that if a real-valued function f is continuous on the closed interval [a, b], then f must attain a maximum and a minimum, each at least once.'
  },
  {
    id: 'rank_nullity_theorem',
    name: 'Rank-Nullity Theorem',
    statement: 'In mathematics, the rank-nullity theorem is a theorem in linear algebra, which asserts that the dimension of the domain of a linear map is the sum of its rank and its nullity.'
  },
];
