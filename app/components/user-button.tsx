import Link from "next/link";
import { SignOut as SignOutForm } from "@/app/components/auth-components";

type UserShape = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function UserButton({ user }: { user: UserShape | null | undefined }) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
      >
        Zaloguj się
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.image && (
        <img 
          src={user.image} 
          alt={user.name || "User"} 
          className="w-8 h-8 rounded-full"
        />
      )}
      <span className="text-sm text-white">
        {user.name || user.email}
      </span>
      <SignOutForm
        redirectTo="/"
        buttonClassName="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        formClassName="inline-block"
      />
    </div>
  );
}
