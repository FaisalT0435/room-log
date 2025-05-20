import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (!data.isLoggedIn) router.push('/login');
        else setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
};