declare module 'playroom/lib' {
  type ErrorCallback = (e: Error) => void;

  interface Commands {
    start: (cb: ErrorCallback) => void;
    build: (cb: ErrorCallback) => void;
  }

  interface Config {
    cwd?: string;
  }

  export default function load(config: Config): Commands;
}
