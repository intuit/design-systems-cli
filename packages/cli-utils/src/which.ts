import npmWhich from 'npm-which';
import path from 'path';

const w = npmWhich(process.cwd());

/** Locate a program or locally installed node module executable. */
export default function which(cmd: string): string {
  try {
    return w.sync(cmd);
  } catch (e) {
    try {
      return w.sync(cmd, {
        cwd: __dirname
      });
    } catch (err) {
      return w.sync(cmd, {
        cwd: path.join(__dirname, '..', '..', '..')
      });
    }
  }
}
