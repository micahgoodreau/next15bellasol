"use server";
import { createClient } from "@/utils/supabase/server";
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

export async function getLights(searchString: string) {

    const supabase = await createClient();

    const lightsQuery = supabase.from('street_lights').select(`
        id,
        building,
        created_at,
        is_working,
        notes,
        updated_at,
        updated_by
      `)
      .order('is_working', { ascending: true })

    type Lights = QueryData<typeof lightsQuery>
    const { data, error } = await lightsQuery
    if (error) throw error
    const lights: Lights = data


    return lights
}