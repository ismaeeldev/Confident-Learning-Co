import { PUBLIC_ROUTES } from "./canon";

export interface NavLink {
  label: string;
  href: string;
}

export const primaryNavigation: NavLink[] = [
  { label: "The Reflection", href: PUBLIC_ROUTES.reflection },
  { label: "The Parent Guide", href: PUBLIC_ROUTES.parentGuide },
  { label: "Inside the Loop", href: PUBLIC_ROUTES.insideTheLoop },
  { label: "Articles", href: PUBLIC_ROUTES.articles },
  { label: "About", href: PUBLIC_ROUTES.about },
];

export const secondaryNavigation: NavLink[] = [
  { label: "Work With Us Closely", href: PUBLIC_ROUTES.workWithUs },
];

export const headerCta: NavLink = {
  label: "Take the 5-Minute Parent Reflection",
  href: PUBLIC_ROUTES.reflection,
};

export const legalNavigation: NavLink[] = [
  { label: "Privacy", href: PUBLIC_ROUTES.privacy },
  { label: "Terms", href: PUBLIC_ROUTES.terms },
  { label: "Cookies", href: PUBLIC_ROUTES.cookies },
  { label: "Refund Policy", href: PUBLIC_ROUTES.refundPolicy },
];
