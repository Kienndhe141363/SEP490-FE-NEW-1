"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import { BASE_API_URL } from "@/config/constant";
import useUserStore from "@/store/UserStore";
import toast from "react-hot-toast";

interface User {
  userId: number;
  fullName: string;
  email: string;
  roles: string;
  role: string;
  phone: string;
  status: true | false;
  account: string;
}

const ViewUserListForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // Start with page 0
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>(""); // For Status filter
  const [roleFilter, setRoleFilter] = useState<string>(""); // For Role filter
  const currentUser = useUserStore((state) => state.user);

  const fetchUsers = async (page = 0) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_API_URL}/user/management/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, searchTerm },
      });

      const userData = response?.data?.users;
      if (Array.isArray(userData)) {
        setUsers(userData);
        setTotalPages(response.data.totalPages || 1); // Set total pages based on response
      } else {
        console.error("Data received is not an array:", userData);
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      setError("Error fetching users");
      console.error("Error fetching users:", err);
      setUsers([]);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/authen/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_API_URL}/user/search`,
        {
          keyword: `%${searchTerm}%`, // Từ khóa tìm kiếm
          status: statusFilter ? statusFilter === "true" : undefined, // Trạng thái (true/false hoặc undefined)
          roles: roleFilter || undefined, // Vai trò (hoặc undefined nếu không chọn)
          pageable: {
            page: currentPage,
            size: 10, // Số lượng item mỗi trang
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response?.data?.data?.dataSource;
      console.log(response?.data?.data?.dataSource);
      if (!Array.isArray(userData)) {
        console.error("Unexpected data format:", response.data);
        setError("Unexpected data format received from API");
        setUsers([]);
        return;
      }

      setUsers(userData.sort((a, b) => a.userId - b.userId));
      setTotalPages(Math.ceil((response.data.data.totalCount || 1) / 10)); // Tính tổng số trang
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("No results found for your search");
        } else if (err.response?.status === 401) {
          router.push("/authen/login");
        } else {
          setError("An error occurred while searching");
        }
      } else {
        setError("Unexpected error occurred");
      }
      console.error("Search error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: number) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      const user = users.find((u) => u.userId === userId);
      if (!user) return;

      const newStatus = !user.status;

      await axios.post(
        `${BASE_API_URL}/user/management/status/${userId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, status: newStatus } : user
        )
      );

      // Show success toast
      toast.success(`Update user status successfully!`);
    } catch (err) {
      setError("Error updating user status");
      console.error("Error updating user status:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/authen/login");
      }

      // Show error toast
      toast.error("Failed to update user status");
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    fetchUsers(page);
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are within the max visible range
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // If there are many pages, show a subset with ellipses
      if (currentPage > 2) {
        pageButtons.push(
          <button
            key={0}
            onClick={() => handlePageChange(0)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            1
          </button>
        );
        if (currentPage > 3) {
          pageButtons.push(
            <span key="left-ellipsis" className="px-2">
              ...
            </span>
          );
        }
      }

      // Display pages around the current page
      for (
        let i = Math.max(0, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }

      // Add ellipses and last page if the current page is far from the last page
      if (currentPage < totalPages - 3) {
        if (currentPage < totalPages - 4) {
          pageButtons.push(
            <span key="right-ellipsis" className="px-2">
              ...
            </span>
          );
        }
        pageButtons.push(
          <button
            key={totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageButtons;
  };
  const downloadTemplate = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }
  
    try {
      const response = await axios.get(`${BASE_API_URL}/user/management/export-template`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Quan trọng để tải file
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "UserTemplate.xlsx"); // Đặt tên file
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      toast.success("Template downloaded successfully!");
    } catch (err) {
      console.error("Error downloading template:", err);
      toast.error("Failed to download template");
    }
  };
  
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }
  
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`${BASE_API_URL}/user/management/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Reload users after successful import
      fetchUsers(currentPage);
      toast.success("File imported successfully!");
    } catch (err) {
      console.error("Error importing file:", err);
      toast.error("Failed to import file");
    }
  };
  
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    searchUsers(new Event("submit") as unknown as React.FormEvent); // Gọi lại searchUsers khi thay đổi bộ lọc//-
  }, [statusFilter, roleFilter]);

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-8 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-6xl font-bold">User List</h2>
        <div className="flex space-x-4">
  <form onSubmit={searchUsers} className="flex space-x-4">
    <input
      type="text"
      placeholder="Search..."
      className="border px-3 py-1 rounded"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button
      type="submit"
      className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
      disabled={loading}
    >
      {loading ? "Searching..." : "Search"}
    </button>
  </form>

  <button
    className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
    onClick={() => router.push("/feature/add-user")}
  >
    +Add New User
  </button>

  <button
    className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
    onClick={() => downloadTemplate()}
  >
    Download Template
  </button>

  <label
    className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639] cursor-pointer"
  >
    Import
    <input
      type="file"
      onChange={handleImportFile}
      className="hidden"
    />
  </label>
</div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          {error}
        </div>
      )}
      <div className="flex space-x-4 mt-4">
        {/* Status Filter */}
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Role Filter */}
        <select
          className="border px-3 py-2 rounded "
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
          <option value="ROLE_MANAGER">ROLE_MANAGER</option>
          <option value="ROLE_CLASS_ADMIN">ROLE_CLASS_ADMIN</option>
          <option value="ROLE_TRAINER">ROLE_TRAINER</option>
          <option value="ROLE_TRAINEE">ROLE_TRAINEE</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <table className="w-full mt-10 table-auto border-collapse rounded py-5">
            <thead>
              <tr className="bg-[#6FBC44] text-white">
                <th className="px-6 py-3 uppercase tracking-wider border-r-white">
                  #
                </th>
                <th className="px-6 py-3 text-left uppercase tracking-wider border-r-white">
                  Account
                </th>
                <th className="px-6 py-3 text-left uppercase tracking-wider border-r-white">
                  Role
                </th>
                <th className="px-6 py-3 text-left uppercase tracking-wider border-r-white">
                  Email
                </th>
                <th className="px-6 py-3 text-center uppercase tracking-wider border-r-white">
                  Phone number
                </th>
                <th className="px-6 py-3 text-center uppercase tracking-wider border-r-white">
                  Status
                </th>
                <th className="px-6 py-3 text-center uppercase tracking-wider border-r-white">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((e) => e.userId != currentUser?.userId)
                .map((user, index) => (
                  <tr
                    key={user.userId}
                    className={user.status === false ? "bg-green-300" : ""}
                  >
                    <td className="border px-6 py-3 text-center">
                      {user.userId}
                    </td>
                    <td className="border px-6 py-3 text-left">
                      {user.account}
                    </td>
                    <td className="border px-6 py-3 text-left">
                      {user.roles || user.role || "No Role"}
                    </td>
                    <td className="border px-6 py-3 text-left">{user.email}</td>
                    <td className="border px-6 py-3 text-center">
                      {user.phone}
                    </td>
                    <td className="border px-6 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          onClick={() => handleToggleStatus(user.userId)}
                          className={`flex h-6 w-12 cursor-pointer rounded-full border border-black ${
                            user.status
                              ? "justify-end bg-green-500"
                              : "justify-start bg-black"
                          } px-[1px]`}
                        >
                          <motion.div
                            className="h-5 w-5 rounded-full bg-white"
                            layout
                            transition={{
                              type: "spring",
                              stiffness: 700,
                              damping: 30,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="border px-6 py-3 justify-center-center">
                      <div className="flex justify-center">
                        <Link href={`/feature/view-user-detail/${user.userId}`}>
                          <FiEdit className="w-6 h-6 text-green-600 hover:text-green-800" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination mt-4 flex align-middle w-[100%] justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              &lt;
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewUserListForm;
