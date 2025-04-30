"use server";

import dbConnect from "@/lib/mongodb";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { User } from "@/models/User";
import { redirect } from "next/navigation";

interface State {
  success?: boolean;
  error?: string;
  pending?: boolean;
}

export async function addUserName(prevState: State, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  try {
    const { userId } = session;
    const userName = formData.get("userName") as string;
    const notifications = formData.get("notifications") as string;
    console.log(formData);

    if (!userName) {
      return {
        ...prevState,
        error: "Please fill in all fields",
      };
    }

    await dbConnect();

    //// i want to query and check if the userName exists it should be unique for each user

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { userName, notifications: notifications === "on" },

      { new: true, runValidators: true }
    );

    if (!user) {
      return {
        ...prevState,
        error: "Failed to add user name",
      };
    }

    return {
      ...prevState,
      success: true,
    };
  } catch (error) {
    console.error("Failed to add user name", error);
    return {
      ...prevState,
      error: "Failed to add user name",
    };
  }
}
