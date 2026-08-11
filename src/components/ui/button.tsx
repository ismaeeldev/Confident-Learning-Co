import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex max-w-full shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-center text-base font-semibold text-wrap transition-all duration-200 outline-none select-none focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gold-500 text-brand-navy-950 hover:not-active:-translate-y-px hover:bg-brand-gold-600 active:bg-brand-gold-700 active:translate-y-0",
        outline:
          "border-brand-navy-700 bg-transparent text-brand-navy-900 hover:bg-brand-sage-100",
        secondary:
          "border-brand-sage-600 bg-transparent text-brand-sage-800 hover:bg-brand-sage-100",
        ghost: "text-brand-navy-900 hover:bg-brand-sage-100",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "rounded-none border-none p-0 text-brand-sage-800 underline underline-offset-4 hover:text-brand-navy-900",
      },
      size: {
        default:
          "min-h-12 gap-2 px-6 py-2.5 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        sm: "min-h-10 gap-1.5 rounded-xl px-4 py-2 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "min-h-14 gap-2 px-8 py-3 text-lg has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-12",
        "icon-sm": "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
