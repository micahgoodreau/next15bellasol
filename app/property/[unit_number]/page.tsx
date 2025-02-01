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
      street_address_1: string;
      folio: string;
      association_number: string;
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
      active: boolean;
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
        `id, unit_number, building_number, street_address_1, association_number, folio, leepa_owners(owner_name, address1, address2, address3, address4, country), contacts(id, first_name, last_name, contact_type, active, phone_numbers(phone_number, phone_type), email_addresses(id, email_address))`
      )
      .match({ unit_number: unitNumber })
      .returns<Dbresults[]>()
      .single();
  
    if (propertyDetail === null) return <>Property not found.</>;
  
    return (
        <>
        <div className="p-2 bg-gray-700 text-white rounded-sm">
        <p className="pb-2 font-bold">Unit Details</p>
        <p>Unit {propertyDetail.unit_number}</p>
        <p>Association {propertyDetail.association_number}</p>
        <p>Building {propertyDetail.building_number}</p>
        <p>Street Address {propertyDetail.street_address_1}</p>
        </div>
        <div className="p-2 bg-gray-700 text-white rounded-sm">
        <p className="pb-2 font-bold">LeePA Owner Details</p>
        <p>{propertyDetail.leepa_owners.owner_name}</p>
        <p>{propertyDetail.leepa_owners.address1}</p>
        <p>{propertyDetail.leepa_owners.address2}</p>
        <p>{propertyDetail.leepa_owners.address3}</p>
        <p>{propertyDetail.leepa_owners.address4}</p>
        <p className="pb-2">{propertyDetail.leepa_owners.country}</p>
        <span>
                  <Link
                    href={`https://www.leepa.org/Display/DisplayParcel.aspx?FolioID=${propertyDetail.folio}`}
                  >
                    View on LeePA
                  </Link>
                </span>
        </div>
        <AddContactForm property_id={propertyDetail.id} />
        {/*<pre>{JSON.stringify(propertyDetail , null, 2)}</pre>*/}
        {propertyDetail.contacts?.map((contact) => (
          contact.active ?
          <div key={contact.id}>

          <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
          {contact.active ? "Active" : "Deactivated"} {contact.contact_type} {contact.first_name} {contact.last_name} <Link href={`/contact/${contact.id}`}>Edit</Link>
            </p>
            <Table>

              <TableBody>
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
        </div>: null))}


        </>
    );
}