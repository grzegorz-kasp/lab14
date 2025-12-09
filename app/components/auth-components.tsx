import { signIn, signOut } from '@/lib/auth';
import { ReactNode } from 'react';

type SignInProps = {
  provider?: string;
  redirectTo?: string;
  buttonClassName?: string;
  children?: ReactNode;
};

export function SignIn({
  provider = 'github',
  redirectTo,
  buttonClassName = 'bg-neutral-700 text-white p-2 rounded-md',
  children,
}: SignInProps) {
  return (
    <form
      action={async () => {
        'use server';
        if (redirectTo) {
          await signIn(provider, { redirectTo });
        } else {
          await signIn(provider);
        }
      }}
    >
      <button className={buttonClassName}>
        {children ?? `Zaloguj się z ${provider}`}
      </button>
    </form>
  );
}

type SignOutProps = {
  buttonClassName?: string;
  children?: ReactNode;
  redirectTo?: string;
  formClassName?: string;
};

export function SignOut({
  redirectTo,
  buttonClassName = 'bg-neutral-700 text-white p-2 rounded-md',
  children,
  formClassName = 'w-full',
}: SignOutProps) {
  return (
    <form
      action={async () => {
        'use server';
        if (redirectTo) {
          await signOut({ redirectTo });
        } else {
          await signOut();
        }
      }}
      className={formClassName}
    >
      <button className={buttonClassName}>
        {children ?? 'Wyloguj się'}
      </button>
    </form>
  );
}
