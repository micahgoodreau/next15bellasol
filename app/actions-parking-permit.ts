"use server";
import { flattenValidationErrors } from "next-safe-action"
import { UserSchema } from "../schemas/User";
import { actionClient } from "@/lib/safe-action";
import { ParkingPermitRequestSchema } from "@/schemas/ParkingPermitRequest";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const saveUserAction = actionClient
    .schema(UserSchema, {
        handleValidationErrorsShape: async (ve) => Promise.resolve(flattenValidationErrors(ve).fieldErrors),
    })
    .action(async ({ parsedInput: { id, firstname, lastname, email } }) => {

        await fetch(`http://localhost:3500/users/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
            })
        })

        //throw new Error("Dave Error")

        return { message: `${firstname} Updated! 🎉` }
    })

export const saveParkingPermitRequestAction = actionClient
    .schema(ParkingPermitRequestSchema, {
        handleValidationErrorsShape: async (ve) => Promise.resolve(flattenValidationErrors(ve).fieldErrors),
    })
    .action(async ({ parsedInput: { id,
        first_name,
        last_name,
        unit_number,
        contact_phone,
        contact_email,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        vehicle_year,
        vehicle_plate_number,
        vehicle_plate_state,
        admin_notes,
        permit_number,
        permit_status   
    } }) => {

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const updated_by = user?.id || "";
    const { data, error } = await supabase.from("parking_permit_requests").update( {
      first_name,
        last_name,
        unit_number,
        contact_phone,
        contact_email,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        vehicle_year,
        vehicle_plate_number,
        vehicle_plate_state,
        admin_notes,
        permit_number,
        permit_status,
      updated_by,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

        //throw new Error("Dave Error")
    revalidatePath("/parkingpermitrequests", "page")
    return { message: `Parking Permit Request Updated! 🎉` }
})