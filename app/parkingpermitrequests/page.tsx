import SearchParkingPermitRequests from "@/components/SearchParkingPermitRequests";
import { Suspense } from "react";


export default async function Page() {

       return (
        <div>
            <h1>Parking Permit Requests List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <SearchParkingPermitRequests />
            </Suspense>
        </div>
      );
}