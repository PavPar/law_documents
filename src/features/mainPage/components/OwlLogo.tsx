import React from "react";
import LogoSvg from "../../../app/svg/owl.svg";
import { css } from "@emotion/css";
export enum OWL_LOGO_SIZE {
  default = "200px",
  s = "100px",
  m = "200px",
  l = "300px",
}
export type OwlLogoProps = {
  size?: OWL_LOGO_SIZE;
};

export function OwlLogo({ size }: OwlLogoProps) {
  return (
    <img
      className={css`
        width: ${size || OWL_LOGO_SIZE.default};
      `}
      src={LogoSvg}
    />
  );
}
