"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ToastDemoButton() {
  return (
    <Button variant="outline" onClick={() => toast("Sample toast notification")}>
      Trigger toast
    </Button>
  );
}
