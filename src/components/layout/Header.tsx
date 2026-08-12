"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { primaryNavigation, headerCta } from "@/config/navigation";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
        <div className="flex h-16 items-center justify-between gap-6 sm:h-20">
          <Link href="/" className="shrink-0" aria-label={brand.name}>
            <Image
              src="/logo.png"
              alt={brand.name}
              width={490}
              height={93}
              priority
              className="h-7 w-auto sm:h-9 lg:h-10"
            />
          </Link>

          <nav className="hidden items-center gap-8 xl:flex" aria-label="Primary">
            {primaryNavigation.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-sm font-medium whitespace-nowrap transition-colors",
                    "after:bg-brand-sage-700 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100",
                    active
                      ? "text-brand-navy-900 after:scale-x-100"
                      : "text-brand-navy-800 hover:text-brand-sage-800",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
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
