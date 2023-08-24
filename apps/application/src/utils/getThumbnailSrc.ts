export const getThumbnailSrc = ({
  height,
  url,
  width,
}: {
  url: string;
  height: number;
  width: number;
}) =>
  url
    .replace('{width}', width.toString())
    .replace('{height}', height.toString());
