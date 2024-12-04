import GradeAverageForm from "@/components/view-grade-average/ViewGradeAverageForm";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";

type Props = {
  id: any;
};

const Grade = ({ id }: Props) => {
  const [listTrainee, setListTrainee] = useState([]);
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listSchemes, setListSchemes] = useState([]);
  const [listGrade, setListGrade] = useState([]);
  const [listGradesUpdate, setListGradesUpdate] = useState([]);

  // const listSchemes = listSubject?.find(
  //   (subject: any) => subject.subjectId === selectedSubject
  // )?.schemes;

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

  const fetchListSchemesBySubject = async (subjectId: number) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/detail/${subjectId}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res?.data) {
        return res?.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res?.data) {
        const listSubjectScheme = await Promise.all(
          res?.data.map(async (subject: any) => {
            const schemes = await fetchListSchemesBySubject(subject.subjectId);
            return schemes;
          })
        );
        setListSubject(listSubjectScheme);
        setSelectedSubject(listSubjectScheme[0]?.subjectId);
        setListSchemes(listSubjectScheme[0]?.schemes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/grade-management/search`,
        {
          classId: id, // ID lớp học
          status: true, // Trạng thái (true: đã kích hoạt, false: chưa kích hoạt)
          pageable: {
            page: 1,
            size: 10, // Số lượng item mỗi trang
          },
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      const res = response?.data?.data?.dataSource;
      setListGrade(res);
      setListGradesUpdate([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchListTrainee();
    fetchListSubject();
  }, []);

  console.log("listTrainee", listTrainee);
  console.log(listSubject);
  console.log(selectedSubject);
  console.log("listSchemes", listSchemes);
  console.log("listGrade", listGrade);
  console.log("listGradesUpdate", listGradesUpdate);

  // Handle subject change
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    const schemes = listSubject?.find(
      (subject: any) => subject.subjectId === value
    )?.schemes;
    setListSchemes(schemes);
    setListGradesUpdate([]);
  };

  const handleReset = () => {
    setListGradesUpdate([]);
  };

  const handleAddGrade = async () => {
    try {
      const formatData = listGradesUpdate.map((grade: any) => ({
        classId: id,
        user: grade.user,
        subjectId: selectedSubject,
        markSchemeId: grade.markSchemeId,
        grade: grade.grade,
      }));

      await axios.post(
        `${BASE_API_URL}/grade-management/add-grade-trainee`,
        formatData,
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      alert("Add grade successfully");
      // TODO: Refetch data
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalTrainee = (traineeId: number) => {
    const userGrade = listGrade.find(
      (grade: any) => grade.userId === traineeId
    );

    const currentSubject = listSubject.find(
      (subject: any) => subject.subjectId === selectedSubject
    );

    const subjectGrade = userGrade?.gradeComponentList.find(
      (grade: any) => grade.subjectName === currentSubject.subjectName
    );

    const total = subjectGrade?.gradeComponents.reduce(
      (acc: number, grade: any) => {
        const gradeUpdate = listGradesUpdate.find(
          (gradeUpdate: any) =>
            gradeUpdate.traineeId === traineeId &&
            gradeUpdate.markSchemeId === grade.markSchemeId
        );

        return (
          acc + (gradeUpdate?.grade || grade.grade) * (grade.markWeight / 100)
        );
      },
      0
    );

    if (!total) return "";

    return total.toFixed(1);
  };

  const findGrade = (userId: number, markSchemeId: number) => {
    const userGrade = listGrade.find((grade: any) => grade.userId === userId);

    const currentSubject = listSubject.find(
      (subject: any) => subject.subjectId === selectedSubject
    );
    const subjectGrade = userGrade?.gradeComponentList.find(
      (grade: any) => grade.subjectName === currentSubject.subjectName
    );
    const schemeGrade = subjectGrade?.gradeComponents.find(
      (grade: any) => grade.markSchemeId === markSchemeId
    );

    return (
      listGradesUpdate.find(
        (grade: any) =>
          grade.traineeId === userId && grade.markSchemeId === markSchemeId
      )?.grade ||
      schemeGrade?.grade ||
      ""
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Grade Average</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Subject:</span>
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {listSubject?.map((subject: any) => (
                <SelectItem key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {listSchemes?.map((scheme: any) => (
                <th
                  key={scheme.markSchemeId}
                  className="py-4 px-6 text-center border-r border-[#5da639]"
                >
                  {scheme.markName}
                  <div className="text-sm font-normal">
                    {scheme.markWeight}%
                  </div>
                </th>
              ))}
              <th className="py-4 px-6 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {listTrainee?.map((student: any, index) => (
              <tr key={student.userId} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 border-r border-gray-200">
                  {index + 1}
                </td>
                <td className="py-4 px-6 border-r border-gray-200">
                  {student.account}
                </td>
                <td className="py-4 px-6 border-r border-gray-200">
                  {student.email}
                </td>
                {listSchemes?.map((scheme: any) => (
                  <td
                    key={scheme.markSchemeId}
                    className="py-4 px-6 text-center border-r border-gray-200"
                  >
                    <input
                      type="number"
                      className="w-20 text-center border border-gray-300 rounded-md"
                      value={findGrade(student.userId, scheme.markSchemeId)}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value > 10 || value < 0) return;

                        const gradeIndex = listGradesUpdate.findIndex(
                          (grade: any) =>
                            grade.traineeId === student.userId &&
                            grade.markSchemeId === scheme.markSchemeId
                        );
                        if (gradeIndex !== -1) {
                          const newGradesUpdate = [...listGradesUpdate];
                          newGradesUpdate[gradeIndex].grade = e.target.value;
                          setListGradesUpdate(newGradesUpdate);
                        } else {
                          setListGradesUpdate([
                            ...listGradesUpdate,
                            {
                              traineeId: student.userId,
                              user: student.account,
                              markSchemeId: scheme.markSchemeId,
                              grade:
                                e.target.value === ""
                                  ? 0
                                  : Number(e.target.value),
                              markWeight: scheme.markWeight,
                            },
                          ]);
                        }
                      }}
                    />
                  </td>
                ))}
                <td className="py-4 px-6 text-center">
                  {calculateTotalTrainee(student.userId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6 space-x-4">
        <button className="bg-gray-200 px-6 py-2 rounded" onClick={handleReset}>
          Reset
        </button>
        <button
          className={`${
            listGradesUpdate.length === 0 ? "bg-[#bddaaa]" : "bg-[#6FBC44]"
          }  text-white px-6 py-2 rounded`}
          onClick={handleAddGrade}
          disabled={listGradesUpdate.length === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Grade;
