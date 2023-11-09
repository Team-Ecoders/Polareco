import styled from 'styled-components';
import Logo from '../../assets/Logo.png';
import { useState } from 'react';
import { TfiMenu } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/store/store';
import { logout } from '../../redux/slice/loginSlice';
import { Link } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
  const userInfo = useSelector((state: RootState) => state.user);

  const [ishambergerClicked, setIsHambergerClicked] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <>
      <Entire>
        <HeaderContainer>
          <HeaderLogoNavberContainer>
            <Link to={'/'}>
              <HeaderLogoContainer>
                <HeaderLogo src={Logo} />
                <HeaderLogoText>POLARECO</HeaderLogoText>
              </HeaderLogoContainer>
            </Link>
            <HeaderNavbarContainer>
              <Nav>
                <Link to={'/services'}>Services</Link>
              </Nav>
              <Nav>
                <Link to={'/ecohabit'}>Eco-Habit</Link>
              </Nav>
              <Nav>
                <Link to={'/community'}>Community</Link>
              </Nav>
              <Nav>
                <Link to={'/contact'}>Contact</Link>
              </Nav>
            </HeaderNavbarContainer>
          </HeaderLogoNavberContainer>

          <HeaderUserContainer>
            {isLoggedIn ? (
              <>
                <Link to={'/myinfo'}>
                  <HeaderProfilePic src={userInfo.profileImg} />
                  <UsernameButton>{userInfo.userName}</UsernameButton>
                </Link>

                <LogoutButton onClick={logoutHandler}>Logout</LogoutButton>
              </>
            ) : (
              <>
                <LoginButton>
                  <Link to={'/login'}>Login</Link>
                </LoginButton>
                <CreateAccountButton>
                  <Link to={'/signup'}>Create Account</Link>
                </CreateAccountButton>
              </>
            )}
            <HeaderHambergerButtonContainer
              onClick={() => {
                setIsHambergerClicked(!ishambergerClicked);
              }}>
              <TfiMenu />
            </HeaderHambergerButtonContainer>
          </HeaderUserContainer>
        </HeaderContainer>
        {ishambergerClicked ? (
          <HeaderHambergerMenuContainer>
            <ul>
              <li>
                <Link to={'/services'}>Services</Link>
              </li>
              <li>
                <Link to={'/ecohabit'}>Eco-Habit</Link>
              </li>
              <li>
                <Link to={'/community'}>Community</Link>
              </li>
              <li>
                <Link to={'/contact'}>Contact</Link>
              </li>
            </ul>
          </HeaderHambergerMenuContainer>
        ) : null}
      </Entire>
    </>
  );
}

export default Header;

const Entire = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 90px;
`;

const HeaderContainer = styled.div`
  position: fixed;
  z-index: 40;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 1620px;
  margin: 0 auto;
  height: 80px;
  background-color: #ffffff;
  border: none;
`;

const HeaderLogoNavberContainer = styled.div`
  display: flex;
  justify-content: center;
  a {
    text-decoration: none;
  }
`;

const HeaderLogoContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const HeaderLogo = styled.img`
  width: auto;
  height: 50px;
  cursor: pointer;
  @media (max-width: 480px) {
    height: 35px;
  }
`;

const HeaderLogoText = styled.div`
  color: black;
  height: 50px;
  font-family: 'Inter';
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  margin-top: 10%;
  margin-left: 10px;

  cursor: pointer;

  /* 모바일 화면 or 화면크기가 줄어들 때 네비게이션 바 display: none, 햄버거 버튼 생성.. */
  @media (max-width: 1024px) {
    // 화면 크기가 1024px 이하일 때 ipad
    height: 50px;
    font-family: 'Inter';
    font-size: 25px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin-top: 10%;
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때 ipad 가로
    height: 45px;
    font-family: 'Inter';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin-top: 10%;
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때 moble
    height: 45px;
    font-family: 'Inter';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin-top: 10%;
    margin-left: 5px;
  }
