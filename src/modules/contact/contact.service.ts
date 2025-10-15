import { IContact } from "./contact.interface";
import { Contact } from "./contact.models";

const getAllContact = async () => {
  return await Contact.findOne().lean();
};

const updateContact = async (id: string, payload: Partial<IContact>) => {
  return await Contact.findByIdAndUpdate(id, payload, { new: true });
};

export const contactService = {
  getAllContact,
  updateContact,
};
