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
    statement: "The first incompleteness theorem states that for any self-consistent recursive axiomatic system powerful enough to describe the arithmetic of the natural numbers (for example, Peano arithmetic), there are true propositions about the naturals that cannot be proved from the axioms. The second incompleteness theorem, an extension of the first, shows that the system cannot prove its own consistency.",
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
    statement: 'Bayes\' theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event. For example, if the risk of developing health problems is known to increase with age, Bayes’ theorem allows the risk to an individual of a known age to be assessed more accurately than simply assuming that the individual is typical of the population as a whole.'
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
    id: 'chinese_remainder_theorem',
    name: 'Chinese Remainder Theorem',
    statement: 'The Chinese remainder theorem states that if one knows the remainders of the Euclidean division of an integer n by several integers, then one can determine uniquely the remainder of the division of n by the product of these integers, under the condition that the divisors are pairwise coprime.'
  },
  {
    id: 'euclids_theorem',
    name: 'Euclid\'s Theorem on Infinitude of Primes',
    statement: 'Euclid\'s theorem is a fundamental statement in number theory that asserts that there are infinitely many prime numbers.'
  },
  {
    id: 'fundamental_theorem_of_arithmetic',
    name: 'Fundamental Theorem of Arithmetic',
    statement: 'The fundamental theorem of arithmetic, also called the unique factorization theorem or the unique-prime-factorization theorem, states that every integer greater than 1 either is a prime number itself or can be represented as the product of prime numbers and that, moreover, this representation is unique, up to the order of the factors.'
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
    id: 'taylor_theorem',
    name: 'Taylor\'s Theorem',
    statement: 'Taylor\'s theorem gives an approximation of a k-times differentiable function around a given point by a polynomial of degree k, called the k-th order Taylor polynomial.'
  },
  {
    id: 'lagrange_theorem',
    name: 'Lagrange\'s Theorem (Group Theory)',
    statement: 'In the mathematical field of group theory, Lagrange\'s theorem is a theorem that states that for any finite group G, the order (number of elements) of every subgroup H of G divides the order of G.'
  },
  {
    id: 'isomorphism_theorems',
    name: 'Isomorphism Theorems',
    statement: 'The isomorphism theorems are three theorems in abstract algebra that describe the relationship between quotients, homomorphisms, and subobjects. Versions of the theorems exist for groups, rings, vector spaces, modules, Lie algebras, and various other algebraic structures.'
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
    id: 'noether_theorem',
    name: 'Noether\'s Theorem',
    statement: 'Noether\'s theorem states that every differentiable symmetry of the action of a physical system has a corresponding conservation law.'
  },
  {
    id: 'riemann_roch_theorem',
    name: 'Riemann-Roch Theorem',
    statement: 'The Riemann-Roch theorem is an important theorem in mathematics, specifically in complex analysis and algebraic geometry, for the computation of the dimension of the space of meromorphic functions with prescribed zeros and allowed poles.'
  },
  {
    id: 'hairy_ball_theorem',
    name: 'Hairy Ball Theorem',
    statement: 'The hairy ball theorem of algebraic topology states that there is no non-vanishing continuous tangent vector field on even-dimensional n-spheres. For the ordinary sphere, if f is a continuous function that assigns a vector in R3 to every point p on a sphere such that f(p) is always tangent to the sphere at p, then there is at least one p such that f(p) = 0.'
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
    id: 'schroeder_bernstein_theorem',
    name: 'Schröder-Bernstein Theorem',
    statement: 'The Schröder-Bernstein theorem states that if there exist injective functions f: A → B and g: B → A between the sets A and B, then there exists a bijective function h: A → B.'
  },
  {
    id: 'continuum_hypothesis',
    name: 'Continuum Hypothesis',
    statement: 'The continuum hypothesis is a hypothesis about the possible sizes of infinite sets. It states that there is no set whose cardinality is strictly between that of the integers and that of the real numbers.'
  },
  {
    id: 'well_ordering_theorem',
    name: 'Well-Ordering Theorem',
    statement: 'The well-ordering theorem, also known as Zermelo\'s theorem, states that every set can be well-ordered. A set X is well-ordered by a strict total order if every non-empty subset of X has a least element under the ordering.'
  },
  {
    id: 'zorn_lemma',
    name: 'Zorn\'s Lemma',
    statement: 'Zorn\'s lemma states that a partially ordered set containing upper bounds for every chain (that is, every totally ordered subset) necessarily contains at least one maximal element.'
  },
  {
    id: 'four_color_theorem',
    name: 'Four Color Theorem',
    statement: 'The four color theorem states that any map in a plane can be colored using four colors in such a way that regions sharing a common boundary (other than a single point) do not share the same color.'
  },
  {
    id: 'kurzweil_henstock_integral',
    name: 'Henstock-Kurzweil integral',
    statement: 'The Henstock-Kurzweil integral, also known as the Denjoy integral, the Luzin integral or Perron integral, is a generalization of the Riemann integral, and in some aspects more general than the Lebesgue integral.'
  },
  {
    id: 'lebesgue_dominated_convergence',
    name: 'Lebesgue Dominated Convergence Theorem',
    statement: 'In measure theory, Lebesgue\'s dominated convergence theorem provides a sufficient condition under which almost everywhere convergence of a sequence of functions implies convergence in the L1 norm.'
  },
  {
    id: 'monotone_convergence_theorem',
    name: 'Monotone Convergence Theorem',
    statement: 'In mathematics, the monotone convergence theorem is any of a number of related theorems proving the convergence of monotonic sequences (sequences that are non-decreasing or non-increasing).'
  },
  {
    id: 'fatou_lemma',
    name: 'Fatou\'s Lemma',
    statement: 'In mathematics, Fatou\'s lemma is a lemma in real analysis that establishes an inequality relating the Lebesgue integral of the limit inferior of a sequence of functions to the limit inferior of integrals of these functions.'
  },
  {
    id: 'fubini_theorem',
    name: 'Fubini\'s Theorem',
    statement: 'In mathematical analysis, Fubini\'s theorem is a result that gives conditions under which it is possible to compute a double integral by using an iterated integral.'
  },
  {
    id: 'radon_nikodym_theorem',
    name: 'Radon-Nikodym Theorem',
    statement: 'The Radon-Nikodym theorem is a result in measure theory that expresses one measure in terms of another. It is a generalization of the idea that any function can be integrated.'
  },
  {
    id: 'riesz_representation_theorem',
    name: 'Riesz Representation Theorem',
    statement: 'The Riesz representation theorem is a theorem in functional analysis. It represents linear functionals on certain spaces of functions as integrals.'
  },
  {
    id: 'hahn_banach_theorem',
    name: 'Hahn-Banach Theorem',
    statement: 'The Hahn-Banach theorem is a central tool in functional analysis. It allows the extension of bounded linear functionals defined on a subspace of some vector space to the whole space, and it also shows that there are "enough" continuous linear functionals defined on every normed vector space to make the study of the dual space "interesting".'
  },
  {
    id: 'open_mapping_theorem',
    name: 'Open Mapping Theorem (Functional Analysis)',
    statement: 'In functional analysis, the open mapping theorem, also known as the Banach-Schauder theorem, is a fundamental result which states that if A: X → Y is a surjective continuous linear operator between Banach spaces X and Y, then A is an open map.'
  },
  {
    id: 'closed_graph_theorem',
    name: 'Closed Graph Theorem',
    statement: 'In mathematics, the closed graph theorem is a basic result in functional analysis that characterizes continuous linear operators between Banach spaces in terms of their graphs.'
  },
  {
    id: 'uniform_boundedness_principle',
    name: 'Uniform Boundedness Principle',
    statement: 'The uniform boundedness principle or Banach-Steinhaus theorem is a fundamental result in functional analysis. In its simplest form, it asserts that a family of continuous linear operators from a Banach space to a normed vector space is uniformly bounded if it is pointwise bounded.'
  },
  {
    id: 'arzela_ascoli_theorem',
    name: 'Arzelà-Ascoli Theorem',
    statement: 'The Arzelà-Ascoli theorem is a fundamental result of mathematical analysis giving necessary and sufficient conditions to decide whether every sequence of a given family of real-valued continuous functions defined on a closed and bounded interval has a uniformly convergent subsequence.'
  },
  {
    id: 'stone_weierstrass_theorem',
    name: 'Stone-Weierstrass Theorem',
    statement: 'The Stone-Weierstrass theorem is a generalization of the Weierstrass approximation theorem. The Stone-Weierstrass theorem states that every continuous function defined on a compact interval [a, b] can be uniformly approximated as closely as desired by a polynomial function.'
  },
  {
    id: 'tietze_extension_theorem',
    name: 'Tietze Extension Theorem',
    statement: 'In topology, the Tietze extension theorem states that any continuous function from a closed subset of a normal topological space into the real numbers can be extended to a continuous function on the whole space.'
  },
  {
    id: 'bolzano_weierstrass_theorem',
    name: 'Bolzano-Weierstrass Theorem',
    statement: 'In mathematics, specifically in real analysis, the Bolzano-Weierstrass theorem states that each bounded sequence in Rn has a convergent subsequence.'
  },
  {
    id: 'heine_borel_theorem',
    name: 'Heine-Borel Theorem',
    statement: 'In the topology of metric spaces, the Heine-Borel theorem states that for a subset of Euclidean space Rn, to be compact is equivalent to being closed and bounded.'
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
    id: 'lhopital_rule',
    name: 'L\'Hôpital\'s Rule',
    statement: 'In calculus, L\'Hôpital\'s rule or L\'Hospital\'s rule uses derivatives to help evaluate limits involving indeterminate forms.'
  },
  {
    id: 'fermat_theorem_on_stationary_points',
    name: 'Fermat\'s Theorem on Stationary Points',
    statement: 'In mathematics, Fermat\'s theorem (also known as interior extremum theorem) is a method to find local maxima and minima of differentiable functions on open sets by showing that every local extremum of the function is a stationary point (the function\'s derivative is zero at that point).'
  },
  {
    id: 'green_theorem',
    name: 'Green\'s Theorem',
    statement: 'In vector calculus, Green\'s theorem relates a line integral around a simple closed curve C to a double integral over the plane region D bounded by C.'
  },
  {
    id: 'stokes_theorem',
    name: 'Stokes\' Theorem',
    statement: 'In vector calculus, and more generally differential geometry, Stokes\' theorem is a statement about the integration of differential forms on manifolds, which both simplifies and generalizes several theorems from vector calculus.'
  },
  {
    id: 'divergence_theorem',
    name: 'Divergence Theorem',
    statement: 'In vector calculus, the divergence theorem, also known as Gauss\'s theorem or Ostrogradsky\'s theorem, is a theorem which relates the flux of a vector field through a closed surface to the divergence of the field in the volume enclosed.'
  },
  {
    id: 'frobenius_theorem_differential_topology',
    name: 'Frobenius Theorem (Differential Topology)',
    statement: 'In mathematics, Frobenius\' theorem gives necessary and sufficient conditions for finding a maximal set of independent solutions of an overdetermined system of first-order linear homogeneous partial differential equations.'
  },
  {
    id: 'implicit_function_theorem',
    name: 'Implicit Function Theorem',
    statement: 'The implicit function theorem is a tool that allows relations to be converted to functions of several real variables. It does this by representing the relation as the graph of a function.'
  },
  {
    id: 'rank_nullity_theorem',
    name: 'Rank-Nullity Theorem',
    statement: 'In mathematics, the rank-nullity theorem is a theorem in linear algebra, which asserts that the dimension of the domain of a linear map is the sum of its rank and its nullity.'
  },
  {
    id: 'rouche_capelli_theorem',
    name: 'Rouché-Capelli Theorem',
    statement: 'In linear algebra, the Rouché-Capelli theorem determines the number of solutions for a system of linear equations, given the rank of its augmented matrix and coefficient matrix.'
  },
  {
    id: 'determinant_properties',
    name: 'Properties of Determinants',
    statement: 'The determinant is a scalar value that can be computed from the elements of a square matrix and encodes certain properties of the linear transformation described by the matrix. Determinants have various properties, including multiplicativity and behavior under row operations.'
  },
  {
    id: 'cramer_rule',
    name: 'Cramer\'s Rule',
    statement: 'In linear algebra, Cramer\'s rule is an explicit formula for the solution of a system of linear equations with as many equations as unknowns, valid whenever the system has a unique solution.'
  },
  {
    id: 'eigenvalue_and_eigenvector',
    name: 'Eigenvalues and Eigenvectors',
    statement: 'In linear algebra, an eigenvector or characteristic vector of a linear transformation is a nonzero vector that changes at most by a scalar factor when that linear transformation is applied to it. The corresponding scalar factor is often denoted by λ and is called the eigenvalue.'
  },
  {
    id: 'diagonalization',
    name: 'Diagonalization of a Matrix',
    statement: 'A square matrix is called diagonalizable or non-defective if it is similar to a diagonal matrix. That is, if there exists an invertible matrix P such that P−1AP is a diagonal matrix. Such a P is said to diagonalize A.'
  },
  {
    id: 'jordan_normal_form',
    name: 'Jordan Normal Form',
    statement: 'In linear algebra, a Jordan normal form, also known as a Jordan canonical form, is an upper triangular matrix of a particular form called a Jordan matrix representing a linear operator on a finite-dimensional vector space with respect to some basis.'
  },
  {
    id: 'singular_value_decomposition',
    name: 'Singular Value Decomposition',
    statement: 'In linear algebra, the singular value decomposition is a factorization of a real or complex matrix. It is the generalization of the eigendecomposition of a positive semidefinite normal matrix (for example, a symmetric matrix with positive eigenvalues) to any m × n matrix via an extension of the polar decomposition.'
  },
  {
    id: 'qr_decomposition',
    name: 'QR Decomposition',
    statement: 'In linear algebra, a QR decomposition, also known as a QR factorization or QU factorization, is a decomposition of a matrix A into a product A = QR of an orthogonal matrix Q and an upper triangular matrix R.'
  },
  {
    id: 'lu_decomposition',
    name: 'LU Decomposition',
    statement: 'In linear algebra, LU decomposition is a factorization of a matrix as the product of a lower triangular matrix and an upper triangular matrix.'
  },
  {
    id: 'cholesky_decomposition',
    name: 'Cholesky Decomposition',
    statement: 'In linear algebra, the Cholesky decomposition or Cholesky factorization is a decomposition of a Hermitian, positive-definite matrix into the product of a lower triangular matrix and its conjugate transpose.'
  },
  {
    id: 'schur_decomposition',
    name: 'Schur Decomposition',
    statement: 'In the mathematical discipline of linear algebra, the Schur decomposition or Schur triangulation, named after Issai Schur, is a matrix decomposition. It allows one to write an arbitrary square matrix as unitarily equivalent to an upper triangular matrix.'
  },
  {
    id: 'perron_frobenius_theorem',
    name: 'Perron-Frobenius Theorem',
    statement: 'In mathematics, the Perron-Frobenius theorem, proved by Oskar Perron and Georg Frobenius, asserts that a real square matrix with positive entries has a unique largest real eigenvalue and that the corresponding eigenvector has strictly positive components.'
  },
  {
    id: 'gershgorin_circle_theorem',
    name: 'Gershgorin Circle Theorem',
    statement: 'In mathematics, the Gershgorin circle theorem may be used to bound the spectrum of a square matrix. It was first published by the Soviet mathematician Semyon Aranovich Gershgorin in 1931.'
  },
  {
    id: 'courant_fischer_min_max_theorem',
    name: 'Courant-Fischer Min-Max Theorem',
    statement: 'The Courant-Fischer min-max theorem is a result in linear algebra that gives a variational characterization of the eigenvalues of a Hermitian matrix.'
  },
  {
    id: 'cauchy_binet_formula',
    name: 'Cauchy-Binet Formula',
    statement: 'The Cauchy-Binet formula is an identity for the determinant of the product of two rectangular matrices of transpose shapes.'
  },
  {
    id: 'laplace_expansion',
    name: 'Laplace Expansion',
    statement: 'In linear algebra, the Laplace expansion, named after Pierre-Simon Laplace, also called cofactor expansion, is an expression for the determinant of an n × n matrix. It is a weighted sum of the determinants of n sub-matrices of size (n − 1) × (n − 1).'
  },
  {
    id: 'matrix_tree_theorem',
    name: 'Matrix Tree Theorem',
    statement: 'In the mathematical field of graph theory, the matrix tree theorem or Kirchhoff\'s theorem, named after Gustav Kirchhoff, is a theorem about the number of spanning trees in a graph.'
  },
  {
    id: 'max_flow_min_cut_theorem',
    name: 'Max-Flow Min-Cut Theorem',
    statement: 'In optimization theory, the max-flow min-cut theorem states that in a flow network, the maximum amount of flow passing from the source to the sink is equal to the total capacity of the edges in a minimum cut.'
  },
  {
    id: 'hall_marriage_theorem',
    name: 'Hall\'s Marriage Theorem',
    statement: 'In mathematics, Hall\'s marriage theorem is a theorem with two equivalent formulations. In one, it gives a sufficient condition for the existence of a system of distinct representatives. In another, it is a result about bipartite graphs.'
  },
  {
    id: 'menger_theorem',
    name: 'Menger\'s Theorem',
    statement: 'In the mathematical discipline of graph theory, Menger\'s theorem says that in a finite graph, the minimum number of vertices in a u-v separator is equal to the maximum number of vertex-disjoint u-v paths.'
  },
  {
    id: 'dilworth_theorem',
    name: 'Dilworth\'s Theorem',
    statement: 'Dilworth\'s theorem is a theorem in order theory which states that in any finite partially ordered set, the size of the largest antichain equals the minimum number of chains needed to cover all elements.'
  },
  {
    id: 'ramsey_theorem',
    name: 'Ramsey\'s Theorem',
    statement: 'In combinatorics, Ramsey\'s theorem, in one of its graph-theoretic forms, states that one will find monochromatic cliques in any edge-labelling (with colours) of a sufficiently large complete graph.'
  },
  {
    id: 'turan_theorem',
    name: 'Turán\'s Theorem',
    statement: 'In the mathematical field of graph theory, Turán\'s theorem is a result on the number of edges in a Kr-free graph.'
  },
  {
    id: 'kuratowski_theorem',
    name: 'Kuratowski\'s Theorem',
    statement: 'In graph theory, Kuratowski\'s theorem is a mathematical forbidden graph characterization of planar graphs, named after Kazimierz Kuratowski.'
  },
  {
    id: 'wagner_theorem',
    name: 'Wagner\'s Theorem',
    statement: 'In graph theory, Wagner\'s theorem is a mathematical forbidden graph characterization of planar graphs, named after Klaus Wagner. It states that a finite graph is planar if and only if its minors include neither K5 (the complete graph on five vertices) nor K3,3 (the complete bipartite graph on six vertices).'
  },
  {
    id: 'graph_minor_theorem',
    name: 'Graph Minor Theorem',
    statement: 'In graph theory, the graph minor theorem states that every minor-closed family of graphs can be characterized by a finite set of forbidden minors. This is also known as the Robertson-Seymour theorem.'
  },
  {
    id: 'lovasz_local_lemma',
    name: 'Lovász Local Lemma',
    statement: 'In probability theory, the Lovász local lemma is a result that shows that if a number of "bad" events are "mostly" independent from one another and each has a not "too large" probability, then there is a non-zero probability that none of them will occur.'
  },
  {
    id: 'burnside_lemma',
    name: 'Burnside\'s Lemma',
    statement: 'Burnside\'s lemma, sometimes also called the Cauchy-Frobenius lemma, is a result in group theory that is often useful in counting problems. It gives a formula to count the number of orbits in a set X under the action of a group G.'
  },
  {
    id: 'polya_enumeration_theorem',
    name: 'Pólya Enumeration Theorem',
    statement: 'In combinatorics, the Pólya enumeration theorem is a theorem that provides a way to enumerate the number of distinct configurations (or "colorings") of a set of objects under the action of a symmetry group.'
  },
  {
    id: 'van_der_waerden_theorem',
    name: 'Van der Waerden\'s Theorem',
    statement: 'In mathematics, Van der Waerden\'s theorem is a theorem in the field of Ramsey theory, named after the Dutch mathematician B. L. van der Waerden. It states that for any given positive integers r and k, there is some number N such that if the integers {1, 2, ..., N} are colored, each with one of r different colors, then there must exist a monochromatic arithmetic progression of length k.'
  },
  {
    id: 'szemeredi_theorem',
    name: 'Szemerédi\'s Theorem',
    statement: 'Szemerédi\'s theorem is a result in arithmetic combinatorics, concerning arithmetic progressions in subsets of the integers. In 1936, Erdős and Turán conjectured that any sequence of natural numbers with positive natural density contains an arithmetic progression of length k for every k. Szemerédi proved the conjecture in 1975.'
  },
  {
    id: 'green_tao_theorem',
    name: 'Green-Tao Theorem',
    statement: 'The Green-Tao theorem, proved by Ben Green and Terence Tao in 2004, states that the sequence of prime numbers contains arbitrarily long arithmetic progressions.'
  },
  {
    id: 'fermat_last_theorem',
    name: 'Fermat\'s Last Theorem',
    statement: 'Fermat\'s Last Theorem states that no three positive integers a, b, and c can satisfy the equation an + bn = cn for any integer value of n greater than 2.'
  },
  {
    id: 'dirichlet_theorem_on_arithmetic_progressions',
    name: 'Dirichlet\'s Theorem on Arithmetic Progressions',
    statement: 'In number theory, Dirichlet\'s theorem on arithmetic progressions, also called the Dirichlet prime number theorem, states that for any two coprime integers a and d, there are infinitely many primes of the form a + nd, where n is a non-negative integer.'
  },
  {
    id: 'prime_number_theorem',
    name: 'Prime Number Theorem',
    statement: 'The prime number theorem describes the asymptotic distribution of the prime numbers among the positive integers. It formalizes the intuitive idea that primes become less common as they become larger by precisely quantifying the rate at which this occurs.'
  },
  {
    id: 'riemann_hypothesis',
    name: 'Riemann Hypothesis',
    statement: 'The Riemann hypothesis is a conjecture that the Riemann zeta function has its zeros only at the negative even integers and complex numbers with real part 1/2.'
  },
  {
    id: 'goldbach_conjecture',
    name: 'Goldbach Conjecture',
    statement: 'The Goldbach conjecture is one of the oldest and best-known unsolved problems in number theory and in all of mathematics. It states that every even integer greater than 2 is the sum of two primes.'
  },
  {
    id: 'twin_prime_conjecture',
    name: 'Twin Prime Conjecture',
    statement: 'The twin prime conjecture is a well-known conjecture in number theory that there are infinitely many prime numbers p such that p + 2 is also prime.'
  },
  {
    id: 'legendre_conjecture',
    name: 'Legendre\'s Conjecture',
    statement: 'Legendre\'s conjecture, proposed by Adrien-Marie Legendre, states that there is a prime number between n^2 and (n + 1)^2 for every positive integer n.'
  },
  {
    id: 'abc_conjecture',
    name: 'ABC Conjecture',
    statement: 'The abc conjecture is a conjecture in number theory, that arose out of a discussion of Joseph Oesterlé and David Masser in 1985. It is stated in terms of three positive integers, a, b and c (hence the name) that are coprime and satisfy a + b = c.'
  },
  {
    id: 'erdos_straus_conjecture',
    name: 'Erdős-Straus Conjecture',
    statement: 'The Erdős-Straus conjecture states that for all integers n ≥ 2, the rational number 4/n can be expressed as the sum of three positive unit fractions.'
  },
  {
    id: 'catalan_conjecture',
    name: 'Catalan\'s Conjecture (Mihăilescu\'s Theorem)',
    statement: 'In number theory, Catalan\'s conjecture (or Mihăilescu\'s theorem) is a theorem which states that the only solution in the natural numbers of x^a − y^b = 1 for a, b > 1, x, y ≥ 1 is x = 3, a = 2, y = 2, b = 3.'
  },
  {
    id: 'lindemann_weierstrass_theorem',
    name: 'Lindemann-Weierstrass Theorem',
    statement: 'The Lindemann-Weierstrass theorem is a result that is very useful in establishing the transcendence of a number. It states that if α1, ..., αn are algebraic numbers which are linearly independent over the rational numbers Q, then e^α1, ..., e^αn are algebraically independent over Q.'
  },
  {
    id: 'gelfond_schneider_theorem',
    name: 'Gelfond-Schneider Theorem',
    statement: 'In mathematics, the Gelfond-Schneider theorem is a result that establishes the transcendence of a large class of numbers.'
  },
  {
    id: 'baker_theorem',
    name: 'Baker\'s Theorem',
    statement: 'In mathematics, Baker\'s theorem gives a lower bound for the absolute value of a linear combination of logarithms of algebraic numbers.'
  },
  {
    id: 'thue_siegel_roth_theorem',
    name: 'Thue-Siegel-Roth Theorem',
    statement: 'The Thue-Siegel-Roth theorem is a result in the field of Diophantine approximation to algebraic numbers. It states that if α is a real algebraic number, and ε is any positive real number, then the inequality |α - p/q| < 1/q^(2+ε) has only a finite number of solutions in rational numbers p/q.'
  },
  {
    id: 'mordell_weil_theorem',
    name: 'Mordell-Weil Theorem',
    statement: 'The Mordell-Weil theorem states that for an abelian variety A over a number field K, the group A(K) of K-rational points of A is a finitely generated abelian group.'
  },
  {
    id: 'hilbert_nullstellensatz',
    name: 'Hilbert\'s Nullstellensatz',
    statement: 'Hilbert\'s Nullstellensatz is a theorem that establishes a fundamental relationship between geometry and algebra. This relationship is the basis of algebraic geometry.'
  },
  {
    id: 'bezout_theorem',
    name: 'Bézout\'s Theorem',
    statement: 'In algebraic geometry, Bézout\'s theorem is a statement about the number of common points, or intersection points, of two plane algebraic curves.'
  },
  {
    id: 'hodge_conjecture',
    name: 'Hodge Conjecture',
    statement: 'The Hodge conjecture is a major unsolved problem in algebraic geometry that relates the algebraic topology of a non-singular complex algebraic variety and the subvarieties of that variety.'
  },
  {
    id: 'tate_conjecture',
    name: 'Tate Conjecture',
    statement: 'In mathematics, the Tate conjecture is a 1963 conjecture of John Tate in algebraic geometry that describes the algebraic cycles on a variety in terms of Galois representations.'
  },
  {
    id: 'weil_conjectures',
    name: 'Weil Conjectures',
    statement: 'In mathematics, the Weil conjectures were a set of highly influential proposals by André Weil on the generating functions known as local zeta-functions, for algebraic varieties over finite fields.'
  },
  {
    id: 'modularity_theorem',
    name: 'Modularity Theorem',
    statement: 'The modularity theorem states that every elliptic curve over the rational numbers is modular. The theorem was a conjecture of Taniyama and Shimura, and its proof by Andrew Wiles, with help from Richard Taylor, also proved Fermat\'s Last Theorem.'
  },
  {
    id: 'birch_and_swinnerton_dyer_conjecture',
    name: 'Birch and Swinnerton-Dyer Conjecture',
    statement: 'The Birch and Swinnerton-Dyer conjecture is an open problem in mathematics, one of the seven Millennium Prize Problems listed by the Clay Mathematics Institute. It describes the set of rational solutions to equations defining an elliptic curve.'
  },
  {
    id: 'grothendieck_riemann_roch_theorem',
    name: 'Grothendieck-Riemann-Roch Theorem',
    statement: 'The Grothendieck-Riemann-Roch theorem is a far-reaching generalization of the Hirzebruch-Riemann-Roch theorem, about coherent sheaves on a scheme.'
  },
  {
    id: 'atiyah_singer_index_theorem',
    name: 'Atiyah-Singer Index Theorem',
    statement: 'The Atiyah-Singer index theorem states that for an elliptic differential operator on a compact manifold, the analytical index is equal to the topological index.'
  },
  {
    id: 'poincare_conjecture',
    name: 'Poincaré Conjecture',
    statement: 'In mathematics, the Poincaré conjecture is a theorem about the characterization of the 3-sphere, which is the hypersphere that bounds the unit ball in four-dimensional space.'
  },
  {
    id: 'thurston_geometrization_conjecture',
    name: 'Thurston\'s Geometrization Conjecture',
    statement: 'The geometrization conjecture gives a way to decompose any compact 3-manifold into pieces that have a geometric structure.'
  },
  {
    id: 'smale_h_cobordism_theorem',
    name: 'Smale\'s h-cobordism Theorem',
    statement: 'In differential topology, the h-cobordism theorem of Stephen Smale proves that if (W; M, M\') is a compact h-cobordism between two simply connected smooth closed manifolds M and M\' of dimension n ≥ 5, then W is diffeomorphic to the cylinder M × [0, 1].'
  },
  {
    id: 'whitney_embedding_theorem',
    name: 'Whitney Embedding Theorem',
    statement: 'In differential topology, the Whitney embedding theorem states that any smooth real n-dimensional manifold can be smoothly embedded in the 2n-dimensional Euclidean space.'
  },
  {
    id: 'morse_theory',
    name: 'Morse Theory',
    statement: 'In mathematics, specifically in differential topology, Morse theory is a set of techniques for studying the topology of a manifold by analyzing the critical points of a smooth function on the manifold.'
  },
  {
    id: 'de_rham_cohomology',
    name: 'De Rham Cohomology',
    statement: 'In mathematics, de Rham cohomology is a tool belonging both to algebraic topology and to differential topology, capable of expressing basic topological information about smooth manifolds in a form adapted to computation and the concrete representation of cohomology classes.'
  },
  {
    id: 'hodge_theory',
    name: 'Hodge Theory',
    statement: 'In mathematics, Hodge theory, named after W. V. D. Hodge, is a method for studying the cohomology groups of a smooth manifold M using partial differential equations.'
  },
  {
    id: 'chern_weil_theory',
    name: 'Chern-Weil Theory',
    statement: 'In mathematics, the Chern-Weil theory, named after Shiing-Shen Chern and André Weil, is a way of defining characteristic classes of vector bundles and principal bundles on a smooth manifold.'
  },
  {
    id: 'gauss_bonnet_theorem',
    name: 'Gauss-Bonnet Theorem',
    statement: 'The Gauss-Bonnet theorem, or Gauss-Bonnet formula, is a fundamental formula of differential geometry, connecting the curvature of a surface to its Euler characteristic.'
  },
  {
    id: 'nash_embedding_theorem',
    name: 'Nash Embedding Theorem',
    statement: 'The Nash embedding theorems (or imbedding theorems), named after John Forbes Nash, state that every Riemannian manifold can be isometrically embedded into some Euclidean space.'
  },
  {
    id: 'ricci_flow',
    name: 'Ricci Flow',
    statement: 'In differential geometry, the Ricci flow is the intrinsic geometric flow—a process that deforms the metric of a Riemannian manifold in a way formally analogous to the diffusion of heat, thus smoothing out irregularities in the metric.'
  },
  {
    id: 'calabi_yau_theorem',
    name: 'Calabi-Yau Theorem',
    statement: 'In differential geometry, the Calabi-Yau theorem (also known as the Calabi conjecture) states that a compact Kähler manifold with a vanishing first Chern class has a unique Ricci-flat metric in the same Kähler class.'
  },
  {
    id: 'positive_mass_theorem',
    name: 'Positive Mass Theorem',
    statement: 'In general relativity, the positive mass theorem states that, assuming the dominant energy condition, the mass of an asymptotically flat spacetime is non-negative; moreover, the mass is zero only for Minkowski spacetime.'
  },
  {
    id: 'penrose_singularity_theorems',
    name: 'Penrose Singularity Theorems',
    statement: 'In general relativity, a singularity theorem uses the concept of geodesic incompleteness to define a spacetime singularity. The Penrose-Hawking singularity theorems are a set of results in general relativity which attempt to answer the question of when gravitation produces singularities.'
  },
  {
    id: 'hawking_area_theorem',
    name: 'Hawking\'s Area Theorem',
    statement: 'Hawking\'s area theorem, a result of classical general relativity, states that the surface area of a black hole\'s event horizon can never decrease.'
  },
  {
    id: 'no_hair_theorem',
    name: 'No-Hair Theorem',
    statement: 'In theoretical physics, the no-hair theorem postulates that all black hole solutions of the Einstein-Maxwell equations of gravitation and electromagnetism in general relativity can be completely characterized by only three externally observable classical parameters: mass, electric charge, and angular momentum.'
  },
  {
    id: 'cpt_theorem',
    name: 'CPT Theorem',
    statement: 'The CPT theorem in quantum field theory states that CPT symmetry (Charge, Parity, Time) is an exact symmetry of nature. It implies that any Lorentz invariant local quantum field theory with a Hermitian Hamiltonian must have CPT symmetry.'
  },
  {
    id: 'spin_statistics_theorem',
    name: 'Spin-Statistics Theorem',
    statement: 'The spin-statistics theorem proves that all particles with half-integer spin (fermions) obey Fermi-Dirac statistics, and all particles with integer spin (bosons) obey Bose-Einstein statistics.'
  },
  {
    id: 'goldstone_theorem',
    name: 'Goldstone\'s Theorem',
    statement: 'In quantum field theory, Goldstone\'s theorem examines a generic continuous symmetry which is spontaneously broken. It states that for every such symmetry, there exists a corresponding massless scalar particle or field, known as a Goldstone boson or Nambu-Goldstone boson.'
  },
  {
    id: 'higgs_mechanism',
    name: 'Higgs Mechanism',
    statement: 'The Higgs mechanism is a kind of mass generation mechanism, a process that gives mass to elementary particles. It is a key feature of the Standard Model of particle physics.'
  },
  {
    id: 'weinberg_witten_theorem',
    name: 'Weinberg-Witten Theorem',
    statement: 'In quantum field theory, the Weinberg-Witten theorem proves that massless particles (either composite or elementary) with spin j > 1/2 cannot carry a Lorentz-covariant current, while massless particles with spin j > 1 cannot carry a Lorentz-covariant stress-energy tensor.'
  },
  {
    id: 'coleman_mandula_theorem',
    name: 'Coleman-Mandula Theorem',
    statement: 'The Coleman-Mandula theorem is a no-go theorem in theoretical particle physics. It states that "space-time and internal symmetries cannot be combined in any but a trivial way".'
  },
  {
    id: 'haag_lopu_sohnius_theorem',
    name: 'Haag-Lopuszanski-Sohnius Theorem',
    statement: 'The Haag-Lopuszanski-Sohnius theorem is a generalization of the Coleman-Mandula theorem which shows that the only possible Lie superalgebra of symmetries of a consistent quantum field theory in four dimensions is the supersymmetry algebra.'
  },
  {
    id: 'bell_theorem',
    name: 'Bell\'s Theorem',
    statement: 'Bell\'s theorem is a term encompassing a number of closely related results in physics, which determine that quantum mechanics is incompatible with local hidden-variable theories.'
  },
  {
    id: 'ks_theorem',
    name: 'Kochen-Specker Theorem',
    statement: 'The Kochen-Specker (KS) theorem is a "no-go" theorem in quantum mechanics that places constraints on the permissible types of hidden-variable theories. It demonstrates that it is impossible to assign definite values to all physical quantities of a quantum system simultaneously, while preserving the functional relationships between them.'
  },
  {
    id: 'gleason_theorem',
    name: 'Gleason\'s Theorem',
    statement: 'Gleason\'s theorem is a mathematical result in quantum logic that is of crucial importance for the justification of the Born rule for computing probabilities in quantum mechanics.'
  },
  {
    id: 'wigner_theorem',
    name: 'Wigner\'s Theorem',
    statement: 'Wigner\'s theorem specifies how physical symmetries such as rotations, translations, and CPT are represented on the Hilbert space of states. The theorem is a cornerstone of the mathematical formulation of quantum mechanics.'
  },
  {
    id: 'stone_von_neumann_theorem',
    name: 'Stone-von Neumann Theorem',
    statement: 'The Stone-von Neumann theorem is a result in mathematics which states that every irreducible representation of the canonical commutation relations is unitarily equivalent to the position representation.'
  },
  {
    id: 'kadison_singer_problem',
    name: 'Kadison-Singer Problem',
    statement: 'The Kadison-Singer problem, now a theorem proved by Marcus, Spielman, and Srivastava, is a problem in the mathematics of quantum mechanics that asks whether every pure state on the diagonal algebra of bounded operators on a Hilbert space has a unique extension to a pure state on all bounded operators.'
  },
  {
    id: 'navier_stokes_existence_and_smoothness',
    name: 'Navier-Stokes Existence and Smoothness',
    statement: 'The Navier-Stokes existence and smoothness problem concerns the mathematical properties of solutions to the Navier-Stokes equations, a system of partial differential equations that describe the motion of viscous fluid substances.'
  },
  {
    id: 'yang_mills_existence_and_mass_gap',
    name: 'Yang-Mills Existence and Mass Gap',
    statement: 'The Yang-Mills existence and mass gap problem is an unsolved problem in mathematical physics and mathematics, and one of the seven Millennium Prize Problems defined by the Clay Mathematics Institute. The problem is to prove that for any compact simple gauge group G, a non-trivial quantum Yang-Mills theory exists on R4 and has a mass gap Δ > 0.'
  },
  {
    id: 'p_vs_np_problem',
    name: 'P vs NP Problem',
    statement: 'The P versus NP problem is a major unsolved problem in computer science. It asks whether every problem whose solution can be quickly verified can also be quickly solved.'
  },
  {
    id: 'cook_levin_theorem',
    name: 'Cook-Levin Theorem',
    statement: 'The Cook-Levin theorem, also known as Cook\'s theorem, states that the Boolean satisfiability problem is NP-complete. That is, any problem in NP can be reduced in polynomial time by a deterministic Turing machine to the problem of determining whether a Boolean formula is satisfiable.'
  },
  {
    id: 'church_turing_thesis',
    name: 'Church-Turing Thesis',
    statement: 'The Church-Turing thesis is a hypothesis about the nature of computable functions. It states that a function on the natural numbers can be calculated by an effective method if and only if it is computable by a Turing machine.'
  },
  {
    id: 'halting_problem',
    name: 'Halting Problem',
    statement: 'The halting problem is the problem of determining, from a description of an arbitrary computer program and an input, whether the program will finish running or continue to run forever. Alan Turing proved in 1936 that a general algorithm to solve the halting problem for all possible program-input pairs cannot exist.'
  },
  {
    id: 'rice_theorem',
    name: 'Rice\'s Theorem',
    statement: 'In computability theory, Rice\'s theorem states that for any non-trivial property of partial functions, there is no general and effective method to decide whether an algorithm computes a partial function with that property.'
  },
  {
    id: 'turing_completeness',
    name: 'Turing Completeness',
    statement: 'In computability theory, a system of data-manipulation rules (such as a computer\'s instruction set, a programming language, or a cellular automaton) is said to be Turing complete or computationally universal if it can be used to simulate any single-taped Turing machine.'
  },
  {
    id: 'kleene_recursion_theorem',
    name: 'Kleene\'s Recursion Theorem',
    statement: 'Kleene\'s recursion theorems are a pair of fundamental results in computability theory that show that self-referential programs can be constructed.'
  },
  {
    id: 'myhill_nerode_theorem',
    name: 'Myhill-Nerode Theorem',
    statement: 'In the theory of formal languages, the Myhill-Nerode theorem provides a necessary and sufficient condition for a language to be regular.'
  },
  {
    id: 'pumping_lemma_for_regular_languages',
    name: 'Pumping Lemma for Regular Languages',
    statement: 'The pumping lemma for regular languages is a lemma that describes a property of all regular languages. Informally, it says that all sufficiently long words in a regular language may be "pumped"—that is, have a middle section of the word repeated a number of times—to produce a new word that also lies within the same language.'
  },
  {
    id: 'pumping_lemma_for_context_free_languages',
    name: 'Pumping Lemma for Context-Free Languages',
    statement: 'The pumping lemma for context-free languages is a lemma that describes a property of all context-free languages. It is a more powerful version of the pumping lemma for regular languages.'
  },
  {
    id: 'chomsky_hierarchy',
    name: 'Chomsky Hierarchy',
    statement: 'In formal language theory, the Chomsky hierarchy is a containment hierarchy of classes of formal grammars.'
  },
  {
    id: 'shannon_source_coding_theorem',
    name: 'Shannon\'s Source Coding Theorem',
    statement: 'In information theory, the source coding theorem (or Shannon\'s first theorem) establishes the limits to possible data compression, and the operational meaning of the Shannon entropy.'
  },
  {
    id: 'shannon_noisy_channel_coding_theorem',
    name: 'Shannon\'s Noisy-Channel Coding Theorem',
    statement: 'The noisy-channel coding theorem is a theorem in information theory that establishes that for any given degree of noise contamination of a communication channel, it is possible to communicate discrete data (information) nearly error-free up to a computable maximum rate through the channel.'
  },
  {
    id: 'kraft_mcmillan_inequality',
    name: 'Kraft-McMillan Inequality',
    statement: 'In coding theory, the Kraft-McMillan inequality gives a necessary and sufficient condition for the existence of a prefix code (in McMillan\'s version) or a uniquely decodable code (in Kraft\'s version) for a given set of codeword lengths.'
  },
  {
    id: 'gibbs_inequality',
    name: 'Gibbs\' Inequality',
    statement: 'In information theory, Gibbs\' inequality is a statement about the information entropy of a discrete probability distribution. It says that the entropy of a probability distribution P is less than or equal to its cross-entropy with any other probability distribution Q, with equality if and only if P=Q.'
  },
  {
    id: 'hamming_bound',
    name: 'Hamming Bound',
    statement: 'In coding theory, the Hamming bound is a limit on the parameters of an arbitrary block code: it is also known as the sphere-packing bound or the volume bound from an interpretation in terms of packing balls in the Hamming metric into the space of all possible words.'
  },
  {
    id: 'singleton_bound',
    name: 'Singleton Bound',
    statement: 'The Singleton bound is a relatively crude upper bound on the size of an arbitrary block code C with block length n, size M, and minimum distance d.'
  },
  {
    id: 'gilbert_varshamov_bound',
    name: 'Gilbert-Varshamov Bound',
    statement: 'The Gilbert-Varshamov bound is a bound on the parameters of a code. It is a lower bound on the maximum number of codewords in a code of a given length and a given minimum distance.'
  },
  {
    id: 'johnson_bound',
    name: 'Johnson Bound',
    statement: 'In coding theory, the Johnson bound is an upper bound on the size of a code of a given length and minimum distance.'
  },
  {
    id: 'plotkin_bound',
    name: 'Plotkin Bound',
    statement: 'The Plotkin bound is an upper bound on the maximum number of codewords in a binary code of a given length and minimum distance.'
  },
  {
    id: 'elias_bassalygo_bound',
    name: 'Elias-Bassalygo Bound',
    statement: 'The Elias-Bassalygo bound is an upper bound on the size of a binary code of a given length and minimum distance.'
  },
  {
    id: 'macwilliams_identities',
    name: 'MacWilliams Identities',
    statement: 'In coding theory, the MacWilliams identities are a set of identities that relate the weight enumerator of a linear code to the weight enumerator of its dual code.'
  },
  {
    id: 'bch_bound',
    name: 'BCH Bound',
    statement: 'In coding theory, the BCH bound is a lower bound on the minimum distance of a BCH code.'
  },
  {
    id: 'carlitz_uchiyama_bound',
    name: 'Carlitz-Uchiyama Bound',
    statement: 'The Carlitz-Uchiyama bound is an estimate for exponential sums. It is a deep result from the theory of algebraic function fields over finite fields.'
  },
  {
    id: 'weil_bound_for_character_sums',
    name: 'Weil Bound for Character Sums',
    statement: 'In number theory, the Weil bound is a bound on exponential sums. It is a fundamental result in analytic number theory.'
  },
  {
    id: 'chevalley_warning_theorem',
    name: 'Chevalley-Warning Theorem',
    statement: 'The Chevalley-Warning theorem is a theorem in number theory. It states that if a polynomial in several variables over a finite field has a number of variables greater than its degree, then the number of its roots is a multiple of the characteristic of the field.'
  },
  {
    id: 'ax_grothendieck_theorem',
    name: 'Ax-Grothendieck Theorem',
    statement: 'The Ax-Grothendieck theorem is a result in algebraic geometry that states that any injective polynomial map from an algebraic variety to itself is surjective.'
  },
  {
    id: 'tarski_seidenberg_theorem',
    name: 'Tarski-Seidenberg Theorem',
    statement: 'The Tarski-Seidenberg theorem states that the projection of a semi-algebraic set is a semi-algebraic set. This is the key result of quantifier elimination for real-closed fields.'
  },
  {
    id: 'sylvester_gallai_theorem',
    name: 'Sylvester-Gallai Theorem',
    statement: 'The Sylvester-Gallai theorem states that given a finite set of points in the Euclidean plane, either all the points lie on a single line, or there is a line which contains exactly two of the points.'
  },
  {
    id: 'de_bruijn_erdos_theorem_incidence_geometry',
    name: 'De Bruijn-Erdős Theorem (Incidence Geometry)',
    statement: 'The de Bruijn-Erdős theorem, in incidence geometry, is any of a number of results on the number of lines determined by a set of points. The original version states that every set of n points in a projective plane, that are not all collinear, determine at least n lines.'
  },
  {
    id: 'szemeredi_trotter_theorem',
    name: 'Szemerédi-Trotter Theorem',
    statement: 'The Szemerédi-Trotter theorem is a result in combinatorial geometry. It states that given n points and m lines in the Euclidean plane, the number of incidences (i.e., the number of pairs (point, line) such that the point lies on the line) is at most O(n^(2/3)m^(2/3) + n + m).'
  },
  {
    id: 'beck_theorem_combinatorial_geometry',
    name: 'Beck\'s Theorem (Combinatorial Geometry)',
    statement: 'Beck\'s theorem is a theorem in combinatorial geometry that asserts a trade-off between the number of lines determined by a set of points and the number of points on a single line.'
  },
  {
    id: 'erdos_anekeny_theorem',
    name: 'Erdős-Anning Theorem',
    statement: 'The Erdős-Anning theorem states that an infinite number of points in the plane can have integer distances from each other only if all the points lie on a straight line.'
  },
  {
    id: 'uspensky_theorem',
    name: 'Uspensky\'s Theorem',
    statement: 'Uspensky\'s theorem, in number theory, gives a condition for the number of integer solutions to an equation.'
  },
  {
    id: 'lagrange_four_square_theorem',
    name: 'Lagrange\'s Four-Square Theorem',
    statement: 'Lagrange\'s four-square theorem, also known as Bachet\'s conjecture, states that any natural number can be represented as the sum of four integer squares.'
  },
  {
    id: 'sum_of_two_squares_theorem',
    name: 'Sum of Two Squares Theorem',
    statement: 'Fermat\'s theorem on sums of two squares states that an odd prime p can be expressed as a sum of two squares if and only if p ≡ 1 (mod 4).'
  },
  {
    id: 'euler_totient_theorem',
    name: 'Euler\'s Totient Theorem',
    statement: 'Euler\'s totient theorem states that if n and a are coprime positive integers, then a to the power of the totient of n is congruent to 1 modulo n.'
  },
  {
    id: 'wilson_theorem',
    name: 'Wilson\'s Theorem',
    statement: 'Wilson\'s theorem states that a natural number n > 1 is a prime number if and only if the product of all the positive integers less than n is one less than a multiple of n.'
  },
  {
    id: 'lucas_theorem',
    name: 'Lucas\'s Theorem',
    statement: 'Lucas\'s theorem expresses the remainder of division of the binomial coefficient (m choose n) by a prime number p in terms of the base-p expansions of the integers m and n.'
  },
  {
    id: 'kummer_theorem',
    name: 'Kummer\'s Theorem',
    statement: 'Kummer\'s theorem provides the p-adic valuation of a binomial coefficient. It states that for a prime p and integer n, the p-adic valuation of (n choose k) is the number of carries when adding k and n-k in base p.'
  },
  {
    id: 'wolstenholme_theorem',
    name: 'Wolstenholme\'s Theorem',
    statement: 'Wolstenholme\'s theorem states that for a prime number p > 3, the numerator of the generalized harmonic number H(p-1) is divisible by p^2.'
  },
  {
    id: 'von_staudt_clausen_theorem',
    name: 'Von Staudt-Clausen Theorem',
    statement: 'The von Staudt-Clausen theorem is a result in number theory that gives the fractional part of Bernoulli numbers.'
  },
  {
    id: 'jacobi_triple_product_identity',
    name: 'Jacobi Triple Product Identity',
    statement: 'The Jacobi triple product is the mathematical identity: for complex numbers z and x with |x|<1 and z≠0, we have the identity.'
  },
  {
    id: 'pentagonal_number_theorem',
    name: 'Pentagonal Number Theorem',
    statement: 'Euler\'s pentagonal number theorem is a theorem about the expansion of the Euler function. It states that the expansion is given by a certain alternating sum of pentagonal numbers.'
  },
  {
    id: 'rogers_ramanujan_identities',
    name: 'Rogers-Ramanujan Identities',
    statement: 'The Rogers-Ramanujan identities are two identities in number theory related to partitions. They were first proved by Leonard James Rogers, and were later rediscovered by Srinivasa Ramanujan.'
  },
  {
    id: 'dyson_conjecture',
    name: 'Dyson\'s Rank Conjecture',
    statement: 'Dyson\'s rank conjecture states that the rank of a partition modulo 5 divides the partitions of n into 5 groups of equal size. A similar conjecture was made for the modulus 7.'
  },
  {
    id: 'alder_conjecture',
    name: 'Alder\'s Conjecture',
    statement: 'Alder\'s conjecture is a conjecture in partition theory, which states that the number of partitions of n into parts congruent to 1 or 4 (mod 5) is greater than or equal to the number of partitions of n into parts of size differing by at least 4.'
  },
  {
    id: 'schur_theorem_on_partitions',
    name: 'Schur\'s Theorem on Partitions',
    statement: 'Schur\'s theorem on partitions states that the number of partitions of n into parts congruent to 1 or 5 (mod 6) is equal to the number of partitions of n into distinct parts congruent to 1 or 2 (mod 3).'
  },
  {
    id: 'hardy_ramanujan_asymptotic_formula',
    name: 'Hardy-Ramanujan Asymptotic Partition Formula',
    statement: 'The Hardy-Ramanujan asymptotic formula is an asymptotic formula for the partition function p(n). It was discovered by G. H. Hardy and Srinivasa Ramanujan in 1918.'
  },
  {
    id: 'circle_method',
    name: 'Hardy-Littlewood Circle Method',
    statement: 'The Hardy-Littlewood circle method is a technique of analytic number theory for counting the number of solutions to certain Diophantine equations.'
  },
  {
    id: 'vinogradov_theorem',
    name: 'Vinogradov\'s Theorem',
    statement: 'Vinogradov\'s theorem states that any sufficiently large odd integer can be expressed as the sum of three prime numbers.'
  },
  {
    id: 'chen_theorem',
    name: 'Chen\'s Theorem',
    statement: 'Chen\'s theorem states that every sufficiently large even number can be written as the sum of either two primes, or a prime and a semiprime (the product of two primes).'
  },
  {
    id: 'bombieri_vinogradov_theorem',
    name: 'Bombieri-Vinogradov Theorem',
    statement: 'The Bombieri-Vinogradov theorem is a major result of analytic number theory, obtained in the mid-1960s. It is a refinement of the Siegel-Walfisz theorem, which gives a bound for the error term in the prime number theorem for arithmetic progressions.'
  },
  {
    id: 'elliott_halberstam_conjecture',
    name: 'Elliott-Halberstam Conjecture',
    statement: 'The Elliott-Halberstam conjecture is a conjecture in number theory concerning the distribution of prime numbers in arithmetic progressions.'
  },
  {
    id: 'montgomery_odlyzko_law',
    name: 'Montgomery\'s Pair Correlation Conjecture',
    statement: 'Montgomery\'s pair correlation conjecture is a conjecture in number theory, which states that the pair correlation between pairs of zeros of the Riemann zeta function (normalized to have unit average spacing) is the same as the pair correlation of eigenvalues of random Hermitian matrices.'
  },
  {
    id: 'sato_tate_conjecture',
    name: 'Sato-Tate Conjecture',
    statement: 'The Sato-Tate conjecture is a statistical statement about the family of elliptic curves. It gives the distribution of the Frobenius traces of an elliptic curve without complex multiplication.'
  },
  {
    id: 'langlands_program',
    name: 'Langlands Program',
    statement: 'The Langlands program is a web of far-reaching and influential conjectures about connections between number theory and geometry.'
  },
  {
    id: 'fundamental_lemma',
    name: 'Fundamental Lemma (Langlands Program)',
    statement: 'The fundamental lemma is a deep result in the Langlands program, a web of conjectures that connect number theory and representation theory. It was proved by Ngô Bảo Châu.'
  }
];
