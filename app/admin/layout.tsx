export const dynamic = "force-dynamic";
export const revalidate = false;
export const fetchCache = "force-no-store";
export const dynamicParams = true;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
