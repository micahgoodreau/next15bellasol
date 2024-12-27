"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import { createServerAction } from "zsa";
import { revalidatePath } from "next/cache";
import { addContactFormSchema, addEmailAddressFormSchema, addPhoneNumberFormSchema, addressSchema } from "./validation";
import { ActionResponse, AddressFormData } from "@/types";


export type State =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

  export async function submitAddress(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    try {
      const rawData: AddressFormData = {
        streetAddress: formData.get('streetAddress') as string,
        apartment: formData.get('apartment') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zipCode: formData.get('zipCode') as string,
        country: formData.get('country') as string,
      }
  
      // Validate the form data
      const validatedData = addressSchema.safeParse(rawData)
  
      if (!validatedData.success) {
        return {
          success: false,
          message: 'Please fix the errors in the form',
          errors: validatedData.error.flatten().fieldErrors,
        }
      }
  
      // Here you would typically save the address to your database
      console.log('Address submitted:', validatedData.data)
  
      return {
        success: true,
        message: 'Address saved successfully!',
      }
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred',
      }
    }
  }

  
  export async function getContacts(searchString: string) {
    const supabase = await createClient();
    const { data: sResults, error } = await supabase
    .from("contacts")
    .select(`id, first_name, last_name, contact_type`)
    .or(`first_name.ilike.%${searchString}%, last_name.ilike.%${searchString}%`)
    .order("last_name", { ascending: true })
    .limit(25);

    return sResults;
    
  }

  export async function addEmail(
    prevState: State | null,
    formdata: FormData,
  ): Promise<State> {
    try {
      // Artificial delay; don't forget to remove that!
      //await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Validate our data
      const { email_address, contact_id } = addEmailAddressFormSchema.parse(formdata);
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      //const var_created_by = user?.id;
      const { data, error } = await supabase.from("email_addresses").insert({
        email_address: email_address,
        contact_id: contact_id,
        created_by: user?.id
      });
      revalidatePath('/');
      
      return {
        status: "success",
        message: `Welcome, ${email_address} added!`,
      };
    } catch (e) {
      // In case of a ZodError (caused by our validation) we're adding issues to our response
      if (e instanceof ZodError) {
        return {
          status: "error",
          message: "Invalid form data",
          errors: e.issues.map((issue) => ({
            path: issue.path.join("."),
            message: `Server validation: ${issue.message}`,
          })),
        };
      }
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  }

  export async function addPhone(
    prevState: State | null,
    formdata: FormData,
  ): Promise<State> {
    try {
      // Artificial delay; don't forget to remove that!
      //await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Validate our data
      const { phone_number, phone_type, contact_id } = addPhoneNumberFormSchema.parse(formdata);
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      //const var_created_by = user?.id;
      const { data, error } = await supabase.from("phone_numbers").insert({
        phone_number: phone_number,
        phone_type: phone_type,
        contact_id: contact_id,
      });
      revalidatePath('/');
      
      return {
        status: "success",
        message: `Contact added!`,
      };
    } catch (e) {
      // In case of a ZodError (caused by our validation) we're adding issues to our response
      if (e instanceof ZodError) {
        return {
          status: "error",
          message: "Invalid form data",
          errors: e.issues.map((issue) => ({
            path: issue.path.join("."),
            message: `Server validation: ${issue.message}`,
          })),
        };
      }
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  }
export async function addContact(
  prevState: State | null,
  formdata: FormData,
): Promise<State> {
  try {
    // Artificial delay; don't forget to remove that!
    //await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate our data
    const { first_name, last_name, business_name, contact_type, property_id } = addContactFormSchema.parse(formdata);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    //const var_created_by = user?.id;

    const var_created_by = user?.id;
    console.log(user, var_created_by);
    const { data, error } = await supabase.rpc("insert_contact", {
      var_first_name: first_name,
      var_last_name: last_name,
      var_business_name: business_name,
      var_contact_type: contact_type,
      var_property_id: property_id,
      var_created_by,
    });
    console.log(data, error);
    revalidatePath('/');
    
    return {
      status: "success",
      message: `Contact added!`,
    };
  } catch (e) {
    // In case of a ZodError (caused by our validation) we're adding issues to our response
    if (e instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid form data",
        errors: e.issues.map((issue) => ({
          path: issue.path.join("."),
          message: `Server validation: ${issue.message}`,
        })),
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}

export const incrementNumberAction = createServerAction() 
    .input(z.object({
        number: z.number()
    }))
    .handler(async ({ input }) => {
        // Sleep for .5 seconds
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Increment the input number by 1
        return input.number + 1;
    });

    

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
