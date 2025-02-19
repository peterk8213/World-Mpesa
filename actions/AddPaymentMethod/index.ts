"use server";
import dbConnect from "@/lib/mongodb";
import { Provider } from "@/models/provider";

interface State {
  success?: boolean;
  error?: string;
  pending?: boolean;
}

export async function addPaymentMethod(prevState: State, formData: FormData) {
  try {
    // Parse form data
    const name = formData.get("name") as string;
    const shortname = formData.get("shortname") as string;
    const description = formData.get("description") as string;
    const iconUrl = formData.get("iconUrl") as string;
    const maxAmount = parseFloat(formData.get("maxAmount") as string);
    const minAmount = parseFloat(formData.get("minAmount") as string);
    const fee = parseInt(formData.get("fee") as string);
    const processingTime = formData.get("processingTime") as string;
    const available = formData.get("available") === "on"; // Parse as boolean

    // Validate required fields
    if (!name || !shortname || !description || !iconUrl || !processingTime) {
      return {
        ...prevState,
        error: "Please fill in all required fields",
        pending: false,
      };
    }

    // Validate numeric fields
    if (isNaN(maxAmount) || isNaN(minAmount) || isNaN(fee)) {
      return {
        ...prevState,
        error: "Invalid numeric values for maxAmount, minAmount, or fee",
        pending: false,
      };
    }

    // Connect to the database
    await dbConnect();

    // Add the provider
    const provider = await Provider.addProvider({
      name,
      shortname,
      iconUrl,
      maxAmount,
      minAmount,
      fee,
      processingTime,
      available,
      description,
    });

    if (!provider) {
      return {
        ...prevState,
        error: "Failed to add payment method",
        pending: false,
      };
    }

    // Success
    return {
      ...prevState,
      success: true,
      pending: false,
    };
  } catch (error) {
    console.error("Error adding payment method:", error);
    return {
      ...prevState,
      error: "An unexpected error occurred. Please try again.",
      pending: false,
    };
  }
}
