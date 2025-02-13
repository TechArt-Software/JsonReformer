import ReformerModel from './ReformerModel';
/**
 * Cleans up a JSON string by removing extra unused characters and
 * normalizing string literals so that newlines and extra whitespace
 * inside them are replaced with single spaces.
 *
 * @param jsonStr - The original JSON string.
 * @returns The cleaned JSON string, ready for JSON.parse.
 */
export const ParseModel = (jsonStr: string): ReformerModel => {
    // Step 1: Trim overall whitespace from the input.
    const trimmed: string = jsonStr.trim();
  
    // Step 2: Extract the core JSON (from the first '{' or '[' to the last '}' or ']').
    const startIndex: number = trimmed.search(/[\{\[]/);
    const endIndex: number = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Invalid JSON structure.");
    }
    const jsonCore: string = trimmed.substring(startIndex, endIndex + 1);
  
    // Step 3: Replace newlines and extra spaces inside JSON string literals.
    // This regex matches any JSON string literal.
    const fixed: string = jsonCore.replace(/"((?:\\.|[^"\\])*)"/g, (match: string, content: string) => {
      // Replace newline characters (and following whitespace) with a single space.
      let cleanedContent: string = content.replace(/\n\s*/g, ' ');
      // Collapse multiple spaces into one.
      cleanedContent = cleanedContent.replace(/\s{2,}/g, ' ');
      // Trim any accidental leading/trailing spaces.
      cleanedContent = cleanedContent.trim();
      // Return the fixed string literal with surrounding quotes.
      return `"${cleanedContent}"`;
    });
  
    return JSON.parse(fixed) as ReformerModel;
  }
