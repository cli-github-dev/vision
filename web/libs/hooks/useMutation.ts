import { useState } from 'react';

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: any;
  controller?: AbortController;
}

type UseMutationResult<T> = [(data: any) => Promise<void>, UseMutationState<T>];

export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
    controller: new AbortController(),
  });

  if (state.controller?.signal?.aborted) {
    setState((prev) => ({ ...prev, controller: new AbortController() }));
  }

  async function mutation(data: any) {
    setState((prev) => ({ ...prev, loading: true }));
    const timeoutId = setTimeout(() => state.controller?.abort(), 60_000);

    try {
      const result = await (
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: state.controller?.signal,
        })
      ).json();
      setState((prev) => ({
        ...prev,
        data: result,
        loading: false,
      }));
    } catch (error) {
      console.log(`[useMutation] ${error}`);
      setState((prev) => ({ ...prev, error, loading: false }));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return [mutation, { ...state }];
}
