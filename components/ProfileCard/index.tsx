import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const profileCard = ({ user }: any) => {
  return (
    <div>
      <Card className=" bg-opacity-10  border-none  ">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Avatar className="w-20 h-20 mr-4 border-2 border-white">
              <AvatarImage
                src={"https://avatar.iran.liara.run/public"}
                alt={user.name?.slice(0, 8)}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user?.name?.slice(0, 8)}</h2>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default profileCard;
