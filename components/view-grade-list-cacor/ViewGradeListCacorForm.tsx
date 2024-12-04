"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, Users, BookOpen, Settings, LogOut, UserCircle } from "lucide-react";
import { FiEdit } from "react-icons/fi";

// Calculate final grade from theory and practice
const calculateTotal = (theory: number, practice: number) => {
  if (theory === undefined || practice === undefined) return "";
  return ((theory + practice) / 2).toFixed(1);
};

const ViewGradeListCacorForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      theory: undefined,
      practice: 9,
      detailLink: "/details/1",
    },
    {
      id: 2,
      name: "Trần Văn B",
      theory: 8.5,
      practice: 9,
      detailLink: "/details/2",
    },
    {
      id: 3,
      name: "Mã Đình Thị Thái H",
      theory: 8,
      practice: 7,
      detailLink: "/details/3",
    },
    {
      id: 4,
      name: "Hoàng Hoái A",
      theory: 8,
      practice: 7,
      detailLink: "/details/4",
    },
    {
      id: 5,
      name: "Đinh Thái M",
      theory: 8,
      practice: 7,
      detailLink: "/details/5",
    },
  ]);

  // Handle search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const filteredStudents = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setStudents(filteredStudents);
  };

  // Reset search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      // Reset to original data when search is cleared
      setStudents([
        {
          id: 1,
          name: "Nguyễn Văn A",
          theory: undefined,
          practice: 9,
          detailLink: "/details/1",
        },
        {
          id: 2,
          name: "Trần Văn B",
          theory: 8.5,
          practice: 9,
          detailLink: "/details/2",
        },
        {
          id: 3,
          name: "Mã Đình Thị Thái H",
          theory: 8,
          practice: 7,
          detailLink: "/details/3",
        },
        {
          id: 4,
          name: "Hoàng Hoái A",
          theory: 8,
          practice: 7,
          detailLink: "/details/4",
        },
        {
          id: 5,
          name: "Đinh Thái M",
          theory: 8,
          practice: 7,
          detailLink: "/details/5",
        },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#6FBC44] fixed h-screen">
        <div className="p-6">
          <img
            src="/assets/images/fpt-logo.png"
            alt="FPT Logo"
            className="w-40 mb-12"
          />
        </div>

        <nav className="text-white space-y-1">
          <Link href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <Home className="w-6 h-6 mr-4" />
            <span className="font-semibold">Home</span>
          </Link>
          <Link href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <Users className="w-6 h-6 mr-4" />
            <span className="font-semibold">User Management</span>
          </Link>
          <Link href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-semibold">Curriculum Management</span>
          </Link>
          <Link href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-semibold">Class Management</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full pb-4">
          <Link href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <UserCircle className="w-6 h-6 mr-4" />
            <span className="text-white font-semibold">My Account</span>
          </Link>
          <Link href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <LogOut className="w-6 h-6 mr-4" />
            <span className="text-white font-semibold">Sign out</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-[#EFF5EB]">
        <div className="py-8 px-12 mt-10"> {/* Changed from p-12 to py-8 px-12 */}
          <div className="flex justify-between items-center mb-8"> {/* Changed from mb-12 to mb-8 */}
            <h1 className="text-4xl font-bold">Grade Final</h1>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="pl-4 pr-10 py-2 rounded-md border border-gray-300 w-64 focus:outline-none focus:border-[#6FBC44]"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-[#6FBC44] text-white px-6 py-2 rounded-md hover:bg-[#5da639] transition duration-200"
              >
                Search
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-[#6FBC44] text-white">
                  <th className="py-4 px-6 text-left w-16">#</th>
                  <th className="py-4 px-6 text-left">Trainee Name</th>
                  <th className="py-4 px-6 text-center">Final Theory 1</th>
                  <th className="py-4 px-6 text-center">Final Practice</th>
                  <th className="py-4 px-6 text-center">Total</th>
                  <th className="py-4 px-6 text-center w-24">Detail</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{student.id}</td>
                    <td className="py-4 px-6">{student.name}</td>
                    <td className="py-4 px-6 text-center">{student.theory || ""}</td>
                    <td className="py-4 px-6 text-center">{student.practice}</td>
                    <td className="py-4 px-6 text-center">
                      {calculateTotal(student.theory, student.practice)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link href={student.detailLink}>
                        <FiEdit className="w-5 h-5 text-[#6FBC44] hover:text-[#5da639] mx-auto" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGradeListCacorForm;