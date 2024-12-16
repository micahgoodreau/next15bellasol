import { AddContactForm } from "@/components/add-contact-form";
import { AddEmailForm } from "@/components/add-email-form";
import { AddPhoneForm } from "@/components/add-phone-form";
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

    
    const supabase = await createClient();


    interface Dbresults {
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
    const contactId = (await params).id;
    const { data: contact } = await supabase
      .from("contacts")
      .select(
        `id, first_name, last_name, contact_type, phone_numbers(id, phone_number, phone_type), email_addresses(id, email_address)`
      )
      .match({ id: contactId })
      .returns<Dbresults[]>()
      .single();
  
    if (contact === null) return <>No contact found for id: {contactId}</>;
  
    return (
        <>
        <h1>Contact Details - {contact.first_name} {contact.last_name}</h1>
        <AddPhoneForm contact_id={contact.id} />
        <AddEmailForm contact_id={contact.id} />
        {/*<pre>{JSON.stringify(contact , null, 2)}</pre>*/}
        <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Email Addresses
            </p>
            <Table>

              <TableBody>
                {contact.email_addresses?.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell> {email.email_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Phone Numbers
            </p>
            <Table>

              <TableBody>
                {contact?.phone_numbers?.map((phone) => (
                  <TableRow key={phone.id}>
                    <TableCell> {phone.phone_type}</TableCell>
                    <TableCell> {phone.phone_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
    );
}