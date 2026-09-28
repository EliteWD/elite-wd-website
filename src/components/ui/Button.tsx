import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "outlineLight" | "capsule";
type Size = "compact" | "regular" | "large";

type Common = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
};

function classes({ variant = "primary", size = "regular", block, className }: Omit<Common, "children">) {
  return [styles.base, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(" ");
}

/** Pill link. External (tel:, mailto:, https:) hrefs render a plain anchor. */
export function ButtonLink({
  href,
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<"a">, "className" | "children"> & { href: string }) {
  const cls = classes({ variant, size, block, className });
  if (/^(tel:|mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={classes({ variant, size, block, className })} {...rest}>
      {children}
    </button>
  );
}

/** Dark Pricing Capsule — non-interactive label that sits beside the Blue Pill. */
export function Capsule({ size, className, children }: Omit<Common, "variant" | "block">) {
  return <span className={classes({ variant: "capsule", size, className })}>{children}</span>;
}
