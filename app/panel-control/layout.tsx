import Link from "next/link";
import type { Metadata } from "next";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/panel-control", label: "Resumen" },
  { href: "/panel-control/baterias", label: "Baterías" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900">
      <header className="border-b border-gold/15 bg-ink-800">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <p className="font-condensed text-lg font-black text-sand-100 uppercase tracking-wide">
              Panel <span className="text-gold">Luaidesa</span>
            </p>
            <nav className="hidden sm:flex items-center gap-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sand-100/60 hover:text-gold text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <LogoutButton />
        </div>
        <nav className="sm:hidden flex items-center gap-5 px-5 pb-3 -mt-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sand-100/60 hover:text-gold text-xs font-medium">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-5 py-10">{children}</main>
    </div>
  );
}
