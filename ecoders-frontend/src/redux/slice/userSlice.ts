import { createSlice } from '@reduxjs/toolkit';
import ProfileImg from '../../assets/ProfileImage.svg';

interface userState {
  userName: string;
  userId: string;
  email: string;
  profileImg: string;
}

const initialState: userState = {
  userName: '',
  userId: '',
  email: '',
  profileImg: ProfileImg,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.userName = action.payload;
    },
    setId: (state, action) => {
      state.userId = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setProfileImg: (state, action) => {
      state.profileImg = action.payload;
    },
  },
});

export const { setUsername, setEmail, setId, setProfileImg } = userSlice.actions;
export default userSlice.reducer;
