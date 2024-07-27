import { Lightbulb, Volume2 } from "lucide-react";
import React, { useState } from "react";

function QuestionsSection({ mockinterviewquestion, activequestionindex }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const textToSpeach = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };
  return (
    mockinterviewquestion && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {mockinterviewquestion &&
            mockinterviewquestion.map((question, index) => (
              <button
                className={`py-2 px-3 rounded-full text-xs font-medium transition-colors duration-200 text-center cursor-pointer ease-in-out ${
                  activequestionindex === index
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-current={activequestionindex === index ? "true" : "false"}
              >
                Question {index + 1}
              </button>
            ))}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Question:</h2>
          <p className="text-lg mb-4">
            {mockinterviewquestion[activequestionindex]?.question}
          </p>
          <button
            onClick={() =>
              textToSpeach(mockinterviewquestion[activequestionindex]?.question)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ease-in-out ${
              isSpeaking
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <Volume2 size={18} />
            {isSpeaking ? "Stop" : "Listen"}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h2 className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
            <Lightbulb size={20} />
            Note
          </h2>
          <p className="text-sm text-blue-600">
            {process.env.NEXT_PUBLIC_INTERVIEW_NOTE}
          </p>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
