"use client"

import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { useToast } from "@/hooks/use-toast"
import { saveParkingPermitRequestAction, saveUserAction } from "@/app/actions-parking-permit"
import { InputWithLabel } from "./InputWithLabel"
import { DisplayServerActionResponse } from "./DisplayServerActionResponse"
import { ParkingPermitRequest, ParkingPermitRequestSchema } from "@/schemas/ParkingPermitRequest"

type Props = {
    parkingPermitRequest: ParkingPermitRequest
}

// Pattern #3: Hook Callbacks - best choice!!
export default function ApproveParkingRequest2({ parkingPermitRequest }: Props) {
    const router = useRouter()
    const { toast } = useToast()
    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
    const { executeAsync, result, isExecuting } = useAction(saveParkingPermitRequestAction, {
        onSuccess: async ({ data }) => {
            toast({
                variant: "default",
                title: "Success! 🎉",
                description: data?.message,
            });
            await delay(2000)
            
            router.back();
            router.refresh()
        },
        onError: ({ error }) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User Did Not Update",
            })
        },
    })

    const form = useForm<ParkingPermitRequest>({
        resolver: zodResolver(ParkingPermitRequestSchema),
        defaultValues: { ...parkingPermitRequest },
    })

    useEffect(() => {
        // boolean value to indicate form has not been saved
        localStorage.setItem("userFormModified", form.formState.isDirty.toString())
    }, [form.formState.isDirty])

    async function onSubmit() {
        /* No need to validate here because 
        react-hook-form already validates with 
        our Zod schema */

        // Test validation errors: 
        // executeAsync({
        //     id: 9,
        //     firstname: "D",
        //     lastname: "G",
        //     email: "davegray.codes",
        // })
        await executeAsync(form.getValues())
        router.refresh() // could grab a new timestamp from db
        // reset dirty fields
        form.reset(form.getValues())
    }

    return (
        <div>

            <DisplayServerActionResponse result={result} />
            <h1>Approve Parking Permit Request</h1>
            <div className="flex gap-4">
                {parkingPermitRequest.unit_number} {parkingPermitRequest.first_name} {parkingPermitRequest.last_name}
            </div>
            <div className="flex gap-4">
                {parkingPermitRequest.contact_email} {parkingPermitRequest.contact_phone}
            </div>
            <div className="flex gap-4">
                {parkingPermitRequest.vehicle_year} {parkingPermitRequest.vehicle_make} {parkingPermitRequest.vehicle_model} {parkingPermitRequest.vehicle_color}
            </div>
            <div className="flex gap-4">
            {parkingPermitRequest.vehicle_plate_number} {parkingPermitRequest.vehicle_plate_state}
            </div>
            <Form {...form}>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit(onSubmit)();
                }}>

                    <InputWithLabel
                    fieldTitle="Permit Number"
                    nameInSchema="permit_number"
                    labelLeft={true}
                    />
                    <InputWithLabel
                    fieldTitle="Permit Status"
                    nameInSchema="permit_status"
                    labelLeft={true}
                    />
                    <InputWithLabel
                    fieldTitle="Admin Notes"
                    nameInSchema="admin_notes"
                    labelLeft={true}
                    />
                    <div className="flex gap-4">
                        <Button>{isExecuting ? "Working..." : "Submit"}</Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => form.reset()}
                        >Reset</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}