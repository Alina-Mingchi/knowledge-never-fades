export const MANAGER_APPROVAL_LIMIT = 10000;

export function requiresManagerApproval(amount: number) {
  return Number.isFinite(amount) && amount > MANAGER_APPROVAL_LIMIT;
}