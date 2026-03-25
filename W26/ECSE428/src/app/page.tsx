import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IT</span>
            </div>
            <span className="text-xl font-bold">ITMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Intramural Team
            <br />
            <span className="text-primary">Management System</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The comprehensive platform for McGill Athletics intramural sports.
            Manage teams, leagues, schedules, and more.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "Team Management",
              description:
                "Create teams, manage rosters, recruit players, and coordinate with your squad.",
            },
            {
              title: "League Operations",
              description:
                "View schedules, track standings, and follow your team through the season.",
            },
            {
              title: "Smart Scheduling",
              description:
                "Manage availability, resolve conflicts, and keep everyone on the same page.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-3 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
