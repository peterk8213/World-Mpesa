import { Amount as CryptoAmountType } from "@/types";

export async function convertToCrypto(
  amountInUSD: number
): Promise<CryptoAmountType> {
  if (!amountInUSD) {
    throw new Error("Invalid amount");
  }
  const response = await fetch(
    `https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD,USDCE&fiatCurrencies=KES,USD`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch prices");
  }

  const { result } = await response.json();

  // Access the amount directly from the data
  const wldRate = result.prices.WLD.USD.amount;
  const usdceRate = result.prices.USDCE.USD.amount;
  const wldDecimals = result.prices.WLD.USD.decimals;
  const usdceDecimals = result.prices.USDCE.USD.decimals;

  // Ensure rates are numbers
  const wldRateNumber = parseFloat(wldRate) || 0;
  const usdceRateNumber = parseFloat(usdceRate) || 0;
  const wldDecimalsNumber = wldDecimals || 12;
  const usdceDecimalsNumber = usdceDecimals || 12;

  const amountInWLD =
    amountInUSD / (wldRateNumber / Math.pow(10, wldDecimalsNumber)); // Scaling down to n decimals
  const amountInUSDCE =
    amountInUSD / (usdceRateNumber / Math.pow(10, usdceDecimalsNumber));

  console.log("Amount in WLD:", amountInWLD);
  console.log("Amount in USDCE:", amountInUSDCE);

  return {
    WLD: parseFloat(amountInWLD.toFixed(6)), // Convert and limit precision to 6 decimal places
    USDCE: parseFloat(amountInUSDCE.toFixed(6)),
  };
}
