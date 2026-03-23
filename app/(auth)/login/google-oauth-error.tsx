"use client";

import { useSearchParams } from "next/navigation";
import { FormError } from "@/components/ui/FormError";

export function GoogleOAuthErrorBanner() {
  const params = useSearchParams();
  const raw = params.get("error");
  if (!raw) return null;
  return <FormError message={raw} />;
}
