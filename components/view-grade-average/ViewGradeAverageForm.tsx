"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import page from "@/app/feature/view-class-list/[id]/page";
import { sign } from "crypto";

interface Student {
  id: number;
  name: string;
  email: string;
  assignmentAverage: number | null;
  finalAverage: number | null;
}
type Props = {
  id: any;
};

const GradeAverageForm = ({ id }: Props) => {
  // State for subject selection
  const [selectedSubject, setSelectedSubject] = useState("java");

  // State for students data
  const [students, setStudents] = useState<Student[]>([
    // {
    //   id: 1,
    //   name: "Nguyễn Văn A",
    //   email: "dieuntphe161355@gmail.com",
    //   assignmentAverage: 9.7,
    //   finalAverage: 8.0,
    // },
    // {
    //   id: 2,
    //   name: "Trần Văn B",
    //   email: "dieuntphe161355@gmail.com",
    //   assignmentAverage: null,
    //   finalAverage: null,
    // },
    // {
    //   id: 3,
    //   name: "Mã Đình Thị Thái H",
    //   email: "dieuntphe161355@gmail.com",
    //   assignmentAverage: null,
    //   finalAverage: null,
    // },
    // {
    //   id: 4,
    //   name: "Hoàng Hoái A",
    //   email: "dieuntphe161355@gmail.com",
    //   assignmentAverage: null,
    //   finalAverage: null,
    // },
    // {
    //   id: 5,
    //   name: "Đinh Thái M",
    //   email: "dieuntphe161355@gmail.com",
    //   assignmentAverage: null,
    //   finalAverage: null,
    // },
  ]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/grade-management/search`, {
        method: "POST",
        body: JSON.stringify({
          classId: id,
          keyword: "",
          status: true,
          pageable: {
            page: 1,
            size: 10,
          },
        }),
        headers: { Authorization: `Bearer ${getJwtToken()}` },
      });
      const res = await response.json();
      setStudents(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(students);

  // Handle subject change
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    // Here you would typically fetch new data based on the selected subject
    console.log(`Loading data for subject: ${value}`);
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = [
      "ID",
      "Trainee Name",
      "Email",
      "Assignment Average",
      "Final Average",
    ];
    const csvContent = [
      headers.join(","),
      ...students.map((student) =>
        [
          student.id,
          student.name,
          student.email,
          student.assignmentAverage || "",
          student.finalAverage || "",
        ].join(",")
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grade_template_${selectedSubject}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Handle import
  const handleImport = () => {
    // Create file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvData = event.target?.result as string;
          // Parse CSV and update students
          const lines = csvData.split("\n").slice(1); // Skip header
          const newStudents = lines.map((line, index) => {
            const [id, name, email, assignmentAverage, finalAverage] =
              line.split(",");
            return {
              id: parseInt(id),
              name,
              email,
              assignmentAverage: assignmentAverage
                ? parseFloat(assignmentAverage)
                : null,
              finalAverage: finalAverage ? parseFloat(finalAverage) : null,
            };
          });
          setStudents(newStudents);
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  // Handle export
  const handleExport = () => {
    // Create CSV content with current data
    const headers = [
      "ID",
      "Trainee Name",
      "Email",
      "Assignment Average",
      "Final Average",
      "Total",
    ];
    const csvContent = [
      headers.join(","),
      ...students.map((student) =>
        [
          student.id,
          student.name,
          student.email,
          student.assignmentAverage || "",
          student.finalAverage || "",
          calculateTotal(student.assignmentAverage, student.finalAverage),
        ].join(",")
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grade_export_${selectedSubject}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const calculateTotal = (assignment: number | null, final: number | null) => {
    if (!assignment || !final) return "";
    return (assignment * 0.5 + final * 0.5).toFixed(1);
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
          <Link
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <Home className="w-6 h-6 mr-4" />
            <span className="font-semibold">Home</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <Users className="w-6 h-6 mr-4" />
            <span className="font-semibold">User Management</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-semibold">Curriculum Management</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-semibold">Class Management</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full pb-4">
          <Link
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <UserCircle className="w-6 h-6 mr-4" />
            <span className="text-white font-semibold">My Account</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <LogOut className="w-6 h-6 mr-4" />
            <span className="text-white font-semibold">Sign out</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-[#EFF5EB]">
        <div className="py-8 px-12 mt-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-8">
              Grade Average: HN24_CPL_JAVA_01
            </h1>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Subject:</span>
                <Select
                  value={selectedSubject}
                  onValueChange={handleSubjectChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDownloadTemplate}
                  className="bg-[#6FBC44] text-white px-6 py-2 rounded-md hover:bg-[#5da639] transition duration-200"
                >
                  Download Template
                </button>
                <button
                  onClick={handleImport}
                  className="bg-[#6FBC44] text-white px-6 py-2 rounded-md hover:bg-[#5da639] transition duration-200"
                >
                  Import
                </button>
                <button
                  onClick={handleExport}
                  className="bg-[#6FBC44] text-white px-6 py-2 rounded-md hover:bg-[#5da639] transition duration-200"
                >
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#6FBC44] text-white">
                  <th className="py-4 px-6 text-left w-16 border-r border-[#5da639]">
                    #
                  </th>
                  <th className="py-4 px-6 text-left border-r border-[#5da639]">
                    Trainee Name
                  </th>
                  <th className="py-4 px-6 text-left border-r border-[#5da639]">
                    Email
                  </th>
                  <th className="py-4 px-6 text-center border-r border-[#5da639]">
                    Assignment Average
                    <div className="text-sm font-normal">50%</div>
                  </th>
                  <th className="py-4 px-6 text-center border-r border-[#5da639]">
                    Final Average
                    <div className="text-sm font-normal">50%</div>
                  </th>
                  <th className="py-4 px-6 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 border-r border-gray-200">
                      {student.id}
                    </td>
                    <td className="py-4 px-6 border-r border-gray-200">
                      {student.name}
                    </td>
                    <td className="py-4 px-6 border-r border-gray-200">
                      {student.email}
                    </td>
                    <td className="py-4 px-6 text-center border-r border-gray-200">
                      {student.assignmentAverage || ""}
                    </td>
                    <td className="py-4 px-6 text-center border-r border-gray-200">
                      {student.finalAverage || ""}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {calculateTotal(
                        student.assignmentAverage,
                        student.finalAverage
                      )}
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

export default GradeAverageForm;
