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
  const batches = [
    { min: 1001, percent: 1.3, fixed: 4.2 },
    { min: 501, percent: 1.6, fixed: 2.7 },
    { min: 201, percent: 1.9, fixed: 1.8 },
    { min: 101, percent: 2.3, fixed: 1.35 },
    { min: 51, percent: 2.8, fixed: 0.9 },
    { min: 21, percent: 3.2, fixed: 0.65 },
    { min: 11, percent: 3.5, fixed: 0.45 },
    { min: 6, percent: 4.0, fixed: 0.3 },
    { min: 1, percent: 4.0, fixed: 0.25 },
  ];

  const batch = batches.find((b) => amount >= b.min);
  if (!batch) return { totalFee: 0, netAmount: amount };

  const percentageFee = (batch.percent / 100) * amount;
  const totalFee = percentageFee + batch.fixed;

  return {
    totalFee,
    netAmount: amount - totalFee,
  };
}
