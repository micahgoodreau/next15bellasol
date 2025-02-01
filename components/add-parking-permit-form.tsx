"use client";

import {
  FieldErrors,
  FieldPath,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { addContact, addParkingPermit, State } from "@/app/actions";
import { useFormStatus } from "react-dom";
import {
  addContactFormSchema,
} from "@/app/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { revalidatePath } from "next/cache";

// Interface for our form values that drastically improves type safety for our form
export interface FormValues {
  first_name: string;
  last_name: string;
  contact_type: string;
  phone_number: string;
  email_address: string;
  unit_number: String;
  permit_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_year: string;
  vehicle_plate: string;
  vehicle_plate_state: string;
}

// Everything within our <form> tag
function FormContent({
  register,
  isValid,
  errors,
}: {
  register: UseFormRegister<FormValues>;
  isValid: boolean;
  errors: FieldErrors<FormValues>;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="w-1/2 flex-col-2 mb-2 text-white">
      <div className="w-full mb-2">
        <input
          {...register("unit_number")}
          placeholder="Unit Number"
          className="mr-2 border border-black text-white"
        />
        <ErrorMessage name="first_name" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("first_name")}
          placeholder="First Name"
          className="mr-2 border border-black text-white"
        />
        <ErrorMessage name="first_name" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("last_name")}
          placeholder="Last Name"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="last_name" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("phone_number")}
          placeholder="Phone Number"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="phone_number" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("contact_type")}
          placeholder="OWNER | TENANT | RELATIVE"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="contact_type" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("email_address")}
          placeholder="Email Address"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="email_address" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("permit_number")}
          placeholder="Permit Number"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="permit_number" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("vehicle_make")}
          placeholder="Vehicle Make"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="vehicle_make" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("vehicle_model")}
          placeholder="Vehicle Model"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="vehicle_model" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("vehicle_color")}
          placeholder="Vehicle Color"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="vehicle_color" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("vehicle_year")}
          placeholder="Vehicle Year"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="vehicle_year" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("vehicle_plate")}
          placeholder="Vehicle Plate"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="vehicle_plate" errors={errors} />
      </div>
      <div className="w-full mb-2">
        <input
          {...register("vehicle_plate_state")}
          placeholder="Vehicle Plate State"
          className="mr-2 border border-black text-white flex"
        />
        <ErrorMessage name="vehicle_plate_state" errors={errors} />
      </div>
      <input className="flex" type="submit" />
      {pending && <span>Loading...</span>}
    </div>
  );
}

export function AddParkingPermitForm(props: any) {
  const {
    register,
    formState: { isValid, errors },
    setError,
    reset,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(addContactFormSchema),
  });

  const [state, formAction] = useActionState<State, FormData>(addParkingPermit, null);

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
      />
    </form>
  );
}