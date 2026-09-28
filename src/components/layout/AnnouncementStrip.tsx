import Link from "next/link";
import { href, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import styles from "./Chrome.module.css";

export function AnnouncementStrip({ lang, text }: { lang: Locale; text: Dictionary["common"]["announcement"] }) {
  return (
    <p className={styles.strip}>
      {text.text}{" "}
      <Link href={href(lang, "contact")} className="link-arrow">
        {text.link}
      </Link>
    </p>
  );
}
