"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/dictionaries/en";
import { ButtonLink } from "@/components/ui/Button";
import styles from "./interactive.module.css";

type Project = keyof Dictionary["contact"]["form"]["projectOptions"];
type Answers = { project?: Project; openings?: string; city?: string };

/**
 * Three-question planner that hands its answers to the estimate form through
 * the URL (?project=&openings=&city=), where EstimateForm pre-fills them.
 */
export function ProjectPlanner({
  t,
  projectOptions,
  cities,
  contactHref,
}: {
  t: Dictionary["home"]["planner"];
  projectOptions: Dictionary["contact"]["form"]["projectOptions"];
  cities: string[];
  contactHref: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const choose = (patch: Answers) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
    setStep((s) => s + 1);
  };

  const questions = [t.questions.project, t.questions.openings, t.questions.city];
  const done = step >= 3;
  const query = new URLSearchParams(
    Object.entries(answers).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();

  return (
    <div className={styles.planner} data-reveal data-testid="planner">
      <div className={styles.progress} aria-hidden="true">
        <div className={styles.progressBar} style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }} />
      </div>

      {!done ? (
        <>
          <p className={`t-caption ${styles.plannerStep}`}>{t.step.replace("{n}", String(step + 1))}</p>
          <h3 className={`t-title ${styles.plannerQuestion}`} aria-live="polite">
            {questions[step]}
          </h3>

          <div className={styles.segments}>
            {step === 0 &&
              (Object.keys(projectOptions) as Project[]).map((key) => (
                <button key={key} type="button" className={styles.segment} onClick={() => choose({ project: key })}>
                  {projectOptions[key]}
                </button>
              ))}
            {step === 1 &&
              t.openings.map((range) => (
                <button key={range} type="button" className={styles.segment} onClick={() => choose({ openings: range })}>
                  {range}
                </button>
              ))}
            {step === 2 && (
              <>
                {cities.map((city) => (
                  <button key={city} type="button" className={styles.segment} onClick={() => choose({ city })}>
                    {city}
                  </button>
                ))}
                <button type="button" className={styles.segment} onClick={() => choose({ city: "Other" })}>
                  {t.cityOther}
                </button>
              </>
            )}
          </div>

          {step > 0 && (
            <div className={styles.plannerFooter}>
              <button type="button" className={styles.textButton} onClick={() => setStep((s) => s - 1)}>
                ‹ {t.back}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className={`t-caption ${styles.plannerStep}`}>{t.summary}</p>
          <ul className={`t-lead ${styles.summary}`} data-testid="planner-summary">
            {answers.project && <li>{projectOptions[answers.project]}</li>}
            {answers.openings && (
              <li>
                {answers.openings} {t.openingsLabel}
              </li>
            )}
            {answers.city && <li>{answers.city === "Other" ? t.cityOther : answers.city}</li>}
          </ul>
          <div className={styles.plannerFooter}>
            <ButtonLink href={`${contactHref}?${query}`} size="large">
              {t.cta}
            </ButtonLink>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
            >
              {t.restart}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
