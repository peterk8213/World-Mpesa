import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserNav({ className, ...props }: UserNavProps) {
  return (
    <div className={className} {...props}>
      <Avatar>
        <AvatarImage src="/avatars/user.png" alt="User" />
        <AvatarFallback>User</AvatarFallback>
      </Avatar>
    </div>
  );
}
