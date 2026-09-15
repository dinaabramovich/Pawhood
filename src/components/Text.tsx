import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { colors, typography, type TypographyVariant } from "@/theme/tokens";

type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: keyof typeof colors;
};

export function Text({ variant = "body", color = "textPrimary", style, ...rest }: TextProps) {
  return <RNText style={[typography[variant], { color: colors[color] }, style]} {...rest} />;
}
