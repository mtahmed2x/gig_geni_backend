import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { Gender, UserRole } from "./user.constant";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    companyName: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String, enum: Object.values(Gender) },
    nationality: { type: String },
    aboutMe: { type: String },
    salaryExpectations: { type: String },
    jobPreference: { type: String },
    languages: { type: [String], default: [] },

    phoneNumber: { type: String },
    linkedinProfile: { type: String },
    personalWebsite: { type: String },
    address: {
      homeAddress: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },

    experience: [
      {
        company: { type: String },
        jobTitle: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        currentlyWorking: { type: Boolean, default: false },
        jobDescription: { type: String },
      },
    ],

    education: [
      {
        institution: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        grade: { type: String },
        startYear: { type: String },
        endYear: { type: String },
        description: { type: String },
      },
    ],

    skills: { type: [String], default: [] },
    deviceTokens: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>("User", userSchema);
