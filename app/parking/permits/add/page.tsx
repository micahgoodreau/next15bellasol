import { AddParkingPermitForm } from "@/components/add-parking-permit-form";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
    const supabase = await createClient();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user ? (
        <div>
            Add Parking Permit
        </div>
      ) : (<>Please sign in</>);
}