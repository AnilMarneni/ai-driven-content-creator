import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">✨ AI Content Studio</h1>

      <div className="flex gap-2">
        <Button variant="outline">Docs</Button>
        <Button>Generate</Button>
      </div>
    </header>
  );
}
