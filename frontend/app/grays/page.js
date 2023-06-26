'use client';

import { measurements } from '@/api';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  // const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: measurements.queryKey,
    queryFn: measurements.all,
  });
  /* const mutation = useMutation({
   *   mutationFn: measurements.create,
   *   onSuccess: () => {
   *     queryClient.invalidateQueries(measurements.queryKey);
   *   },
   * }); */

  if (query.isLoading) {
    return null;
  }

  return null;
}
