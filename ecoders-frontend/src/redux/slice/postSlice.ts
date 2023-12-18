import { createSlice } from '@reduxjs/toolkit';
import { postDataState } from '../../interfaces/communityInterfaces';

const initialState: postDataState = {
  memberId: '',
  postId: 0,
  title: '',
  content: '',
  category: '',
  thumbnailUrl: '',
  username: '',
  views: 0,
  likes: 0,
  createdAt: '',
  updatedAt: '',
  comments: [],
  likedByUserIds: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state = action.payload;
    },
    setMemberId: (state, action) => {
      state.memberId = action.payload;
    },
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setContent: (state, action) => {
      state.content = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setThumbnailUrl: (state, action) => {
      state.thumbnailUrl = action.payload;
    },
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setViews: (state, action) => {
      state.views = action.payload;
    },
    setLikes: (state, action) => {
      state.likes = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.createdAt = action.payload;
    },
    setUpdatedAt: (state, action) => {
      state.updatedAt = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    setLikedByUserIds: (state, action) => {
      state.likedByUserIds = action.payload;
    },
  },
});

export const {
  setPost,
  setMemberId,
  setPostId,
  setTitle,
  setContent,
  setCategory,
  setThumbnailUrl,
  setUserName,
  setViews,
  setLikes,
  setCreatedAt,
  setUpdatedAt,
  setComments,
  setLikedByUserIds,
} = postSlice.actions;
export default postSlice.reducer;
