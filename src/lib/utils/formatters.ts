/**
 * Utility functions for values formatting in the Pakistani e-commerce market context.
 */

/**
 * Formats a given number into Pakistani Rupee currency notation.
 * e.g., 1299 -> "Rs. 1,299"
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rs. 0";
  }
  return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

/**
 * Formats a Date string into standard conversational formats.
 * e.g., 2023-10-24T12:00:00Z -> "Oct 24, 2023"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  
  try {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }
    
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  } catch {
    return "N/A";
  }
}

/**
 * Generates a clean random tracking order identifier prefix with random digits.
 * e.g., "WEN-9824"
 */
export function generateOrderNumber(): string {
  const digitsCode = Math.floor(1000 + Math.random() * 9000); // 4 random digits code
  return `WEN-${digitsCode}`;
}
