"use client";

import { getContacts, getLeepa, getParkingPermitRequests } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'; 
import type { ColDef } from "ag-grid-community";
import type { Database } from "@/database.types";


ModuleRegistry.registerModules([AllCommunityModule]);

interface parkingpermitrequests {
    admin_notes: string | null
    contact_email: string | null
    contact_phone: string | null
    created_at: string
    first_name: string | null
    id: number
    last_name: string | null
    permit_number: string | null
    permit_status: string | null
    request_notes: string | null
    unit_number: string | null
    updated_at: string | null
    updated_by: string | null
    vehicle_color: string | null
    vehicle_make: string | null
    vehicle_model: string | null
    vehicle_plate_number: string | null
    vehicle_plate_state: string | null
    vehicle_year: string | null
  }

//interface IResults { parkingpermitrequests: Database['public']['Tables']['parking_permit_requests']['Row'][] };

const myTheme = themeQuartz.withParams({
  "spacing": 4,
  "backgroundColor": "#1e1e1e",
  "textColor": "#f0f0f0",
  "accentColor": "#268bd2",
  "rowBorder": "#f0f0f0",
  "oddRowBackgroundColor": "#2e2e2e",
});

const SearchParkingPermitRequests = () => {
  const [data, setData] = useState<parkingpermitrequests[]  | null >();
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  console.log(searchQuery);
  const router = useRouter();
    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<parkingpermitrequests>[]>([
      { field: "unit_number", width: 100 },
      { field: "first_name" },
      { field: "last_name", headerName: "Last Name", editable: true },
      { field: "contact_phone", headerName: "Phone" },
      { field: "contact_email", headerName: "Email" },
      { field: "vehicle_plate_number", headerName: "Plate", editable: true },
      { field: "vehicle_plate_state", headerName: "State", editable: true },
      { field: "vehicle_make", headerName: "Make", editable: true },
      { field: "vehicle_model", headerName: "Model", editable: true },
      { field: "vehicle_color", headerName: "Color", editable: true },
      { field: "vehicle_year", headerName: "Year", editable: true },
      { field: "created_at", headerName: "Created At", editable: true },
      { field: "permit_status", headerName: "Status", editable: true },
  ]);

  
    const defaultColDef: ColDef = {
      flex: 1,
    };
    const initialSearch = async () => {
      const searchResults = await getParkingPermitRequests(searchQuery || "");
      searchResults ? setData(searchResults) : setData(null);
      return;
  };

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }
    const searchResults = await getParkingPermitRequests(searchQuery || "");
    searchResults ? setData(searchResults) : setData(null);

    //const encodedSearchQuery = encodeURI(searchQuery);
    //router.push(`/contact/search?q=${encodedSearchQuery}`);
    return;
  };
  useEffect(() => {
    initialSearch();
  }, []);
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
        onRowClicked={(event) => {console.log(event.data?.id); router.push(`/parkingpermitrequests/edit/${event.data?.id}`)}}
        
      />
    </div>
    </Suspense>
    </>
  );
};

export default SearchParkingPermitRequests;