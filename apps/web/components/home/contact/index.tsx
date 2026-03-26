import { AlumniForm } from "@/components/common/form/index";

export function Contact() {
  return (
    <section className="">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE (CONTENT) */}
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Join Alumni Network
          </h2>

          <p className="text-muted-foreground text-base md:text-lg">
            Stay connected with your college community. Reconnect with friends,
            explore opportunities, and grow together as alumni of{" "}
            <span className="font-medium text-foreground">
              Saraswati Degree Vidya Mandir
            </span>
            .
          </p>

          {/* Highlights */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>✔ Connect with alumni across industries</p>
            <p>✔ Discover jobs & mentorship opportunities</p>
            <p>✔ Stay updated with college events</p>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="flex justify-center lg:justify-end">
          <AlumniForm />
        </div>
      </div>
    </section>
  );
}
