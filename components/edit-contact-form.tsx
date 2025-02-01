"use client";

import {
  FieldErrors,
  FieldPath,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { editContact, State } from "@/app/actions";
import { useFormStatus } from "react-dom";
import {
  editContactFormSchema,
} from "@/app/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { revalidatePath } from "next/cache";

// Interface for our form values that drastically improves type safety for our form
export interface FormValues {
  first_name: string;
  last_name: string;
  business_name: string;
  contact_type: string;
  contact_id: string;
}
type IContactType = "OWNER" | "OWNER GUEST/RELATIVE" | "TENANT" | "PROPERTY MANAGER";
type IContact = {
  contact_id: string;
  contact_type: IContactType;
  first_name: string;
  last_name: string;
  business_name: string;
};

type EditContactFormProps = {
  contact?: IContact;
}
// Everything within our <form> tag
function FormContent({
  register,
  isValid,
  errors,
  contact,
}: {
  register: UseFormRegister<FormValues>;
  isValid: boolean;
  errors: FieldErrors<FormValues>;
  contact: IContact;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="w-1/2 flex-col-2 mb-2 text-white">

      <div className="w-full mb-2">
      <input
        {...register("contact_id", { value: contact.contact_id })}
        placeholder="contact id"
        type="hidden"
      />
        <input
          {...register("first_name")}
          defaultValue={contact.first_name}
          placeholder="First Name"
          className="mr-2 border border-black text-white"
        />
        <ErrorMessage name="first_name" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("last_name")}
          defaultValue={contact.last_name}
          placeholder="Last Name"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="last_name" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("business_name")}
          defaultValue={contact.business_name}
          placeholder="Business Name"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="business_name" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("contact_type")}
          defaultValue={contact.contact_type}
          placeholder="OWNER | TENANT | RELATIVE"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="contact_type" errors={errors} />
      </div>
      <input className="flex" type="submit" disabled={pending || !isValid} />
      {pending && <span>Loading...</span>}
    </div>
  );
}
export function EditContactForm({ contact }: EditContactFormProps) {
  const {
    register,
    formState: { isValid, errors },
    setError,
    reset,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(editContactFormSchema),
  });

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

  return (
    <form action={formAction}>
      <FormContent
        register={register}
        isValid={isValid}
        errors={errors}
        contact={contact ? contact : { contact_id: "", first_name: "", last_name: "", business_name: "", contact_type: "OWNER" }}
      />
    </form>
  );
}
