export const colors = {
  background: "#FBF9F6",
  surface: "#FFFFFF",
  surfaceMuted: "#F2EEE8",
  border: "#E8E4DE",
  textPrimary: "#1C1B19",
  textSecondary: "#6B6660",
  textInverse: "#FBF9F6",
  brand: "#D97757",
  brandMuted: "#F3DBCF",
  success: "#3A9D6F",
  danger: "#D64545",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: "700" as const },
  title: { fontSize: 24, lineHeight: 30, fontWeight: "700" as const },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" as const },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  button: { fontSize: 16, lineHeight: 20, fontWeight: "600" as const },
} as const;

export type TypographyVariant = keyof typeof typography;
