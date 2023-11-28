import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ModalState {
  modals: Record<string, boolean>; // 여러 모달 관리
}

const initialState: ModalState = {
  modals: {
    // 여기에 여러 모달을 추가, 초기 상태 설정
    //(회원가입, 로그인 시 필요 모달만 남김)
    signupModal: false,
    sendingMailModal: false,
    findPwModal: false,
    sandingPwModal: false,
    setNewPwModal: false,
    loginModal: false,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
