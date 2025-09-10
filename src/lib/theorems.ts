export type FormalityLevel = 'plainEnglish' | 'englishDescription' | 'semiFormal' | 'rigorousFormal';

export type Theorem = {
  id: string;
  name: string;
  proofs: Record<FormalityLevel, string>;
};

export const theorems: Theorem[] = [
  {
    id: 'pythagorean',
    name: 'Pythagorean Theorem',
    proofs: {
      plainEnglish:
        "Imagine you have a right-angled triangle, like a slice of a pizza that's a perfect corner. If you make squares on its three sides, the area of the square on the longest side (the one opposite the right angle) is exactly equal to the areas of the squares on the two shorter sides added together.",
      englishDescription:
        'In any right-angled triangle, the square of the length of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two sides (the legs).',
      semiFormal:
        'Let a right triangle have legs of length \\(a\\) and \\(b\\) and a hypotenuse of length \\(c\\). The relationship between the sides is given by the equation: $$ a^2 + b^2 = c^2 $$ This is known as the Pythagorean theorem. It describes a fundamental property of Euclidean geometry.',
      rigorousFormal:
        `<h3>Proof by Rearrangement</h3>
        <p>Consider a large square with side length \\(a+b\\). We can arrange four identical right triangles with sides \\(a\\), \\(b\\), and \\(c\\) inside it in two different ways.</p>
        <h4>Arrangement 1:</h4>
        <p>Arrange the four triangles in the corners of the large square. The empty space in the center forms a smaller square with side length \\(c\\). The area of this inner square is \\(c^2\\).</p>
        <p>The total area of the large square is \\((a+b)^2\\). The area of the four triangles is \\(4 \\times \\frac{1}{2}ab = 2ab\\). Therefore, the area of the inner square can also be expressed as:</p>
        $$ A_{inner} = (a+b)^2 - 2ab = a^2 + 2ab + b^2 - 2ab = a^2 + b^2 $$
        <h4>Arrangement 2:</h4>
        <p>Arrange the triangles to form two rectangles of size \\(a \\times b\\). This leaves two squares, one with area \\(a^2\\) and another with area \\(b^2\\).</p>
        <h4>Conclusion:</h4>
        <p>Since the area of the four triangles is the same in both arrangements, the remaining area must also be equal. In the first arrangement, the remaining area is \\(c^2\\). In the second, it is \\(a^2 + b^2\\).</p>
        <p>Therefore, we conclude that:</p>
        $$ a^2 + b^2 = c^2 $$
        <p>Q.E.D.</p>`,
    },
  },
  {
    id: 'ftc',
    name: 'Fundamental Theorem of Calculus',
    proofs: {
      plainEnglish:
        "Calculus has two main ideas: finding the slope of a curve (differentiation) and finding the area under it (integration). The Fundamental Theorem of Calculus is like a magic bridge that connects these two ideas. It says that they are opposites of each other, just like addition and subtraction.",
      englishDescription:
        'The Fundamental Theorem of Calculus links the concept of differentiating a function with the concept of integrating a function. The first part states that differentiation and integration are inverse operations. The second part allows us to compute the definite integral of a function by using an antiderivative of the function.',
      semiFormal:
        `The theorem has two parts.
        <h4>Part 1:</h4>
        <p>If \\(f\\) is a continuous function on an interval \\([a, b]\\), then the function \\(F\\) defined by:</p>
        $$ F(x) = \\int_{a}^{x} f(t) \\,dt $$
        <p>is continuous on \\([a, b]\\), differentiable on \\((a, b)\\), and its derivative is \\(f(x)\\); that is, \\(F'(x) = f(x)\\).</p>
        <h4>Part 2:</h4>
        <p>If \\(f\\) is a real-valued function on a closed interval \\([a, b]\\) and \\(F\\) is a continuous function on \\([a, b]\\) such that \\(F'(x) = f(x)\\) for all \\(x\\) in \\((a, b)\\), then:</p>
        $$ \\int_{a}^{b} f(x) \\,dx = F(b) - F(a) $$`,
      rigorousFormal: `<h3>Proof of Part 2</h3>
        <p>Let \\(f\\) be a continuous function on \\([a, b]\\) and let \\(F\\) be any antiderivative of \\(f\\), so \\(F'(x) = f(x)\\).</p>
        <p>From Part 1 of the theorem, we know that the function \\(G(x) = \\int_{a}^{x} f(t) \\,dt\\) is also an antiderivative of \\(f\\).</p>
        <p>Since two antiderivatives of the same function can only differ by a constant, we have:</p>
        $$ F(x) = G(x) + C $$
        <p>for some constant \\(C\\).</p>
        <p>To find \\(C\\), we can evaluate the equation at \\(x=a\\):</p>
        $$ F(a) = G(a) + C $$
        <p>By definition, \\(G(a) = \\int_{a}^{a} f(t) \\,dt = 0\\). So,</p>
        $$ F(a) = 0 + C \\implies C = F(a) $$
        <p>Now we have a complete expression for \\(F(x)\\):</p>
        $$ F(x) = \\int_{a}^{x} f(t) \\,dt + F(a) $$
        <p>To find the definite integral from \\(a\\) to \\(b\\), we can evaluate this at \\(x=b\\):</p>
        $$ F(b) = \\int_{a}^{b} f(t) \\,dt + F(a) $$
        <p>Rearranging the terms gives us the desired result:</p>
        $$ \\int_{a}^{b} f(t) \\,dt = F(b) - F(a) $$
        <p>Q.E.D.</p>`,
    },
  },
  {
    id: 'goedel',
    name: "Gödel's Incompleteness Theorems",
    proofs: {
      plainEnglish:
        "Imagine you have a big book of rules for math. Gödel's First Incompleteness Theorem says that no matter how many rules you have, as long as they don't contradict each other, there will always be true math statements that you can't prove using just those rules. Your book of rules will always be 'incomplete'.",
      englishDescription:
        "Gödel's First Incompleteness Theorem states that for any self-consistent recursive axiomatic system powerful enough to describe the arithmetic of the natural numbers, there are true propositions about the natural numbers that cannot be proved from the axioms.",
      semiFormal:
        `<h4>First Incompleteness Theorem</h4>
        <p>Any consistent formal system \\(F\\) within which a certain amount of elementary arithmetic can be carried out is incomplete; i.e., there are statements of the language of \\(F\\) which can neither be proved nor disproved in \\(F\\).</p>
        <h4>Second Incompleteness Theorem</h4>
        <p>For any consistent system \\(F\\) within which a certain amount of elementary arithmetic can be carried out, the consistency of \\(F\\) cannot be proved in \\(F\\) itself.</p>`,
      rigorousFormal:
        "<p>The proof is highly complex and involves constructing a self-referential statement, often called the 'Gödel sentence' \\(G\\). This sentence essentially asserts its own unprovability within a formal system \\(F\\).</p><p>1.  **Arithmetization of Syntax**: First, we assign a unique natural number (a Gödel number) to every symbol and formula in the formal system.</p><p>2.  **Constructing the Gödel Sentence**: A formula \\(Prov(x, y)\\) is constructed, which is true if and only if \\(x\\) is the Gödel number of a proof of the formula with Gödel number \\(y\\). Using this, a statement \\(G\\) is constructed with the property that it is true if and only if it is not provable in \\(F\\).</p><p>3.  **The Core Argument**: <ul><li>If \\(G\\) is provable in \\(F\\), then \\(F\\) is inconsistent because \\(G\\) asserts its own unprovability.</li><li>If \\(G\\) is not provable in \\(F\\), then \\(G\\) is true (by its very construction), which means there is a true statement that is not provable in \\(F\\).</li></ul><p>Assuming the system \\(F\\) is consistent, \\(G\\) must be true but unprovable. Therefore, \\(F\\) is incomplete.</p>",
    },
  },
];
