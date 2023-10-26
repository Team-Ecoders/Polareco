import styled from 'styled-components';
import Logo from '../../assets/Logo.png';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

function Header() {
  const [loginStates, setLoginStates] = useState(false);
  // const navigate = useNavigate();

  // const navigateToMain = () => {
  //   navigate('/');
  // };

  // const navigateToMyInfo = () => {
  //   navigate('/myinfo');
  // };

  // const navigateToSignUp = () => {
  //   navigate('/signup');
  // };

  return (
    <Entire>
      <HeaderContainer>
        <HeaderLogoContainer>
          {/* onClick={navigateToMain} */}
          <HeaderLogo src={Logo} />
          {/* onClick={navigateToMain} */}
          <HeaderLogoText>POLARECO</HeaderLogoText>
        </HeaderLogoContainer>

        <HeaderNavbarContainer>
          <Nav>Services</Nav>
          <Nav>Eco-Habit</Nav>
          <Nav>Community</Nav>
          <Nav>Contact</Nav>
        </HeaderNavbarContainer>

        <HeaderUserContainer>
          {loginStates ? (
            <>
              {/* <HeaderProfilePic src={profileImg} onClick={navigateToMyInfo} />
              <UsernameButton onClick={navigateToMyInfo}>{username}</UsernameButton>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton> */}
            </>
          ) : (
            <>
              <LoginButton
                onClick={() => {
                  console.log('로그인 시도');
                }}>
                Login
              </LoginButton>
              <CreateAccountButton
                onClick={() => {
                  console.log('회원가입 시도');
                }}>
                Create Account
              </CreateAccountButton>
            </>
          )}
        </HeaderUserContainer>

        <></>
      </HeaderContainer>
    </Entire>
  );
}

export default Header;

const Entire = styled.div`
  display: flex;
  justify-content: center;
  height: 80px;
  margin-bottom: 20px;
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

const HeaderLogoContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const HeaderLogo = styled.img`
  width: auto;
  height: 50px;
  /* margin-top: 15px;
  margin-bottom: 11.94px; */
  cursor: pointer;
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
`;

const HeaderNavbarContainer = styled.div`
  display: flex;
  /* 모바일 화면 or 화면크기가 줄어들 때 네비게이션 바 display: none, 햄버거 버튼 생성.. */
  @media (max-width: 1152px) {
    // 화면 크기가 768px 이하일 때
    /* transform: scale(0.6); // 이 줄을 추가 */
  }

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때
    /* transform: scale(0.4); // 이 줄을 추가 */
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    /* transform: scale(0.25); // 이 줄을 추가 */
  }
`;

const Nav = styled.div`
  color: black;
  font-family: 'Inter';
  font-size: 20px;
  font-style: normal;

  padding-right: 24px;
  padding-left: 24px;

  cursor: pointer;
`;

const HeaderUserContainer = styled.div`
  display: flex;
  margin-right: 20px;
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
`;

const UsernameButton = styled(ButtonStyle)`
  font-size: 20px;
  background-color: #ffffff;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  margin-left: 10px;
  margin-right: 10px;
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
`;

const CreateAccountButton = styled(ButtonStyle)`
  display: flex;
  justify-content: center;
  height: 80%;
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid #1a1a1a;
  margin-left: 10px;
`;
