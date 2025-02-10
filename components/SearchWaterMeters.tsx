"use client";

import { getContacts, getLeepa } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'; 
import type { ColDef } from "ag-grid-community";
import { getLights } from "@/app/actions-lights";
import { getWaterMeters } from "@/app/actions-water-meters";



ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface Property {
    unit_number: number | null
    building_number: number | null
    association_number: number | null
}
interface WaterMeter {
    id: number
    is_estimated: boolean | null
    notes: string | null
    updated_at: string | null
    updated_by: string | null
    unit_number: number | null
    properties: Property | null
};


const myTheme = themeQuartz.withParams({
  "spacing": 4,
  "backgroundColor": "#1e1e1e",
  "textColor": "#f0f0f0",
  "accentColor": "#268bd2",
  "rowBorder": "#f0f0f0",
  "oddRowBackgroundColor": "#2e2e2e",
});

const SearchWaterMetersInput = () => {
  const [data, setData] = useState<WaterMeter[]  | null>();
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();
    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<WaterMeter>[]>([
      { field: "id", width: 100 },
      { field: "unit_number", headerName: "Unit Number", },
      { field: "properties.association_number", headerName: "Association Number", },
      { field: "is_estimated", headerName: "Estimated", editable: true },
      { field: "notes", headerName: "Notes" },
      { field: "updated_at", headerName: "Updated at" },
  ]);

  
    const defaultColDef: ColDef = {
      flex: 1,
    };
    const initialSearch = async () => {
      const searchResults = await getWaterMeters("");
      setData(searchResults);
      return;
  };

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof searchQuery !== "string") {
      return;
    }
    const searchResults = await getWaterMeters(searchQuery || "");
    setData(searchResults);

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
        
      />
    </div>
    </Suspense>
    </>
  );
};

export default SearchWaterMetersInput;