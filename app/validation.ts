import { zfd } from "zod-form-data";
import { z } from "zod";

export const addEmailAddressFormSchema = zfd.formData({
  contact_id: zfd.text(),
  email_address: zfd.text(z.string().min(2, "Too short").max(50, "Too long")),
});

export const linkContactPropertyFormSchema = zfd.formData({
  contact_id: zfd.text(),
  unit_number: zfd.text(z.string().min(3, "Too short").max(4, "Too long")),
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
export const editContactFormSchema = zfd.formData({
  first_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  last_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  business_name: zfd.text(),
  contact_type: zfd.text(),
  contact_id: zfd.text(),
});
export const addressSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(1, 'Country is required'),
});
export const addParkingPermitFormSchema = zfd.formData({
  unit_number: zfd.text(),
  first_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  last_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  contact_type: zfd.text().nullable(),
  phone_number: zfd.text().nullable(),
  email_address: zfd.text().nullable(),
  permit_number: zfd.text(),
  vehicle_make: zfd.text().nullable(),
  vehicle_model: zfd.text().nullable(),
  vehicle_color: zfd.text().nullable(),
  vehicle_year: zfd.text().nullable(),
  vehicle_plate: zfd.text(),
  vehicle_plate_state: zfd.text(),
});

export const addTestFormSchema = z.object({
  contact_type: z.union([
    z.literal("OWNER"),
    z.literal("OWNER GUEST/RELATIVE"),
    z.literal("TENANT"),
    z.literal("PROPERTY MANAGER"),
  ]),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  business_name: z.string(),
  property_id: z.string(),
})

export const testSchema = z.object({
  first_name: z.string().min(1, 'Street address is required'),
  last_name: z.string().optional(),
  business_name: z.string().min(1, 'City is required'),
  contact_type: z.string().min(1, 'State is required'),
  property_id: z.string().min(5, 'ZIP code must be at least 5 characters'),
});