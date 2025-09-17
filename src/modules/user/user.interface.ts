import { Types } from "mongoose";
import { Gender, UserRole } from "./user.constant";

export interface IUser {
  _id: Types.ObjectId;
  deviceTokens: string[];

  email: string;
  password: string;
  role: UserRole;
  verified: boolean;
  name: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  nationality?: string | null;
  aboutMe?: string | null;
  languages: string[];
  address?: {
    homeAddress?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipCode?: string | null;
  };
  phoneNumber?: string | null;

  // For employer
  linkedinProfile?: string | null;
  personalWebsite?: string | null;

  company?: {
    name?: string;
    industry?: string;
    companySze?: string;
    foundedYear?: string;
    website?: string;
    headQuarters?: string;
    description?: string;
    teamMembers?: string[];
    totalCompetitions?: number;
  };
  hiringPreferences?: string[];

  // For Employee
  jobPreference?: string | null;
  salaryExpectations?: string | null;
  experience: {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    jobDescription?: string;
  }[];

  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    grade?: string;
    startYear: string;
    endYear: string;
    description?: string;
  }[];
  skills: string[];

  profileCompletionPercentage: number;
  isProfileComplete: boolean;
}
