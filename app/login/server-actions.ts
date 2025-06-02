"use server";
import { redirect } from "next/navigation";
import { createServerActionClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const supabase = await createServerActionClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  redirect("/dashboard");
}

export async function seedAdminAction() {
  const supabase = createServiceRoleClient();
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error && !error.message.toLowerCase().includes("already registered")) throw new Error(error.message);
  if (data?.user?.id) {
    await supabase.from("profiles").upsert({ id: data.user.id, email, role: "admin", full_name: "Platform Admin" });
  }
  redirect("/login");
}
