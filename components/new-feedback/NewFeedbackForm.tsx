"use client";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

interface FeedbackData {
  curriculumRating: number;
  recommendCourse: boolean;
  satisfiedCurriculum: boolean;
  trainerTeachFull: boolean;
  trainerOnTime: boolean;
  comments: string;
}

type Props = {
  userId?: any;
  classId?: any;
};

const listQuestion = [
  {
    id: 1,
    question: "How would you rate the curriculum quality?",
  },
  {
    id: 2,
    question: "Would you recommend the course to others?",
  },
  {
    id: 3,
    question: "Does the trainer come to class on time?",
  },
  {
    id: 4,
    question: "Are you satisfied with the curriculum?",
  },
  {
    id: 5,
    question: "Does the trainer teach the full lesson?",
  },
];

const NewFeedbackForm = ({ userId, classId }: Props) => {
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${classId}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res?.data) {
        setListSubject(res?.data);
        setSelectedSubject(res?.data[0]?.subjectId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log("userId", userId);
  console.log("classId", classId);
  console.log("selectedSubject", selectedSubject);
  const [feedback, setFeedback] = useState<any>({
    listAnswer: [
      {
        questionId: 1,
        answer: "true",
      },
      {
        questionId: 2,
        answer: "true",
      },
      {
        questionId: 3,
        answer: "true",
      },
      {
        questionId: 4,
        answer: "true",
      },
      {
        questionId: 5,
        answer: "true",
      },
    ],
    description: "",
  });

  const handleSubmit = async () => {
    console.log("Submitted feedback:", feedback);
    try {
      const res = await fetch(`${BASE_API_URL}/feedback-management/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getJwtToken()}`,
        },
        body: JSON.stringify({
          userId,
          classId,
          subjectId: selectedSubject,
          listAnswer: feedback.listAnswer,
          description: feedback.description,
          feedbackDate: new Date().toISOString(),
          openTime: new Date().toISOString(),

          questionId: 1,
          feedBackId: 1,
        }),
      });
      const data = await res.json();
      console.log("Feedback response:", data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  return (
    <div className="flex-1 bg-[#EFF5EB] overflow-auto">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-4xl font-bold">Feedback</h2>
      </div>

      {/* Content */}
      <div className="p-4 w-[95%] mx-auto">
        {" "}
        {/* Changed max-w-4xl to w-[95%] */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Feedback Information */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Feedback Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                <span className="font-bold">Class:</span>
                <span>Java01</span>
              </div>
              {/* <div className="flex gap-2">
                <span className="font-bold">Trainer:</span>
                <span>HuyLT</span>
              </div> */}
              <div className="flex gap-2">
                <span className="font-bold">Subject Name:</span>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {listSubject?.map((subject: any) => (
                      <SelectItem
                        key={subject.subjectId}
                        value={subject.subjectId}
                      >
                        {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="flex gap-2">
                <span className="font-bold">Duration:</span>
                <span>12/8/2024-12/12-2024</span>
              </div> */}
            </div>
          </div>

          {/* Rating Section */}
          {/* <div className="mb-6">
            <p className="mb-2">How would you rate the curriculum quality?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => renderStar(num))}
            </div>
          </div> */}

          {/* Yes/No Questions */}
          {/* <div className="mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="mb-2">
                    Would you recommend the course to others?
                  </p>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={feedback.recommendCourse}
                        onChange={() =>
                          setFeedback({ ...feedback, recommendCourse: true })
                        }
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={!feedback.recommendCourse}
                        onChange={() =>
                          setFeedback({ ...feedback, recommendCourse: false })
                        }
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-2">Are you satisfied with the curriculum?</p>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={feedback.satisfiedCurriculum}
                        onChange={() =>
                          setFeedback({
                            ...feedback,
                            satisfiedCurriculum: true,
                          })
                        }
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={!feedback.satisfiedCurriculum}
                        onChange={() =>
                          setFeedback({
                            ...feedback,
                            satisfiedCurriculum: false,
                          })
                        }
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2">
                    Does the trainer teach the full lesson?
                  </p>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={feedback.trainerTeachFull}
                        onChange={() =>
                          setFeedback({ ...feedback, trainerTeachFull: true })
                        }
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={!feedback.trainerTeachFull}
                        onChange={() =>
                          setFeedback({
                            ...feedback,
                            trainerTeachFull: false,
                          })
                        }
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-2">
                    Does the trainer come to class on time?
                  </p>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={feedback.trainerOnTime}
                        onChange={() =>
                          setFeedback({ ...feedback, trainerOnTime: true })
                        }
                      />
                      <span className="ml-2 text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#6FBC44] w-4 h-4"
                        checked={!feedback.trainerOnTime}
                        onChange={() =>
                          setFeedback({ ...feedback, trainerOnTime: false })
                        }
                      />
                      <span className="ml-2 text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {listQuestion.map((question) => (
            <div key={question.id} className="mb-6">
              <p className="mb-2">{question.question}</p>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6FBC44] w-4 h-4"
                    checked={
                      feedback.listAnswer[question.id - 1].answer !== "false"
                    }
                    onChange={() => {
                      feedback.listAnswer[question.id - 1].answer = "true";
                      setFeedback({ ...feedback });
                    }}
                  />
                  <span className="ml-2 text-sm">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6FBC44] w-4 h-4"
                    checked={
                      feedback.listAnswer[question.id - 1].answer === "false"
                    }
                    onChange={() => {
                      feedback.listAnswer[question.id - 1].answer = "false";
                      setFeedback({ ...feedback });
                    }}
                  />
                  <span className="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>
          ))}

          {/* Comments Section */}
          <div className="mb-6">
            <p className="mb-2 font-bold">Your comments about the course</p>
            <textarea
              className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6FBC44] text-sm"
              value={feedback.description}
              onChange={(e) =>
                setFeedback({ ...feedback, description: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#6FBC44] text-white rounded-lg hover:bg-[#5da639] text-sm"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFeedbackForm;
