//// i need a function that takes a number and decimal points and formants without formating
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
