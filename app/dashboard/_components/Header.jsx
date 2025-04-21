"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();

  // useEffect(() => {
  //   console.log(path);
  // }, [path]);

  return (
    <div className="flex py-4 px-4 sm:px-10 md:px-20 lg:px-32 items-center justify-between bg-secondary shadow-md">
      <Link href={"/dashboard"}>
        <div className="flex items-center gap-3">
          <Image src={"/logo.svg"} width={40} height={20} />
          <h1 className="text-2xl text-blue-600 font-bold">Assessment AI</h1>
        </div>
      </Link>
      <ul className="hidden md:flex gap-6">
        {/* <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path == "/dashboard" && "text-primary font-bold"
          }`}
        >
          Dashboard
        </li> */}
        {/* <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path == "/dashboard/questions" && "text-primary font-bold"
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path == "/dashboard/upgrade" && "text-primary font-bold"
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path == "/dashboard/howitworks" && "text-primary font-bold"
          }`}
        >
          How it Works?
        </li> */}
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
