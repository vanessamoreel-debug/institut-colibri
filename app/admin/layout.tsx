// /app/admin/layout.tsx
import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-title">Tableau de bord</div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
