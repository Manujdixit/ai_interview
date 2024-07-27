"use client";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";

function Feedback({ params }) {
  const [feedbacklist, setFeedbacklist] = useState([]);
  // console.log(params);
  useEffect(() => {
    GetFeedbackDetails();
  }, []);

  const GetFeedbackDetails = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    // console.log(result);
    setFeedbacklist(result);
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulation!</h2>
      <h2 className="font-bold text-2xl">Here is your interview Feedback</h2>
      {feedbacklist?.length === 0 && (
        <h2 className="text-red-500">No feedback found</h2>
      )}
      {/* <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>7/10</strong>
      </h2> */}
      <h2 className="text-sm text-gray-500">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </h2>
      {feedbacklist &&
        feedbacklist.map((item, index) => (
          <Collapsible key={index} className="my-8">
            <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
              {item.question}
              <ChevronsUpDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg ">
                  <strong>Rating:</strong>
                  {item.rating}
                </h2>
                <h2 className="p-2 border rounded-lg bg-red-50 text-red-900 text-sm">
                  <strong>Your Answer: </strong>
                  {item.userAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-green-50 text-green-900 text-sm">
                  <strong>Correct Answer: </strong>
                  {item.correctAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-blue-900 text-sm">
                  <strong>Feedback: </strong>
                  {item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      <Link href={"/dashboard"}>
        <Button className={"flex gap-2"}>
          <Home className="h-4 w-4" /> Go to Home
        </Button>
      </Link>
    </div>
  );
}

export default Feedback;
