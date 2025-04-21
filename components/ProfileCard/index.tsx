// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";

// const profileCard = ({ user }: any) => {
//   return (
//     <div>
//       <Card className=" bg-opacity-10  border-none  ">
//         <CardContent className="p-6">
//           <div className="flex items-center">
//             <Avatar className="w-20 h-20 mr-4 border-2 border-white">
//               <AvatarImage
//                 src={"https://avatarm.iran.liara.run/public"}
//                 alt={user.name?.slice(0, 8)}
//               />
//               <AvatarFallback>
//                 {user.name?.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h2 className="text-2xl font-bold">{user?.name?.slice(0, 8)}</h2>
//               <p className="text-sm opacity-80">{user.email}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
// export default profileCard;

"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Check, Edit2, Loader2, X } from "lucide-react";
import { useActionState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUsername } from "@/actions/UpdateUsername";
import { toastError, toastSuccess } from "@/lib/toast";

export default function Profile(user: {
  userName: string | null;
  verificationLevel: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, ispending] = useActionState(updateUsername, {
    success: false,
    data: {},
    error: null,
  });

  const { userName, verificationLevel } = user;

  useEffect(() => {
    if (state.success) {
      setIsEditing(false);
      toastSuccess("Username updated successfully");
    }
    if (state.error) {
      console.error(state.error);
      toastError(state.error);
    }
  }, [ispending]);

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <div className="relative">
        {/* Profile Image & Status */}
        <div className="group relative mx-auto h-32 w-32">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-gray-900 to-gray-800">
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-white/90">
              {userName?.charAt(0).toUpperCase() ?? "😊"}
            </span>
          </div>
          {/* Online Status */}
          <div className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-4 border-white bg-green-500 dark:border-gray-900" />
          {/* Verified Badge */}
          {verificationLevel == "orb" && (
            <div className="absolute -right-1 top-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md dark:bg-gray-900">
                <BadgeCheck className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          )}
        </div>

        {/* Username Section */}
        {userName ? (
          <div className="mt-6 text-center">
            {isEditing ? (
              <form
                action={formAction}
                className="group relative mx-auto inline-flex items-center"
              >
                <div className="relative">
                  <Input
                    name="username"
                    defaultValue={userName}
                    className="h-9 w-[200px] rounded-full border-0 bg-gray-100 px-4 text-center text-base font-medium shadow-none transition-colors focus-visible:bg-gray-200 dark:bg-gray-800/50 dark:focus-visible:bg-gray-800"
                    autoFocus
                    required
                  />
                  <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 opacity-0 blur transition-opacity group-focus-within:opacity-100" />
                </div>
                <div className="ml-2 flex items-center gap-1">
                  <Button
                    size="sm"
                    type="submit"
                    className="h-8 w-8 rounded-full bg-gray-900 p-0 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                    disabled={ispending}
                  >
                    {ispending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="group relative mx-auto inline-flex items-center">
                <span className="text-lg font-medium">{`@${userName}`}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1.5 h-8 w-8 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 text-center">
            <Button
              size="sm"
              className="rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Add Username
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
