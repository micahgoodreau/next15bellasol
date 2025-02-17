import SearchParkingPermitRequests from "@/components/SearchParkingPermitRequests";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";


export default async function Page() {
      const supabase = await createClient();
    
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
       return user ? (
        <div>
            <h1>Parking Permit Requests List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <SearchParkingPermitRequests />
            </Suspense>
        </div>
      ) : (<>Please sign in</>);
}