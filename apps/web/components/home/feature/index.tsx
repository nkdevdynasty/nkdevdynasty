import { Users, Briefcase, Calendar } from "lucide-react";

export default function Feature() {
  return (
    <section className="relative px-6 py-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 via-background to-background" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Join Alumni Network?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Stay connected, grow your career, and be part of a thriving alumni
            community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group p-6 rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition">
              <Users className="w-6 h-6 text-primary" />
            </div>

            <h3 className="font-semibold text-lg">Networking</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Connect with alumni across industries and expand your professional
              network.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-6 rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>

            <h3 className="font-semibold text-lg">Opportunities</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Discover jobs, internships, and mentorship programs tailored for
              alumni.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-6 rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition">
              <Calendar className="w-6 h-6 text-primary" />
            </div>

            <h3 className="font-semibold text-lg">Community</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Stay engaged with events, reunions, and important college updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
