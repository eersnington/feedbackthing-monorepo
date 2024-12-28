export type FeedbackTagProps = {
  id: string;
  name: string;
  color: string;
  project_id: string;
  created_at: string;
};

export type Feedback = {
  id: string;

  user_id: string;
  project_id: string;

  title: string;
  description: string;
  status: string;
  upvotes: number;

  comment_count: number;
  raw_tags: string[];
  created_at: string;
};

// model;
// profiles;
// {
//   id;
//   String;
//   @id @
//   default(cuid())
//   avatar_url        String?
//   email             String
//   changelogs        changelogs[]
//   feedback          feedback[]
//   feedback_comments feedback_comments[]
//   feedback_upvoters feedback_upvoters[]
//   notifications     notifications[]
//   project_api_keys  project_api_keys[]
//   project_invites   project_invites[]
//   project_members   project_members[]
// }

export type ProfileProps = {
  id: string;
  avatar_url: string;
  email: string;
  full_name: string;
};

export type FeedbackWithUserProps = Feedback & {
  user: ProfileProps & { isTeamMember: boolean };
  tags: { name: string; color: string }[];
  has_upvoted: boolean;
};
