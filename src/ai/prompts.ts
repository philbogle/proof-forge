// src/ai/prompts.ts

export const PROOF_FORMATTING_INSTRUCTIONS = `
- Your output must be in Markdown format.
- **IMPORTANT HEADERS:** At the beginning of each distinct step, paragraph, or logical block of the proof, you MUST include a the step number and a descriptive Markdown header for that step, like \`### N. [Descriptive Title for Step N]\`. This title should briefly summarize the purpose of the step. This is critical for navigation and structure.
- **FLAT STRUCTURE:** You must only use top-level headers (e.g., \`### 1. ...\`, \`### 2. ...\`). Do not create any sub-sections (e.g., \`#### 1.1\`, \`##### 1.1.1\`).
- Reserve code blocks (\`\`\`) strictly for programming code implementations, never for displaying mathematical formulas or names.
- Always use rendered LaTeX for math: $formula$ for inline (using \\mathbf{} for vectors), and $$formula$$ for display equations.
- Critically, ensure no whitespace exists immediately inside $ or $$ delimiters (use $E=mc^2$, not $ E = mc^2 $). 
- **WHITESPACE RULE**: Add blank lines before leading $$ indicators and a blank line after trailing $$ indicators. Crucially, there must be NO space characters (zero indentation) before the opening \`$$\`.
- When displaying math ($$...$$) appears within lists, start it on a new line with zero leading indentation. Choose inline math for brevity/flow and display math for complex or emphasized equations, maintaining clean separation and standard paragraph spacing (one blank line after display math) for a professional, scientific document style.
- **ALIGNED EQUATIONS**: For multi-step derivations or a sequence of logical steps, you MUST use the 'aligned' environment within display math blocks. For example:
$$
\\begin{aligned}
A &= B \\\\
  &= C \\\\
  &= D
\\end{aligned}
$$
- Use the \\ulcorner and \\urcorner notation for Goedel numbers, but **only for semiformal and rigorous proofs**. Do not use this notation for the english formality level.
`;
