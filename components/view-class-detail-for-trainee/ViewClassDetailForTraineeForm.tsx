"use client";
import React from "react";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const ViewClassDetailForTraineeForm: React.FC = () => {
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
        <div className="p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Class Detail: HN24_CPL.V_JAVA01</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-12 mb-8">
            <button className="text-xl font-bold px-4 py-2 text-black border-b-2 border-black hover:opacity-80 transition-opacity">
              Class Info
            </button>
            <button className="text-xl font-bold px-4 py-2 text-gray-500 hover:text-black hover:border-b-2 hover:border-black transition-all">
              Trainee
            </button>
            <button className="text-xl font-bold px-4 py-2 text-gray-500 hover:text-black hover:border-b-2 hover:border-black transition-all">
              Attendance
            </button>
            <button className="text-xl font-bold px-4 py-2 text-gray-500 hover:text-black hover:border-b-2 hover:border-black transition-all">
              Session
            </button>
          </div>

          {/* Class Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <div className="grid grid-cols-2 gap-x-20 gap-y-8">
              <div>
                <label className="block text-2xl font-bold mb-2">Class Name:</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300">Fresher Cpp for</p>
              </div>
              <div>
                <label className="block text-2xl font-bold mb-2">Class Admin*</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300">DungNTP9</p>
              </div>
              
              <div>
                <label className="block text-2xl font-bold mb-2">Location:</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300">F-Ville2</p>
              </div>
              <div>
                <label className="block text-2xl font-bold mb-2">Curriculum:</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300">KS</p>
              </div>

              <div>
                <label className="block text-2xl font-bold mb-2">Start Date</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300">1-11/2024</p>
              </div>
              <div>
                <label className="block text-2xl font-bold mb-2">End Date</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300">30/11/2024</p>
              </div>

              <div className="col-span-2">
                <label className="block text-2xl font-bold mb-2">Note:</label>
                <p className="text-xl p-3 border rounded-lg border-gray-300 min-h-[100px]">
                  Đang xây dựng content
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewClassDetailForTraineeForm;