import Image from "next/image";
import type { ResolvedProfile } from "@/lib/profile";

interface ProfileHeroProps {
  profile: ResolvedProfile;
}

function SocialIcon({ icon }: { icon: "globe" | "github" | "linkedin" }) {
  const paths: Record<string, string> = {
    globe:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    github:
      "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.7C8.7 20.1 8.1 19 7.5 18.5c-.84-.58-1.12-.58-1.12-1.15 0-.58.42-.9 1.12-.9 1.3 0 2.3 1.2 3.2 2.3.6 1 1.1 1.5 2.5 1.5 1.38 0 2.38-.63 2.38-1.83 0-.9-.35-1.52-.9-2.12-.73-.8-1.6-1.78-1.6-3.65 0-1.52.58-2.76 1.5-3.74-.15-.35-.65-1.75.15-3.64 0 0 1.23-.38 4.05 1.43 1.17-.32 2.43-.48 3.68-.48 1.25 0 2.5.16 3.68.48 2.82-1.81 4.05-1.43 4.05-1.43.8 1.89.3 3.29.15 3.64.92.98 1.5 2.22 1.5 3.74 0 1.87-.87 2.85-1.6 3.65-.56.6-.9 1.22-.9 2.12 0 1.2 1 1.83 2.38 1.83 1.4 0 1.9-.5 2.5-1.5.9-1.1 1.9-2.3 3.2-2.3.7 0 1.12.32 1.12.9 0 .57-.28.57-1.12 1.15-.6.5-1.2 1.6-1.2 3.3v1.7c0 .27.16.58.66.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2z",
    linkedin:
      "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.57c0-1.29 1.05-2.35 2.35-2.35 1.29 0 2.35 1.05 2.35 2.35v4.57h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
  };
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[icon]} />
    </svg>
  );
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <section className="relative">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="profile-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div
            className="pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-30"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle, #0a0a0a 2px, transparent 2px)",
              backgroundSize: "12px 12px",
            }}
          />
          <h1 className="font-display max-w-2xl text-2xl leading-snug text-zinc-900 sm:text-3xl">
            {profile.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-800/90 sm:text-base">
            {profile.bio}
          </p>
          {(profile.company || profile.location) && (
            <p className="mt-4 text-sm text-zinc-700/80">
              {[profile.company, profile.location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 lg:pt-2">
          <div className="profile-avatar-ring relative">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={160}
                height={160}
                className="rounded-full border-4 border-lime-400/80 object-cover"
                priority
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-lime-400/80 bg-zinc-800 text-4xl text-lime-300">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <div className="profile-crosshair h-32 w-32" aria-hidden />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <div className="flex gap-4 text-lime-300/90">
          <span>{profile.publicRepos} repos</span>
          <span>{profile.followers} followers</span>
          <span>{profile.following} following</span>
        </div>
      </div>

      <p className="font-display mt-6 text-xs leading-relaxed text-white/40 sm:text-sm">
        {profile.fontNote}
      </p>

      <nav className="mt-6 flex flex-wrap gap-6 border-t border-white/10 pt-6">
        {profile.social.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display flex items-center gap-2 text-lime-300 transition-colors hover:text-lime-200"
          >
            <SocialIcon icon={link.icon} />
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
