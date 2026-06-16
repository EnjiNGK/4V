import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const IDLE_MS = 20 * 60 * 1000;
const ROLE_CHECK_MS = 2.5 * 60 * 1000;
const IDLE_TICK_MS = 45 * 1000;

export type AdminLogoutReason = "idle" | "session" | "role";

type Options = {
  enabled: boolean;
  userId: string | undefined;
  onForceLogout: (reason: AdminLogoutReason) => void;
};

export function useAdminSecurity({ enabled, userId, onForceLogout }: Options) {
  const onForceLogoutRef = useRef(onForceLogout);
  onForceLogoutRef.current = onForceLogout;

  const lastActivity = useRef(Date.now());
  const bump = useCallback(() => {
    lastActivity.current = Date.now();
  }, []);

  useEffect(() => {
    if (!enabled || !userId) return;
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session?.user) {
        onForceLogoutRef.current("session");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      if (!data) onForceLogoutRef.current("role");
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, userId]);

  useEffect(() => {
    if (!enabled || !userId) return;

    const events: (keyof WindowEventMap)[] = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    const onActivity = () => bump();
    events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));
    bump();

    const idleTimer = window.setInterval(() => {
      if (Date.now() - lastActivity.current > IDLE_MS) {
        onForceLogoutRef.current("idle");
      }
    }, IDLE_TICK_MS);

    const roleTimer = window.setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        onForceLogoutRef.current("session");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!data) onForceLogoutRef.current("role");
    }, ROLE_CHECK_MS);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, onActivity));
      window.clearInterval(idleTimer);
      window.clearInterval(roleTimer);
    };
  }, [enabled, userId, bump]);
}

export function useAdminNoIndex(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow, noarchive");
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [enabled]);
}
