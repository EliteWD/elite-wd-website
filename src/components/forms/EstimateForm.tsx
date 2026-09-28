"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import styles from "./EstimateForm.module.css";

type Props = {
  lang: Locale;
  t: Dictionary["contact"]["form"];
  cities: string[];
  endpoint: string;
  phone: string;
  phoneHref: string;
};

type Field = "name" | "phone" | "email" | "city" | "project" | "propertyType" | "timeline";
type ChoiceField = "project" | "propertyType" | "timeline";
type Status = "idle" | "sending" | "success" | "notConnected" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Partial<Record<Field, true>> {
  const errors: Partial<Record<Field, true>> = {};
  const get = (key: string) => String(data.get(key) ?? "").trim();
  if (get("name").length < 2) errors.name = true;
  if (get("phone").replace(/\D/g, "").length < 10) errors.phone = true;
  if (!emailPattern.test(get("email"))) errors.email = true;
  if (!get("city")) errors.city = true;
  if (!get("project")) errors.project = true;
  if (!get("propertyType")) errors.propertyType = true;
  if (!get("timeline")) errors.timeline = true;
  return errors;
}

export function EstimateForm({ lang, t, cities, endpoint, phone, phoneHref }: Props) {
  const [errors, setErrors] = useState<Partial<Record<Field, true>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  // Pre-fill from the project planner / area checker (?project=&openings=&city=).
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const project = params.get("project");
    const city = params.get("city");
    const openings = params.get("openings");

    if (project && project in t.projectOptions) {
      form.querySelector<HTMLInputElement>(`input[name="project"][value="${project}"]`)?.click();
    }
    if (city) {
      const select = form.elements.namedItem("city") as HTMLSelectElement | null;
      if (select) select.value = cities.includes(city) ? city : "Other";
    }
    if (openings) {
      const message = form.elements.namedItem("message") as HTMLTextAreaElement | null;
      if (message && !message.value) message.value = `${t.openings}: ${openings}`;
    }
  }, [cities, t]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Bots fill the hidden field; silently accept and drop.
    if (data.get("company")) {
      setStatus("success");
      return;
    }

    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!endpoint) {
      setStatus("notConnected");
      return;
    }

    setStatus("sending");
    try {
      data.delete("company");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const fieldClass = (field: Field, base: string) => `${base} ${errors[field] ? styles.invalid : ""}`;
  const describedBy = (field: Field) => (errors[field] ? `${field}-error` : undefined);

  /** Single-answer question rendered as pill buttons (radio group). */
  const choice = (name: ChoiceField, legend: string, options: Record<string, string>) => (
    <fieldset
      className={`${styles.segmented} ${styles.full}`}
      aria-invalid={errors[name]}
      aria-describedby={describedBy(name)}
    >
      <legend className={styles.label}>{legend}</legend>
      {Object.entries(options).map(([value, text]) => (
        <label key={value} className={styles.segment}>
          <input type="radio" name={name} value={value} />
          <span>{text}</span>
        </label>
      ))}
      {errors[name] && (
        <span id={`${name}-error`} className={`${styles.error} ${styles.full}`} style={{ width: "100%" }}>
          {t.errors[name]}
        </span>
      )}
    </fieldset>
  );

  if (status === "success") {
    return (
      <p className={styles.status} role="status">
        {t.success}
      </p>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <input type="hidden" name="language" value={lang} />
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="name" className={styles.label}>{t.name}</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={errors.name}
          aria-describedby={describedBy("name")}
          className={fieldClass("name", styles.input)}
        />
        {errors.name && <span id="name-error" className={styles.error}>{t.errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>{t.phone}</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          aria-invalid={errors.phone}
          aria-describedby={describedBy("phone")}
          className={fieldClass("phone", styles.input)}
        />
        {errors.phone && <span id="phone-error" className={styles.error}>{t.errors.phone}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>{t.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={errors.email}
          aria-describedby={describedBy("email")}
          className={fieldClass("email", styles.input)}
        />
        {errors.email && <span id="email-error" className={styles.error}>{t.errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>{t.city}</label>
        <select
          id="city"
          name="city"
          required
          defaultValue=""
          aria-invalid={errors.city}
          aria-describedby={describedBy("city")}
          className={fieldClass("city", styles.select)}
        >
          <option value="" disabled>{t.cityPlaceholder}</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
          <option value="Other">{t.cityOther}</option>
        </select>
        {errors.city && <span id="city-error" className={styles.error}>{t.errors.city}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="openings" className={styles.label}>{t.openings}</label>
        <input
          id="openings"
          name="openings"
          type="number"
          min={1}
          max={200}
          inputMode="numeric"
          placeholder={t.openingsPlaceholder}
          className={styles.input}
        />
      </div>

      {choice("project", t.project, t.projectOptions)}
      {choice("propertyType", t.propertyType, t.propertyTypeOptions)}
      {choice("timeline", t.timeline, t.timelineOptions)}

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="message" className={styles.label}>{t.message}</label>
        <textarea id="message" name="message" rows={4} className={styles.textarea} />
      </div>

      <div className={`${styles.footer} ${styles.full}`}>
        {(status === "notConnected" || status === "error") && (
          <p className={styles.status} role="alert">
            {status === "notConnected" ? t.notConnected : t.error}{" "}
            <a href={`tel:${phoneHref}`}>{phone}</a>
          </p>
        )}
        <Button type="submit" size="large" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </Button>
        <p className={styles.privacy}>{t.privacy}</p>
      </div>
    </form>
  );
}
