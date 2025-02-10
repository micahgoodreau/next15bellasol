export interface AddressFormData {
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  export interface ActionResponse {
    success: boolean;
    message: string;
    errors?: {
      [K in keyof AddressFormData]?: string[];
    };
  }
  
  export interface TestFormData  {
    first_name: string;
    last_name: string;
    business_name: string;
    contact_type: string;
    property_id: string;
  }
  export interface ActionResponseTestForm {
    success: boolean;
    message: string;
    errors?: {
      [P in keyof TestFormData]?: string[];
    };
  }

  export interface ParkingPermitFromRequest {
    admin_notes: string | null
    contact_email: string | null
    contact_phone: string | null
    created_at: string
    first_name: string | null
    id: number
    last_name: string | null
    permit_number: string | null
    permit_status: string | null
    request_notes: string | null
    unit_number: string | null
    updated_at: string | null
    updated_by: string | null
    vehicle_color: string | null
    vehicle_make: string | null
    vehicle_model: string | null
    vehicle_plate_number: string | null
    vehicle_plate_state: string | null
    vehicle_year: string | null
  }