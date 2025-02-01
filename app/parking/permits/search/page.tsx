import SearchInput from "@/components/SearchInput";
import SearchParkingPermits from "@/components/SearchParkingPermits";
import { Suspense } from "react";


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
            <h1 className="pb-2">Parking Permit List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <SearchParkingPermits />
            </Suspense>
        </div>
      );
}