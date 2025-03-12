//// i need a function that takes a number and decimal points and formants without  rounding
// this is balance and amout and i need to format it without rounding
/// also should allow to format to 0 db ed 999.99 to 999

export function formatWithoutRounding(num: number, decimals: number): string {
  if (!Number.isFinite(num) || decimals < 0) {
    throw new Error(
      "Invalid input: num must be a finite number and decimals must be non-negative."
    );
  }

  const strNum = num.toString();
  const decimalIndex = strNum.indexOf(".");

  if (decimalIndex === -1) return strNum; // No decimal, return as is

  // Extract up to the specified decimal places without rounding
  const truncated = strNum.substring(0, decimalIndex + decimals + 1);

  return truncated;
}
