"use server";

import dbConnect from "@/lib/mongodb";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { User } from "@/models/User";
import { redirect } from "next/navigation";

export async function handleNotificationRequest({
  notifications,
}: {
  notifications: boolean;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/");
    }

    const { userId } = session;

    await dbConnect();

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { notifications },
      { new: true, runValidators: true }
    );

    if (!user) {
      return {
        error: "Failed to update notification settings",
        success: false,
      };
    }

    console.log(
      "Notification settings updated successfully",
      user._id,
      notifications
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update notification settings", error);
    return {
      error: "Failed to update notification settings",
      success: false,
    };
  }
}
