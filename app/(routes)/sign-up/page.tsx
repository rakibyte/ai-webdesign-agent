'use client';

import React from 'react';
import { SignUp } from '@insforge/nextjs';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-4">
        <SignUp />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
