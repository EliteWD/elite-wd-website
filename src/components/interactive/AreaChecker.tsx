"use client";

import { useId, useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionaries/en";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./interactive.module.css";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .trim();

type Result = { kind: "yes" | "no"; city: string } | { kind: "empty" } | null;

/** "Do we serve your city?" — instant, client-side lookup against the service list. */
export function AreaChecker({
  t,
  cities,
  contactHref,
  phone,
  phoneHref,
}: {
  t: Dictionary["areas"]["checker"];
  cities: string[];
  contactHref: string;
  phone: string;
  phoneHref: string;
}) {
  const inputId = useId();
  const listId = useId();
  const [result, setResult] = useState<Result>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = String(new FormData(event.currentTarget).get("city") ?? "").trim();
    if (!raw) {
      setResult({ kind: "empty" });
      return;
    }
    const match = cities.find((city) => normalize(city) === normalize(raw));
    setResult(match ? { kind: "yes", city: match } : { kind: "no", city: raw });
  }

  return (
    <div className={styles.checker} data-reveal data-testid="area-checker">
      <h3 className="t-product-name">{t.title}</h3>
      <form className={styles.checkerForm} onSubmit={onSubmit} noValidate>
        <label htmlFor={inputId} className="visually-hidden">
          {t.label}
        </label>
        <input
          id={inputId}
          name="city"
          list={listId}
          autoComplete="address-level2"
          placeholder={t.placeholder}
          className={styles.checkerInput}
        />
        <datalist id={listId}>
          {cities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        <button type="submit" className={styles.segment}>
          {t.button}
        </button>
      </form>

      <div className={styles.checkerResult} aria-live="polite" data-testid="area-result">
        {result?.kind === "empty" && <p className="t-body">{t.empty}</p>}
        {result?.kind === "yes" && (
          <>
            <p className={`t-lead ${styles.checkerYes}`}>{t.yes.replace("{city}", result.city)}</p>
            <div className={styles.checkerCta}>
              <ButtonLink href={`${contactHref}?city=${encodeURIComponent(result.city)}`}>{t.cta}</ButtonLink>
            </div>
          </>
        )}
        {result?.kind === "no" && (
          <p className="t-body">
            {t.no.replace("{city}", result.city)}{" "}
            <a href={`tel:${phoneHref}`} className="link">
              {phone}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
