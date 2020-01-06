declare module 'copy-template-dir' {
  export default function template(
    source: string,
    output: string,
    options: any,
    cb: (err: Error, createdFiles: string[]) => void
  ): void;
}
