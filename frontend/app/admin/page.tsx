import type { Metadata } from "next";
import AdminPageClient from "@/app/admin/page";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Protected demo admin dashboard for Pride Auto Store operations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPageClient />;
}
