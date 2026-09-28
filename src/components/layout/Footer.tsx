import Link from "next/link";
import { href, switchLocalePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { site, allCities } from "@/content/site";
import { LogoStacked } from "./Logo";
import styles from "./Chrome.module.css";

const socialLabels: Record<keyof typeof site.social, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google",
  youtube: "YouTube",
};

export function Footer({ lang, common }: { lang: Locale; common: Dictionary["common"] }) {
  const { footer, nav } = common;
  const otherLang: Locale = lang === "en" ? "es" : "en";
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter(
    (key) => site.social[key],
  );
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <LogoStacked width={132} />
            <p>{footer.tagline}</p>
          </div>

          <div>
            <h2 className={styles.footerHeading}>{footer.products}</h2>
            <ul className={styles.footerList}>
              <li><Link href={href(lang, "windows")}>{nav.windows}</Link></li>
              <li><Link href={href(lang, "doors")}>{nav.doors}</Link></li>
              <li><Link href={href(lang, "contact")}>{common.cta.estimate}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={styles.footerHeading}>{footer.company}</h2>
            <ul className={styles.footerList}>
              <li><Link href={href(lang, "about")}>{nav.about}</Link></li>
              <li><Link href={href(lang, "areas")}>{nav.areas}</Link></li>
              {socials.map((key) => (
                <li key={key}>
                  <a href={site.social[key]} target="_blank" rel="noopener noreferrer">
                    {socialLabels[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.footerHeading}>{footer.contact}</h2>
            <ul className={styles.footerList}>
              <li><a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a></li>
              <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              <li>{site.region.name}</li>
            </ul>
          </div>
        </div>

        <p className={styles.areas}>
          <strong>{footer.areas}</strong>
          {allCities.join(" · ")}
        </p>

        <div className={styles.footerBottom}>
          <span>
            © {year} {site.name}. {footer.rights}
            {site.registered && site.insured && ` ${footer.registeredInsured}.`}
            {site.license && ` ${footer.license} ${site.license}.`}
          </span>
          <Link href={switchLocalePath(href(lang, "home"), otherLang)} hrefLang={otherLang} lang={otherLang}>
            {common.language.switchTo}
          </Link>
        </div>
      </div>
    </footer>
  );
}