`;

const HeaderNavbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  /* 모바일 화면 or 화면크기가 줄어들 때 네비게이션 바 display: none, 햄버거 버튼 생성.. */
  @media (max-width: 1024px) {
    // 화면 크기가 1024px 이하일 때 ipad
    display: none;
  }
`;

const Nav = styled.div`
  color: black;
  font-family: 'Inter';
  font-size: 20px;
  font-style: normal;

  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: 2px;

  cursor: pointer;

  &:hover {
    font-weight: 600;
    border-bottom: 0.7px solid #7092bf60;
  }
  @media (max-width: 1024px) {
    // 화면 크기가 1024px 이하일 때 ipad
    font-size: 18px;
  }
  a {
    text-decoration: none;
    color: black;
  }
`;
const HeaderUserContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const ButtonStyle = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 24px 12px 24px;
  border-radius: 100px;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: 'Inter';
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  height: 56px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #7092bf;
  }

  @media (max-width: 1024px) {
    // 화면 크기가 1024px 이하일 때 ipad
    padding: 10px 20px 10px 20px;
    border-radius: 90px;
    background-color: #1a1a1a;
    color: #ffffff;
    font-family: 'Inter';
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    height: 50px;
  }

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때 ipad 가로
    padding: 8px 18px 8px 18px;
    border-radius: 90px;
    background-color: #1a1a1a;
    color: #ffffff;
    font-family: 'Inter';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    height: 45px;
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때 moble
    padding: 5px 12px 5px 12px;
    border-radius: 90px;
    background-color: #1a1a1a;
    color: #ffffff;
    font-family: 'Inter';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    height: 45px;
  }
`;

const UsernameButton = styled(ButtonStyle)`
  background-color: #ffffff;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  margin-left: 10px;
  margin-right: 10px;
  height: 80%;

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때 ipad 가로
    display: none;
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때 moble
    display: none;
  }
`;

const LogoutButton = styled(ButtonStyle)`
  display: flex;
  justify-content: center;
  border: none;
  height: 80%;
`;

const LoginButton = styled(ButtonStyle)`
  display: flex;
  justify-content: center;
  border: none;
  height: 80%;
  @media (max-width: 480px) {
    margin-left: 3px;
  }
  a {
    text-decoration: none;
    color: white;
  }
`;

const CreateAccountButton = styled(ButtonStyle)`
  display: flex;
  justify-content: center;
  height: 80%;
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid #1a1a1a;
  margin-left: 10px;
  @media (max-width: 480px) {
    margin-left: 3px;
  }
  a {
    text-decoration: none;
    color: #141414;
  }
`;

const HeaderHambergerButtonContainer = styled(ButtonStyle)`
  display: none;
  @media (max-width: 1024px) {
    // 화면 크기가 1024px 이하일 때 ipad
    display: block;
    justify-content: center;
    height: 80%;
    background-color: #9badc5;

    border: 1px solid #ffffff;
    margin-left: 10px;
  }
  @media (max-width: 480px) {
    margin-left: 3px;
  }
`;

const HeaderHambergerMenuContainer = styled.div`
  display: none;
  @media (max-width: 1024px) {
    // 화면 크기가 1024px 이하일 때 ipad
    display: flex;
    justify-content: center;
    margin-top: 82px;
    width: 90%;
  }
  ul {
    width: 100%;
    padding: 0;
  }
  ul li {
    padding: 15px 5px;
    border-bottom: 1px solid #0000006f;
    &:hover {
      background-color: #7092bf4c;
      cursor: pointer;
      font-weight: bold;
      border-bottom: 1px solid #000;
    }
    a {
      text-decoration: none;
      color: #000;
    }
  }
`;

//로그인 후 유저 프로필
const HeaderProfilePic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #d9d9d9;
  cursor: pointer;

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때 ipad 가로
    margin-right: 10px;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    margin-right: 5px;
    width: 35px;
    height: 35px;
  }
`;
