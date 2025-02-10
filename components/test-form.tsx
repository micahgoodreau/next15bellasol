'use client'

import { useActionState } from 'react'
import { addTest } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ActionResponseTestForm } from '@/types'
import { CheckCircle2 } from 'lucide-react'


const initialState: ActionResponseTestForm = {
  success: false,
  message: '',
}

export default function TestForm() {

  const [state, action, isPending] = useActionState(addTest, initialState)

  return (
    <div>
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
        <CardDescription>Please enter your shipping address details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6" autoComplete="on">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="First Name"
                required
                minLength={5}
                maxLength={100}
                autoComplete="first-name"
                aria-describedby="firstName-error"
                className={state?.errors?.first_name ? 'border-red-500' : ''}
              />
              {state?.errors?.first_name && (
                <p id="streetAddress-error" className="text-sm text-red-500">
                  {state.errors.first_name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Last Name"
                maxLength={20}
                autoComplete="last-name"
                aria-describedby="lastName-error"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  placeholder="Business Name"
                  required
                  minLength={2}
                  maxLength={50}
                  autoComplete="business-name"
                  aria-describedby="business_name-error"
                  className={state?.errors?.business_name ? 'border-red-500' : ''}
                />
                {state?.errors?.business_name && (
                  <p id="city-error" className="text-sm text-red-500">
                    {state.errors.business_name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_type">Contact Type</Label>
                <Input
                  id="contact_type"
                  name="contact_type"
                  placeholder="OWNER | OWNER GUEST/RELATIVE | TENANT | PROPERTY MANAGER"
                  required
                  minLength={2}
                  maxLength={50}
                  autoComplete="contact-type"
                  aria-describedby="contact_type-error"
                  className={state?.errors?.contact_type ? 'border-red-500' : ''}
                />
                {state?.errors?.contact_type && (
                  <p id="state-error" className="text-sm text-red-500">
                    {state.errors.contact_type[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property_id">Property Id</Label>
                <Input
                  id="property_id"
                  name="property_id"
                  placeholder="Property Id"
                  required
                  maxLength={25}
                  autoComplete="property-id"
                  aria-describedby="property_id-error"
                  className={state?.errors?.property_id ? 'border-red-500' : ''}
                />
                {state?.errors?.property_id && (
                  <p id="zipCode-error" className="text-sm text-red-500">
                    {state.errors.property_id[0]}
                  </p>
                )}
              </div>

            </div>
          </div>

          {state?.message && (
            <>
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success && <CheckCircle2 className="h-4 w-4" />}
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
            </>
          )}


          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Address'}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

