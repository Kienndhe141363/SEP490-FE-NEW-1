"use client";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const AddNewSubjectForm: React.FC = () => {
  const [lessons, setLessons] = useState<{ lessonName: string; order: number }[]>([
    { lessonName: "Lesson 1", order: 1 },
    { lessonName: "Lesson 2", order: 2 },
    { lessonName: "Lesson 3", order: 3 },
    { lessonName: "Lesson 4", order: 4 },
  ]);

  const [newLesson, setNewLesson] = useState({ lessonName: "", order: "" });

  const handleAddLesson = () => {
    if (newLesson.lessonName.trim() && newLesson.order.trim()) {
      setLessons([...lessons, { lessonName: newLesson.lessonName, order: parseInt(newLesson.order) }]);
      setNewLesson({ lessonName: "", order: "" });
    }
  };

  const handleDeleteLesson = (index: number) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    setLessons(updatedLessons);
  };

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-24 min-h-screen">
      <div className="flex justify-between items-center p-8 border-b">
        <h2 className="text-6xl font-bold">Add New Subject</h2>
        <div className="flex space-x-4">
          <button className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]">
            Download Template
          </button>
          <button className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]">
            Import
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#6FBC44] text-white">
              <th className="px-6 py-3 text-center">No</th>
              <th className="px-6 py-3 text-center">Lesson</th>
              <th className="px-6 py-3 text-center">Order</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson, index) => (
              <tr key={index} className="text-center border-b">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">{lesson.lessonName}</td>
                <td className="p-3 border">{lesson.order}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleDeleteLesson(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Lesson */}
      <div className="flex items-center mt-6 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex-grow">
          <label className="block text-xl font-bold">Lesson Name:</label>
          <input
            type="text"
            value={newLesson.lessonName}
            onChange={(e) => setNewLesson({ ...newLesson, lessonName: e.target.value })}
            placeholder="Enter Lesson Name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex-grow ml-4">
          <label className="block text-xl font-bold">Order:</label>
          <input
            type="number"
            value={newLesson.order}
            onChange={(e) => setNewLesson({ ...newLesson, order: e.target.value })}
            placeholder="Enter Order"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="button"
          onClick={handleAddLesson}
          className="ml-4 p-2 bg-[#6FBC44] text-white rounded-full hover:bg-[#5da639]"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end w-full mt-12">
        <button className="bg-[#D5DCD0] text-black font-bold py-3 px-6 rounded shadow-md hover:shadow-lg mr-4">
          Back
        </button>
        <button className="bg-[#6FBC44] text-white font-bold py-3 px-6 rounded shadow-md hover:shadow-lg">
          Add
        </button>
      </div>
    </div>
  );
};

export default AddNewSubjectForm;
