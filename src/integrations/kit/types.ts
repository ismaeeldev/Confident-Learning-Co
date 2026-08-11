export interface KitSubscriber {
  id: string;
  email: string;
}

export interface UpsertSubscriberInput {
  email: string;
  firstName?: string;
  fields?: Record<string, string>;
}

export interface ApplyTagInput {
  subscriberId: string;
  tag: string;
}

export interface RemoveTagInput {
  subscriberId: string;
  tag: string;
}

export interface EmailProvider {
  upsertSubscriber(input: UpsertSubscriberInput): Promise<KitSubscriber>;
  applyTag(input: ApplyTagInput): Promise<void>;
  removeTag(input: RemoveTagInput): Promise<void>;
}
