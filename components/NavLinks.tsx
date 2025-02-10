"use client";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "Recent Sales",
    href: "/sales",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Search Contacts",
    href: "/contact/search",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Search Property Managers",
    href: "/propertymanagers/search",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Search Parking Permits",
    href: "/parking/permits/search",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Add Parking Permits",
    href: "/parking/permits/add",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Parking Permit Requests to Approve",
    href: "/parkingpermitrequests",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Search LeePa Owners",
    href: "/leepa",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Units by Building",
    href: "/building/1",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Water Meters",
    href: "/watermeters",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Street Lights List",
    href: "/lights",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Street Lights Map",
    href: "https://www.arcgis.com/apps/mapviewer/index.html?webmap=47399985b1254ce6b6f03cc6c4fb7a05",
    target: "_blank",
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            target={link.target}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-gray-800 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-300 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
