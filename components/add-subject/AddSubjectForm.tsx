"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Trash2 } from "lucide-react";
import { FormError } from "../custom/form-error";
import { Tab } from "@headlessui/react";
import toast from "react-hot-toast";
interface Subject {
  code: string;
  weight: number;
  subjectId?: number;
  subjectCode?: string;
}
interface SubjectScheme {
  markName: string;
  markWeight: number;
}
interface SubjectLesson {
  lesson: string;
  sessionOrder: number;
  description: string;
}
const AddSubjectForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchSubjects = async () => {
    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_API_URL}/subject/search`,
        { page: 0, size: 100, orderBy: 'id', sortDirection: 'asc' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllSubjects(response.data.data.dataSource || []);
    } catch (err) {
      toast.error("Error fetching subjects.");
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/authen/login");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);
  const validationSchema = Yup.object({
    subjectName: Yup.string().required("Subject Name is required"),
    subjectCode: Yup.string().required("Subject Code is required"),
    descriptions: Yup.string().optional(),
    schemes: Yup.array()
      .of(
        Yup.object({
          markName: Yup.string().required("Mark Name is required"),
          markWeight: Yup.number()
            .min(0, "Weight must be positive")
            .required("Mark Weight is required"),
        })
      )
      .test(
        "total-weight",
        "Total mark weight must be 100",
        (schemes) => {
          const totalWeight = schemes.reduce((sum, scheme) => sum + scheme.markWeight, 0);
          return totalWeight === 100;
        }
      ),
    lessonList: Yup.array().of(
      Yup.object({
        lesson: Yup.string().required("Lesson is required"),
        sessionOrder: Yup.number()
          .min(1, "Session Order must be at least 1")
          .required("Session Order is required"),
        description: Yup.string().optional(),
      })
    ),
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);
  
  const handleNext = (validateForm: any, values: any, setTouched: any) => {
    const generalInfoFields = {
      subjectName: values.subjectName,
      subjectCode: values.subjectCode,
      descriptions: values.descriptions,
      schemes: values.schemes,
    };
  
    validateForm(generalInfoFields).then((errors: any) => {
      if (Object.keys(errors).length === 0) {
        setHasErrors(false); // Không có lỗi, chuyển sang tab Session List
        setCurrentTab(1); // Chuyển sang tab Session List
      } else {
        setHasErrors(true); // Có lỗi, không chuyển tab
        setTouched({
          subjectName: true,
          subjectCode: true,
          descriptions: true,
          schemes: values.schemes.map(() => ({
            markName: true,
            markWeight: true,
          })),
        });
      }
    });
  };
  
  

  const handleSubmit = async (values: any) => {
    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${BASE_API_URL}/subject/add-subject`,
        {
          subjectName: values.subjectName,
          subjectCode: values.subjectCode,
          descriptions: values.descriptions,
          status: true,
          schemes: values.schemes,
          lessonList: values.lessonList,
          documentLink: "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push("/feature/view-subject-list");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.errorCode === "ERR026") {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error adding subject.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-8 min-h-screen">
      <div className="flex justify-between items-center p-8 border-b">
        <h2 className="text-5xl font-bold">Add New Subject</h2>
      </div>
      {error && <FormError message={error} />}
      <div className="bg-white rounded-[40px] p-12 mx-auto mt-10">
        <Formik
          initialValues={{
            subjectName: "",
            subjectCode: "",
            descriptions: "",
            schemes: [{ markName: "", markWeight: 0 }],
            lessonList: [{ lesson: "", sessionOrder: 1, description: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, validateForm, setTouched }) => (
            <Tab.Group
            selectedIndex={currentTab}
            onChange={(index) => {
              // Không cho phép chuyển sang tab Session List nếu có lỗi
              if (index === 1 && hasErrors) {
                return; // Không chuyển tab nếu có lỗi
              }
              setCurrentTab(index); // Chuyển tab nếu không có lỗi
            }}
          >
              <Tab.List className="flex space-x-4 mb-8">
  <Tab
    className={({ selected }) =>
      selected
        ? "bg-[#6FBC44] text-white font-bold py-2 px-4 rounded"
        : "bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded"
    }
  >
    General Info
  </Tab>
  <Tab
    disabled={currentTab === 0} // Disable tab Session List khi có lỗi
    className={({ selected }) =>
      selected
        ? "bg-[#6FBC44] text-white font-bold py-2 px-4 rounded"
        : hasErrors
        ? "bg-gray-200 text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed" // Tab bị vô hiệu hóa
        : "bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded"
    }
  >
    Session List
  </Tab>
</Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <Form className="grid grid-cols-2 gap-x-16 gap-y-8">
                    <div className="col-span-1">
                      <label className="block font-bold text-2xl mb-2">Subject Name*</label>
                      
                      <Field name="subjectName" placeholder="Input Subject Name" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                      <ErrorMessage name="subjectName" component="div" className="text-red-500" />
                      <label className="block font-bold text-2xl mb-2 mt-4">Description</label>
                      <Field as="textarea" name="descriptions" placeholder="Input Description" className="p-2.5 w-full border border-[#D4CBCB] h-20 rounded" />
                      <ErrorMessage name="descriptions" component="div" className="text-red-500" />
                    </div>
                    <div className="col-span-1">
                      <label className="block font-bold text-2xl mb-2">Subject Code*</label>
                      <Field name="subjectCode" placeholder="Input Subject Code" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                      <ErrorMessage name="subjectCode" component="div" className="text-red-500" />
                      <label className="block font-bold text-2xl mb-2 mt-4">Weight Grade</label>
                      <FieldArray name="schemes">
                        {({ remove, push }) => (
                          <div>
                            <table className="w-full border border-[#D4CBCB] text-center">
                              <thead>
                                <tr className="bg-[#6FBC44] text-white">
                                  <th className="px-4 py-3 uppercase tracking-wider">Mark Name</th>
                                  <th className="px-4 py-3 uppercase tracking-wider">Mark Weight (%)</th>
                                  <th className="px-4 py-3 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.schemes.map((scheme, index) => (
                                  <tr key={index} className="border-b border-[#D4CBCB]">
                                    <td className="px-4 py-2">
                                      <Field name={`schemes[${index}].markName`} placeholder="Mark Name" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                                      <ErrorMessage name={`schemes[${index}].markName`} component="div" className="text-red-500 text-sm mt-1" />
                                    </td>
                                    <td className="px-4 py-2">
                                      <Field name={`schemes[${index}].markWeight`} type="number" placeholder="Mark Weight" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                                      <ErrorMessage name={`schemes[${index}].markWeight`} component="div" className="text-red-500 text-sm mt-1" />
                                    </td>
                                    <td className="px-4 py-2">
                                      <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-6 h-6" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button type="button" onClick={() => push({ markName: "", markWeight: 0 })} className="mt-4 bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]">
                              + Add Scheme
                            </button>
                            {errors.schemes && typeof errors.schemes === 'string' && (
                              <div className="text-red-500 text-sm mt-1">{errors.schemes}</div>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                    <div className="flex mt-10 col-span-2 gap-x-6">
                    <button
  type="button"
  onClick={() => handleNext(validateForm, values, setTouched)}
  className="text-white bg-[#6FBC44] font-bold shadow-md hover:shadow-lg hover:bg-[#5da639] py-3 px-6 rounded"
>
  Next
</button>
                    </div>
                  </Form>
                </Tab.Panel>
                <Tab.Panel>
                  <Form className="grid grid-cols-1 gap-x-16 gap-y-8">
                    <FieldArray name="lessonList">
                      {({ remove, push }) => (
                        <div>
                          <div className="flex justify-end mb-4">
  <button
    onClick={async () => {
      const token = getJwtToken();
      if (!token) {
        router.push("/authen/login");
        return;
      }
      try {
        const response = await axios.get(`${BASE_API_URL}/session-management/export-template`, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template.xlsx");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error downloading template:", error);
      }
    }}
    className="bg-[#6FBC44] text-white font-bold py-2 px-4 mr-2 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]"
  >
    Download Template
  </button>

  <label className="flex items-center bg-[#6FBC44] text-white  font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639] cursor-pointer">
    <input
      type="file"
      onChange={async (e) => {
        const token = getJwtToken();
        if (!token) {
          router.push("/authen/login");
          return;
        }
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        console.log(file.name)
        try {

          const response = await axios.post(`${BASE_API_URL}/session-management/import-session`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response.data);
          alert("Import successful!");
        } catch (error) {
          console.error("Error importing file:", error);
          alert("Import failed.");
        }
      }}
      className="hidden"
    />
    Import File
  </label>
</div>
                          <table className="w-full border border-[#D4CBCB] text-center">
                            <thead>
                              <tr className="bg-[#6FBC44] text-white">
                                <th className="px-4 py-3 uppercase tracking-wider">Lesson</th>
                                <th className="px-4 py-3 uppercase tracking-wider">Order</th>
                                <th className="px-4 py-3 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.lessonList.map((lesson, index) => (
                                <tr key={index} className="border-b border-[#D4CBCB]">
                                  <td className="px-4 py-2">
                                    <Field name={`lessonList[${index}].lesson`} placeholder="Lesson" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                                    <ErrorMessage name={`lessonList[${index}].lesson`} component="div" className="text-red-500 text-sm mt-1" />
                                  </td>
                                  <td className="px-4 py-2">
                                    <Field name={`lessonList[${index}].sessionOrder`} type="number" placeholder="Session Order" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                                    <ErrorMessage name={`lessonList[${index}].sessionOrder`} component="div" className="text-red-500 text-sm mt-1" />
                                  </td>
                                  <td className="px-4 py-2">
                                    <Field name={`lessonList[${index}].description`} placeholder="Description" className="p-2.5 w-full border border-[#D4CBCB] h-11 rounded" />
                                    <ErrorMessage name={`lessonList[${index}].description`} component="div" className="text-red-500 text-sm mt-1" />
                                  </td>
                                  <td className="px-4 py-2">
                                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                                      <Trash2 className="w-6 h-6" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button type="button" onClick={() => push({ lesson: "", sessionOrder: 1, description: "" })} className="mt-4 bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]">
                            + Add Lesson
                          </button>
                        </div>
                      )}
                    </FieldArray>
                    <div className="flex mt-10 col-span-2 gap-x-6">
                      <button type="button" onClick={() => setCurrentTab(0)} className="text-black bg-[#D5DCD0] font-bold shadow-md hover:shadow-lg hover:bg-gray-400 py-3 px-6 rounded">
                        Back
                      </button>
                      <button type="submit" className="text-white bg-[#6FBC44] font-bold shadow-md hover:shadow-lg hover:bg-[#5da639] py-3 px-6 rounded mr-10">
                        Submit
                      </button>
                    </div>
                  </Form>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default AddSubjectForm;

