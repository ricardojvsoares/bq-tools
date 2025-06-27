export interface IBackoffRetryOptions {
  delayDuration?: number;
  delayDurationExponential?: boolean;
  maxAttempts?: number;
  onFail?: (error: unknown, attempt: number, maxAttempts: number) => void;
  timeout?: number;
  timeoutCustomError?: () => Error;
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const executeWithBackoffRetry = async <T>(
  fn: (attempt: number) => Promise<T>,
  options?: IBackoffRetryOptions,
): Promise<T> => {
  const maxAttempts = Math.max(options?.maxAttempts ?? 1, 1);

  let err;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (!options?.timeout) {
        return await fn(attempt);
      }

      return await Promise.race([
        fn(attempt),
        new Promise<T>((_, rej) =>
          setTimeout(
            () => rej(options.timeoutCustomError ? options.timeoutCustomError() : new Error('Execution timeout')),
            options.timeout,
          ),
        ),
      ]);
    } catch (error) {
      err = error;
      if (options?.onFail) {
        options?.onFail(error, attempt, maxAttempts);
      }

      if (attempt < maxAttempts && options?.delayDuration) {
        const delayDuration =
          options?.delayDuration * (options?.delayDurationExponential ? Math.pow(2, attempt - 1) : 1);
        await sleep(delayDuration);
      }
    }
  }

  throw err;
};
