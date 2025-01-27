import { getContacts } from "@/app/actions";
import Contacts from "@/components/Contacts";
import GridExample from "@/components/GridExample";
import SearchInput from "@/components/SearchInput";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";


// Row Data Interface
interface Contact {
    id: any;
    first_name: any;
    last_name: any;
    contact_type: any;
  };

export default async function Page() {

       return (
        <div>
            <h1>Contact List</h1>
            <SearchInput />
        </div>
      );
}