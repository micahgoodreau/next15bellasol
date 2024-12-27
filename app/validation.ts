import { zfd } from "zod-form-data";
import { z } from "zod";

export const addEmailAddressFormSchema = zfd.formData({
  contact_id: zfd.text(),
  email_address: zfd.text(z.string().min(2, "Too short").max(50, "Too long")),
});

export const addPhoneNumberFormSchema = zfd.formData({
  contact_id: zfd.text(),
  phone_number: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  phone_type: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
});

export const addLeaseFormSchema = zfd.formData({
  property_id: zfd.text(),
  start_date: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  end_date: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
});

export const addContactFormSchema = zfd.formData({
  property_id: zfd.text(),
  first_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  last_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  business_name: zfd.text(),
  contact_type: zfd.text(),
});

export const addressSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(1, 'Country is required'),
});