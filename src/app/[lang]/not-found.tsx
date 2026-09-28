import { lang } from "next/root-params";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/Sections";
import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, hasLocale, href } from "@/lib/i18n";

export default async function NotFound() {
  const value = await lang();
  const locale = hasLocale(value) ? value : defaultLocale;
  const { notFound } = getDictionary(locale);

  return (
    <PageHero
      label="404"
      title={notFound.title}
      subtitle={notFound.body}
      actions={<ButtonLink href={href(locale, "home")}>{notFound.home}</ButtonLink>}
    />
  );
}
