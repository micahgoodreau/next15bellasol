import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "./ui/button";

export default async function PropertyDetail(props: any) {
  const supabase = await createClient();
  const revalidate = 0;

  /* ================================================================================
  const deletePhoneNumber = async (id: string) => {
    "use server";
    //const requestUrl = new URL(request.url)

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    // await supabase.auth.signOut()
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const var_created_by = user?.id;
    //console.log(user, var_created_by);
    const { error } = await supabase
      .from("phone_numbers")
      .delete()
      .eq("id", id);
    //console.log(id, error);
    revalidatePath("/");

    if (error) {
      console.log(error);
      return redirect(`/login/login?error=Could not create contact`);
    }

    return; //redirect(`/dashbard/building/1/unit/${var_property_id}`);
  };

  ================================================================================  */

  /* =================================================================================
  const deleteEmail = async (id: string) => {
    "use server";
    //const requestUrl = new URL(request.url)

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    // await supabase.auth.signOut()
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const var_created_by = user?.id;
    //console.log(user, var_created_by);
    const { error } = await supabase
      .from("email_addresses")
      .delete()
      .eq("id", id);
    //console.log(id, error);
    revalidatePath("/");

    if (error) {
      console.log(error);
      return redirect(`/login/login?error=Could not create contact`);
    }

    return; //redirect(`/dashbard/building/1/unit/${var_property_id}`);
  };
================================================================================  */

  const { data: properties } = await supabase
    .from("properties")
    .select(
      `id, unit_number, folio, building_number, street_address_1, association_number, leases(id, start_date, end_date, lease_notes, contacts(id, first_name, last_name)), contacts(id, first_name, last_name, contact_type, phone_numbers(id, phone_number, phone_type), email_addresses(id, email_address))`
    )
    .match({ id: props.property_id })
    .single();

  const { data: leepa_owners } = await supabase
    .from("leepa_owners")
    .select()
    .match({ property_id: props.property_id })
    .single();

  const { data: leases } = await supabase
    .from("leases")
    .select(
      `id, start_date, end_date, lease_notes, contacts(id, first_name, last_name)`
    )
    .match({ property_id: props.property_id });

  const { data: leepa_sales } = await supabase
    .from("leepa_sales")
    .select(`id, sale_price, sale_date`)
    .match({ property_id: props.property_id })
    .order("sale_date", { ascending: false });

  return (
    <>
      <div className="rounded-xl bg-gray-700 p-2 shadow-sm">
        <div className="flex p-4">
          {/*Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null */}
          <h3 className="ml-2 text-sm text-white font-medium">
            Property Detail for Unit {properties?.unit_number}
          </h3>
        </div>
        <div className="truncate rounded-xl bg-gray-500 px-4 py-8 text-white text-left">
          <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Unit Info:
            </p>
            <div className="p-3">
              <p>Unit Number: {properties?.unit_number}</p>
              <p>Postal Address: {properties?.street_address_1}</p>
              <p>Building Number: {properties?.building_number}</p>
              <p>Association Number: {properties?.association_number}</p>
            </div>
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              LeePA Info:
            </p>
            <div className="p-3">
              <p>{leepa_owners?.owner_name}</p>
              <p>{leepa_owners?.address1}</p>
              <p>{leepa_owners?.address2}</p>
              <p>{leepa_owners?.address3}</p>
              <p>{leepa_owners?.address4}</p>
              <p>{leepa_owners?.country}</p>
            </div>
            <div className="w-full flex flex-col-2">
              <div>
                <span className="">
                  LeePA data last updated:{" "}
                  {leepa_owners?.updated_at.slice(0, 10)}
                </span>
              </div>
              <div className="text-right w-full">
                <span>
                  <Link
                    href={`https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=${properties?.folio}`}
                  >
                    View on LeePA
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Contacts:
            </p>
            {properties?.contacts.map((contact) => (
              <div
                className="mb-2 border-b border-black bg-gray-500"
                key={contact.id}
              >
                <p className="text-lg">
                  <span>{contact.contact_type}: </span>
                  {contact.first_name} {contact.last_name}{" "}

                  <Link
                    href={`/contact/${contact.id}`}
                  >
                    <button className="bg-blue-700 p-2 rounded-sm">Edit Contact</button>
                  </Link>
                </p>
                {contact?.phone_numbers?.map((phone) => (
                  <div className="ml-4 flex" key={phone.id}>
                    {phone.phone_number} {phone.phone_type}{" "}

                    {/*   
                    <form action={deletePhoneNumber.bind(null, phone.id)}>
                      <button className="mr-4">
                        <TrashIcon className="h-4 w-4 text-red-700" />
                      </button>
                    </form>
                    */}
                  </div>
                ))}

                {contact?.email_addresses?.map((email) => (
                  <div className="ml-4 flex" key={email.id}>
                    {email.email_address}

                    {/*
                    <form action={deleteEmail.bind(null, email.id)}>
                      <button className="mr-4">
                        <TrashIcon className="h-4 w-4 text-red-700" />
                      </button>
                    </form>

                    */}
                  </div>
                ))}
                <div className="p-2">

                </div>
              </div>
            ))}
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Lease Info:
            </p>
            {leases?.map((lease: any) => (
              <div className="border-b border-black mb-2" key={lease.id}>
                <div>
                  <p>
                    Start {lease.start_date} : End {lease.end_date}
                  </p>
                  <p>{lease.lease_notes}</p>
                </div>
                <div>
                  <ul>
                    {lease.contacts?.map((contact: any) => (
                      <li key={contact.id}>
                        {contact.first_name} {contact.last_name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              LeePA Sales History:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Sale Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leepa_sales?.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell> {sale.sale_date}</TableCell>
                    <TableCell>
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD", // Change this
                      }).format(Number(sale.sale_price))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
