import type { ContentRepository } from "@/lib/social-content/data/content-repository";
import type { ContentReview } from "@/lib/social-content/domain/types";

export class ApprovalService {
  private repository: ContentRepository;

  constructor(repository: ContentRepository) {
    this.repository = repository;
  }

  approve(contentId: string, notes?: string): Promise<ContentReview> {
    return this.repository.recordReview(contentId, "approved", notes);
  }

  reject(contentId: string, notes?: string): Promise<ContentReview> {
    return this.repository.recordReview(contentId, "rejected", notes);
  }
}
