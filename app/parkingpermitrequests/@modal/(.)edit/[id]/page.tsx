import { createClient } from "@/utils/supabase/server";
import React from "react";
import { Modal } from "@/components/Modal";
import { getUser } from "@/lib/getUser";
import ApproveParkingRequest2 from "@/components/approve-parking-request2";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {

    const parkingPermitRequestId = (await params).id;
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
        admin_notes,
        updated_at,
        updated_by,
        permit_number,
        permit_status,
        request_notes`)
      .match({ id: parkingPermitRequestId })
      .single();

    if (!requestData) {
        return <div>Request not found</div>;
    }
    const user = await getUser(parseInt(parkingPermitRequestId));

    if (!user?.id) {
        return (
            <div className="p-8 max-w-md space-y-2">
                <h1 className="text-2xl">
                    No User Found for that ID.
                </h1>
            </div>
        )
    }

    return (
      <Modal>
            <div className="max-w-md space-y-2 p-8">
            <h1>Parking Permit Request Detail</h1>
              <ApproveParkingRequest2 parkingPermitRequest={requestData} />
            </div>
            </Modal>
      );
    }