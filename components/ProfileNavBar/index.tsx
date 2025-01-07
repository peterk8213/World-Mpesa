import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileNavBar() {
  const router = useRouter();

  return (
    <div className="rounded-lg ">
      <header className="sticky top-0 z-10 flex justify-between items-center p-4  bg-opacity-10 backdrop-blur-md ">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full  bg-gradient-to-br from-green-200 to-gray-200 hover:shadow-xl hover:shadow-blue-100 focus:shadow-xl focus:shadow-blue-100 transition-shadow duration-200"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Profile</h1>
        <div className="w-10 h-10" />
      </header>
    </div>
  );
}
