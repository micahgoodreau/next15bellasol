import { AddContactForm } from "@/components/add-contact-form";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";


export default async function Page({
  params,
}: {
  params: Promise<{ unit_number: string }>
}) {

    
    const supabase = await createClient();

    interface Dbresults {
      id: string;
      unit_number: number;
      building_number: number;
      leepa_owners: LeepaOwner;
      contacts: Contact[];
    }
    interface LeepaOwner {
      owner_name: string;
      address1: string;
      address2: string;
      address3: string;
      address4: string;
      country: string;
    }
    interface Contact {
      id: string;
      first_name: string;
      last_name: string;
      contact_type: string;
      phone_numbers: Phone[];
      email_addresses: Email[];
    }
    interface Phone {
      id: string;
      phone_number: string;
      phone_type: string;
    }
    interface Email {
      id: string;
      email_address: string;
    }
    const unitNumber = (await params).unit_number;
    const { data: propertyDetail } = await supabase
      .from("properties")
      .select(
        `id, unit_number, building_number, leepa_owners(owner_name, address1, address2, address3, address4, country), contacts(id, first_name, last_name, contact_type, phone_numbers(phone_number, phone_type), email_addresses(id, email_address))`
      )
      .match({ unit_number: unitNumber })
      .returns<Dbresults[]>()
      .single();
  
    if (propertyDetail === null) return <>Property not found.</>;
  
    return (
        <>
        <h1>Unit Details</h1>
        <AddContactForm property_id={propertyDetail.id} />
        {/*<pre>{JSON.stringify(propertyDetail , null, 2)}</pre>*/}
        {propertyDetail.contacts?.map((contact) => (<div key={contact.id}>

          <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
          {contact.contact_type} {contact.first_name} {contact.last_name} <Link href={`/contact/${contact.id}`}>Edit</Link>
            </p>
            <Table>

              <TableBody key={contact.id}>
                {contact?.phone_numbers?.map((phone) => (
                  <TableRow key={phone.id}>
                    <TableCell> {phone.phone_type}</TableCell>
                    <TableCell> {phone.phone_number}</TableCell>
                  </TableRow>
                ))}
                
                {contact?.email_addresses?.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell> {email.email_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>))}


        </>
    );
}