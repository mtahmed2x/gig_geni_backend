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
    companyName: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    gender: { type: String, enum: Object.values(Gender), default: null },
    nationality: { type: String, default: null },
    aboutMe: { type: String, default: null },
    salaryExpectations: { type: String, default: null },
    jobPreference: { type: String, default: null },
    languages: { type: [String], default: [] },

    phoneNumber: { type: String, default: null },
    linkedinProfile: { type: String, default: null },
    personalWebsite: { type: String, default: null },
    address: {
      homeAddress: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      zipCode: { type: String, default: null },
    },

    experience: {
      type: [
        {
          company: { type: String },
          jobTitle: { type: String },
          startDate: { type: String },
          endDate: { type: String },
          currentlyWorking: { type: Boolean, default: false },
          jobDescription: { type: String },
        },
      ],
      default: [],
    },
    education: {
      type: [
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
      default: [],
    },

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
