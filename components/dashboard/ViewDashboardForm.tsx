"use client";
import React from "react";
import Link from "next/link";
import { Home, Users, BookOpen, Settings, LogOut, Library, BookOpenText, GraduationCap, MessagesSquare } from "lucide-react";

const ViewDashBoardForm: React.FC = () => {
  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] min-h-screen  ">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 p-10 ">
        <div className="grid grid-cols-3 gap-6">
          <Link href="/feature/view-system-setting" className="bg-gray-400 flex flex-col items-center justify-center p-20 rounded-lg hover:shadow-lg hover:shadow-gray-500 hover:bg-gray-500">
            <Settings className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">System Setting</span>
          </Link>
          <Link href="/feature/view-user-list" className="bg-purple-400 flex flex-col items-center justify-center p-8 rounded-lg hover:shadow-lg hover:shadow-purple-500 hover:bg-purple-500">
            <Users className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">User</span>
          </Link>
          <Link href="/feature/view-subject-list" className="bg-blue-400 flex flex-col items-center justify-center p-8 rounded-lg hover:shadow-lg hover:shadow-blue-500 hover:bg-blue-500">
            <BookOpenText className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Subject</span>
          </Link>
          <Link href="/feature/view-curriculum-list" className="bg-red-400 flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-red-500 hover:bg-red-500">
            <Library className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Curriculum</span>
          </Link>
          <Link href="/feature/view-class-list" className="bg-green-400 flex flex-col items-center justify-center p-8 mt-10 rounded-lg hover:shadow-lg hover:shadow-green-500 hover:bg-green-500">
            <GraduationCap className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Class</span>
          </Link>
          <Link href="/feature/feedback-list" className="bg-yellow-400 flex flex-col items-center justify-center p-8 mt-10 rounded-lg hover:shadow-lg hover:shadow-yellow-500 hover:bg-yellow-500">
            <MessagesSquare className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Feedback</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewDashBoardForm;
