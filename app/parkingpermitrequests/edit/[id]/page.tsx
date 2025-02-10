import { createClient } from "@/utils/supabase/server";

type Props = {
    params: {
        id: number,
    }
}

export default async function EditParkingRequestexport({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const id = (await params).id;
    const supabase = await createClient();
    const { data: requestData } = await supabase
      .from("parking_permit_requests")
      .select(`id,
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
        created_at,
        permit_status`)
      .match({ id })
      .single();

    if (!requestData) {
        return <div>Request not found</div>;
    }


    if (!requestData?.id) {
        return (
            <div className="p-8 max-w-md space-y-2">
                <h1 className="text-2xl">
                    No User Found for that ID.
                </h1>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-md space-y-2">
            <h1 className="text-2xl">Edit User {id}</h1>
            {/* <UserForm user={user} /> */}
        </div>
    )
}