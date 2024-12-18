import SearchableContacts from "./searchable-contacts";
import { createClient } from "@/utils/supabase/server";


const getContacts = async (search: string) => {
    const supabase = await createClient();
  (
    await supabase
      .from("contacts")
      .select(`id, first_name, last_name`)
      .or(`first_name.ilike.%${search}%, last_name.ilike.%${search}%`)
      .order("last_name", { ascending: true })
      .limit(25)
  ).data; //.json() as Promise<Comment[]>
}
export default async function Contacts() {
  const contacts = await getContacts("micah");

  const search = async (search: string) => {
    "use server";
    const contacts = await getContacts(search);
    return contacts;
  };

  return <SearchableContacts contacts={contacts} search={search} />;
}
