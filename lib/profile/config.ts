export interface SocialLink {
  label: string;
  href: string;
  icon: "globe" | "github" | "linkedin";
}

export interface ProfileConfig {
  name: string;
  npmUsername: string;
  githubUsername: string;
  tagline: string;
  bio: string;
  fontNote: string;
  social: SocialLink[];
}

export const profileConfig: ProfileConfig = {
  name: "Prakhar Dubey",
  npmUsername: "prakhar_dubey",
  githubUsername: "prakhardubey2002",
  tagline: "I like building things be it tangible or intangible",
  bio: `Hi, I'm Prakhar — a software engineer who loves building Node packages and frontend tools. Currently working as an SDE (Frontend). I used to chase hackathons as a student, but these days, it's research papers and building cool stuff that keep me going. If you're visiting my profile, feel free to connect — I enjoy meeting new people. If you check out my public packages, a ⭐ or feedback in the issues section would mean a lot. I believe change is inevitable — and so is refactoring code.`,
  fontNote: `You might notice the quirky font above and below — it's Sans Forgetica. It's said to help with memory retention (though research is mixed). I included it partly for the aesthetics.`,
  social: [
    {
      label: "Saanjh2811",
      href: "https://linktr.ee/prakhardubey",
      icon: "globe",
    },
    {
      label: "prakhardubey2002",
      href: "https://github.com/prakhardubey2002",
      icon: "github",
    },
    {
      label: "prakhar-dubey-2790b81b7",
      href: "https://www.linkedin.com/in/prakhar-dubey-2790b81b7",
      icon: "linkedin",
    },
  ],
};
