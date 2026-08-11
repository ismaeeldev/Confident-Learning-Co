import "server-only";
import type { EmailProvider, KitSubscriber, UpsertSubscriberInput, ApplyTagInput, RemoveTagInput } from "./types";

export function createMockEmailProvider(): EmailProvider {
  const subscribersByEmail = new Map<string, KitSubscriber>();
  const tagsBySubscriber = new Map<string, Set<string>>();

  return {
    async upsertSubscriber(input: UpsertSubscriberInput) {
      const existing = subscribersByEmail.get(input.email);
      if (existing) return existing;
      const subscriber: KitSubscriber = {
        id: `mock-subscriber-${subscribersByEmail.size + 1}`,
        email: input.email,
      };
      subscribersByEmail.set(input.email, subscriber);
      tagsBySubscriber.set(subscriber.id, new Set());
      return subscriber;
    },
    async applyTag(input: ApplyTagInput) {
      const tags = tagsBySubscriber.get(input.subscriberId) ?? new Set<string>();
      tags.add(input.tag);
      tagsBySubscriber.set(input.subscriberId, tags);
    },
    async removeTag(input: RemoveTagInput) {
      tagsBySubscriber.get(input.subscriberId)?.delete(input.tag);
    },
  };
}
