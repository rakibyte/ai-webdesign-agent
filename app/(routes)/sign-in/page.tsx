'use client';

import React from 'react';
import { SignIn } from '@insforge/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-4">
        <SignIn />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
