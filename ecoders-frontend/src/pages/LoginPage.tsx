import googleicon from '../assets/google-icon.png';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import { useDispatch } from 'react-redux';
import { openModal } from '../redux/slice/modalSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {
  const [password, setPassword] = useState(''); // 비밀번호 상태와 업데이트 함수를 선언합니다.
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = async (res: any) => {
    // const email = res.profileObj.email;
    // dispatch(setEmail(email));
    // const username = res.profileObj.name;
    // //console.log(email);
    // dispatch(setUsername(username));
    // try {
    //   const response = await axios.post(`${APIURL}/auth/oauth/google/login`, {
    //     email: email,
    //     username: username,
    //   });
    //   if (response.status === 200) {
    //     const headers = response.headers;
    //     const accessToken = headers['authorization'];
    //     const refreshToken = headers['refresh-token'];
    //     const id = headers['member-id'];
    //     localStorage.setItem('accessToken', accessToken);
    //     localStorage.setItem('refreshToken', refreshToken);
    //     localStorage.setItem('id', id);
    //     dispatch(setAccessToken(accessToken));
    //     dispatch(setRefreshToken(refreshToken));
    //     dispatch(setId(id));
    //     dispatch(setAuthType('GOOGLE'));
    //     //console.log(accessToken);
    //     //console.log(refreshToken);
    //     //console.log(id);
    //     //console.log('로그인 성공! 현재 유저: ', res.profileObj);
    //     dispatch(login());
    //     navigate('/');
    //   }
    // } catch (error) {
    //   console.error('Error occurred:', error);
    //   alert('오류');
    // }
  };

  const linkToSignupHandler = () => {
    navigate('/signup');
  };

  const modalOpenHandler = () => {
    dispatch(openModal('findPwModal'));
  };

  const loginHandler = async (e: any) => {
    e.preventDefault();
  };

  return (
    <Container>
      <LoginContainer>
        <EleWrapper>
          <Logo src={logo} />
          <Title>LOGIN</Title>
          <FormContainer>
            <LoginForm>
              <Input
                className="email-input"
                placeholder="이메일"
                type="email"
                value={email} // 이메일 상태 값을 할당합니다.
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
              <Input
                className="password-input"
                placeholder="비밀번호"
                type="password"
                value={password} // 비밀번호 상태 값을 할당합니다.
                onChange={e => setPassword(e.target.value)} // 입력 변경시 상태를 업데이트합니다.
              />
              <div className="forgot-pw" onClick={modalOpenHandler}>
                비밀번호 찾기
              </div>
              <PwModal modaltype="findPwModal">
                <div className="modal-cont-wrapper">
                  <div className="modal-title">비밀번호 찾기</div>
                  <p className="modal-content">
                    비밀번호를 잊으셨나요? 가입하신 이메일을 적어주세요.
                    <br />
                    이메일로 비밀번호 재설정 링크를 보내드립니다.
                  </p>
                  <div>
                    <Input className="modal-email-input" placeholder="이메일" type="email" />
                  </div>
                  <div>
                    <SubmitButton className="modal-email-submit">이메일 전송하기</SubmitButton>
                  </div>
                </div>
              </PwModal>

              <ButtonWrapper>
                <SubmitButton className="login-submit" onClick={loginHandler}>
                  Log in
                </SubmitButton>
                <SubmitButtonGoogle className="google-login-submit">
                  <GoogleLogo src={googleicon} />
                  Sign up with google
                </SubmitButtonGoogle>
              </ButtonWrapper>
            </LoginForm>
          </FormContainer>
          <IsUser onClick={linkToSignupHandler}>계정이 없으신가요?</IsUser>
        </EleWrapper>
      </LoginContainer>
    </Container>
  );
}

export default LoginPage;

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3px solid #000;
  border-radius: 30px;
  background-color: #fff;
  width: 32rem;
  padding: 5rem;
  @media (max-width: 1152px) {
    // 화면 크기가 1152px 이하일 때
    width: 32rem;
    padding: 5rem;
  }

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때
    width: 32rem;
    padding: 5rem;
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    width: 24rem;
    padding: 2rem;
  }
`;

const EleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 115px;
  @media (max-width: 1152px) {
    // 화면 크기가 1152px 이하일 때
    width: 115px;
  }

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때
    width: 115px;
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    width: 78px;
  }
`;

const Title = styled.div`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 36px;
  font-weight: 500;
  line-height: normal;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 18rem;

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    width: 18rem;
  }
  .forgot-pw {
    text-align: end;
    color: #000;
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
  }
`;

const PwModal = styled(Modal)`
  width: 27rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;

  div > .modal-cont-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    > .modal-title {
      font-family: Inter;
      font-size: 24px;
      font-weight: 400;
      line-height: normal;
      text-align: center;
    }
  }

  p {
    text-align: center;
    font-family: Inter;
    font-size: 14px;
    line-height: normal;
    text-align: left;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
`;

const SubmitButton = styled(Button)`
  padding: 16px;

  &.login-submit {
    background-color: #7092bf;
    color: #fff;
    border: none;

    &:hover {
      background-color: #d4e2f1;
    }
  }

  &.google-login-submit {
    background-color: #fff;
    border: 1px solid #5a5a5a;

    &:hover {
      background-color: #5a5a5a;
      border: 1px solid #5a5a5a;
    }
  }

  &.modal-email-submit {
    background-color: #7092bf;
    color: #fff;
    border: none;

    &:hover {
      background-color: #d4e2f1;
    }
  }
`;

const IsUser = styled.div`
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
`;

const SubmitButtonGoogle = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding: 16px;

  &.login-submit {
    background-color: #7092bf;
    color: #fff;
    border: none;

    &:hover {
      background-color: #d4e2f1;
    }
  }

  &.google-login-submit {
    background-color: #fff;
    border: 1px solid #5a5a5a;

    &:hover {
      background-color: #5a5a5a;
      border: 1px solid #5a5a5a;
    }
  }

  &.modal-email-submit {
    background-color: #7092bf;
    color: #fff;
    border: none;

    &:hover {
      background-color: #d4e2f1;
    }
  }
`;

const GoogleLogo = styled.img`
  width: 20px;
  height: auto;
  margin: 5px;
`;
