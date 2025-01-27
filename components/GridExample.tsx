"use client"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { useState } from 'react';
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

export default function GridExample(data: IResults) {
  // Row Data: The data to be displayed.
  console.log(data.contacts);
  const [rowData, setRowData] = useState<Contact[]>(data.contacts);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<Contact>[]>([
    { field: "id" },
    { field: "first_name" },
    { field: "last_name" },
    { field: "contact_type" },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <div style={{ width: "50vw", height: "70vh" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        
      />
    </div>
  );
};