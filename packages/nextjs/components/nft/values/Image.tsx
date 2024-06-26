"use client";

import { Style, beautyStyleMap } from "../../../types/Types";

export type ImageProps = {
  value: string | undefined;
  alt: string;
  style?: Style;
};

export const Image = ({ value, alt = "Image", style = "rounded" }: ImageProps) => {
  console.log(value);

  return (
    <>
      {/* eslint-disable-next-line*/}
      <img src={value} alt={alt} className={`bg-base-300 ${beautyStyleMap[style]}`} />
    </>
  );
};
