import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { Gender, UserRole } from "./user.constant";
import bcrypt from "bcrypt";

const isFilled = (val: any): boolean => {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim() !== "";
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object")
    return Object.keys(val).some((k) => isFilled(val[k]));
  return true;
};

const calculateProfileCompletion = (user: Partial<IUser>) => {
  if (!user.role) {
    return { percentage: 0, isComplete: false };
  }

  const commonFields = [
    user.name,
    user.dateOfBirth,
    user.gender,
    user.nationality,
    user.aboutMe,
    user.languages,
    user.phoneNumber,
    user.address?.city,
    user.address?.country,
  ];

  let roleSpecificFields: any[] = [];

  if (user.role === UserRole.Employee) {
    roleSpecificFields = [
      user.jobPreference,
      user.salaryExpectations,
      user.experience,
      user.education,
      user.skills,
    ];
  } else if (user.role === UserRole.Employer) {
    roleSpecificFields = [
      user.linkedinProfile,
      user.company?.name,
      user.company?.industry,
      user.company?.description,
      user.company?.website,
      user.company?.headQuarters,
    ];
  }

  const allFields = [...commonFields, ...roleSpecificFields];
  const totalFields = allFields.length;

  if (totalFields === 0) {
    return { percentage: 100, isComplete: true };
  }

  const filledFields = allFields.filter(isFilled).length;

  const percentage = Math.round((filledFields / totalFields) * 100);
  const isComplete = percentage === 100;

  return { percentage, isComplete };
};

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
    active: {
      type: Boolean,
      default: true,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
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

    company: {
      name: { type: String },
      industry: { type: String },
      companySze: { type: String },
      foundedYear: { type: String },
      website: { type: String },
      headQuarters: { type: String },
      description: { type: String },
      teamMembers: [{ type: String }],
      totalCompetitions: { type: Number },
    },

    hiringPreferences: [{ type: String }],

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

    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  const { percentage, isComplete } = calculateProfileCompletion(this);
  this.profileCompletionPercentage = percentage;
  this.isProfileComplete = isComplete;

  next();
});

userSchema.post("findOneAndUpdate", async function (doc, next) {
  if (!doc) {
    return next();
  }

  const update = this.getUpdate() as { $set?: Record<string, any> };
  if (update.$set) {
    const updateKeys = Object.keys(update.$set);
    const isOnlyCompletionUpdate =
      updateKeys.length > 0 &&
      updateKeys.every(
        (key) =>
          key === "profileCompletionPercentage" || key === "isProfileComplete"
      );

    if (isOnlyCompletionUpdate) {
      return next();
    }
  }

  const { percentage, isComplete } = calculateProfileCompletion(doc);

  if (
    doc.profileCompletionPercentage !== percentage ||
    doc.isProfileComplete !== isComplete
  ) {
    try {
      await this.model.findByIdAndUpdate(doc._id, {
        $set: {
          profileCompletionPercentage: percentage,
          isProfileComplete: isComplete,
        },
      });
    } catch (error) {
      console.error("Failed to update profile completion post-hook:", error);
    }
  }

  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>("User", userSchema);
