import styled from 'styled-components';
import logo from '../assets/Logo.png';
import googleicon from '../assets/google-icon.png';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../redux/slice/modalSlice';
import { useState } from 'react';

interface ErrorObject {
  email: string | null | undefined;
  confirmEmail: string | null | undefined;
  password: string | null | undefined;
  confirmPassword: string | null | undefined;
  username: string | null | undefined;
}

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // input 상태
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  // 유효성 검사용 input 상태
  const [errors, setErrors] = useState<ErrorObject>({
    email: null,
    confirmEmail: null,
    password: null,
    confirmPassword: null,
    username: null,
  });

  // 유효성 검사 함수
  const validateForm = (): boolean => {
    const newErrors: ErrorObject = {
      email: null,
      confirmEmail: null,
      password: null,
      confirmPassword: null,
      username: null,
    };

    // input에 값을 입력하지 않았을 경우
    if (!formData.email) {
      newErrors.email = '이메일을 입력하세요.';
    }

    if (!formData.confirmEmail) {
      newErrors.confirmEmail = '이메일로 전송된 인증코드를 입력하세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 한 번 입력하세요.';
    }

    if (!formData.username) {
      newErrors.username = '닉네임을 입력하세요.';
    }

    // 이메일이 형식에 맞지 않을 때
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]$/;

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 닉네임이 형식에 맞지 않을 때
    const usernameRegex = /^(?!.*\s)(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{4,20}$/;
    if (formData.username) {
      newErrors.username = !formData.username
        ? '닉네임을 입력하세요.'
        : !usernameRegex.test(formData.username)
        ? '닉네임 형식이 맞지 않습니다.'
        : formData.username.length < 4
        ? '닉네임은 4자 이상이어야 합니다.'
        : formData.username.length > 20
        ? '닉네임은 20자 이하로 설정하세요.'
        : undefined;
    }

    // 비밀번호가 형식에 맞지 않을 때
    const passwordRegex =
      /^(?![0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+`])[A-Za-z0-9!@#$%^&*()_+`]{8,20}$/;

    if (formData.password) {
      newErrors.password = !passwordRegex.test(formData.password)
        ? /^[0-9]/.test(formData.password)
          ? '비밀번호는 숫자로 시작할 수 없습니다.'
          : formData.password.length < 8
          ? '비밀번호는 8자 이상이어야 합니다.'
          : undefined
        : undefined;
    }

    // 비밀번호가 일치하지 않을 때
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);

    // 오류가 없다면(newErrors에 true, truthy한 값이 있는지 검사 -> 즉 오류가 있는지 검사)
    // error모든 값이 false라면 treu를 리턴함 -> 유효성 검사 통과
    return Object.values(newErrors).every(error => !error);
  };

  // onChange
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    //비밀번호에 공백 입력할 수 없음
    if (name == 'password' || name == 'confirmPassword') {
      value = value.replace(/\s/g, '');
    }

    //유저네임 입력시 공백으로 시작할 수 없음
    if (name == 'username') {
      if (value.startsWith(' ')) {
        value = value.trim();
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 로그인 페이지로 이동
  const linkToLoginPageHandler = () => {
    navigate('/login');
    dispatch(closeModal('signupModal')); // 모달이 열려 있지 않게 함
  };

  // submit 함수
  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const isValid = validateForm();
    if (!isValid) {
      return;
    } else {
      dispatch(openModal('signupModal'));
    }
  };

  return (
    <Container>
      <SignupContainer>
        <EleWrapper>
          <Logo src={logo} />
          <Title>SIGN UP</Title>
          <FormContainer>
            <SignUpForm onSubmit={onSubmitHandler} noValidate>
              <EmailInputContainer>
                <Input
                  className="email-input"
                  placeholder="이메일"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                />

                {/* 이메일 인증 버튼 */}

                <EmailCertifyButton
                  type="button"
                  onClick={() => {
                    console.log('서버에 이메일 인증 메일 전송 요청');
                    //3분 타이머
                  }}>
                  인증메일 발송
                </EmailCertifyButton>
              </EmailInputContainer>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}

              {/* 이메일 확인 인풋 */}
              <EmailInputContainer>
                <Input
                  className="email-input"
                  placeholder="인증코드"
                  type="text"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={changeHandler}
                />
                <EmailCertifyButton
                  type="button"
                  onClick={() => {
                    console.log('서버에 이메일 인증 메일 전송 요청');
                    //3분 타이머
                  }}>
                  인증하기
                </EmailCertifyButton>
              </EmailInputContainer>
              {errors.confirmEmail ? (
                <ErrorText>{errors.confirmEmail}</ErrorText>
              ) : (
                <Info>이메일 인증하기 버튼을 누르면 입력한 이메일로 인증코드가 발송됩니다.</Info>
              )}

              <Input
                className="password-input"
                placeholder="비밀번호"
                type="password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
              />

              {errors.password ? (
                <ErrorText>{errors.password}</ErrorText>
              ) : (
                <Info>비밀번호는 영문/숫자/특수문자를 반드시 포함한 8자 이상이어야 합니다.</Info>
              )}
              <Input
                className="password-check-input"
                placeholder="비밀번호 확인"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={changeHandler}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
              <Input
                className="username-input"
                placeholder="닉네임"
                type="text"
                name="username"
                value={formData.username}
                onChange={changeHandler}
              />
              {errors.username ? (
                <ErrorText>{errors.username}</ErrorText>
              ) : (
                <Info>닉네임은 한글/영문/숫자 포함 4자 이상 20자 이하여야 합니다.</Info>
              )}
              <ButtonWrapper>
                <SubmitButton className="sign-up-submit">Sign up</SubmitButton>
                <SignUpModal modaltype="signupModal">
                  <div className="modal-cont-wrapper">
                    <p className="modal-content">회원가입에 성공하였습니다.</p>
                    <div>
                      <SubmitButton className="link-to-login" onClick={linkToLoginPageHandler}>
                        로그인 하러가기
                      </SubmitButton>
                    </div>
                  </div>
                </SignUpModal>
                <SubmitButtonGoogle className="google-login-submit">
                  <GoogleLogo src={googleicon} />
                  Sign up with google
                </SubmitButtonGoogle>
              </ButtonWrapper>
            </SignUpForm>
          </FormContainer>
          <IsUser onClick={linkToLoginPageHandler}>계정이 이미 있으신가요?</IsUser>
        </EleWrapper>
      </SignupContainer>
    </Container>
  );
}

export default Signup;

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
`;

const SignupContainer = styled.div`
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
    padding: 3rem;
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

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    width: 18rem;
  }
`;

const EmailInputContainer = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
`;

const SignUpModal = styled(Modal)`
  width: 25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

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

const EmailCertifyButton = styled(Button)`
  padding: 3px;
  width: 60%;
  height: 35px;
  font-size: small;
  font-weight: normal;
  background-color: #7092bfe4;
  color: #fff;
  margin-left: 5px;
  border-radius: 10px;
  border: #7092bfe4;
  &:hover {
    background-color: #d4e2f1;
  }
`;

const SubmitButton = styled(Button)`
  padding: 16px;

  &.sign-up-submit {
    background-color: #7092bf;
    color: #fff;
    border: none;

    &:hover {
      background-color: #d4e2f1;
    }
  }

  &.google-sign-up-submit {
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

  &.link-to-login {
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

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  text-align: left;
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

const Info = styled.p`
  font-size: 12px;
  color: #d4d4d4;
  padding-left: 5px;
`;
