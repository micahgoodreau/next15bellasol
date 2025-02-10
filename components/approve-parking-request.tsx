"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { approveParkingRequestAction, incrementNumberAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { formData } from "zod-form-data";


export interface FormValues {
    permit_number: string;
    permit_status: string;

  }

    const approveParkingRequestFormSchema = z.object({
        permit_number: z.string().nonempty("Permit Number is required"),
    });

export default function ApproveParkingRequest({ permit_request_id }: { permit_request_id: number }) {
    const [counter, setCounter] = useState(0);
    const { isPending, execute, data } = useServerAction(approveParkingRequestAction);
      const {
        register,
        formState: { isValid, errors },
        setError,
        reset,
      } = useForm<FormValues>({
        mode: "all",
        resolver: zodResolver(approveParkingRequestFormSchema),
      });
    return (
        <>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formValues = new FormData(e.currentTarget);
                    const permit_number = formValues.get("permit_number") as string;
                    const permit_status = formValues.get("permit_status") as string;
                    const [data, err] = await execute({ 
                        permit_number, permit_status, permit_request_id 
                })}}>
                    <div className="w-full mb-2">
                        <input
                            {...register("permit_number")}
                            placeholder="Permit Number"
                            className="mr-2 border border-black"
                        />
                        
                    </div>
                    <div className="w-full mb-2">
                        <input
                            {...register("permit_status")}
                            placeholder="Permit Number"
                            className="mr-2 border border-black"
                        />
                        
                    </div>
                    <Button
                    disabled={isPending} 
                    type="submit"
                >
                    Invoke action
                </Button>
                
                
                </form>

</>
    );
}