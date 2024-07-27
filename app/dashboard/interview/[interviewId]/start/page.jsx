"use client";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnsSec from "./_components/RecordAnsSec";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";

function StartInterview({ params }) {
  //   console.log(params);
  const [interviewdata, setInterviewdata] = useState(null);
  const [mockinterviewquestion, setMockinterviewquestion] = useState(null);
  const [activequestionindex, setActivequestionindex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp);
    console.log(jsonMockResp);
    setMockinterviewquestion(jsonMockResp);
    setInterviewdata(result[0]);
    console.log(result);
  };

  const handleRecordingStateChange = (recordingState) => {
    setIsRecording(recordingState);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockinterviewquestion={mockinterviewquestion}
          activequestionindex={activequestionindex}
        />
        <RecordAnsSec
          mockinterviewquestion={mockinterviewquestion}
          activequestionindex={activequestionindex}
          interviewdata={interviewdata}
          onRecordingStateChange={handleRecordingStateChange}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activequestionindex > 0 && (
          <Button
            onClick={() => setActivequestionindex(activequestionindex - 1)}
            disabled={isRecording}
          >
            Previous
          </Button>
        )}
        {activequestionindex != mockinterviewquestion?.length - 1 && (
          <Button
            onClick={() => setActivequestionindex(activequestionindex + 1)}
            disabled={isRecording}
          >
            Next
          </Button>
        )}
        {activequestionindex == mockinterviewquestion?.length - 1 && (
          <Link href={`/dashboard/interview/${interviewdata?.mockId}/feedback`}>
            <Button disabled={isRecording}>End interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
