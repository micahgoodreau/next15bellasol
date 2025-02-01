"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldPath, useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "./ui/input"
import { editContact, State } from "@/app/actions"
import { useActionState, useEffect } from "react"
import { editContactFormSchema } from "@/app/validation"


// Interface for our form values that drastically improves type safety for our form
export interface FormValues {
  first_name: string;
  last_name: string;
  business_name: string;
  contact_type: string;
}


type IContactType = "OWNER" | "OWNER GUEST/RELATIVE" | "TENANT" | "PROPERTY MANAGER";
type IContact = {
  contact_type: IContactType;
  first_name: string;
  last_name: string;
  business_name: string;
};

type TestFormProps = {
  property_id: string,
  contact?: IContact;
}

const FormSchema = z.object({
  contact_type: z.union([
    z.literal("OWNER"),
    z.literal("OWNER GUEST/RELATIVE"),
    z.literal("TENANT"),
    z.literal("PROPERTY MANAGER"),
  ]),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  business_name: z.string(),
  property_id: z.string(),
})

export function TestForm({ property_id, contact }: TestFormProps) {

    const {
      register,
      formState: { isValid, errors },
      setError,
      reset,
    } = useForm<FormValues>({
      mode: "all",
      resolver: zodResolver(editContactFormSchema),
    });


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: contact ? { ...contact } : { first_name: "", last_name: "", business_name: "", contact_type: "OWNER" },
  })
  const [state, formAction] = useActionState<State, FormData>(editContact, null);

  useEffect(() => {
    if (!state) {
      return;
    }
    // In case our form action returns `error` we can now `setError`s
    if (state.status === "error") {
      state.errors?.forEach((error: any) => {
        setError(error.path as FieldPath<FormValues>, {
          message: error.message,
        });
      });
    }
    if (state.status === "success") {
      //alert(state.message);
      reset();
      //revalidatePath("/");
    }
  }, [state, setError]);




  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formAction(formData);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form action={formAction}  className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="contact_type"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Contact Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OWNER">OWNER</SelectItem>
                  <SelectItem value="OWNER GUEST/RELATIVE">OWNER GUEST/RELATIVE</SelectItem>
                  <SelectItem value="TENANT">TENANT</SelectItem>
                  <SelectItem value="PROPERTY MANAGER">PROPERTY MANAGER</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription style={{ visibility: "hidden" }}>
                Contact type is the type of contact.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormDescription style={{ visibility: "hidden" }}>
                This is contact first name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormDescription style={{ visibility: "hidden" }}>
                This is contact last name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Business Name" {...field} />
              </FormControl>
              <FormDescription style={{ visibility: "hidden" }}>
                This is contact business name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
