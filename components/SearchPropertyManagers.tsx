"use client";

import { getContacts, getPropertyManagers } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'; 
import type { ColDef } from "ag-grid-community";



ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface Contact {
  id: any;
  first_name: any | null;
  last_name: any | null;
  contact_type: any | null;
};
interface IResults { contacts: Contact[]};

const myTheme = themeQuartz.withParams({
  "spacing": 4,
  "backgroundColor": "#1e1e1e",
  "textColor": "#f0f0f0",
  "accentColor": "#268bd2",
  "rowBorder": "#f0f0f0",
  "oddRowBackgroundColor": "#2e2e2e",
});

const SearchPropertyManagers = () => {
  const [data, setData] = useState<{ id: any; first_name: any; last_name: any; contact_type: any; }[]  | null>();
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();
    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<Contact>[]>([
      { field: "first_name" },
      { field: "last_name" },
      { field: "contact_type" },
    ]);
  
    const defaultColDef: ColDef = {
      flex: 1,
    };

        const initialSearch = async () => {
          const searchResults = await getPropertyManagers("");
          setData(searchResults);
          return;
      };
    
        useEffect(() => {
            initialSearch();
        }, []);
  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }
    const searchResults = await getContacts(searchQuery || "");
    setData(searchResults);

    //const encodedSearchQuery = encodeURI(searchQuery);
    //router.push(`/contact/search?q=${encodedSearchQuery}`);
    return;
  };

  return (
    <>
    <form onSubmit={onSearch} className="flex justify-center w-2/3 pb-5">
      <input
        value={searchQuery || ""}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-zinc-200 bg-zinc-800 focus:bg-black rounded-full focus:outline-none focus:ring-[1px] focus:ring-green-700 placeholder:text-zinc-400"
        placeholder="What are you looking for?"
      />
    </form>
    {/* <pre>{JSON.stringify(data , null, 2)}</pre>*/}
    <Suspense fallback={<div>Loading...</div>}>
    <div style={{ width: "50vw", height: "70vh" }}>
      <AgGridReact
        theme={myTheme}
        rowData={data}
        columnDefs={colDefs}
        
      />
    </div>
    </Suspense>
    </>
  );
};

export default SearchPropertyManagers;