"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewdata, setInterviewdata] = useState();
  const [webcamenabled, setWebcamenabled] = useState(false);

  useEffect(() => {
    // console.log(params.interviewId);
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    setInterviewdata(result[0]);
  };
  //   console.log(interviewdata);

  if (!interviewdata) return <div>Loading...</div>;
  // console.log(interviewdata);

  return (
    <>
      {/* <div>Interview: {JSON.stringify(interviewdata)}</div> */}
      <div className="my-10  ">
        <h2 className="font-bold text-2xl">Let's Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
          <div className="flex flex-col my-5 gap-5 ">
            <div className="flex flex-col p-5 rounded-lg border">
              <h2>
                <strong>Job role/ position: </strong>
                {interviewdata.jobPosition}
              </h2>
              <h2>
                <strong>Job description/ Tech stack: </strong>
                {interviewdata.jobDesc}
              </h2>
              <h2>
                <strong>Job experience: </strong>
                {interviewdata.jobExperience}
              </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
              <h2 className="flex gap-2 items-center text-yellow-500">
                <Lightbulb />
                <strong>Information</strong>
              </h2>
              <h2 className="text-yellow-500">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </h2>
            </div>
          </div>
          <div>
            {webcamenabled ? (
              <Webcam
                mirrored={true}
                onUserMedia={() => setWebcamenabled(true)}
                onUserMediaError={() => setWebcamenabled(false)}
                style={{ height: 300, width: 300 }}
              />
            ) : (
              <div className="flex flex-col">
                <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
                <Button variant="ghost" onClick={() => setWebcamenabled(true)}>
                  Enable webcam and microphone
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end items-end">
          <Link href={"/dashboard/interview/" + params.interviewid + "/start"}>
            <Button>Start Interview</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Interview;
