export const batches = [
  { min: 1000, percent: 1.3, fixed: 4.2 },
  { min: 500, percent: 1.5, fixed: 3.5 },
  { min: 200, percent: 1.8, fixed: 2.6 },
  { min: 100, percent: 2.0, fixed: 2.1 },
  { min: 50, percent: 2.3, fixed: 1.6 },
  { min: 30, percent: 2.5, fixed: 1.3 }, // New range for $3–5
  { min: 20, percent: 2.8, fixed: 1.0 },
  { min: 15, percent: 3.5, fixed: 0.8 },

  { min: 10, percent: 3.5, fixed: 0.6 },
  { min: 7, percent: 3.2, fixed: 0.5 },
  { min: 5, percent: 3.2, fixed: 0.45 },
  { min: 3, percent: 3.4, fixed: 0.35 },

  { min: 2, percent: 3.4, fixed: 0.25 },
  { min: 1, percent: 3.6, fixed: 0.2 }, // New range for $20+
];

export function calculateWithdrawFee({
  amount,
  method,
}: {
  amount: number;
  method?: string;
}): {
  totalFee: number;
  netAmount: number;
} {
  const batch = batches.find((b) => amount >= b.min);
  if (!batch) return { totalFee: 0, netAmount: amount };

  const percentageFee = (batch.percent / 100) * amount;
  const totalFee = percentageFee + batch.fixed;

  return {
    totalFee,
    netAmount: amount - totalFee,
  };
}
