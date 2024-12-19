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
  import { TrashIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";

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
      const deletePhoneNumber = async (id: string) => {
        "use server";
        //const requestUrl = new URL(request.url)
    
        const supabase = await createClient();
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
      const deleteEmail = async (id: string) => {
        "use server";
        //const requestUrl = new URL(request.url)
    
        const supabase = await createClient();
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
    
      
    if (contact === null) return <>No contact found for id: {contactId}</>;
  
    return (
        <>
          <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Contact Details
            </p>
        <p><b>First Name:</b> {contact.first_name}</p>
        <p><b>Last Name:</b>  {contact.last_name}</p>
        <p><b>Contact Type:</b> {contact.contact_type}</p>
        </div>

        
        
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
                    <TableCell><form action={deleteEmail.bind(null, email.id)}>
                      <button className="mr-4">
                        <TrashIcon className="h-4 w-4 text-red-700" />
                      </button>
                    </form></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AddEmailForm contact_id={contact.id} />
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
                    <TableCell><form action={deletePhoneNumber.bind(null, phone.id)}>
                      <button className="mr-4">
                        <TrashIcon className="h-4 w-4 text-red-700" />
                      </button>
                    </form></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AddPhoneForm contact_id={contact.id} />
          </div>
        </>
    );
}