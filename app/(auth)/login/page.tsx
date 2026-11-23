import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-40 items-center justify-center text-sm text-muted">
          Memuat form masuk…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
