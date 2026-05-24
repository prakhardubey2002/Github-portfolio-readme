import { profileConfig } from "./config";

export interface GitHubProfile {
  name: string | null;
  login: string;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
}

export class GitHubProfileService {
  async getProfile(username = profileConfig.githubUsername): Promise<GitHubProfile | null> {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        name: data.name ?? null,
        login: data.login,
        avatarUrl: data.avatar_url,
        bio: data.bio ?? null,
        location: data.location ?? null,
        company: data.company ?? null,
        blog: data.blog ?? null,
        publicRepos: data.public_repos ?? 0,
        followers: data.followers ?? 0,
        following: data.following ?? 0,
        htmlUrl: data.html_url,
      };
    } catch {
      return null;
    }
  }
}

export const githubProfileService = new GitHubProfileService();
