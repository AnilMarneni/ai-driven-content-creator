import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-56 border-r bg-white p-4">
      <ul className="space-y-3 text-sm">
        <li>
          <Link href="/generate" className="hover:underline">
            Generate
          </Link>
        </li>
        <li>
          <Link href="/templates" className="hover:underline">
            Templates
          </Link>
        </li>
      </ul>
    </aside>
  );
}
