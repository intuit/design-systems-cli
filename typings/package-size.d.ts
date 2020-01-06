declare module 'package-size' {
  export interface Options {
    registry?: string;
    resolve?: string[] | string;
  }

  interface SizeStats {
    name: string;
    versionedName: string;
    size: number;
    minified: number;
    gzipped: number;
  }

  export default function getSizes(
    packages: string,
    options: Options
  ): SizeStats;
}
