import { supabase } from "@/integrations/supabase/client";

export async function joinClass(joinCode: string) {
  const { data, error } = await supabase.rpc("join_class", { p_join_code: joinCode.trim() });
  if (error) throw error;
  return data as string;
}

export async function linkGuardian(inviteCode: string) {
  const { data, error } = await supabase.rpc("link_guardian", {
    p_invite_code: inviteCode.trim(),
  });
  if (error) throw error;
  return data as string;
}

export async function createGuardianInvite() {
  const { data, error } = await supabase.rpc("create_guardian_invite");
  if (error) throw error;
  return data as string;
}

export function slugifySchoolName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
