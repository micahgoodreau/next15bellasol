"use server";
import { createClient } from "@/utils/supabase/server";
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

export async function getWaterMeters(searchString: string) {

    const supabase = await createClient();

    const metersQuery = supabase.from('water_meters').select(`
        id,
        unit_number,
        is_estimated,
        notes,
        updated_at,
        updated_by,
        properties (unit_number, building_number, association_number)
      `)
      .order('is_estimated', { ascending: false })

    type WaterMeters = QueryData<typeof metersQuery>
    const { data, error } = await metersQuery;
    if (error) throw error
    const meters: WaterMeters = data;


    return meters;
}