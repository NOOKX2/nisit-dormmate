"use client";

import { useEffect } from "react";
import type { User } from "@prisma/client";
import { useAuth } from "@/context/AuthContext";

type SafeUser = Omit<User, "password">;

export function DashboardAuthSync({ user }: { user: SafeUser }) {
  const { login } = useAuth();

  useEffect(() => {
    login(user);
    // login จาก Context ไม่ได้ memo — sync ครั้งเดียวต่อ user id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return null;
}
