import { href, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./Chrome.module.css";

/** Phone-only sticky bar: the two actions a homeowner needs at any scroll depth. */
export function MobileActionBar({ lang, common }: { lang: Locale; common: Dictionary["common"] }) {
  return (
    <div className={styles.actionBar} data-testid="mobile-action-bar">
      <ButtonLink href={`tel:${site.contact.phoneHref}`} variant="outline" block>
        {common.cta.call}
      </ButtonLink>
      <ButtonLink href={href(lang, "contact")} block>
        {common.cta.estimateShort}
      </ButtonLink>
    </div>
  );
}
