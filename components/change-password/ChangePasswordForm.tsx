"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ChangePasswordSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/custom/form-error";
import { FormSuccess } from "@/components/custom/form-success";
import {
  Home,
  BookOpen,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isViewPassword, setIsViewPassword] = useState<boolean>(true);
  const router = useRouter();
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await axios.put(
          "http://3.82.112.209:8080/api/v1/auth/change-password",
          values,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        toast.success("Password changed successfully!");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || "An error occurred.");
        } else {
          toast.error("An unknown error occurred.");
        }
      }
    });
  };
  const [profileData, setProfileData] = useState<any>({
    email: "",
    account: "",
  });
  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login"); // Chuyển hướng nếu không có token
      return;
    }

    // Gọi API để lấy thông tin người dùng
    axios
      .get("http://3.82.112.209:8080/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data);
      })
      .catch(() => {
        router.push("/authen/login"); // Chuyển hướng nếu có lỗi
      })
      .finally(() => {

      });
  }, [router]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}

      <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-24">
        <div className="bg-white rounded-[40px] p-8 max-w-[1066px] mx-auto">
          <div className="flex gap-8">
            <div className="w-[296px] flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-[130px] h-[130px] rounded-full bg-[#E5E5E5] overflow-hidden">
                  <Image
                    src="/assets/images/default-avatar.png"
                    alt="User avatar"
                    width={130}
                    height={130}
                    className="rounded-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-[25px] h-[25px] bg-[#FFBA34] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📷</span>
                </button>
              </div>
              <h3 className="font-bold text-xl mb-1">{profileData.account}</h3>
              <p className="text-[#6C757D]">{profileData.email}</p>
            </div>
            <div className="flex-1">
              <div className="border-b mb-8">
                <div className="flex gap-8 mb-[-2px]">
                  <button
                    onClick={() => {
                      router.push("/authen/view-profile");
                    }}
                    className="px-4 py-2 font-bold text-[#41464B] "
                  >
                    User Profile
                  </button>
                  <button className="px-4 py-2 font-bold text-[#41464B] border-b-4 border-[#6FBC44]">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="form w-full flex flex-col items-center justify-center">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col items-center mt-8"
                  >
                    <FormField
                      control={form.control}
                      name="oldPassword"
                      render={({ field }) => (
                        <FormItem className="w-full mt-4">
                          <FormLabel className="text-lg font-semibold">
                            Old Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Enter your password"
                                type={isViewPassword ? "password" : "text"}
                                className="h-14 border-gray-700 w-full "
                              />
                              {isViewPassword ? (
                                <EyeOff
                                  onClick={() => setIsViewPassword(false)}
                                  className="text-crusta absolute right-2 top-4 z-50 w-5"
                                />
                              ) : (
                                <Eye
                                  onClick={() => setIsViewPassword(true)}
                                  className="text-crusta absolute right-2 top-4 z-50 w-5"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className=" w-full mt-4">
                          <FormLabel className="text-lg font-semibold">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Enter your password"
                                type={isViewPassword ? "password" : "text"}
                                className="h-14 border-gray-700 w-full "
                              />
                              {isViewPassword ? (
                                <EyeOff
                                  onClick={() => setIsViewPassword(false)}
                                  className="text-crusta absolute right-2 top-4 z-50 w-5"
                                />
                              ) : (
                                <Eye
                                  onClick={() => setIsViewPassword(true)}
                                  className="text-crusta absolute right-2 top-4 z-50 w-5"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className=" w-full mt-4">
                          <FormLabel className="text-lg font-semibold">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Confirm your password"
                                type={isViewPassword ? "password" : "text"}
                                className="h-14 border-gray-700 w-full "
                              />
                              {isViewPassword ? (
                                <EyeOff
                                  onClick={() => setIsViewPassword(false)}
                                  className="text-crusta absolute right-2 top-4 z-50 w-5"
                                />
                              ) : (
                                <Eye
                                  onClick={() => setIsViewPassword(true)}
                                  className="text-crusta absolute right-2 top-4 z-50 w-5"
                                />
                              )}
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className="flex lg:w-7/12 w-10/12 h-14 items-center justify-center">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="mt-10  bg-lightgreen font-bold shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-lightgreen p-7 py-6 "
                      >
                        Change
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

