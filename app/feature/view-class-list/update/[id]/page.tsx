"use client";

import AddNewClass2Form from "@/components/add-new-class-2/AddNewClass2Form";
import AddNewClass3Form from "@/components/add-new-class-3/AddNewClass3Form";
import AddNewClass4Form from "@/components/add-new-class-4/AddNewClass4Form";
import AddNewClassForm from "@/components/add-new-class/AddNewClassForm";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UpdateClass = () => {
  const { id } = useParams();

  const [activeStep, setActiveStep] = useState(1);
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/detail/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setData(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <AddNewClass2Form
            setActiveStep={setActiveStep}
            data={data}
            setData={setData}
          />
        );
      case 2:
        return (
          <AddNewClass3Form
            setActiveStep={setActiveStep}
            data={data}
            setData={setData}
          />
        );
      default:
        return <AddNewClass4Form setActiveStep={setActiveStep} data={data} />;
    }
  };

  return <div>{renderStep()}</div>;
};

export default UpdateClass;
