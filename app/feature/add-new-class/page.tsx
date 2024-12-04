"use client";

import AddNewClass2Form from "@/components/add-new-class-2/AddNewClass2Form";
import AddNewClass3Form from "@/components/add-new-class-3/AddNewClass3Form";
import AddNewClass4Form from "@/components/add-new-class-4/AddNewClass4Form";
import AddNewClassForm from "@/components/add-new-class/AddNewClassForm";
import React, { useState } from "react";

const AddNewClass = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState({});

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <AddNewClassForm setActiveStep={setActiveStep} setData={setData} />
        );
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

export default AddNewClass;
