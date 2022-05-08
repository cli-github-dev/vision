import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface Me {
  ok: boolean;
  me?: User;
  error?: object | string;
}

export default function useUser() {
  const { data, error } = useSWR<Me>('/api/users/me');
  const router = useRouter();

  useEffect(() => {
    if (data?.ok) {
      router.replace('/users/table');
    }
  }, [data, router]);

  useEffect(() => {
    if (error) {
      console.log(`[useUser] : ${error}`);
    }
  }, [error]);

  return { me: data?.me, isLoading: !data && !error };
}
