import { profileConfig } from "./config";
import { githubProfileService, type GitHubProfile } from "./github.service";

export interface ResolvedProfile {
  name: string;
  tagline: string;
  bio: string;
  fontNote: string;
  avatarUrl: string;
  githubUsername: string;
  npmUsername: string;
  location: string | null;
  company: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  social: typeof profileConfig.social;
}

export async function getResolvedProfile(): Promise<ResolvedProfile> {
  const github = await githubProfileService.getProfile();

  return {
    name: github?.name ?? profileConfig.name,
    tagline: profileConfig.tagline,
    bio: profileConfig.bio,
    fontNote: profileConfig.fontNote,
    avatarUrl: github?.avatarUrl ?? "",
    githubUsername: profileConfig.githubUsername,
    npmUsername: profileConfig.npmUsername,
    location: github?.location ?? null,
    company: github?.company?.trim() ?? null,
    publicRepos: github?.publicRepos ?? 0,
    followers: github?.followers ?? 0,
    following: github?.following ?? 0,
    social: profileConfig.social,
  };
}

export { profileConfig };
export type { GitHubProfile };
