export const MANAGER_APPROVAL_LIMIT = 10000;

export function requiresManagerApproval(amount: number) {
  return Number.isFinite(amount) && amount > MANAGER_APPROVAL_LIMIT;
}

export const TUTORIAL_TUTOR = "invoice navigator";

/** Only this tutor opens Teach with the "let's start the tutorial" intro. */
export function usesTutorialGreeting(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase() === TUTORIAL_TUTOR;
}