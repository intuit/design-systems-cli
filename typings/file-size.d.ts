declare module 'file-size' {
  export default function getSizes(
    size: number
  ): {
    human(type: string): number;
  };
}
