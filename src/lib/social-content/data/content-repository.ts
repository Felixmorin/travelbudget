import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { getSocialContentConfig, type SocialContentConfig } from "@/lib/social-content/config";
import { assertContentStatusTransition } from "@/lib/social-content/domain/state-machine";
import type { ContentReview, GeneratedContent, ReviewDecision, SocialContentStatus } from "@/lib/social-content/domain/types";

export type ContentRepository = {
  saveContent(content: GeneratedContent): Promise<GeneratedContent>;
  getContent(id: string): Promise<GeneratedContent | null>;
  listContent(): Promise<GeneratedContent[]>;
  listReviewQueue(): Promise<GeneratedContent[]>;
  updateStatus(id: string, status: SocialContentStatus): Promise<GeneratedContent>;
  recordReview(contentId: string, decision: ReviewDecision, notes?: string): Promise<ContentReview>;
};

type StoreFile = {
  contents: GeneratedContent[];
  reviews: ContentReview[];
};

export class LocalContentRepository implements ContentRepository {
  private filePath: string;

  constructor(config: SocialContentConfig = getSocialContentConfig()) {
    this.filePath = join(config.outputDir, "metadata", "social-content-store.json");
  }

  async saveContent(content: GeneratedContent) {
    const store = await this.readStore();
    const existingIndex = store.contents.findIndex((item) => item.id === content.id);
    const nextContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      store.contents[existingIndex] = nextContent;
    } else {
      store.contents.push(nextContent);
    }

    await this.writeStore(store);

    return nextContent;
  }

  async getContent(id: string) {
    const store = await this.readStore();

    return store.contents.find((content) => content.id === id) ?? null;
  }

  async listContent() {
    const store = await this.readStore();

    return [...store.contents].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }

  async listReviewQueue() {
    const contents = await this.listContent();

    return contents.filter((content) => content.status === "ready_for_review");
  }

  async updateStatus(id: string, status: SocialContentStatus) {
    const content = await this.getContent(id);

    if (!content) {
      throw new Error(`Unknown content id: ${id}.`);
    }

    assertContentStatusTransition(content.status, status);

    return this.saveContent({
      ...content,
      status,
    });
  }

  async recordReview(contentId: string, decision: ReviewDecision, notes?: string) {
    const status = decision === "approved" ? "approved" : "rejected";
    await this.updateStatus(contentId, status);

    const store = await this.readStore();
    const now = new Date().toISOString();
    const review: ContentReview = {
      id: crypto.randomUUID(),
      contentId,
      decision,
      notes,
      createdAt: now,
      updatedAt: now,
    };

    store.reviews.push(review);
    await this.writeStore(store);

    return review;
  }

  private async readStore(): Promise<StoreFile> {
    try {
      const content = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(content) as Partial<StoreFile>;

      return {
        contents: Array.isArray(parsed.contents) ? parsed.contents : [],
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      };
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        return { contents: [], reviews: [] };
      }

      throw error;
    }
  }

  private async writeStore(store: StoreFile) {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  }
}

export function createContentRepository(config: SocialContentConfig = getSocialContentConfig()): ContentRepository {
  return new LocalContentRepository(config);
}
