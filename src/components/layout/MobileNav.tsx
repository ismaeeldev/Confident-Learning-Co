"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { primaryNavigation, headerCta } from "@/config/navigation";
import { brand } from "@/config/brand";

/** Mobile menu (shadcn Sheet): large touch targets, locks scroll, returns focus on close. */
export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-background flex flex-col gap-8">
        <SheetHeader>
          <SheetTitle className="font-heading">{brand.name}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label="Primary">
          {primaryNavigation.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="text-brand-navy-900 hover:bg-surface-sage flex min-h-11 items-center rounded-xl px-3 text-base font-medium"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-4">
          <SheetClose asChild>
            <Button asChild className="w-full">
              <Link href={headerCta.href}>{headerCta.label}</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
