export type PostsType = {
  title: string;
  content: string;
  id: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  approvedById: string | null;
  editedById: string | null;
  createdById: string;
};
