declare module 'progress-estimator' {
  import { Chalk } from 'chalk';

  export interface Spinner {
    interval: number;
    frames: string[];
  }

  export interface ChalkTheme extends Chalk {
    asciiCompleted: Chalk;
    asciiInProgress: Chalk;
    estimate: Chalk;
    estimateExceeded: Chalk;
    label: Chalk;
    percentage: Chalk;
    progressBackground: Chalk;
    progressForeground: Chalk;
  }

  export interface Configuration {
    spinner?: Spinner;
    storagePath?: string;
    theme?: ChalkTheme;
  }

  export type ProgressEstimator = <T>(
    promise: Promise<T>,
    label: string,
    estimatedDuration?: number
  ) => Promise<T>;

  const configure: (options: Configuration) => ProgressEstimator;

  export default configure;
}
