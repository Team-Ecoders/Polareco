//user
export interface userState {
  userName: string;
  userId: string;
  email: string;
  profileImg: string;
}

//posts board
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

//post detail
export interface postDataState {
  memberId: string;
  postId?: number;
  title?: string;
  content?: string;
  category?: string;
  thumbnailUrl?: string;
  username?: string;
  views?: number;
  likes: number;
  createdAt?: string;
  updatedAt?: string;
  comments: Array<comment>;
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

export interface postWriteDataState {
  title: string | undefined;
  content: string | undefined;
  thumbnailUrl: string | null;
  category: string | undefined;
}
