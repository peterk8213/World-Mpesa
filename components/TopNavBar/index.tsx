import { Bell, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="bg-white/90 bg-opacity-40 backdrop-blur-sm border-none fixed top-0 left-0 right-0 z-10">
      <header className="flex justify-between items-center p-4 mb-4">
        <Link href={"/share"}>
          <Button variant="ghost" size="icon" className="rounded-full  ">
            <Share2 className="h-8 w-8 text-black" />
          </Button>
        </Link>
        <h1 className="text-xl font-medium">NEKRON</h1>
        <Link href={"#"}>
          <Button variant="ghost" size="icon" className="rounded-full  ">
            <Bell className="h-10 w-10 text-black" />
          </Button>
        </Link>
      </header>
    </div>
  );
};
export default NavBar;
