import { createClient } from "@/utils/supabase/server";
//import type { Database } from "@/database.types";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  const supabase = await createClient();
    
  const {
    data: { user },
  } = await supabase.auth.getUser();

  interface Dbresults {
    id: string;
    unit_number: string;
    sale_date: string;
    sale_price: number;
    property_id: string;
    building_number: string;
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

  const { data: leepa_sales } = await supabase
    .from("leepa_sales")
    .select(
      `id, sale_date, sale_price, unit_number, property_id, building_number, leepa_owners(owner_name, address1)`
    )
    .order("sale_date", { ascending: false })
    .limit(25)
    .returns<Dbresults[]>();
  
  console.log(leepa_sales);
  if (leepa_sales === null || leepa_sales.length === 0)  return <p>No sales to show or not logged in.</p>;

  return user ? (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">Date</TableHead>
          <TableHead className="text-right">Unit</TableHead>
          <TableHead className="text-right">Sale Amount</TableHead>
          <TableHead>Lee PA Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leepa_sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="text-right">
              {" "}
              <Link
                href={`/property/${sale.unit_number}`}
              >
                {sale.sale_date}
              </Link>
            </TableCell>
            <TableCell className="text-right">
              <Link
                href={`/dashboard/building/${sale.building_number}/${sale.property_id}`}
              >
                {sale.unit_number}
              </Link>
            </TableCell>
            <TableCell className="text-right">
              <Link
                href={`/dashboard/building/${sale.building_number}/${sale.property_id}`}
              >
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD", // Change this
                }).format(Number(sale.sale_price))}
              </Link>
            </TableCell>
            <TableCell>
              <Link
                href={`/dashboard/building/${sale.building_number}/${sale.property_id}`}
              >
                {sale.leepa_owners.owner_name} {sale.leepa_owners.address1}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <p>Please sign in</p>);
}
