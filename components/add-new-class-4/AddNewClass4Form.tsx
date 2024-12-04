"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { formatDate } from "date-fns";
import { BASE_API_URL } from "@/config/constant";
import { useRouter } from "next/navigation";

interface Lesson {
  id: number;
  name: string;
  order: number;
  date: string;
  description?: string;
}

interface Subject {
  id: number;
  name: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface AddNewClass4FormProps {
  setActiveStep: (step: number) => void;
  data: any;
}

interface LessonFormProps {
  setSubjects: any;
  subjects: any;
  subjectId: number;
}

export const formatDateRange = (startDate: string, endDate: string) => {
  // 07:30 - 09:00 28/11/2024
  return `${formatDate(new Date(startDate), "HH:mm")} - ${formatDate(
    new Date(endDate),
    "HH:mm dd/MM/yyyy"
  )}`;
};

const LessonForm = ({ setSubjects, subjects, subjectId }: LessonFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    order: 0,
    date: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddLesson = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/session-management/add-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjectId,
            lesson: formData.name,
            sessionOrder: formData.order,
            // date: "2024-11-24T16:24:17.544Z",
            description: formData.description,
          }),
        }
      );
      const res = await response.json();
      console.log("res", res.data);
      if (res.code === "Success") {
        const newSubjects = subjects.map((subject: any) =>
          subject.subjectId === subjectId
            ? {
                ...subject,
                sessionsList: [...subject.sessionsList, res.data],
              }
            : subject
        );
        console.log("newSubjects", newSubjects);
        setSubjects(newSubjects);
        setFormData({
          name: "",
          order: 0,
          date: "",
          description: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-4 items-center">
        <Plus size={20} className="cursor-pointer" onClick={handleAddLesson} />
        <input
          type="text"
          name="name"
          placeholder="Lesson Name:"
          className="bg-gray-100 p-2 rounded"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="order"
          placeholder="Order"
          className="bg-gray-100 p-2 rounded w-24"
          value={formData.order}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description:"
          className="bg-gray-100 p-2 rounded flex-1"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

const AddNewClass4Form = ({ setActiveStep, data }: AddNewClass4FormProps) => {
  const handleCancel = () => {
    setActiveStep(2);
  };

  const activeTab = "Session";

  const [subjects, setSubjects] = useState<any>([]);

  const router = useRouter();

  const toggleSubject = (subjectId: number) => {
    setSubjects(
      subjects.map((subject: any) =>
        subject.subjectId === subjectId
          ? { ...subject, isExpanded: !subject.isExpanded }
          : subject
      )
    );
  };

  const handleUpdateClass = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/update-class-by-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: data.classId,
            classCode: data.classCode,
            locationId: data.locationId,
            generationId: data.generationId,
            curriculumId: data?.curriculum?.curriculumId,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            description: data.note,
            subjectList: data?.subjectList?.map((subject: any) => ({
              subjectId: subject.subjectId,
              slot: subject.slot,
              trainer: subject.trainer,
            })),
            subjectSessionList: subjects.map((subject: any) => ({
              subjectId: subject.subjectId,
              sessionList: subject.sessionsList.map((session: any) => ({
                sessionId: session.sessionId,
                lesson: session.lesson,
                sessionOrder: session.sessionOrder,
                description: session.description,
                date: session.date ? new Date(session.date) : null,
                startDate: session.startDate ? new Date(session.date) : null,
                endDate: session.endDate ? new Date(session.endDate) : null,
              })),
            })),
          }),
        }
      );
      const res = await response.json();
      console.log("res", res);
      if (res.code === "Success") {
        router.push("/feature/view-class-list");
        alert("Add class successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTimeTableSubject = async (sessionsList: any, slot: any) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/get-time-table-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: new Date(data.startDate),
            slot,
            sessions: sessionsList.map((s: any) => ({
              ...s,
              startDate: new Date(s.startDate),
            })),
          }),
        }
      );
      const res = await response.json();
      console.log("res", res);
      if (res.code === "Success") {
        return res.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTimeTableSubjects = async () => {
    try {
      // tôi muốn từ list subject lấy ra list session của từng subject và gán vào subjects
      const newSubjects = await Promise.all(
        data?.subjectList?.map(async (subject: any) => {
          const sessionsList = await fetchTimeTableSubject(
            subject.sessionsList,
            subject.slot
          );
          return {
            ...subject,
            sessionsList,
            isExpanded: true,
          };
        })
      );
      setSubjects(newSubjects);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTimeTableSubjects();
  }, []);

  console.log("subjects", subjects);
  console.log("data", data);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#6FBC44] h-full flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/fpt-software.png"
              alt="FPT Software"
              className="h-8"
            />
            <div className="border-l-2 border-white h-8 mx-2"></div>
            <img
              src="/assets/images/fpt-academy.png"
              alt="FPT Academy"
              className="h-8"
            />
          </div>
        </div>

        <nav className="flex flex-col flex-1 text-white">
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da33a]"
          >
            <Home className="mr-3" /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da33a]"
          >
            <Users className="mr-3" /> User Management
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da33a]"
          >
            <BookOpen className="mr-3" /> Curriculum Management
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da33a]"
          >
            <BookOpen className="mr-3" /> Class Management
          </a>
        </nav>

        <div className="mt-auto px-6 py-3 text-white">
          <a href="#" className="flex items-center hover:text-gray-200">
            <Settings className="mr-3" /> Setting
          </a>
          <a href="#" className="flex items-center mt-3 hover:text-gray-200">
            <Users className="mr-3" /> My Account
          </a>
          <a href="#" className="flex items-center mt-3 hover:text-gray-200">
            <LogOut className="mr-3" /> Sign out
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold">Add New Class</h1>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex space-x-4 border-b border-gray-300">
            {["Class Info", "Trainee", "Session"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${
                  activeTab === tab ? "border-b-2 border-[#6FBC44]" : ""
                }`}
                disabled={activeTab !== tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Session Content */}
          <div className="mt-6">
            {/* Header with borders */}
            <div className="grid grid-cols-5 bg-[#6FBC44] text-white rounded-t-lg">
              <div className="p-3 border-r border-white">No</div>
              <div className="p-3 border-r border-white">Lesson</div>
              <div className="p-3 border-r border-white">Order</div>
              <div className="p-3 border-r border-white">Date</div>
              <div className="p-3">Description</div>
            </div>

            {subjects.map((subject: any) => (
              <div key={subject.subjectId} className="border rounded-lg mb-4">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleSubject(subject.subjectId)}
                >
                  <h3 className="font-bold">{subject.subjectName}</h3>
                  {subject?.isExpanded ? <ChevronUp /> : <ChevronDown />}
                </div>

                {subject?.isExpanded && (
                  <>
                    {subject?.sessionsList?.map(
                      (lesson: any, index: number) => (
                        <div key={index} className="grid grid-cols-5 border-t">
                          <div className="p-4 border-r">{index + 1}</div>
                          <div className="p-4 border-r">{lesson.lesson}</div>
                          <div className="p-4 border-r">
                            {lesson.sessionOrder}
                          </div>
                          <div className="p-4 border-r">
                            {lesson.date
                              ? formatDateRange(lesson.date, lesson.endDate)
                              : "--"}
                          </div>
                          <div className="p-4">{lesson.description}</div>
                        </div>
                      )
                    )}
                    <LessonForm
                      setSubjects={setSubjects}
                      subjects={subjects}
                      subjectId={subject.subjectId}
                    />
                  </>
                )}
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                className="bg-gray-200 px-6 py-2 rounded"
                onClick={handleCancel}
              >
                Back
              </button>
              <button
                className="bg-[#6FBC44] text-white px-6 py-2 rounded"
                onClick={handleUpdateClass}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewClass4Form;
