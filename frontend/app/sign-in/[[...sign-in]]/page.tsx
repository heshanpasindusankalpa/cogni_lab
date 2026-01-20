import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import circuitWiringImage from "@/public/circuit_wiring.png";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-linear-to-br from-muted/50 via-background to-muted/30" />

      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-size-[64px_64px]" />

      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-muted/50 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-muted/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="grid md:grid-cols-2">
          <div className="relative hidden min-h-140 overflow-hidden bg-muted md:block">
            <Image
              src={circuitWiringImage}
              alt="Circuit wiring illustration"
              fill
              className="object-cover opacity-50"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-muted via-muted/70 to-muted/30" />

            <div className="relative flex h-full flex-col justify-end p-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/10 px-4 py-1.5">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-foreground" />
                  <span className="text-xs font-medium tracking-wider text-muted-foreground">
                    WELCOME BACK
                  </span>
                </div>
                <h1 className="text-4xl font-bold leading-tight text-foreground">
                  Continue your
                  <br />
                  <span className="text-muted-foreground">lab journey</span>
                </h1>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Access experiments, equipment settings, and real-time lab
                  insights with a streamlined workspace.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-card p-8 md:p-12">
            <div className="w-full max-w-sm">
              <SignIn
                fallbackRedirectUrl={"/"}
                routing="path"
                path="/sign-in"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
