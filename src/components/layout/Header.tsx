"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { primaryNavigation, headerCta } from "@/config/navigation";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-200",
        scrolled ? "bg-background/95 border-border border-b backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label={brand.name}>
            <Image
              src="/logo.png"
              alt={brand.name}
              width={490}
              height={93}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
            {primaryNavigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-navy-900 hover:text-brand-sage-800 text-sm font-medium whitespace-nowrap underline-offset-4 transition-colors hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button asChild className="hidden xl:inline-flex">
            <Link href={headerCta.href}>{headerCta.label}</Link>
          </Button>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
