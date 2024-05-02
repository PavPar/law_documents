import React from "react";
import LogoSvg from "../../../app/svg/logo.svg";
import { css } from "@emotion/css";
export enum LOGO_SIZE {
  default = "200px",
  s = "200px",
  m = "300px",
  l = "400px",
}
export type LogoProps = {
  size?: LOGO_SIZE;
};

export function Logo({ size }: LogoProps) {
  return (
    <img
      className={css`
        width: ${size || LOGO_SIZE.default};
      `}
      src={LogoSvg}
    />
  );
}
