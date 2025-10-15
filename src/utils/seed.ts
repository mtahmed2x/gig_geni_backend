import { config } from "../config";
import { Contact } from "../modules/contact/contact.models";
import { PrivacyPolicy } from "../modules/privacyPolicy/privacyPolicy.models";
import { TermsAndConditions } from "../modules/termsAndConditions/termsAndConditions.models";
import { UserRole } from "../modules/user/user.constant";
import { User } from "../modules/user/user.models";

export const bootstrapAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: UserRole.Admin });

    if (!adminExists) {
      await User.create({
        email: config.admin.email,
        password: config.admin.password,
        role: UserRole.Admin,
        verified: true,
        name: "Admin",
      });
      console.log("🚀 Admin user bootstrapped successfully!");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error bootstrapping admin user:", error);
  }
};

export const bootstrapContact = async () => {
  try {
    const contactExists = await Contact.findOne({});

    if (!contactExists) {
      await Contact.create({});
      console.log("🚀 Contact bootstrapped successfully!");
    } else {
      console.log("✅ Contact already exists");
    }
  } catch (error) {
    console.error("❌ Error bootstrapping contact:", error);
  }
};

export const bootstrapTermsAndConditions = async () => {
  try {
    const termsExists = await TermsAndConditions.findOne({});
    if (!termsExists) {
      await TermsAndConditions.create({});
      console.log("🚀 Terms and Condtions bootstrapped successfully!");
    } else {
      console.log("✅ Terms and Condtions already exists");
    }
  } catch (error) {
    console.error("❌ Error bootstrapping Terms and Condtions:", error);
  }
};

export const bootstrapPrivacyPolicy = async () => {
  try {
    const policyExists = await PrivacyPolicy.findOne({});

    if (!policyExists) {
      await PrivacyPolicy.create({});
      console.log("🚀 Privacy Policy bootstrapped successfully!");
    } else {
      console.log("✅ Privacy Policy already exists");
    }
  } catch (error) {
    console.error("❌ Error bootstrapping Privacy Policy:", error);
  }
};
