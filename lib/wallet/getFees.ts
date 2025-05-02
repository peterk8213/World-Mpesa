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
  // const batches = [
  //   { min: 1, max: 5, percent: 2.0, fixed: 0.2 },
  //   { min: 6, max: 10, percent: 2.3, fixed: 0.2 },
  //   { min: 11, max: 20, percent: 2.0, fixed: 0.25 },
  //   { min: 21, max: 50, percent: 1.8, fixed: 0.3 },
  //   { min: 51, max: 100, percent: 1.7, fixed: 0.35 },
  //   { min: 101, max: 200, percent: 1.6, fixed: 0.4 },
  //   { min: 201, max: 500, percent: 1.5, fixed: 0.5 },
  //   { min: 501, max: 1000, percent: 1.5, fixed: 0.75 },
  //   { min: 1001, max: 5000, percent: 1.5, fixed: 1.0 },
  // ];
  const batches = [
    { min: 1, max: 5, percent: 4.0, fixed: 0.25 },
    { min: 6, max: 10, percent: 4.0, fixed: 0.3 },
    { min: 11, max: 20, percent: 3.5, fixed: 0.45 },
    { min: 21, max: 50, percent: 3.2, fixed: 0.65 },
    { min: 51, max: 100, percent: 2.8, fixed: 0.9 },
    { min: 101, max: 200, percent: 2.3, fixed: 1.35 },
    { min: 201, max: 500, percent: 1.9, fixed: 1.8 },
    { min: 501, max: 1000, percent: 1.6, fixed: 2.7 },
    { min: 1001, max: 5000, percent: 1.3, fixed: 4.2 },
  ];

  const batch = batches.find((b) => amount >= b.min && amount <= b.max);
  if (!batch) return { totalFee: 0, netAmount: amount };

  const percentageFee = (batch.percent / 100) * amount;
  const totalFee = percentageFee + batch.fixed;

  return {
    totalFee: totalFee,
    netAmount: amount - totalFee,
  };
}
