import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-5 bg-black">
      <Link href={"/dashboard"}>
        <Button>Go to dashboard</Button>
      </Link>
      <h1 className="text-red-500">
        Note- Works best on Chrome. No dark mode ahead!!
      </h1>
    </div>
  );
}
