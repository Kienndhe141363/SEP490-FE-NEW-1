"use client";
import React, { useState } from "react";
import { Home, Users, BookOpen, Settings, LogOut, CheckCircle2, MinusCircle } from "lucide-react";
import Image from "next/image";
const AddNewTraineeForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [trainees, setTrainees] = useState([
    {
      id: 1,
      name: "DieuNTP",
      email: "dieuntphe161355@fpt.edu.vn",
      phone: "0336627895",
    },
    {
      id: 2,
      name: "NgaNQ",
      email: "nganqhe1625342@fpt.edu.vn",
      phone: "0337462847",
    },
  ]);

  const [inClass, setInClass] = useState([
    {
      id: 1,
      name: "DieuNTP",
      email: "dieuntphe161355@fpt.edu.vn",
      phone: "0336627895",
    },
    {
      id: 2,
      name: "NgaNQ",
      email: "nganqhe1625342@fpt.edu.vn",
      phone: "0337462847",
    },
    {
      id: 3,
      name: "DieuNTP",
      email: "dieuntphe161355@fpt.edu.vn",
      phone: "0336627895",
    },
    {
      id: 4,
      name: "NgaNQ",
      email: "nganqhe1625342@fpt.edu.vn",
      phone: "0337462847",
    },
    {
      id: 5,
      name: "DieuNTP",
      email: "dieuntphe161355@fpt.edu.vn",
      phone: "0336627895",
    },
  ]);

  const handleAddToClass = (id: number) => {
    const userToAdd = trainees.find((user) => user.id === id);
    if (userToAdd) {
      setInClass((prevInClass) => {
        const filteredInClass = prevInClass.filter((user) => user.id !== id);
        return [...filteredInClass, userToAdd];
      });
      setTrainees((prevTrainees) => prevTrainees.filter((user) => user.id !== id));
    }
  };

  const handleRemoveFromClass = (id: number) => {
    const userToRemove = inClass.find((user) => user.id === id);
    if (userToRemove) {
      setTrainees((prevTrainees) => {
        const filteredTrainees = prevTrainees.filter((user) => user.id !== id);
        return [...filteredTrainees, userToRemove];
      });
      setInClass((prevInClass) => prevInClass.filter((user) => user.id !== id));
    }
  };

  const filteredTrainees = trainees.filter((trainee) =>
    trainee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#EFF5EB]">
      {/* Sidebar */}
      <div className="w-[228px] bg-[#6FBC44] fixed h-screen shadow-md">
        <div className="p-10">
          <Image
            src="/assets/images/fpt-logo.png"
            alt="FPT Logo"
            width={179}
            height={127}
            className="mb-8 rounded-full"
          />
        </div>

        <nav className="text-white">
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <Home className="w-6 h-6 mr-4" />
            <span className="font-bold">Home</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <Users className="w-6 h-6 mr-4" />
            <span className="font-bold">User Management</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-bold">Course Management</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 mt-60 hover:bg-[#5da639]">
            <Settings className="w-6 h-6 mr-4" />
            <span className="font-bold">Setting</span>
          </a>
          <a href="#" className="flex items-center px-6 py-3 hover:bg-[#5da639]">
            <LogOut className="w-6 h-6 mr-4" />
            <span className="font-bold">Sign out</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-[250px] bg-[#EFF5EB] p-8">
        {/* Search Section */}
        
        {/* Available Trainees Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#6FBC44] text-white">
                  <th className="py-4 px-6 text-left w-[10%] border-r border-gray-300">#</th>
                  <th className="py-4 px-6 text-left w-[25%] border-r border-gray-300">Account</th>
                  <th className="py-4 px-6 text-left w-[35%] border-r border-gray-300">Email</th>
                  <th className="py-4 px-6 text-left w-[20%] border-r border-gray-300">Phone number</th>
                  <th className="py-4 px-6 w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainees.map((trainee, index) => (
                  <tr key={trainee.id} className={index % 2 === 1 ? 'bg-[#EFF5EB]' : ''}>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.id}</td>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.name}</td>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.email}</td>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.phone}</td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => handleAddToClass(trainee.id)}>
                        <CheckCircle2 className="w-6 h-6 text-[#6FBC44]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        <div className="mb-8 mt-8">
          <input
            type="text"
            placeholder="DieuNTP"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] h-12 px-4 rounded border border-gray-300"
          />
        </div>

        {/* Trainee in Class Section */}
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Trainee in class</h2>
            <div className="flex gap-4">
              <button className="px-4 py-2 text-blue-600 hover:underline">
                Download Template
              </button>
              <button className="px-6 py-2 bg-[#6FBC44] text-white rounded">
                Import
              </button>
              <button className="px-6 py-2 bg-[#6FBC44] text-white rounded">
                Export
              </button>
            </div>
          </div>

          {/* In Class Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#6FBC44] text-white">
                  <th className="py-4 px-6 text-left w-[10%] border-r border-gray-300">#</th>
                  <th className="py-4 px-6 text-left w-[25%] border-r border-gray-300">Account</th>
                  <th className="py-4 px-6 text-left w-[35%] border-r border-gray-300">Email</th>
                  <th className="py-4 px-6 text-left w-[20%] border-r border-gray-300">Phone number</th>
                  <th className="py-4 px-6 w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {inClass.map((trainee, index) => (
                  <tr key={trainee.id} className={index % 2 === 1 ? 'bg-[#EFF5EB]' : ''}>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.id}</td>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.name}</td>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.email}</td>
                    <td className="py-4 px-6 border-r border-gray-300">{trainee.phone}</td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => handleRemoveFromClass(trainee.id)}>
                        <MinusCircle className="w-6 h-6 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="px-8 py-2 bg-[#D5DCD0] text-black rounded">
            Cancel
          </button>
          <button className="px-8 py-2 bg-[#6FBC44] text-white rounded">
            Save
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddNewTraineeForm;