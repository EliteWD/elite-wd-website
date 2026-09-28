import { ButtonLink } from "@/components/ui/Button";
import styles from "./Chrome.module.css";

type Props = {
  title: string;
  links: { id: string; label: string }[];
  cta: { href: string; label: string };
};

/** Sticky product-section navigation used on the product pages. */
export function LocalNav({ title, links, cta }: Props) {
  return (
    <div className={styles.localWrap}>
      <nav className={styles.local} aria-label={title}>
        <span className={styles.localTitle}>{title}</span>
        <ul className={styles.localLinks}>
          {links.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className={styles.localLink}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <ButtonLink href={cta.href} size="compact">
          {cta.label}
        </ButtonLink>
      </nav>
    </div>
  );
}
