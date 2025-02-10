"use server";

// a function that takes in an amount, as a string and converts it to kes equivalent using the conversion rate  from a real time api maybe cache in redis for 60 seconds
// returns the equivalent amount in kes as a number

import { ConversionRate as ConversionRateType } from "@/types";

// import getRedisClient from "@/lib/redis";

export async function getConversionRate() {
  try {
    // const redis = await getRedisClient();
    let conversionRate: ConversionRateType;
    // const cachedData = await redis.get("conversionRate");
    if (true) {
      const response = await fetch(
        `https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD,USDCE&fiatCurrencies=KES,USD`,
        {
          method: "GET",
          // revalidate: 60,
          next: {
            revalidate: 30,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversion  prices");
      }

      const { result } = await response.json();

      // Access the amount directly from the data
      const kesRate = result.prices.USDCE.KES.amount;
      const usdRate = result.prices.USDCE.USD.amount;

      // Ensure rates are numbers
      const kesRateNumber = parseFloat(kesRate) / Math.pow(10, 6);
      const usdRateNumber = parseFloat(usdRate) / Math.pow(10, 6);
      if (!kesRateNumber || !usdRateNumber) {
        throw new Error("Invalid conversion rates");
      }

      const conversionRateNumber = kesRateNumber / usdRateNumber;

      conversionRate = {
        conversionRate: conversionRateNumber,
      };

      // const cache = await redis.setEx(
      //   "conversionRate",
      //   120,
      //   JSON.stringify(conversionRate)
      // );
      return conversionRate;
    }
    // console.log("cached data", JSON.parse(cachedData));
    // const parsedData = JSON.parse(cachedData);
    // conversionRate = {
    //   conversionRate: parsedData.conversionRate,
    // };
    // return conversionRate;
  } catch (error) {
    console.error("Error in convertToKes", error);
    throw new Error("Unable to convert USD to KES amounts try again later");
  }
}
