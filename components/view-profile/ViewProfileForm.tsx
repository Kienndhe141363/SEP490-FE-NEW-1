"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/UserStore";
import { UploadButton } from "@/app/utils/uploadthing";
import { BASE_API_URL } from "@/config/constant";


const ViewProfileForm = () => {
  const [profileData, setProfileData] = useState<any>({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyPhone: "",
    roles: "",
    account: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const currentUser = useUserStore(state => state.user);
  const setCurrentUser = useUserStore(state => state.setUser);
  const setUserAvatarAction = useUserStore(state => state.updateAvatar);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // setAvatarUrl(imageUrl);
      // Upload logic can go here
    }
  };


  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login"); // Chuyển hướng nếu không có token
      return;
    }

    !currentUser && axios
      .get(`${BASE_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data);
        const { password, ...filteredData } = response.data;
        setCurrentUser(filteredData);
      })
      .catch(() => {
        router.push("/authen/login"); // Chuyển hướng nếu có lỗi
      })
      .finally(() => { });
  }, [router]);


  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-24 min-h-screen">
      <div className="bg-white rounded-[40px] p-8 max-w-[1066px] mx-auto">
        <div className="flex gap-8">
          {/* Profile Image Section */}
          <div className="w-[296px] flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-[130px] h-[130px] rounded-full bg-[#E5E5E5] overflow-hidden">
                <img src={currentUser?.imgAva}
                  alt="User avatar"
                  className="rounded-full object-cover"
                />
              </div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  if (res.length > 0) {
                    setUserAvatarAction(res[0].appUrl)
                  }
                }}
                onUploadError={(error: Error) => {
                  console.log(`ERROR! ${error.message}`);
                }}
              />


              <button
                className="absolute bottom-0 right-0 w-[25px] h-[25px] bg-[#FFBA34] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e5a82f] transition-colors"
              >
                <span className="text-white text-xs">📷</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <h3 className="font-bold text-xl mb-1">{profileData.account}</h3>
            <p className="text-[#6C757D]">{profileData.email}</p>
          </div>


          {/* Profile Information Section */}
          <div className="flex-1">
            <div className="border-b mb-8">
              <div className="flex gap-8 mb-[-2px]">
                <button className="px-4 py-2 font-bold text-[#41464B] border-b-4 border-[#6FBC44]">
                  User Profile
                </button>
                <button
                  onClick={() => {
                    router.push("/authen/change-password");
                  }}
                  className="px-4 py-2 font-bold text-[#41464B]"
                >
                  Change Password
                </button>
              </div>
            </div>


            <div className="px-4">
              {/* <h2 className="text-2xl font-bold mb-8">Profile Information</h2> */}


              <table className="min-w-full ">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">Full name</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.fullName}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">Date of Birth</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.dateOfBirth}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">Phone Number</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.phone}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">Address</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.address}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">
                      Emergency Number
                    </td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.emergencyPhone}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-black font-bold">Role</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.roles}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end mt-8">
                <Button className="bg-[#6FBC44] text-white hover:bg-[#5da639] px-8 py-2 rounded-lg font-semibold shadow-md">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ViewProfileForm;
