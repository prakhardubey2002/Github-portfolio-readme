import type { NpmSearchResponse } from "./types";

const REGISTRY_BASE = "https://registry.npmjs.org";
const PAGE_SIZE = 250;

export class PackageListService {
  async getPackagesByMaintainer(username: string): Promise<string[]> {
    const packages: string[] = [];
    let from = 0;
    let total = Infinity;

    while (from < total) {
      const url = new URL("/-/v1/search", REGISTRY_BASE);
      url.searchParams.set("text", `maintainer:${username}`);
      url.searchParams.set("size", String(PAGE_SIZE));
      url.searchParams.set("from", String(from));

      const res = await fetch(url.toString(), {
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch packages for ${username}: ${res.status}`);
      }

      const data = (await res.json()) as NpmSearchResponse;
      total = data.total;

      for (const obj of data.objects) {
        packages.push(obj.package.name);
      }

      from += PAGE_SIZE;
      if (data.objects.length === 0) break;
    }

    return [...new Set(packages)].sort((a, b) => a.localeCompare(b));
  }
}

export const packageListService = new PackageListService();
