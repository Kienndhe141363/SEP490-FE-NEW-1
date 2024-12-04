"use client";

import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClassInfo from "../../view-class-list/[id]/ClassInfo";
import Trainee from "../../view-class-list/[id]/Trainee";
import Grade from "../../view-class-list/[id]/Grade";
import Session from "../../view-class-list/[id]/Session";
import WeeklyTimetableForm from "@/components/weekly-timeable/WeeklyTimeableForm";
import Feedback from "./Feedback";
import NewFeedbackForm from "@/components/new-feedback/NewFeedbackForm";

const listTabs = [
  "Class Info",
  "Trainee",
  "Grade",
  "Session",
  "Schedule",
  "Feedback",
];

type Props = {};

export default function ViewCLassDetail(props: Props) {
  const { userId } = useParams();
  console.log(userId);
  const [activeTab, setActiveTab] = useState("Class Info");
  // const [id, setId] = useState<any>(null);
  const id = 19;

  const fetchClassDetail = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/get-class-user/${userId}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const [data, setData] = useState<any>(null);

  const [listTrainee, setListTrainee] = useState([]);

  const fetchListTrainee = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/get-trainee-in-class/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setListTrainee(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/detail/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setData(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClassDetail();
    fetchData();
    fetchListTrainee();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Class Info":
        return <ClassInfo id={id} data={data} />;
      case "Trainee":
        return (
          <Trainee
            id={id}
            listTrainee={listTrainee}
            fetchListTrainee={fetchListTrainee}
          />
        );
      // case "Attendance":
      //   return <TakeAttendanceForm id={id} listTrainee={listTrainee} />;
      // case "WeeklyTime":
      //   return "WeeklyTime";
      case "Grade":
        return <Grade id={id} />;
      case "Session":
        return <Session id={id} />;
      case "Schedule":
      case "Weekly Timetable":
        return <WeeklyTimetableForm />;
      case "Feedback":
        return <NewFeedbackForm userId={userId} classId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="ml-64">
      <main className="flex-1 bg-[#EFF5EB] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-medium">
              Class Detail: {data?.className}
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 mb-6">
            {listTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium ${activeTab === tab
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-lg p-8">{renderTabContent()}</div>

          {/* Buttons */}
          {/* <div className="flex justify-center gap-4 mt-8">
          <button className="px-8 py-2 bg-[#6FBC44] text-white font-medium rounded-lg">
            Save
          </button>
          <button className="px-8 py-2 bg-[#D5DCD0] text-black font-medium rounded-lg">
            Cancel
          </button>
        </div> */}
          {/* </div> */}
        </div>
      </main>
    </div>
  );
};

