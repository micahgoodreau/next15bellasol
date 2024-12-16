"use client";

import {
  FieldErrors,
  FieldPath,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { addPhone, State } from "@/app/actions";
import { useFormStatus } from "react-dom";
import {
  addPhoneNumberFormSchema,
} from "@/app/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { revalidatePath } from "next/cache";

// Interface for our form values that drastically improves type safety for our form
export interface FormValues {
  contact_id: string;
  phone_number: string;
  phone_type: string;
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
    <div className="w-1/2 flex-col-2 mb-2 text-white">
      <input
        {...register("contact_id", { value: contact_id })}
        placeholder="property id"
        type="hidden"
      />
      <div className="w-full mb-2">
        <input
          {...register("phone_number")}
          placeholder="Phone Number"
          className="mr-2 border border-black text-white"
        />
        <ErrorMessage name="phone_number" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("phone_type")}
          placeholder="Phone Type - CELL, HOME, WORK"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="phone_type" errors={errors} />
      </div>
      <input className="flex" type="submit" disabled={pending || !isValid} />
      {pending && <span>Loading...</span>}
    </div>
  );
}
export function AddPhoneForm(props: any) {
  const {
    register,
    formState: { isValid, errors },
    setError,
    reset,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(addPhoneNumberFormSchema),
  });

  const [state, formAction] = useActionState<State, FormData>(addPhone, null);

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
