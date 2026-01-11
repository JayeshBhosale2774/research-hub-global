import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface AuditLogEntry {
  action: string;
  table_name: string;
  record_id?: string;
  details?: Record<string, unknown>;
}

export async function logAdminAction(entry: AuditLogEntry) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  await supabase.from("admin_audit_logs").insert([{
    admin_id: user.id,
    action: entry.action,
    table_name: entry.table_name,
    record_id: entry.record_id,
    details: (entry.details || {}) as Json,
  }]);
}

export function useAuditLog() {
  const log = async (entry: AuditLogEntry) => {
    await logAdminAction(entry);
  };

  return { log };
}
