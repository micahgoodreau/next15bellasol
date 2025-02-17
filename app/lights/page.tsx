import SearchLightsInput from "@/components/SearchLights";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";


export default async function Page() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

       return user ? (
        <div>
            <h1>Street Lights List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <SearchLightsInput />
            </Suspense>
        </div>
      ) : (<>Please sign in</>);
}