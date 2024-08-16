import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const useAuthRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (isMounted) {
        if (error || !user) {
          window.location.href = '/';
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      setIsMounted(false); // Cleanup to prevent state updates if unmounted
    };
  }, [isMounted]);

  return { loading };
};

export default useAuthRedirect;
