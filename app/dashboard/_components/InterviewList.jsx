"use client";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { db } from "@/utils/db";
import { desc, eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

function InterviewList() {
  const [InterviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetPrevInterviews();
  }, [user]);

  const GetPrevInterviews = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      // .where(
      //   eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      // )
      .orderBy(desc(MockInterview.id))
      .limit(10);

    console.log(result);
    setInterviewList(result);
  };

  return (
    <div>
      <h2 className=" text-xl mt-16  font-bold">Explore recent interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {InterviewList &&
          InterviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;
