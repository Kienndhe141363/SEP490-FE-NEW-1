import { useState } from "react";

type Props = {
  id: any;
  data: any;
};

const ClassInfo = ({ id, data }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      {/* tôi muốn hiển thị label và input nằm ngang như trong file figma  */}
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Class Code:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.classCode}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Class Admin:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.admin}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Location:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.locationName}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">
          Plan Trainee No:
        </label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.planTraineeNo}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Start Date:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.startDate}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">End Date:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.endDate}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Supplier:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.supplier}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Curriculum:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.curriculumName}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Trainee No:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          // value={data?.admin}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Generation:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          // value={data?.admin}
          readOnly
        />
      </div>
      <div className="flex items-center">
        <label className="block text-lg font-medium w-48">Description:</label>
        <input
          type="text"
          className="w-full h-10 px-3"
          value={data?.descriptions}
          readOnly
        />
      </div>
    </div>
  );
};

export default ClassInfo;
