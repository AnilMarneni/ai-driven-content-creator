import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <main style={{ padding: "16px", flex: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
