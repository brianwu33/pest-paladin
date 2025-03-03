// app/components/AuthRedirect.tsx
'use client'; // Mark this as a client component

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

export function AuthRedirect() {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to finish loading

    // Example redirect logic:
    // If user is signed in and on '/', push to '/dashboard'
    if (isSignedIn && pathname === '/') {
      router.push('/dashboard');
    }
    // If user is signed out and NOT on '/', push to '/'
    if (!isSignedIn && pathname !== '/') {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  return null; // This component doesn't render anything visible
}