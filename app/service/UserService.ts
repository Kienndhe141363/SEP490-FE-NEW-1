import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";

export const fetchClassAdmin = async () => {
  const token = getJwtToken();

  const adminsResponse = await axios.get(
    `${BASE_API_URL}/user/management/list`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  //@ts-ignore
  const fetchedAdmin = adminsResponse?.data?.users.filter((user) => user.roles.includes('ROLE_CLASS_ADMIN'));
  return fetchedAdmin

}
