import { z } from "zod";
import * as zfd from "zod-form-data";

export const ParkingPermitRequestSchema = z.object({
  admin_notes: z.string().nullable(),
  contact_email: z.string().nullable(),
  contact_phone: z.string().nullable(),
  created_at: z.string(),
  first_name: z.string().nullable(),
  id: zfd.numeric(),
  last_name: z.string().nullable(),
  permit_number: z.string().nullable(),
  permit_status: z.string().nullable(),
  request_notes: z.string().nullable(),
  unit_number: z.string().nullable(),
  updated_at: z.string().nullable(),
  updated_by: z.string().nullable(),
  vehicle_color: z.string().nullable(),
  vehicle_make: z.string().nullable(),
  vehicle_model: z.string().nullable(),
  vehicle_plate_number: z.string().nullable(),
  vehicle_plate_state: z.string().nullable(),
  vehicle_year: z.string().nullable(),
});

export type ParkingPermitRequest = z.infer<typeof ParkingPermitRequestSchema>;


/*
unit_number: z.string(),
  first_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  last_name: zfd.text(z.string().min(2, "Too short").max(20, "Too long")),
  contact_type: z.string().nullable(),
  phone_number: z.string().nullable(),
  email_address: z.string().nullable(),
  permit_number: z.string(),
  vehicle_make: z.string().nullable(),
  vehicle_model: z.string().nullable(),
  vehicle_color: z.string().nullable(),
  vehicle_year: z.string().nullable(),
  vehicle_plate: z.string(),
  vehicle_plate_state: z.string(),
  */