"use client";

import { getContacts, getParkingPermits } from "@/app/actions";
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
interface IParkingPermit {
  contact_type: string | null
  created_at: string
  created_by: string | null
  email_address: string | null
  first_name: string | null
  id: number
  last_name: string | null
  permit_number: string
  phone_number: string | null
  unit_number: string
  vehicle_color: string | null
  vehicle_make: string | null
  vehicle_model: string | null
  vehicle_plate: string
  vehicle_plate_state: string | null
  vehicle_year: string | null
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

const SearchParkingPermits = () => {
  const [data, setData] = useState<IParkingPermit[]  | null>();
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();
    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<IParkingPermit>[]>([
        { field: "permit_number" },
        { field: "vehicle_plate" },
        { field: "unit_number" },
        { field: "vehicle_make" },
        { field: "vehicle_model" },
        { field: "vehicle_color" },
      ]);
  
    const defaultColDef: ColDef = {
      flex: 1,
    };


    const initialSearch = async () => {
        const searchResults = await getParkingPermits("");
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
    const searchResults = await getParkingPermits(searchQuery || "");
    if (searchResults) {
        setData(searchResults);
    }

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

export default SearchParkingPermits;