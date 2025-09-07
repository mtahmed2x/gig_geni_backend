import { Types } from "mongoose";
import { Gender, UserRole } from "./user.constant";

export interface IUser {
  _id: Types.ObjectId;

  email: string;
  password: string;
  role: UserRole;
  verified: boolean;

  name: string;
  companyName: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  aboutMe: string;
  salaryExpectations: string;
  jobPreference: string;
  languages: string[];

  phoneNumber?: string;
  linkedinProfile?: string;
  personalWebsite?: string;
  address?: {
    homeAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  experience: {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    jobDescription: string;
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

  deviceTokens: string[];
}
