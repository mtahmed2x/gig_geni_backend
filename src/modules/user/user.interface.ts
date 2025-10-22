import { Types } from "mongoose";
import { Gender, UserRole } from "./user.constant";

export interface IUser {
  _id: Types.ObjectId;

  email: string;
  password: string;
  role: UserRole;
  name: string;
  verified: boolean;
  active: boolean;
  suspended: boolean;
  deviceTokens: string[];

  // mandatory for all users
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  nationality?: string | null;
  address?: {
    homeAddress?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipCode?: string | null;
  };

  aboutMe?: string | null;
  languages?: string[];

  // For employer
  company?: {
    name?: string;
    industry?: string;
    description?: string;
    website?: string;
    headQuarters?: string;
    companySze?: string;
    foundedYear?: string;
  };
  hiringPreferences?: string[];

  // For Employee
  skills: string[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    grade?: string;
    startYear: string;
    endYear: string;
    description?: string;
  }[];
  experience: {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    jobDescription?: string;
  }[];
  jobPreference?: string | null;
  salaryExpectations?: string | null;
  linkedinProfile?: string | null;
  personalWebsite?: string | null;

  profileCompletionPercentage: number;
  isProfileComplete: boolean;
}
