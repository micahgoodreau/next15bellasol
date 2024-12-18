"use client";
import { SetStateAction, useState } from "react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import Link from "next/link";


interface Contact  {
    id: string;
    last_name: string;
    first_name: string;
    contact_type: string;
}

export default function SearchableContacts({
  contacts,
  search,
}: {
  contacts: { id: string; first_name: string; last_name: string; contact_type: string; }[] | null | void;
  search: (search: string) => any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(contacts);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearchResults(await search(e.target.value));
    
  };
  console.log(searchResults);
  return (
    <div className="@container border-2 border-gray-500 rounded-xl p-2">
      <div className="flex gap-2 justify-center">
        <input
          type="text"
          className="border-2 border-gray-500 rounded-xl p-2 w-full flex-grow text-white"
          value={searchTerm}
          onChange={handleChange}
        />
        <button className="bg-blue-500 text-white rounded-xl p-2 w-full mt-2">
          Submit
        </button>
      </div>
      <h1 className="text-3xl font-bold">contacts</h1>
      <div className="flex flex-wrap items-center justify-around">
        {searchResults?.map((contact: any) => (
          <div className="p-2 text-left w-full @md:w-1/2" key={contact.id}>
            <div className="p-2 border border-gray-200 rounded-md">
              <p className="mt-4 text-xl">
                <Link href={`/contact/${contact.id}`}>
                  {contact.first_name} {contact.last_name}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}