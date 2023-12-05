import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import axios from 'axios';
import { login, logout } from '../../../redux/slice/loginSlice';
import { setEmail, setId, setUsername, setProfileImg } from '../../../redux/slice/userSlice';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

export async function tokenExpirationHandler(fun: Function) {
  const dispatch = useDispatch();
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    // refreshToken으로 accessToken 재발급 시도
    const response = await axios.get(`${APIURL}/token/reissue`, {
      headers: {
        'Refresh-Token': refreshToken,
        //ngrok 사용시에만 넣음
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });

    //refreshToken이 유효한 상태 accessToken 재등록
    if (response.status === 200) {
      //accessToken 재등록
      const newAccessToken = response.data['authorization'];
      const newRefreshToken = response.data['refreshToken'];
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // accessToken 재등록 후 callBack 함수 호출
      fun();
    }
  } catch (err: any) {
    //refreshToken도 만료됨
    if (err.resopnse.status === 403) {
      // 로컬 스토리지 토큰들 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      alert('로그인을 다시 시도해주세요');

      //로그아웃
      dispatch(logout());
      // setIsLoading(false);
    } else {
      console.log(err);
      // setIsLoading(false);
    }
  }
}

function Session() {
  // { setIsLoading }: { setIsLoading: React.Dispatch<React.SetStateAction<boolean>> }
  const dispatch = useDispatch();
  //로그인 상태 받아옴
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  console.log('session');
  //유저 정보 받아오는 함수
  async function getUser() {
    const accessToken = localStorage.getItem('accessToken');

    try {
      // setIsLoading(true);
      const response = await axios.get(`${APIURL}/member/my-info`, {
        headers: {
          Authorization: accessToken,
          //ngrok 사용시에만 넣음
          'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
      });
      // accessToken으로 유저 정보 불러오기 성공 (user 정보 저장)
      if (response.status === 200) {
        //get한 정보 userSlice 저장
        dispatch(setUsername(response.data.username));
        dispatch(setEmail(response.data.email));
        dispatch(setId(response.data.uuid));
        //프로필 이미지
        // response.data.imageUrl && dispatch(setProfileImg(response.data.profileImage));
        console.log('User information has been received successfully.');
        // setIsLoading(false);
      }
    } catch (err: any) {
      //accessToken 만료일 경우
      if (err.response.status === 403) {
        tokenExpirationHandler(getUser);
      }
    }
  }

  useEffect(() => {
    //토큰 유무로 로그인 상태 저장
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      dispatch(login());
      getUser();
    } else {
      dispatch(logout());
      // setIsLoading(false);
    }
    // // 로그인 상태일때 getUser 함수 호출
    // if (isLoggedIn) {
    //   getUser();
    // }
  });
  return <></>;
}
export default Session;
