interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "send";
  amount: number;
  currency: string;
  date: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  // Simulate a delay to mimic database fetch
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data
  return [
    {
      id: "1",
      type: "deposit",
      amount: 0.5,
      currency: "ETH",
      date: "2023-06-01",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 0.1,
      currency: "ETH",
      date: "2023-06-02",
    },
    {
      id: "3",
      type: "send",
      amount: 0.05,
      currency: "ETH",
      date: "2023-06-03",
    },
    {
      id: "4",
      type: "deposit",
      amount: 1.0,
      currency: "ETH",
      date: "2023-06-04",
    },
    {
      id: "5",
      type: "withdrawal",
      amount: 0.2,
      currency: "ETH",
      date: "2023-06-05",
    },
    {
      id: "6",
      type: "send",
      amount: 0.15,
      currency: "ETH",
      date: "2023-06-06",
    },
    {
      id: "7",
      type: "deposit",
      amount: 0.75,
      currency: "ETH",
      date: "2023-06-07",
    },
    {
      id: "8",
      type: "withdrawal",
      amount: 0.3,
      currency: "ETH",
      date: "2023-06-08",
    },
    {
      id: "9",
      type: "send",
      amount: 0.08,
      currency: "ETH",
      date: "2023-06-09",
    },
    {
      id: "10",
      type: "deposit",
      amount: 1.2,
      currency: "ETH",
      date: "2023-06-10",
    },
  ];
}
