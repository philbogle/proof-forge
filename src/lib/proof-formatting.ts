/**
 * A post-processing function to ensure $$ delimiters are correctly formatted.
 * It ensures that each $$ is preceded and followed by exactly one newline,
 * and removes any other leading/trailing whitespace on that line.
 * @param proofText The raw markdown proof text.
 * @returns The formatted proof text.
 */
export function formatProof(proofText: string): string {
  if (!proofText) return '';
  
  // Trim the whole text first
  let formattedText = proofText.trim();
  
  // Use a unique marker that is unlikely to appear in the text.
  const marker = 'UNIQUE_MARKER_FOR_SPLITTING';
  
  // Replace all occurrences of $$ with the marker, handling surrounding whitespace.
  // This regex looks for optional whitespace, then $$, then optional whitespace.
  // The 'g' flag ensures all occurrences are replaced.
  formattedText = formattedText.replace(/\s*\$\$\s*/g, `\n${marker}\n`);
  
  // Split the text by the marker.
  const parts = formattedText.split(marker);
  
  // Process the parts. Even-indexed parts are outside $$ blocks, odd-indexed are inside.
  return parts.map((part, index) => {
    // Content *inside* a $$...$$ block
    if (index % 2 === 1) {
      // Just trim the content inside the block and wrap with $$ and newlines.
      return `$$\n${part.trim()}\n$$`;
    }
    // Content *outside* a $$...$$ block.
    // Just return the part, as newlines are already handled by the replacement.
    return part;
  })
  .join('') // Join without any extra separators.
  .replace(/\n\n+/g, '\n\n') // Collapse more than two newlines into two.
  .trim(); // Final trim to remove any leading/trailing whitespace.
}

    