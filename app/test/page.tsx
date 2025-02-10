import TestDialog from "@/components/test-dialog";
import TestForm from "@/components/test-form";
import { Toaster } from "@/components/ui/toaster";


type IContactType = "OWNER" | "OWNER GUEST/RELATIVE" | "TENANT" | "PROPERTY MANAGER";
type IContact = {
  contact_type: IContactType;
  first_name: string;
  last_name: string;
  business_name: string;
};

export default function Page() {

    const contact = {
        contact_type: "OWNER" as IContactType,
        first_name: "John",
        last_name: "Doe",
        business_name: "John Doe Inc",
    } as IContact;
    return (
        <div>
            <Toaster />
            <TestDialog />
            <TestForm />
        </div>
      );
}