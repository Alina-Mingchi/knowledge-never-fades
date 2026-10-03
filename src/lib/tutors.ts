export interface Tutor {
  id: string;
  name: string;
  languageCode: string;
  createdAt: number;
}

export const DEFAULT_TUTOR: Tutor = {
  id: "mira-default",
  name: "Mira",
  languageCode: "en",
  createdAt: 0,
};

const STORAGE_KEY = "knf-tutors";

export function normalizeTutorName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function getTutors(storage?: Pick<Storage, "getItem">): Tutor[] {
  const target = storage ?? (typeof window === "undefined" ? undefined : window.localStorage);
  if (!target) return [];

  try {
    const parsed: unknown = JSON.parse(target.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Tutor =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Tutor).id === "string" &&
        typeof (item as Tutor).name === "string" &&
        typeof (item as Tutor).languageCode === "string" &&
        typeof (item as Tutor).createdAt === "number",
    );
  } catch {
    return [];
  }
}

export function saveTutor(
  name: string,
  languageCode: string,
  storage?: Pick<Storage, "getItem" | "setItem">,
  now = Date.now(),
) {
  const normalizedName = normalizeTutorName(name);
  if (!normalizedName) return null;

  const target = storage ?? (typeof window === "undefined" ? undefined : window.localStorage);
  if (!target) return null;

  const tutor: Tutor = {
    id: `tutor-${now}`,
    name: normalizedName,
    languageCode,
    createdAt: now,
  };
  target.setItem(STORAGE_KEY, JSON.stringify([...getTutors(target), tutor]));
  return tutor;
}