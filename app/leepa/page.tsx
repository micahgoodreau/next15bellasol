"use client";

import { getLeepa } from "@/app/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'; 
import type { ColDef } from "ag-grid-community";
import { on } from "events";



ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface LeepaOwner {
  property_id: string;
  owner_name: string | null;
  unit_number: number | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  address4: string | null;
    country: string | null;

};
interface IResults { leepaowners: LeepaOwner[]};

const myTheme = themeQuartz.withParams({
  "spacing": 4,
  "backgroundColor": "#1e1e1e",
  "textColor": "#f0f0f0",
  "accentColor": "#268bd2",
  "rowBorder": "#f0f0f0",
  "oddRowBackgroundColor": "#2e2e2e",
});

const Page = () => {
    const [data, setData] = useState<LeepaOwner[]  | null>();

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<LeepaOwner>[]>([
        { field: "unit_number" },
        { field: "owner_name" },
        { field: "address1", editable: true },
        { field: "address2" },
        { field: "address3" },
        { field: "address4" },
        { field: "country", editable: true },
    ]);

    const defaultColDef: ColDef = {
      flex: 1,
    };
    const onSearch = async () => {
    

        const searchResults = await getLeepa();
        setData(searchResults);
    
        //const encodedSearchQuery = encodeURI(searchQuery);
        //router.push(`/contact/search?q=${encodedSearchQuery}`);
        return;
      };
        useEffect(() => {
            onSearch();
        }, []);
  return (
    <>

    {/* <pre>{JSON.stringify(data , null, 2)}</pre> */}
    <div style={{ width: "50vw", height: "70vh" }}>
      <AgGridReact
        theme={myTheme}
        rowData={data}
        columnDefs={colDefs}
        
      />
    </div>
    </>
  );
};

export default Page;