import { useState, useEffect } from "react";

const useRole = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("role");
      setRole(updatedRole);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return role;
};

export default useRole;
