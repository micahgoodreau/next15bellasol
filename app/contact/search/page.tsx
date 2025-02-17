import SearchInput from "@/components/SearchInput";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";


// Row Data Interface
interface Contact {
    id: any;
    first_name: any;
    last_name: any;
    contact_type: any;
  };

export default async function Page() {
      const supabase = await createClient();
    
      const {
        data: { user },
      } = await supabase.auth.getUser();

       return user ? (
        <div>
            <h1>Contact List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <SearchInput />
            </Suspense>
        </div>
      ) : (<>Please sign in</>);
}