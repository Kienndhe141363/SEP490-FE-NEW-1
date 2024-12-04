"use client";
import React, { useState } from "react";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";

const ViewClassDetailForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Class Info");
  
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
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <Home className="w-6 h-6 mr-4" />
            <span className="font-medium">Home</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <Users className="w-6 h-6 mr-4" />
            <span className="font-medium">User Management</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-medium">Curriculum Management</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-medium">Class Management</span>
          </a>

          <div className="mt-auto">
            <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
              <Settings className="w-6 h-6 mr-4" />
              <span className="font-medium">Setting</span>
            </a>
            <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
              <LogOut className="w-6 h-6 mr-4" />
              <span className="font-medium">Sign out</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#EFF5EB] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-medium">Class Detail: HN24_CPL.V_JAVA.01</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 mb-6">
            {["Class Info", "Trainee", "Attendance", "Session"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div>
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Class Name:</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Location:</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Start Date</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Supplier</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Trainee No.</label>
                  <input
                    type="text"
                    value="25"
                    readOnly
                    className="w-full h-10 border border-gray-300 rounded px-3 bg-gray-100"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Class Admin*</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Plan Trainee No.</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                <label className="block text-lg font-medium mb-2">End Date</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Curriculum</label>
                  <select className="w-full h-10 border border-gray-300 rounded px-3">
                    <option value="">Select curriculum</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium mb-2">Generation</label>
                  <input
                    type="text"
                    className="w-full h-10 border border-gray-300 rounded px-3"
                  />
                </div>
              </div>

              {/* Notes Section - Full Width */}
              <div className="col-span-2">
                <label className="block text-lg font-medium mb-2">Note:</label>
                <textarea
                  className="w-full h-32 border border-gray-300 rounded p-3"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button className="px-8 py-2 bg-[#6FBC44] text-white font-medium rounded-lg">
                Save
              </button>
              <button className="px-8 py-2 bg-[#D5DCD0] text-black font-medium rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewClassDetailForm;