import SearchWaterMetersInput from "@/components/SearchWaterMeters";
import { Suspense } from "react";


export default async function Page() {

       return (
        <div>
            <h1>Street Lights List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <SearchWaterMetersInput />
            </Suspense>
        </div>
      );
}