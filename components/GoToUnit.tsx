import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GoToUnitButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gotoUnit = async (formData: FormData) => {
    "use server";
    const unit_number = formData.get("unit_number") as string;
    const supabase = await createClient();
    // await supabase.auth.signOut()
    const { data: properties } = await supabase
      .from("properties")
      .select(
        `id,
      building_number`
      )
      .match({ unit_number: unit_number })
      .single();

    return redirect(
      `/building/${properties?.building_number}/${properties?.id}`
    );
  };

  return user ? (
    <div>
      <form action={gotoUnit}>
        <input
          className="rounded-md border bg-inherit px-4 py-2 w-20 h-10"
          name="unit_number"
          placeholder="Unit"
          required
        />
        <button className="py-2 ml-2 px-4 h-10 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Go
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
