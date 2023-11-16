import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/sharedlayout/Footer';
import Header from './components/sharedlayout/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from './redux/store/store';
import axios from 'axios';
import { login, logout } from './redux/slice/loginSlice';
import { setEmail, setId, setUsername, setProfileImg } from './redux/slice/userSlice';
import FindPasswordPage from './pages/FindPasswordPage';
import ErrorPage from './pages/ErrorPage';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();
  //로그인 상태 받아옴
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  useEffect(() => {
    //토큰 유무로 로그인 상태 저장
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      dispatch(login());
    } else {
      dispatch(logout());
    }

    //유저 정보 받아오는 함수
    async function getUser() {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axios.get(`${APIURL}/members/my-info`, {
          headers: {
            Authorization: accessToken,
          },
        });
        // accessToken으로 유저 정보 불러오기 성공 (user 정보 저장)
        if (response.status === 200) {
          //get한 정보 userSlice 저장
          dispatch(setUsername(response.data.username));
          dispatch(setEmail(response.data.email));
          dispatch(setId(response.data.id));
          response.data.imageUrl && dispatch(setProfileImg(response.data.imageUrl));
          console.log('User information has been received successfully.');
        }
      } catch (err: any) {
        //accessToken 만료일 경우
        if (err.response.status === 401) {
          try {
            // refreshToken으로 accessToken 재발급 시도
            const response = await axios.get(`${APIURL}/members/..`, {
              headers: {
                'Refresh-Token': refreshToken,
              },
            });

            //refreshToken이 유효한 상태 accessToken 재등록
            if (response.status === 200) {
              //accessToken 재등록
              const newAccessToken = response.data['authorization'];
              localStorage.setItem('accessToken', newAccessToken);

              // 재등록 후 유저 정보 불러오기
              getUser();
            }
          } catch (err: any) {
            //refreshToken도 만료됨
            if (err.resopnse.status === 401) {
              // 로컬 스토리지 토큰들 삭제
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');

              //로그아웃
              dispatch(logout());
            } else {
              console.log(err);
            }
          }
        }
      }
    }
    // 로그인 상태일때 getUser 함수 호출
    if (isLoggedIn) {
      getUser();
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/findpw" element={<FindPasswordPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
