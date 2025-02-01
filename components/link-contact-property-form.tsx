"use client";

import {
  FieldErrors,
  FieldPath,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { addEmail, linkContactProperty, State } from "@/app/actions";
import { useFormStatus } from "react-dom";
import {
  addEmailAddressFormSchema,
} from "@/app/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { revalidatePath } from "next/cache";

// Interface for our form values that drastically improves type safety for our form
export interface FormValues {
  contact_id: string;
  unit_number: string;
}

// Everything within our <form> tag
function FormContent({
  register,
  isValid,
  errors,
  contact_id,
}: {
  register: UseFormRegister<FormValues>;
  isValid: boolean;
  errors: FieldErrors<FormValues>;
  contact_id: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="flex w-3/4 mb-2">
      <input
        {...register("contact_id", { value: contact_id })}
        placeholder="property id"
        type="hidden"
      />
      <div className="flex-row w-3/4 mb-2 ">
        <input
          {...register("unit_number")}
          placeholder="Unit Number"
          className="mr-2 border-solid border-2 border-accent"
        />
        <ErrorMessage name="unit_number" errors={errors} />
      </div>
      <div className="flex-row">
      <input className="border-solid border-2 bg-accent border-slate-100 rounded-sm text-primary pr-2 pl-2 h-7" type="submit"  />
      {pending && <span>Loading...</span>}
      </div>
    </div>
  );
}
export function LinkContactPropertyForm(props: any) {
  const {
    register,
    formState: { isValid, errors },
    setError,
    reset,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(addEmailAddressFormSchema),
  });

  const [state, formAction] = useActionState<State, FormData>(linkContactProperty, null);

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
        contact_id={props.contact_id}
      />
    </form>
  );
}
