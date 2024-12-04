import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import { MinusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  id: any;
  listTrainee: any[];
  fetchListTrainee: () => void;
};

const Trainee = ({ id, listTrainee, fetchListTrainee }: Props) => {
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/trainee/export-template`, {
        headers: { Authorization: `Bearer ${getJwtToken()}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template-trainee.xlsx";
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleImportTrainee = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${BASE_API_URL}/trainee/import?classId=${id}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      console.log(res);
      fetchListTrainee();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/trainee/export/${id}`, {
        headers: { Authorization: `Bearer ${getJwtToken()}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template-trainee.xlsx";
      a.click();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListTrainee();
  }, []);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Trainee in class</h2>
        <div className="flex gap-4">
          {/* <button
            className="px-4 py-2 text-blue-600 hover:underline"
            onClick={handleDownloadTemplate}
          >
            Download Template
          </button>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={handleImportTrainee}
          />
          <label
            htmlFor="file"
            className="px-6 py-2 bg-[#6FBC44] text-white rounded cursor-pointer"
          >
            Import
          </label> */}
          <button
            className="px-4 py-2 bg-[#6FBC44] text-white rounded"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#6FBC44] text-white">
              <th className="py-4 px-6 text-left w-[10%] border-r border-gray-300">
                #
              </th>
              <th className="py-4 px-6 text-left w-[25%] border-r border-gray-300">
                Account
              </th>
              <th className="py-4 px-6 text-left w-[35%] border-r border-gray-300">
                Email
              </th>
              <th className="py-4 px-6 text-left w-[20%] border-r border-gray-300">
                Phone number
              </th>
              {/* <th className="py-4 px-6 w-[10%]"></th> */}
            </tr>
          </thead>
          <tbody>
            {listTrainee.map((trainee, index) => (
              <tr
                key={trainee.userId}
                className={index % 2 === 1 ? "bg-[#EFF5EB]" : ""}
              >
                <td className="py-4 px-6 border-r border-gray-300">
                  {index + 1}
                </td>
                <td className="py-4 px-6 border-r border-gray-300">
                  {trainee.account}
                </td>
                <td className="py-4 px-6 border-r border-gray-300">
                  {trainee.email}
                </td>
                <td className="py-4 px-6 border-r border-gray-300">
                  {trainee.phone}
                </td>
                {/* <td className="py-4 px-6 text-center">
                  <button onClick={() => handleRemoveFromClass(trainee.id)}>
                    <MinusCircle className="w-6 h-6 text-red-500" />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trainee;
