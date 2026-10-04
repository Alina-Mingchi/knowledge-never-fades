import { describe, expect, it } from "vitest";
import { getTutors, normalizeTutorName, saveTutor } from "@/lib/tutors";
import { requiresManagerApproval } from "@/lib/tutorial";

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