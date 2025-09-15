// To run this test file, execute `npx tsx src/lib/proof-formatting.test.ts` in your terminal.

import { formatProof } from './proof-formatting';

function runTests() {
  const testCases = [
    {
      name: 'Handles basic case with correct spacing',
      input: 'Some text\n\n$$\\text{formula}$$\n\nMore text',
      expected: 'Some text\n\n$$\n\\text{formula}\n$$\n\nMore text',
    },
    {
      name: 'Removes leading space before $$',
      input: 'Some text\n\n  $$\\text{formula}$$\n\nMore text',
      expected: 'Some text\n\n$$\n\\text{formula}\n$$\n\nMore text',
    },
    {
      name: 'Adds newline before $$ if missing',
      input: 'Some text$$\\text{formula}$$More text',
      expected: 'Some text\n\n$$\n\\text{formula}\n$$\n\nMore text',
    },
    {
      name: 'Adds newline after $$ if missing',
      input: 'Some text\n\n$$\\text{formula}$$More text',
      expected: 'Some text\n\n$$\n\\text{formula}\n$$\n\nMore text',
    },
    {
        name: 'Trims whitespace inside $$ block',
        input: '$$\n  \\text{formula}  \n$$',
        expected: '$$\n\\text{formula}\n$$',
    },
    {
        name: 'Handles multiple $$ blocks',
        input: 'First part\n$$\n  A=B  \n$$ and second part\n\n  $$C=D$$',
        expected: 'First part\n\n$$\nA=B\n$$\n\nand second part\n\n$$\nC=D\n$$',
    },
    {
        name: 'Handles equation starting on same line as $$',
        input: '$$ E=mc^2 $$',
        expected: '$$\nE=mc^2\n$$',
    },
    {
      name: 'Handles complex aligned environment with incorrect spacing',
      input: 'Some text \n\n  $$  \n\\begin{aligned}\nA &= B \\\\\n&= C\n\\end{aligned} \n $$  \n\nMore text',
      expected: 'Some text\n\n$$\n\\begin{aligned}\nA &= B \\\\\n&= C\n\\end{aligned}\n$$\n\nMore text',
    },
    {
      name: 'Handles empty input',
      input: '',
      expected: '',
    },
    {
      name: 'Handles input with only whitespace',
      input: '   \n  \t ',
      expected: '',
    },
    {
        name: 'Maintains single newlines between text',
        input: 'Line 1\nLine 2',
        expected: 'Line 1\nLine 2',
    },
    {
        name: 'Collapses more than two newlines between blocks',
        input: 'Text above\n\n\n\n$$\nformula\n$$\n\n\n\nText below',
        expected: 'Text above\n\n$$\nformula\n$$\n\nText below',
    },
    {
        name: 'Handles inline math correctly',
        input: 'This is $inline$ math, and should not be touched.',
        expected: 'This is $inline$ math, and should not be touched.',
    }
  ];

  let passed = 0;
  let failed = 0;

  console.log('Running formatProof tests...\n');

  testCases.forEach((test, index) => {
    const actual = formatProof(test.input);
    const isPassing = actual === test.expected;

    if (isPassing) {
      passed++;
      console.log(`✅ Test ${index + 1}: ${test.name}`);
    } else {
      failed++;
      console.error(`❌ Test ${index + 1}: ${test.name}`);
      console.error('  Input:    ', JSON.stringify(test.input));
      console.error('  Expected: ', JSON.stringify(test.expected));
      console.error('  Actual:   ', JSON.stringify(actual));
      console.log('---');
    }
  });

  console.log('\n-------------------');
  console.log(`Test summary: ${passed} passed, ${failed} failed.`);
  console.log('-------------------\n');

  if (failed > 0) {
    // Exit with a non-zero code to indicate test failure for CI/CD environments
    process.exit(1);
  }
}

runTests();

    