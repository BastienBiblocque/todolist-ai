'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Logout failed:', error);
        router.push('/');
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}
