"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAi";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";

function AddNewInterview() {
  const [open, setOpen] = React.useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobdescription, setJobdescription] = useState("");
  const [jobexperience, setJobexperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonresponse, setJsonresponse] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!jobPosition || !jobdescription || !jobexperience) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const InputPrompt =
        "Job position: " +
        jobPosition +
        ", Job Description: " +
        jobdescription +
        ", Years of Experience : " +
        jobexperience +
        ", Depends on Job Position, Job Description & Years of Experience give us " +
        process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
        " Interview question along with Answer in JSON format, Give us question and answer field on JSON";

      const result = await chatSession.sendMessage(InputPrompt);
      const input = result.response.text();

      function extractJson(text) {
        const match = text.match(/```json\n([\s\S]*?)\n```/);
        return match ? match[1] : null;
      }

      const mockjson = extractJson(input);
      console.log(typeof mockjson);
      setJsonresponse(mockjson);

      console.log(mockjson);
      console.log(jobPosition);
      console.log(jobdescription);
      console.log(jobexperience);
      console.log(user?.primaryEmailAddress?.emailAddress);
      console.log(moment().format("DD-MM-YY"));

      if (mockjson) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: mockjson,
            jobPosition: jobPosition,
            jobDesc: jobdescription,
            jobExperience: jobexperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YY"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("inserted id:", resp);
        if (resp) {
          setOpen(false);
          router.push(`/dashboard/interview/${resp[0].mockId}`);
        }
      } else {
        console.log("Error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpen(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job description
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job role/ position</label>
                    <Input
                      type="text"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                      placeholder="Full stack developer"
                    />
                  </div>
                  <div className="my-3">
                    <label>Job description/ Tech stack</label>
                    <Textarea
                      required
                      onChange={(e) => setJobdescription(e.target.value)}
                      placeholder="React, Angular, Nodejs, Mysql, etc."
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of experience</label>
                    <Input
                      required
                      onChange={(e) => setJobexperience(e.target.value)}
                      max="50"
                      type="number"
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
