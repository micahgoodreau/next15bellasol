import LeePaSearchInput from "@/components/LeePaSearchInput";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";


export default async function Page() {
      const supabase = await createClient();
    
      const {
        data: { user },
      } = await supabase.auth.getUser();

       return user ? (
        <div>
            <h1>LeePA List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <LeePaSearchInput />
            </Suspense>
        </div>
      ) : (<>Please sign in</>);
}