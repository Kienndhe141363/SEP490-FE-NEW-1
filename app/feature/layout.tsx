"use client";

import {
  BookOpen,
  BookOpenText,
  CircleUser,
  GraduationCap,
  Home,
  Library,
  LogOut,
  MessagesSquare,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";
import { BASE_API_URL } from "@/config/constant";
import axios from "axios";
import useUserStore from "@/store/UserStore";

const Layout = ({ children }: { children: ReactNode }) => {
  const currentPath = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentUser = useUserStore(state => state.setUser)
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

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login"); // Chuyển hướng nếu không có token
      return;
    }

    axios
      .get(`${BASE_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { password, ...filteredData } = response.data;
        setCurrentUser(filteredData);
        setProfileData(response.data);
      })
      .catch(() => {
        router.push("/authen/login");
      })
      .finally(() => { });
  }, [router]);

  // Add event listeners for route changes
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  // Helper function to determine if the link is active
  const isActive = (path: string) => currentPath === path;

  const handleSignOut = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("jwt_token");
    // Redirect to login page or home
    router.push("/authen/login"); 
    
  };

  const role = useRole();

  return (
    <div className="flex min-h-screen">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-[228px] bg-[#6FBC44] fixed h-screen">
        <div className="p-10">
          <Image
            src="/assets/images/fpt-logo.png"
            alt="FPT Logo"
            width={150}
            height={50}
            className="mb-8"
          />
        </div>
        <nav className="text-white">
          <Link
            href="/"
            className={`flex items-center px-6 py-3 ${isActive("/") ? "bg-[#5da639]" : "hover:bg-[#5da639]"
              }`}
          >
            <Home className="w-6 h-6 mr-4" />
            <span className="font-bold">DashBoard</span>
          </Link>

          {role !== "ROLE_TRAINEE" && (
            <>
              <Link
                href="/feature/view-system-setting"
                className={`flex items-center px-6 py-3  ${isActive("/feature/view-system-setting")
                  ? "bg-[#5da639]"
                  : "hover:bg-[#5da639]"
                  }`}
              >
                <Settings className="w-6 h-6 mr-4" />
                <span className="font-bold">System Setting</span>
              </Link>

              <Link
                href="/feature/view-user-list"
                className={`flex items-center px-6 py-3 ${isActive("/feature/view-user-list")
                  ? "bg-[#5da639]"
                  : "hover:bg-[#5da639]"
                  }`}
              >
                <Users className="w-6 h-6 mr-4" />
                <span className="font-bold">User</span>
              </Link>

              <Link
                href="/feature/view-curriculum-list"
                className={`flex items-center px-6 py-3 ${isActive("/feature/view-curriculum-list")
                  ? "bg-[#5da639]"
                  : "hover:bg-[#5da639]"
                  }`}
              >
                <Library className="w-6 h-6 mr-4" />
                <span className="font-bold">Curriculum</span>
              </Link>

              <Link
                href="/feature/view-subject-list"
                className={`flex items-center px-6 py-3 ${isActive("/feature/view-subject-list")
                  ? "bg-[#5da639]"
                  : "hover:bg-[#5da639]"
                  }`}
              >
                <BookOpenText className="w-6 h-6 mr-4" />
                <span className="font-bold">Subject</span>
              </Link>
            </>
          )}

          <Link
            // href="/feature/view-class-list"
            href={`${role === "ROLE_TRAINEE"
              ? `/feature/view-class-detail/${profileData.userId}`
              : "/feature/view-class-list"
              }`}
            className={`flex items-center px-6 py-3 ${isActive("/feature/view-class-list")
              ? "bg-[#5da639]"
              : "hover:bg-[#5da639]"
              }`}
          >
            <GraduationCap className="w-6 h-6 mr-4" />
            <span className="font-bold text-base">Class</span>
          </Link>

          {role !== "ROLE_TRAINEE" && (
            <Link
              href="/feature/feedback-list"
              className={`flex items-center px-6 py-3 ${isActive("/feature/feedback-list")
                ? "bg-[#5da639]"
                : "hover:bg-[#5da639]"
                }`}
            >
              <MessagesSquare className="w-6 h-6 mr-4" />
              <span className="font-bold">Feedback</span>
            </Link>
          )}

          <Link
            href="/authen/view-profile"
            className={`flex items-center px-6 py-3  ${isActive("/authen/view-profile")
              ? "bg-[#5da639]"
              : "hover:bg-[#5da639]"
              }`}
          >
            <CircleUser className="w-6 h-6 mr-4" />
            <span className="font-bold">My Profile</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-6 py-3 hover:bg-[#5da639] text-left"
          >
            <LogOut className="w-6 h-6 mr-4" />
            <span className="font-bold">Sign out</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
