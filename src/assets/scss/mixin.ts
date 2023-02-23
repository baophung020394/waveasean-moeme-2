import { css, CSSObject } from "styled-components";

type breakpointsType = {
  [key: string]: any;
};
// Breakpoints
export const breakpoints: breakpointsType = {
  xs: 0,
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1400px",
};

export const responsive = Object.keys(breakpoints).reduce(
  (accumulator: { [key: string]: any }, label) => {
    accumulator[label] = (
      ...args: [TemplateStringsArray | CSSObject]
    ): any => css`
      @media (max-width: ${breakpoints[label]}) {
        ${css(...args)};
      }
    `;
    return accumulator;
  },
  {}
);
