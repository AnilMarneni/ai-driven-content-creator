import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-56 border-r p-4 bg-white">
      <ul className="space-y-3">
        <li>
          <Link href="/generate" className="text-sm hover:underline">
            Generate
          </Link>
        </li>
        <li>
          <Link href="/templates" className="text-sm hover:underline">
            Templates
          </Link>
        </li>
      </ul>
    </aside>
  );
}
