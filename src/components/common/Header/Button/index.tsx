import React from "react";
import { responsive } from "assets/scss/mixin";

import { FC } from "react";
import { styled } from "utils/styled-component";
import { COLORS } from "constants/colors";

type ButtonType = {
  name: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  inputColor: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
};

const Button: FC<ButtonType> = ({
  name,
  onClick,
  className,
  inputColor,
  type,
  disabled,
}) => {
  return (
    <StyledButton
      className={className}
      onClick={onClick}
      inputColor={inputColor}
      type={type}
      disabled={disabled}
    >
      <ButtonName>{name}</ButtonName>
    </StyledButton>
  );
};

const renderColor = (inputColor?: string) => {
  switch (inputColor) {
    case "primary":
      return `
      background: ${COLORS.BLUE};
      color: ${COLORS.WHITE};
      border: none;
      font-weight: bold;
      `;

    case "stroke":
      return `
        background: transparent;
        color: ${COLORS.WHITE};
        border: 2px solid ${COLORS.WHITE};
      `;

    case "fill":
      return `
      background:${COLORS.BLUE};
      color: ${COLORS.WHITE};
      border: none
      `;

    case "secondary":
      return `
        background: ${COLORS.BACKGROUND_DISABLED};
        color: ${COLORS.COLOR_DISABLED};
        border: 2px solid ${COLORS.WHITE};
      `;

    default:
      return `${COLORS.WHITE}`;
  }
};

const StyledButton = styled.button<{ inputColor?: string }>`
  margin: 0;
  padding: 24px 0;
  border-radius: 50px;
  cursor: pointer;
  max-width: 650px;
  transition: opacity 0.25s ease;
  padding: 10px 0;
  display: inline-block;
  min-width: 96px;
  max-height: 40px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ inputColor }) => renderColor(inputColor)};
  &:focus {
    outline: 0;
  }
  &:disabled,
  &[disabled] {
    background-color: ${COLORS.BACKGROUND_DISABLED};
    color: ${COLORS.COLOR_DISABLED};
  }

  ${responsive.sm`
    padding: 20px
  `}
  &:hover {
    opacity: 0.8;
  }
`;

const ButtonName = styled.span`
  font-size: 16px;
  white-space: nowrap;
  ${responsive.sm`
    font-size: 16px;
  `}
`;

export default Button;
