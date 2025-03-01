"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";

import { revalidatePath } from "next/cache";

export async function updateUsername(
  prevState: {
    data?: {
      username: string;
      userid:  string;
    };
    error?: string | null;
    success: boolean;
  },
  formData: FormData
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      error: "You need to be signed in to update your username",
    };
  }

  try {
    const { userId } = session;

    const newUsername = formData.get("username");
    if (!newUsername) {
      return { success: false, error: "New username is required" };
    }
    if (
      typeof newUsername !== "string" ||
      newUsername.length < 3 ||
      newUsername.length > 30
    ) {
      return { success: false, error: "Invalid username" };
    }

    // Add your database update logic here
    // Example: await db.user.update({ username: newUsername })

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { userName: newUsername }
    );

    if (!updatedUser) {
      return { success: false, error: "Failed to update username" };
    }

    revalidatePath("/profile");

    return { success: true, data: { username: updatedUser.userName, userId } };
  } catch (error) {
    return { success: false, error: "Failed to update username" };
  }
}
