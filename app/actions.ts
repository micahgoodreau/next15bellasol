"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z, ZodError } from "zod";
import { createServerAction } from "zsa";
import { revalidatePath } from "next/cache";
import { addContactFormSchema, addEmailAddressFormSchema, addParkingPermitFormSchema, addPhoneNumberFormSchema, addressSchema, addTestFormSchema, editContactFormSchema, linkContactPropertyFormSchema, testSchema } from "./validation";
import { ActionResponse, ActionResponseTestForm, AddressFormData, TestFormData } from "@/types";
import { toast } from "@/hooks/use-toast";
import { QueryData } from "@supabase/supabase-js";





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

  export async function addTest(prevState: ActionResponseTestForm | null, formData: FormData): Promise<ActionResponseTestForm> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    try {
      const rawData: TestFormData = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        business_name: formData.get('business_name') as string,
        contact_type: formData.get('contact_type') as string,
        property_id: formData.get('property_id') as string,
      }
  
      // Validate the form data
      const validatedData = testSchema.safeParse(rawData)
  
      if (!validatedData.success) {
        toast({ title: 'Form submitted successfully!', variant: 'default' });
        return {
          success: false,
          message: 'Please fix the errors in the form',
          errors: validatedData.error.flatten().fieldErrors,
        }
      }
  
      // Here you would typically save the address to your database
  
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

  export async function getLeepa(searchString: string) {
    const supabase = await createClient();

    if (searchString == "") {
      const { data: lResults, error } = await supabase
      .from("leepa_owners")
      .select(`property_id, owner_name, address1, address2, address3, address4, country, unit_number`)
      .order("unit_number", { ascending: false });
      return lResults;
    }
    const { data: sResults, error } = await supabase
    .from("leepa_owners")
    .select(`property_id, owner_name, address1, address2, address3, address4, country, unit_number`)
    .or(`owner_name.ilike.%${searchString}%, address1.ilike.%${searchString}%, country.ilike.%${searchString}%`)
    .order("unit_number", { ascending: true });

    return sResults;
    
  }
  
  export async function getParkingPermitRequests(searchString: string) {
    const supabase = await createClient();

    if (searchString == "") {
      const { data: lResults, error } = await supabase
      .from("parking_permit_requests")
      .select(`id,
        first_name,
        last_name,
        unit_number,
        contact_phone,
        contact_email,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        vehicle_year,
        vehicle_plate_number,
        vehicle_plate_state,
        created_at,
        updated_at,
        updated_by,
              request_notes,
      admin_notes,
      permit_number,
      created_at,
        permit_status`)
        .or(`permit_status.ilike.%NEW REQUEST%, permit_status.ilike.%PENDING%`)
      .order("permit_status", { ascending: false });
      return lResults;
    }
    const { data: sResults, error } = await supabase
    .from("parking_permit_requests")
    .select(`id,
      first_name,
      last_name,
      unit_number,
      contact_phone,
      contact_email,
      vehicle_make,
      vehicle_model,
      vehicle_color,
      vehicle_year,
      vehicle_plate_number,
      vehicle_plate_state,
      updated_at,
      updated_by,
      request_notes,
      admin_notes,
      permit_number,
      created_at,
      permit_status`)
    .or(`first_name.ilike.%${searchString}%, last_name.ilike.%${searchString}%, unit_number.ilike.%${searchString}%, permit_status.ilike.%${searchString}%`)
    .order("unit_number", { ascending: true });

    return sResults;
    
  }
  export async function getPropertyManagers(searchString: string) {
    const supabase = await createClient();
    if (searchString == "") {
      const { data: lResults, error } = await supabase
      .from("contacts")
      .select(`id, first_name, last_name, contact_type, properties(id, unit_number)`)
      .match({ contact_type: "PROPERTY MANAGER" })
      .order("last_name", { ascending: false });
      return lResults;
    }
    const { data: sResults, error } = await supabase
    .from("contacts")
    .select(`id, first_name, last_name, contact_type, properties(id, unit_number)`)
    .match({ contact_type: "PROPERTY MANAGER" })
    .or(`first_name.ilike.%${searchString}%, last_name.ilike.%${searchString}%`)
    .order("last_name", { ascending: true })
    .limit(25);

    return sResults;
    
  }  
  export async function getContacts(searchString: string) {
    const supabase = await createClient();
    const { data: sResults, error } = await supabase
    .from("contacts")
    .select(`id, first_name, last_name, contact_type, properties(id, unit_number)`)
    .or(`first_name.ilike.%${searchString}%, last_name.ilike.%${searchString}%`)
    .order("last_name", { ascending: true })
    .limit(25);

    return sResults;
    
  }

  export async function getParkingPermits(searchString: string) {
    const supabase = await createClient();
   const parkingPermitsQuery = supabase.from('parking_permits').select(`
        id,
         contact_type,
        created_at,
        created_by,
        phone_number,
        email_address,
        first_name,
        last_name,
        unit_number,
        permit_number,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        vehicle_year,
        vehicle_plate,
        vehicle_plate_state
      `)
      .order('unit_number', { ascending: false })

    type ParkingPermit = QueryData<typeof parkingPermitsQuery>
    const { data, error } = await parkingPermitsQuery;
    if (error) throw error
    const permits: ParkingPermit = data;


    return permits;

    
  }

  export async function addParkingPermit(
    prevState: State | null,
    formdata: FormData,
  ): Promise<State> {
    try {
      // Artificial delay; don't forget to remove that!
      //await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Validate our data
      const { first_name,
        last_name,
        contact_type,
        phone_number,
        email_address,
        unit_number,
        permit_number,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        vehicle_year,
        vehicle_plate,
        vehicle_plate_state, } = addParkingPermitFormSchema.parse(formdata);
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      //const var_created_by = user?.id;
      const { data, error } = await supabase.from("parking_permits").insert({
        first_name,
        last_name,
        contact_type,
        phone_number,
        email_address,
        unit_number,
        permit_number,
        vehicle_make,
        vehicle_model,
        vehicle_color,
        vehicle_year,
        vehicle_plate,
        vehicle_plate_state,
        created_by: user?.id
      });
      revalidatePath('/');

      return {
        status: "success",
        message: `Permit added!`,
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


  export async function linkContactProperty(
    prevState: State | null,
    formdata: FormData,
  ): Promise<State> {
    try {
      // Artificial delay; don't forget to remove that!
      //await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Validate our data
      const { unit_number , contact_id } = linkContactPropertyFormSchema.parse(formdata);
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      //const var_created_by = user?.id;

      // look up property_id from unit_number
      const { data: property, error: propertyLookupError } = await supabase.from("properties").select("id").eq("unit_number", unit_number).single();
      if (propertyLookupError || !property || !user) {
        return {
          status: "error",
          message: "Invalid form data",
          errors: [{ path: "unit_number", message: "Unit number not found" }],
        };
      }
      const { data, error } = await supabase.from("property_contact").insert({
        property_id: property.id,
        contact_id: contact_id,
        created_by: user?.id,
        created_at: new Date().toISOString(),
      });
      revalidatePath('/');
      
      return {
        status: "success",
        message: `Welcome, Contact linked to unit ${unit_number}!`,
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

    const var_created_by = user?.id || "";
    const { data, error } = await supabase.rpc("insert_contact", {
      var_first_name: first_name,
      var_last_name: last_name,
      var_business_name: business_name,
      var_contact_type: contact_type,
      var_property_id: property_id,
      var_created_by,
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
export async function editContact(
  prevState: State | null,
  formdata: FormData,
): Promise<State> {
  try {
    // Artificial delay; don't forget to remove that!
    //await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate our data
    const { contact_id, first_name, last_name, business_name, contact_type } = editContactFormSchema.parse(formdata);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    //const var_created_by = user?.id;

    const updated_by = user?.id || "";
    const { data, error } = await supabase.from("contacts").update( {
      first_name,
      last_name,
      business_name,
      contact_type,
      updated_by,
    }).eq("id", contact_id);
    revalidatePath('/');
    
    return {
      status: "success",
      message: `Contact updated!`,
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
export async function deactivateContact(
  prevState: State | null,
  contact_id: string,
): Promise<State> {
  try {
    // Artificial delay; don't forget to remove that!
    //await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate our data

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    //const var_created_by = user?.id;

    const updated_by = user?.id || "";
    const { data, error } = await supabase.from("contacts").update( {
      active: false,
      updated_by,
      updated_at: new Date().toISOString(),
    }).eq("id", contact_id);
    revalidatePath('/');
    
    return {
      status: "success",
      message: `Contact updated!`,
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

export const approveParkingRequestAction = createServerAction() 
  .input(z.object({
      permit_number: z.string(),
      permit_status: z.string(),
      permit_request_id: z.number()
  }))
  .handler(async ({ input }) => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      //const var_created_by = user?.id;
  
      const updated_by = user?.id || "";
      const { data, error } = await supabase.from("parking_permit_requests").update( {
        permit_status: input.permit_status,
        permit_number: input.permit_number,
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      }).eq("id", input.permit_request_id);

      revalidatePath('/parkingpermitrequests/[id]', 'page');
      return;
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
