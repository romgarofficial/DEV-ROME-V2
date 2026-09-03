export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (password) => password.length >= 8 },
  { id: "lower", label: "One lowercase letter", test: (password) => /[a-z]/.test(password) },
  { id: "upper", label: "One uppercase letter", test: (password) => /[A-Z]/.test(password) },
  { id: "number", label: "One number", test: (password) => /\d/.test(password) },
  { id: "symbol", label: "One symbol (!@#…)", test: (password) => /[^A-Za-z0-9]/.test(password) },
];

export function unmetPasswordRules(password: string) {
  return PASSWORD_RULES.filter((rule) => !rule.test(password));
}

export function passwordMeetsRequirements(password: string) {
  return unmetPasswordRules(password).length === 0;
}

export function passwordStrength(password: string) {
  if (!password) return { score: 0, label: "" };
  const score = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  if (score <= 2) return { score, label: "Weak" };
  if (score === 3) return { score, label: "Fair" };
  if (score === 4) return { score, label: "Good" };
  return { score, label: "Strong" };
}
