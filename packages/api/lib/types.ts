import type {
  projects,
  profiles,
  changelogs,
  project_configs,
  notifications,
  project_invites,
  project_api_keys,
  feedback,
  feedback_tags,
  feedback_comments
} from '@prisma/client';

export type ChangelogWithProfile = changelogs & {
  profiles: profiles | null
}

// DB Types
export type ProjectProps = projects;

export type ProjectConfigProps = project_configs;

export type ProjectConfigWithoutSecretProps = Omit<project_configs, 'integration_sso_secret'>;

export type TeamMemberProps = profiles & {
  joined_at: string;
};

export type NotificationProps = notifications & {
  project: Pick<projects, 'name' | 'slug' | 'icon'>;
  initiator: Pick<profiles, 'first_name' | 'last_name'>;
};

export type ProjectInviteProps = project_invites;

export type ProjectApiKeyProps = project_api_keys;

export type ProjectApiKeyWithoutTokenProps = Omit<project_api_keys, 'token'>;

export type ExtendedInviteProps = project_invites & {
  project: Pick<projects, 'name' | 'slug' | 'icon'>;
  creator: Pick<profiles, 'first_name' | 'last_name'>;
};

export type AnalyticsProps = {
  key: string;
  clicks: number;
  visitors: number;
}[];

export type ChangelogProps = changelogs;

export type ChangelogWithAuthorProps = changelogs & {
  author: profiles;
};

export type FeedbackProps = feedback;

export type FeedbackTagProps = feedback_tags;

export type FeedbackWithUserProps = feedback & {
  user: profiles & { isTeamMember: boolean };
  tags: Array<Pick<feedback_tags, 'name' | 'color'>>;
  has_upvoted: boolean;
};

export type FeedbackWithUserInputProps = Omit<feedback, 'id' | 'created_at'> & {
  tags?: string[];
  user?: Partial<profiles>;
};

export type FeedbackCommentProps = feedback_comments;

export type FeedbackCommentWithUserProps = feedback_comments & {
  user: profiles & { isTeamMember: boolean };
  has_upvoted: boolean;
  replies: FeedbackCommentWithUserProps[];
};

// Keep existing helper/UI types
export interface ErrorProps {
  message: string;
  status: number;
}

export type ApiResponse<T, E extends ErrorProps | null = ErrorProps | null> = Promise<
  E extends null ? { data: T; error: null } : { data: null; error: E }
>;

export interface NavbarTabProps {
  name: string;
  icon: {
    dark: Record<string, unknown> | string;
    light: Record<string, unknown> | string;
  };
  slug: string;
}

export interface CategoryTabProps {
  name: string;
  slug: string;
}