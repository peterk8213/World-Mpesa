export async function sendNotification({
  amountinKes,
  phoneNumber,
  walletAddress,
  fullName,

  appId,
  title,
  mini_app_path,
  apiKey,
}: {
  amountinKes: number;
  phoneNumber: string;
  walletAddress: string;

  appId: string;
  title: string;
  mini_app_path: string;
  fullName?: string;
  apiKey: string;
}) {
  try {
    const apiUrl =
      " https://developer.worldcoin.org/api/v2/minikit/send-notification";

    const transactionAmount = amountinKes.toLocaleString("en-US", {
      style: "currency",
      currency: "KES",
    });

    const recipient = fullName ? `${fullName}_ (${phoneNumber})` : phoneNumber;

    const message = `Your transaction of ${transactionAmount} has been processed successfully. The amount will be credited to ${recipient}.`;
    const reponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        app_id: appId,
        wallet_addresses: [walletAddress],
        title: title,
        message: message,
        mini_app_path: mini_app_path,
      }),
    });
    const data = await reponse.json();
    console.log("Notification response", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to send notification", error);
    return {
      error: "Failed to send notification",
      success: false,
    };
  }
}
