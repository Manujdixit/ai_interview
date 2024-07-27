import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAi";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import {
  BrainCircuit,
  Check,
  Mic,
  MicOff,
  Ticket,
  TicketX,
  VideoOff,
} from "lucide-react";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

function RecordAnsSec({
  mockinterviewquestion,
  activequestionindex,
  interviewdata,
  onRecordingStateChange,
}) {
  const [useranswer, setUseranswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: { interimResults: true },
    googleApiKey: null,
    googleCloudRecognitionConfig: null,
    engine: "browser",
  });

  useEffect(() => {
    if (results.length > 0) {
      const newAnswer = results.map((result) => result.transcript).join(" ");
      setUseranswer((prev) => prev + " " + newAnswer);
      setResults([]);
    }
  }, [results, setResults]);

  const UpdateUserAnswer = useCallback(async () => {
    if (useranswer.length <= 10) {
      toast("Response is too short. Pro Tip: Speak louder for best results.", {
        icon: <BrainCircuit className="text-blue-500" />,
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      const feedbackPrompt = `Question: ${mockinterviewquestion[activequestionindex]?.question}, User answer: ${useranswer}, depends on question and user answer for given interview question, please give us rating and feedback as area of improvement if any in just 3 to 5 lines to JSON format with rating field and feedback field.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const input = result.response.candidates[0].content.parts[0].text;

      function extractJson(text) {
        const match = text.match(/```json\n([\s\S]*?)\n```/);
        return match ? JSON.parse(match[1]) : null;
      }

      const jsonfeedbackresponse = extractJson(input);

      if (!jsonfeedbackresponse) {
        throw new Error("Failed to parse AI response");
      }

      console.log(useranswer);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewdata?.mockId,
        question: mockinterviewquestion[activequestionindex]?.question,
        correctAns: mockinterviewquestion[activequestionindex]?.answer,
        userAns: useranswer,
        feedback: jsonfeedbackresponse.feedback,
        rating: jsonfeedbackresponse.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp) {
        toast("Response saved successfully", {
          icon: <Check className="text-green-500" />,
          position: "top-center",
        });
        setUseranswer("");
        setResults([]);
      } else {
        throw new Error("Failed to save answer");
      }
    } catch (error) {
      console.error("Error in updateduseranswer", error);
      toast.error("An error occurred while processing your answer", {
        icon: <AlertCircle className="text-red-500" />,
        position: "top-center",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [
    useranswer,
    mockinterviewquestion,
    activequestionindex,
    interviewdata,
    user,
  ]);

  useEffect(() => {
    if (!isRecording && useranswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [isRecording, useranswer, UpdateUserAnswer]);

  useEffect(() => {
    onRecordingStateChange(isRecording);
  }, [isRecording, onRecordingStateChange]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex p-1 flex-col justify-center items-center bg-black rounded-lg mt-10 mb-10">
        <VideoOff className="text-white w-48 h-48 absolute" />
        <Webcam
          className="rounded-lg"
          mirrored={true}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="lg"
        className="mb-6 transition-all duration-300 ease-in-out transform hover:scale-105"
        disabled={loading}
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <span className="flex items-center gap-2">
            <MicOff className="animate-pulse" /> Stop Recording
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Mic /> Start Recording
          </span>
        )}
      </Button>

      {isRecording && (
        <div className="w-full mb-6">
          <h3 className="text-lg font-semibold mb-2">Live Transcript:</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <p>{interimResult || useranswer || "Listening..."}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-6">
          <p className="font-bold">Error:</p>
          <p>
            {"Incompatible browser, try using the latest version of Chrome."}
          </p>
        </div>
      )}

      {loading && (
        <div className="w-full text-center">
          <p className="text-lg font-semibold">Processing your answer...</p>
        </div>
      )}
    </div>
  );
}

export default RecordAnsSec;
