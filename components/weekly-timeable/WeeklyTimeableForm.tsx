"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WeeklyTimetableForm: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState("20/10-26/10");
  const [selectedClass, setSelectedClass] = useState("HN24_FR_KS_04");

  const timeSlots = [
    { id: "slot1", time: "9h00-11h30" },
    { id: "slot2", time: "13h30-17h00" },
  ];

  const days = ["Week", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Generate weeks for the entire year
  const weeks = Array.from({ length: 52 }, (_, index) => {
    const startDay = new Date(2024, 0, 1 + index * 7);
    const endDay = new Date(startDay);
    endDay.setDate(endDay.getDate() + 6);
    return `${startDay.getDate()}/${
      startDay.getMonth() + 1
    }-${endDay.getDate()}/${endDay.getMonth() + 1}`;
  });

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="p-6 w-full">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-semibold">Weekly Timetable</h1>
            <div className="flex items-center gap-2">
              <span>Class:</span>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue>{selectedClass}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HN24_FR_KS_04">HN24_FR_KS_04</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="shadow-md">
            <CardContent className="p-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 bg-[#4CAF50] text-black border">
                      <div className="flex items-center">
                        <span className="mr-2">Week:</span>
                        <Select
                          value={selectedWeek}
                          onValueChange={setSelectedWeek}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>{selectedWeek}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {weeks.map((week, index) => (
                              <SelectItem key={index} value={week}>
                                {week}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </th>
                    {days.slice(1).map((day) => (
                      <th
                        key={day}
                        className="p-3 bg-[#4CAF50] text-white border"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td className="p-3 border bg-[#F5F5F5]">
                        <div className="text-sm">{slot.time}</div>
                      </td>
                      {/* Columns for each day */}
                      {days.slice(1).map((day) => (
                        <td key={`${slot.id}-${day}`} className="p-3 border">
                          <Select
                            defaultValue={slot.id === "slot1" ? "JAVA" : "KOR1"}
                          >
                            <SelectTrigger className="w-full mb-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JAVA">JAVA</SelectItem>
                              <SelectItem value="KOR1">KOR1</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="mb-2">
                            <div className="text-xs text-green-600">ROOM:</div>
                            <Select defaultValue="PASSION">
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PASSION">PASSION</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <div className="text-xs text-green-600">
                              Trainer:
                            </div>
                            <Select
                              defaultValue={
                                slot.id === "slot1" ? "LongNQ3" : "AnhBH17"
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LongNQ3">LongNQ3</SelectItem>
                                <SelectItem value="AnhBH17">AnhBH17</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-[#4CAF50] text-white px-8 py-2 rounded">
              Save
            </button>
            <button className="bg-gray-200 px-8 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableForm;
