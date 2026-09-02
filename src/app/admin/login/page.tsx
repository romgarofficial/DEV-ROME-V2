import { AmbientStage } from "@/components/site/ambient-stage";
import { SiteHeader } from "@/components/site/site-header";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <AmbientStage />
      <SiteHeader />
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pt-24 pb-10">
        <LoginForm />
      </div>
    </div>
  );
}
