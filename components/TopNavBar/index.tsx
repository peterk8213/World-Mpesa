import { Cog, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md border-none">
      <header className="flex justify-between items-center p-4 border-b border-gray-200 mb-4">
        <Link href={"/share"}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-gradient-to-br from-blue-200 to-gray-200 hover:shadow-xl hover:shadow-blue-500 focus:shadow-xl focus:shadow-blue-500 transition-shadow duration-300"
          >
            <Share2 className="h-8 w-8 text-black" />
          </Button>
        </Link>
        <h1 className="text-xl font-medium">MpesaWorld</h1>
        <Link href={"/settings"}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full  bg-gradient-to-br from-blue-200 to-gray-200 hover:shadow-xl hover:shadow-blue-500 focus:shadow-xl focus:shadow-blue-500 transition-shadow duration-300 "
          >
            <Cog className="h-10 w-10 text-black" />
          </Button>
        </Link>
      </header>
    </div>
  );
};
export default NavBar;
