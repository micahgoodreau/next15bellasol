import LeePaSearchInput from "@/components/LeePaSearchInput";
import { Suspense } from "react";


export default async function Page() {

       return (
        <div>
            <h1>LeePA List</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <LeePaSearchInput />
            </Suspense>
        </div>
      );
}