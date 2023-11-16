import React from 'react';
import googleicon from '../assets/google-icon.png';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../redux/slice/modalSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { login } from '../redux/slice/loginSlice';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<undefined | string>(undefined);

  const [findPwError, setFindPwError] = useState<undefined | string>(undefined);
  const [findPwEmail, setFindPwEmail] = useState('');

  const linkToSignupHandler = () => {
    navigate('/signup');
  };

  const modalOpenHandler = () => {
    dispatch(openModal('findPwModal'));
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const loginHandler = async (e: any) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      // 로그인 정보 입력 안했을 경우 서버로 보내지 않음 -> 바로 return
      setError('아이디 / 이메일 또는 비밀번호가 잘못되었습니다.');
      return;
    } else {
      const data = {
        email: formData.email,
        password: formData.password,
      };
      try {
        const response = await axios.post(`${APIURL}/login`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          // 1. 로컬에 토큰 저장
          const accessToken = response.data['accessToken'];
          const refreshToken = response.data['refreshToken'];

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // 2. 로그인 전역 상태 변경
          dispatch(login());

          // 3. 홈(메인)으로 이동
          navigate('/');
        }
      } catch (err: any) {
        if (err.response.status === 401) {
          //403
          setError('아이디 / 이메일 또는 비밀번호가 잘못되었습니다.');
        }
      }
    }
  };

  //이메일 유효성 검사 추가
  const findPwHandler = async (e: any) => {
    e.preventDefault();
    if (!findPwEmail) {
      setFindPwError('이메일을 입력하세요.');
    } else {
      setFindPwError('');
      const data = { findPwEmail: findPwEmail };
      try {
        const response = await axios.post(`${APIURL}/login/findpw`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        //회원 정보 있고, 비밀번호 이메일이 발송된 경우
        if (response.status === 200) {
          dispatch(closeModal('findPwModal'));
          dispatch(openModal('sandingPwModal'));
          navigate('/');
        }
      } catch (err: any) {
        //가입한 적 없는 이메일로 pw 찾으려고 하는 경우
        if (err.response.status === 404) {
          setFindPwError('해당 이메일로 가입한 회원정보가 없습니다.');
        }
      }
    }
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
                name="email"
                value={formData.email} // 이메일 상태 값을 할당합니다.
                onChange={changeHandler}
              />
              <Input
                className="password-input"
                placeholder="비밀번호"
                type="password"
                name="password"
                value={formData.password} // 비밀번호 상태 값을 할당합니다.
                onChange={changeHandler} // 입력 변경시 상태를 업데이트합니다.
              />
              {error && <ErrorText>{error}</ErrorText>}

              <div className="forgot-pw" onClick={modalOpenHandler}>
                비밀번호를 잊으셨나요?
              </div>

              {/* 비밀번호 찾기 모달 */}
              <PwModal modaltype="findPwModal">
                <div className="modal-cont-wrapper">
                  <div className="modal-title">비밀번호 찾기</div>
                  <p className="modal-content">
                    비밀번호를 잊으셨나요? 가입하신 이메일을 적어주세요.
                    <br />
                    이메일로 비밀번호 재설정 링크를 보내드립니다.
                  </p>
                  <div>
                    <Input
                      className="modal-email-input"
                      placeholder="이메일"
                      type="email"
                      value={findPwEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFindPwEmail(e.target.value);
                      }}
                    />
                    {findPwError && <ErrorText>{findPwError}</ErrorText>}
                  </div>
                  <div>
                    <SubmitButton className="modal-email-submit" onClick={findPwHandler}>
                      이메일 전송하기
                    </SubmitButton>
                  </div>
                </div>
              </PwModal>

              {/* 비밀번호 찾기 메일 발송 완료 모달 */}
              <PwEmailModal modaltype="sandingPwModal">
                <div className="modal-cont-wrapper">
                  <div className="modal-title ">👋 비밀번호 재설정 메일이 발송되었습니다.👋</div>
                </div>
              </PwEmailModal>

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
  gap: 0.7rem;
  padding: 1.2rem;

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
const PwEmailModal = styled(Modal)`
  width: 25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  div > .modal-cont-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: center;

    > .modal-title {
      font-family: Inter;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
      text-align: center;
    }
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

const ErrorText = styled.div`
  color: #e73e3e;
  font-size: 12px;
  text-align: left;
`;
