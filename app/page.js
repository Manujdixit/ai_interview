import { Button } from "@/components/ui/button";
import { LucideSkull, Skull } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-5 bg-black">
      <Link href={"/dashboard"}>
        <Button>Go to dashboard</Button>
      </Link>
      <h1 className="text-red-500 text-center">
        Note- Please open it Chrome browser of your PC/ Laptop.
      </h1>
      <h1 className="text-red-500 text-center">No Dark mode ahead</h1>
      <Skull className="text-white" />
    </div>
  );
}
