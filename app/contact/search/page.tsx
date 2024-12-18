import { getContacts } from "@/app/actions";
import Contacts from "@/components/Contacts";
import GridExample from "@/components/GridExample";
import SearchInput from "@/components/SearchInput";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default async function Page() {

    //const search = useSearchParams();
    const searchQuery = "micah";  //search ? search.get("q") : null;
    //const router = useRouter();
  
    //const encodedSearchQuery = encodeURI(searchQuery || "");

    const searchResults = await getContacts("micah");



const ValidSearchResult = (results: any) => {
    return (
        <pre>{JSON.stringify(results , null, 2)}</pre>
    );
  }; 


      return (
        <div>
            <h1>Contact List</h1>
            <SearchInput />
            <ValidSearchResult results={searchQuery ? searchResults : null} />
            <GridExample />
        </div>
      );
}