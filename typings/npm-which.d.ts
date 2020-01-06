declare module 'npm-which' {
  interface Options {
    env?: string;
    cwd?: string;
  }

  interface Which {
    sync: (cmd: string, options?: Options) => string;
  }

  export default function create(cwd: string): Which;
}
