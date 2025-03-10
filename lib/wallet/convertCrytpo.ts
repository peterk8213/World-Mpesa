import { formatWithoutRounding } from "@/lib/formatBalance";

export const convertCrypto = async (
  inputToken: string,
  inputTokenAmount: number
): Promise<{
  error?: any;
  success: boolean;

  data?: {
    currency: string;
    amount: number;
  };
}> => {
  try {
    const response = await fetch(
      `https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=${inputToken}&fiatCurrencies=USD`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }

    const { result } = await response.json();
    const rates = result.prices[inputToken].USD.amount;
    const ratesNumber = parseFloat(rates) || 0;
    let amountInUSD = 0;

    if (inputToken == "WLD") {
      amountInUSD = (inputTokenAmount / Math.pow(10, 18)) * ratesNumber;
    } else if (inputToken == "USDCE") {
      amountInUSD = (inputTokenAmount / Math.pow(10, 6)) * ratesNumber;
    }
    if (!amountInUSD || amountInUSD <= 0) {
      throw new Error("Invalid amount");
    }

    console.log({
      success: true,
      data: {
        currency: "USD",
        amount: parseFloat(formatWithoutRounding(amountInUSD, 2)),
      },
    });
    return {
      success: true,
      data: {
        currency: "USD",
        amount: parseFloat(formatWithoutRounding(amountInUSD, 2)),
      },
    };
  } catch (error) {
    return {
      success: false,

      error: error,
    };
  }
};
