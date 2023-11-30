export interface card {
  postId: number;
  title: string;
  category: string;
  thumbnailUrl: string;
  username: string;
  createdAt: string;
  likes: number;
  likedByUserIds: Array<string>;
}

export interface comment {
  memberId: string;
  commentId: number;
  content: string;
  username: string;
  createdAt: string;
  updatedAt: null;
}

export interface postData {
  memberId: string;
  postId?: number;
  title?: string;
  content?: string;
  category?: string;
  thumbnailUrl?: string;
  username?: string;
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
  comments?: Array<comment>;
  likedByUserIds?: Array<string>;
}
