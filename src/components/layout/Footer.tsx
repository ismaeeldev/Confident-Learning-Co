import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { primaryNavigation, legalNavigation } from "@/config/navigation";
import { brand, traderIdentity } from "@/config/brand";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-900 text-brand-cream-100 mt-auto">
      <Container>
        <div className="flex flex-col gap-12 py-16 sm:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0"
              />
              <div>
                <p className="font-heading text-lg">{brand.name}</p>
                <p className="text-brand-sage-300 text-sm">{brand.tagline}</p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
              {primaryNavigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-brand-gold-300 underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <p className="text-brand-sage-300 max-w-2xl text-sm">
            This work supports parents. It does not replace clinical care.
          </p>

          <p className="text-brand-sage-300/80 max-w-2xl text-xs leading-relaxed">
            {traderIdentity.legalName}
            <br />
            {traderIdentity.address}
            <br />
            {traderIdentity.icoRegistration}
          </p>

          <div className="border-brand-navy-700 flex flex-col gap-4 border-t pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
              {legalNavigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-brand-gold-300 underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-brand-sage-300">
              © {year} {brand.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
