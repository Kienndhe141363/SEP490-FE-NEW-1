export type UserType = {
  userId: number;
  fullName: string;
  email: string;
  imgAva: string | null; // nullable string
  phone: string;
  emergencyPhone: string | null; // nullable string
  dateOfBirth: string | null; // nullable string (consider using Date type if needed)
  createdDate: string;
  address: string | null; // nullable string
  account: string;
  password: string; // for security reasons, consider not including password in the type
  roles: string[];
  status: boolean;
}
