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
const SELECTED_STORAGE_KEY = "knf-selected-tutor";

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
  target.setItem(SELECTED_STORAGE_KEY, tutor.id);
  return tutor;
}

export function getSelectedTutorId(storage?: Pick<Storage, "getItem">) {
  const target = storage ?? (typeof window === "undefined" ? undefined : window.localStorage);
  return target?.getItem(SELECTED_STORAGE_KEY) ?? DEFAULT_TUTOR.id;
}

export function setSelectedTutorId(
  id: string,
  storage?: Pick<Storage, "setItem">,
) {
  const target = storage ?? (typeof window === "undefined" ? undefined : window.localStorage);
  target?.setItem(SELECTED_STORAGE_KEY, id);
}