import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      Go to dashboard
      <Link href={"/dashboard"}>
        <Button>Button</Button>
      </Link>
    </>
  );
}
