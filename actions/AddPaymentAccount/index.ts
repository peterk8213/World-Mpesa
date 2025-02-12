"use server";
export async function addPaymentAccount(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const provider = formData.get("provider") as string;
  console.log("formData", formData);
  console.log(prevState);
  if (!fullName || !phoneNumber || !provider) {
    return {
      ...prevState,
      error: "Please fill in all fields",
    };
  }
}
