'use client';

import React, { useState, useEffect } from 'react';
import { SignIn, SignUp, useAuth } from '@insforge/nextjs';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  mode?: 'sign-in' | 'sign-up';
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export function AuthModal({
  mode = 'sign-in',
  triggerText,
  triggerVariant = 'outline',
}: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>(mode);
  const { isSignedIn } = useAuth();

  // Close modal when user signs in successfully
  useEffect(() => {
    if (isSignedIn && open) {
      setOpen(false);
    }
  }, [isSignedIn, open]);

  const defaultText = authMode === 'sign-in' ? 'Login' : 'Sign up';

  return (
    <>
      <Button
        variant={triggerVariant}
        onClick={() => {
          setAuthMode(mode);
          setOpen(true);
        }}
      >
        {triggerText || defaultText}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px] p-6 max-h-[90vh] overflow-y-auto">
          {authMode === 'sign-in' ? (
            <div>
              <SignIn />
              <div className="mt-4 text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="text-primary underline hover:opacity-80 font-medium"
                  onClick={() => setAuthMode('sign-up')}
                >
                  Sign up
                </button>
              </div>
            </div>
          ) : (
            <div>
              <SignUp />
              <div className="mt-4 text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-primary underline hover:opacity-80 font-medium"
                  onClick={() => setAuthMode('sign-in')}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
