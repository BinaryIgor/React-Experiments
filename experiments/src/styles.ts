export const Styles = {
  baseSpacingUnit(multiplier: number = 1) {
    return `calc(var(--base-spacing-unit) * ${multiplier})`
  },
  baseFontUnit(multiplier: number = 1) {
    return `calc(var(--base-font-unit) * ${multiplier})`;
  }
};