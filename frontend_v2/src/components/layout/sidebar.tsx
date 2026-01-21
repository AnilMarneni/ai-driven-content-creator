import Link from "next/link";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Generate", href: "/generate" },
  { name: "Templates", href: "/templates" },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r px-4 py-6">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
