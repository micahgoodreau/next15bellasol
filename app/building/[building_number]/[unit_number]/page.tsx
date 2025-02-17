import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import PropertyDetail from "@/components/PropertyDetail";
import Link from "next/link";
import GoToUnitButton from "@/components/GoToUnit";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ building_number: number; unit_number: string }>;
}) {
  const supabase = await createClient();
    
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const unitNumber = (await params).unit_number;
  const buildingNumber = (await params).building_number;

  const prev_building_number: number = Number(buildingNumber) - Number(1);
  const next_building_number: number = Number(buildingNumber) + Number(1);

  interface Dbresults {
    id: string;
    unit_number: number;
    building_number: number;
    leepa_owners: LeepaOwner;
  }
  interface LeepaOwner {
    owner_name: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    country: string;
  }

  const { data: properties } = await supabase
    .from("properties")
    .select(
      `id, unit_number, building_number, leepa_owners(owner_name, address1, address2, address3, address4, country)`
    )
    .match({ building_number: buildingNumber.toString() })
    .order("unit_number", { ascending: true })
    .returns<Dbresults[]>();

  if (properties === null || properties.length === 0) return redirect("/login");

  return user ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-screen p-2">
        <div className="">
          <div className="">
            <div>
              <GoToUnitButton />
            </div>
            <div className="flex">
              <Link
                href={`/building/${prev_building_number}/${unitNumber}`}
                className="flex w-44 rounded-md bg-btn-background px-4 py-2 text-sm text-foreground no-underline hover:bg-btn-background-hover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>{" "}
                Previous Building
              </Link>

              <Link
                href={`/building/${next_building_number}/${unitNumber}`}
                className="w-44 flex items-center rounded-md bg-btn-background ml-2 px-4 py-2 text-sm text-foreground no-underline hover:bg-btn-background-hover"
              >
                Next Building
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                >
                  <polyline points="15 18 22 12 15 6" />
                </svg>{" "}
              </Link>
            </div>
          </div>

          {properties.map((property) => (
            <p key={property.id} className="py-2 border-b">
              <Link
                href={`/building/${buildingNumber}/${property.id}`}
              >
                {property?.unit_number} {property.leepa_owners?.owner_name}{" "}
              </Link>
            </p>
          ))}
        </div>
        <PropertyDetail property_id={unitNumber} />
      </div>
    </>
  ) : (<>Please sign in</>);
}
