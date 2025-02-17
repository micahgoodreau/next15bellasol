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
import { Toaster } from "@/components/ui/toaster";
import { EditContactForm } from "@/components/edit-contact-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { inter } from "@/components/ui/fonts";
import { LinkContactPropertyForm } from "@/components/link-contact-property-form";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

    
    const supabase = await createClient();

    type IContactType = "OWNER" | "OWNER GUEST/RELATIVE" | "TENANT" | "PROPERTY MANAGER";
    type IContact = {
      contact_id: string;
      contact_type: IContactType;
      first_name: string;
      last_name: string;
      business_name: string;
    };
    
    interface Dbresults {
      id: string;
      first_name: string;
      last_name: string;
      contact_type: string;
      business_name: string;
      active: boolean;
      created_at: string;
      created_by: string;
      updated_at: string;
      updated_by: string;
      phone_numbers: Phone[];
      email_addresses: Email[];
    }
    interface Property {
      id: string;
      unit_number: string;
    }
    interface Property_Contact {
      id: string;
      contact_id: string;
      property_id: string;
      properties: Property;
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
    const { data: contactData } = await supabase
      .from("contacts")
      .select(
        `id, first_name, last_name, contact_type, business_name, active, created_at, created_by, updated_at, updated_by, phone_numbers(id, phone_number, phone_type), email_addresses(id, email_address)`
      )
      .match({ id: contactId })
      .returns<Dbresults[]>()
      .single();


    const { data: linkedPropertiesData } = await supabase
      .from("property_contact")
      .select(
        `property_id, contact_id, properties(id, unit_number)`
      )
      .match({ contact_id: contactId })
      .returns<Property_Contact[]>();


      const contact = {
        contact_id: contactData?.id,
        first_name: contactData?.first_name,
        last_name: contactData?.last_name, 
        contact_type: contactData?.contact_type as IContactType, 
        business_name: contactData?.business_name,
      } as IContact;

      const deletePhoneNumber = async (id: string) => {
        "use server";
        //const requestUrl = new URL(request.url)
    
        const supabase = await createClient();

        const { error } = await supabase
          .from("phone_numbers")
          .delete()
          .eq("id", id);
        revalidatePath("/");
    
        if (error) {
          return redirect(`/login/login?error=Could not create contact`);
        }
    
        return; //redirect(`/dashbard/building/1/unit/${var_property_id}`);
      };
      const deleteEmail = async (id: string) => {
        "use server";
        //const requestUrl = new URL(request.url)
    
        const supabase = await createClient();

        const { error } = await supabase
          .from("email_addresses")
          .delete()
          .eq("id", id);
        revalidatePath("/");
    
        if (error) {
          return redirect(`/login/login?error=Could not create contact`);
        }
    
        return; //redirect(`/dashbard/building/1/unit/${var_property_id}`);
      };
      const deactivateContact = async (id: string) => {
        "use server";
        //const requestUrl = new URL(request.url)
        const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase
          .from("contacts")
          .update({ active: false, updated_by: user?.id, updated_at: new Date().toISOString() })
          .eq("id", id);
        revalidatePath("/");
        await delay(1000);
        redirect(`/contact/${id}`);
    
        if (error) {
          return redirect(`/login/login?error=Could not create contact`);
        }
    
        return; //redirect(`/dashbard/building/1/unit/${var_property_id}`);
      };

      const unlinkProperty = async (property_id: string) => {
        "use server";
        //const requestUrl = new URL(request.url)
    
        const supabase = await createClient();

        const { error } = await supabase
          .from("property_contact")
          .delete()
          .match({ property_id: property_id })
          .match({ contact_id: contactData?.id });
        revalidatePath("/");
    
        if (error) {
          return redirect(`/login/login?error=Could not create contact`);
        }
    
        return; //redirect(`/dashbard/building/1/unit/${var_property_id}`);
      };
      
    if (contactData === null) return <>No contact found for id: {contactId}</>;
  
    return (
        <>
          <div className="border-b border-black mb-2">
            <div className="w-full flex flex-row justify-between align-middle p-2 bg-gray-700 text-white rounded-sm">
              <div>Contact Details  -- Status: {contactData.active ? "Active" : "Deactivated"}</div>
              <div>
              <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                  <form action={deactivateContact.bind(null, contactData?.id)}>
                    <Button variant={"destructive"} type="submit">Delete Contact</Button>
                  </form>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          <EditContactForm contact = {contact} />

        </div>

        
        
        {/*<pre>{JSON.stringify(contact , null, 2)}</pre>*/}

        <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Linked Properties
            </p>
            <Table>

              <TableBody>
                {linkedPropertiesData?.map((property) => (
                  
                  <TableRow key={property.property_id}>
                    <TableCell> {property.properties.unit_number}</TableCell>
                    <TableCell><form action={unlinkProperty.bind(null, property.properties.id)}>
                      <button className="mr-4">
                        <TrashIcon className="h-4 w-4 text-red-700" />
                      </button>
                    </form></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <LinkContactPropertyForm contact_id={contactData?.id} />
          </div>

        <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Email Addresses
            </p>
            <Table>

              <TableBody>
                {contactData?.email_addresses?.map((email) => (
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
            <AddEmailForm contact_id={contactData?.id} />
          </div>
          <div className="border-b border-black mb-2">
            <p className="w-full p-2 bg-gray-700 text-white rounded-sm">
              Phone Numbers
            </p>
            <Table>

              <TableBody>
                {contactData?.phone_numbers?.map((phone) => (
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
            <AddPhoneForm contact_id={contactData?.id} />
          </div>
          <Toaster />
        </>
    );
}