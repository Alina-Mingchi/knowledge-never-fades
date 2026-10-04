import { describe, expect, it } from "vitest";
import { formatUsd, getTeachCopy } from "@/lib/agentCopy";
import { getTutors, normalizeTutorName, saveTutor } from "@/lib/tutors";
import { requiresManagerApproval, usesTutorialGreeting } from "@/lib/tutorial";

describe("tutorial guardrail", () => {
  it("requires approval only above $10,000", () => {
    expect(requiresManagerApproval(10000)).toBe(false);
    expect(requiresManagerApproval(10001)).toBe(true);
  });
});

describe("tutor storage", () => {
  it("trims the name and stores the selected language", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    expect(normalizeTutorName("  Finance   Guide ")).toBe("Finance Guide");
    const tutor = saveTutor("  Finance   Guide ", "zh", storage, 123);
    expect(tutor).toEqual({
      id: "tutor-123",
      name: "Finance Guide",
      languageCode: "zh",
      createdAt: 123,
    });
    expect(getTutors(storage)).toEqual([tutor]);
  });
});

describe("teach greeting", () => {
  it("uses the tutorial intro only for the Invoice Navigator tutor", () => {
    expect(usesTutorialGreeting("Invoice Navigator")).toBe(true);
    expect(usesTutorialGreeting("  invoice   navigator ")).toBe(true);
    expect(usesTutorialGreeting("Mira")).toBe(false);
    expect(usesTutorialGreeting("Finance Guide")).toBe(false);
  });
});

describe("amount readout", () => {
  it("formats the actual entered amount in each language's USD style", () => {
    expect(formatUsd("en", 12500)).toBe("$12,500");
    expect(formatUsd("de", 12500)).toBe("12.500 $");
    expect(formatUsd("ja", 12500)).toBe("$12,500");
    expect(formatUsd("zh", 12500)).toBe("$12,500");
    expect(formatUsd("en", 12500.5)).toBe("$12,500.5");
  });

  it("interpolates the amount into the coaching and guardrail lines", () => {
    const en = getTeachCopy("en");
    expect(en.coaching[2]?.includes("{amount}")).toBe(true);
    expect(en.guardrailAlert.includes("{amount}")).toBe(true);
    expect(
      en.guardrailAlert.replace("{amount}", formatUsd("en", 15000)).includes("$15,000"),
    ).toBe(true);
  });
});