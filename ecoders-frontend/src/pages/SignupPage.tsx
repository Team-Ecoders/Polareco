import styled from 'styled-components';
import logo from '../assets/Logo.png';
import googleicon from '../assets/google-icon.png';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../redux/slice/modalSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

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

  // 이메일이 형식에 맞지 않을 때
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // 닉네임이 형식에 맞지 않을 때
  const usernameRegex = /^[a-zA-Z\dㄱ-ㅎ가-힣]{2,10}$/;

  // 비밀번호가 형식에 맞지 않을 때
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+\[\]{}\\|;:'\",.<>\/?])[a-zA-Z\d`~!@#$%^&*()\-_=+\[\]{}\\|;:'\",.<>\/?]{8,20}$/;

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

  // 이메일 인증 상태
  const [emailConfirm, setEmailConfirm] = useState({
    emailSanding: false,
    emailConfirmed: false,
  });

  // 타이머 관련 상태
  const [timeLeft, setTimeLeft] = useState(180); // 초 단위로 시간을 저장
  const [isRunning, setIsRunning] = useState(false);

  //이메일 인증 메일이 발송되면 유효 시간 카운트
  useEffect(() => {
    let timer: number;

    if (isRunning && timeLeft > 0) {
      //1초마다 시간 줄임
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, isRunning]);

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
      newErrors.confirmEmail = '유효하지 않은 코드입니다.';
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

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (formData.username) {
      newErrors.username = !formData.username
        ? '닉네임을 입력하세요.'
        : !usernameRegex.test(formData.username)
        ? '닉네임 형식이 맞지 않습니다.'
        : formData.username.length < 2
        ? '닉네임은 2자 이상이어야 합니다.'
        : formData.username.length > 20
        ? '닉네임은 20자 이하로 설정하세요.'
        : undefined;
    }

    if (formData.password) {
      newErrors.password = !passwordRegex.test(formData.password)
        ? '비밀번호는 영문/숫자/특수문자를 반드시 포함한 8자 이상이어야 합니다.'
        : formData.password.length < 8
        ? '비밀번호는 8자 이상이어야 합니다.'
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

  // 로그인 페이지로 이동
  const linkToLoginPageHandler = () => {
    navigate('/login');
    dispatch(closeModal('signupModal')); // 모달이 열려 있지 않게 함
  };

  // input onChange 함수
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    //비밀번호, 유저네임 공백 입력할 수 없음
    if (name == 'password' || name == 'confirmPassword' || name == 'username') {
      value = value.replace(/\s/g, '');
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // email 인증 메일 전송 함수
  const onClickSandingEmail = async () => {
    setErrors({ ...errors, email: null });
    if (!formData.email) {
      setErrors({ ...errors, email: '이메일을 입력하세요' });
      return;
    } else if (formData.email && !emailRegex.test(formData.email)) {
      console.log(formData.email);
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
      return;
    } else {
      const data = {
        email: formData.email,
      };
      try {
        const response = await axios.post(`${APIURL}/signup/code/issue`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          //인증메일 발송 완료-> 완료 모달
          dispatch(openModal('sendingMailModal'));

          //이메일이 전송됨
          setEmailConfirm({ ...emailConfirm, emailSanding: true });

          //인증 코드 유효시간 3분
          setTimeLeft(180);
          setIsRunning(true);
        }
      } catch (err: any) {
        if (err.response.status === 403) {
          setErrors({ ...errors, email: '이미 존재하는 이메일입니다.' });
        }
      }
    }
  };

  // email 인증 확인 함수
  const onClickConfirmEmail = async () => {
    if (!formData.confirmEmail) {
      setErrors({ ...errors, confirmEmail: '유효하지 않은 코드입니다.' });
      return;
    } else {
      const data = {
        email: formData.email,
        confirmEmail: formData.confirmEmail,
      };
      try {
        const response = await axios.get(`${APIURL}/signup/code/verification`, {
          params: data,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          setErrors({ ...errors, confirmEmail: '유효하지 않은 코드입니다.' });
          return;
        }
        if (response.status === 404) {
          setErrors({ ...errors, confirmEmail: '인증 코드를 입력해주세요.' });
          return;
        }
        if (response.status === 200) {
          //이메일 인증 완료
          setEmailConfirm({ ...emailConfirm, emailConfirmed: true });
          //인증 코드 타이머 비활성화
          setIsRunning(false);

          //남은 시간 0초..
          setTimeLeft(0);
        }
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  // submit 함수
  const onSubmitHandler = async (e: React.FormEvent) => {
    dispatch(closeModal('sendingMailModal'));

    e.preventDefault();
    // 유효성 검사
    const isValid = validateForm();
    if (!isValid) {
      return;
    } else {
      try {
        const postFormData = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        };

        const response = await axios.post(`${APIURL}/signup`, postFormData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == 200) {
          dispatch(openModal('signupModal'));
        }
      } catch (err: any) {
        console.log(err);
      }
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
              {/* 이메일 입력 input */}
              <EmailInputContainer>
                <Input
                  className="email-input"
                  placeholder="이메일"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  disabled={(emailConfirm.emailSanding && timeLeft > 0) || emailConfirm.emailConfirmed}
                />
                {/* 인증메일 발송 버튼 */}
                <EmailCertifyButton
                  type="button"
                  onClick={onClickSandingEmail}
                  disabled={(emailConfirm.emailSanding && timeLeft > 0) || emailConfirm.emailConfirmed}>
                  인증 메일 발송
                </EmailCertifyButton>
              </EmailInputContainer>
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
              <ConfirmEmailModal modaltype="sendingMailModal">
                <div className="modal-cont-wrapper">
                  <div className="modal-title ">👋 인증 메일이 발송되었습니다.👋</div>
                </div>
              </ConfirmEmailModal>

              {/* 이메일 인증 코드 input */}
              {emailConfirm.emailSanding && (
                <>
                  <EmailInputContainer>
                    <Input
                      className="email-input"
                      placeholder="인증코드"
                      type="text"
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={changeHandler}
                      disabled={emailConfirm.emailConfirmed}
                    />
                    <EmailCertifyButton
                      type="button"
                      onClick={onClickConfirmEmail}
                      disabled={emailConfirm.emailConfirmed}>
                      이메일 인증하기
                    </EmailCertifyButton>
                  </EmailInputContainer>

                  {/* 타이머 */}
                  {isRunning && timeLeft !== 0 && (
                    <TimerText>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60 < 10 ? '0' : '') + (timeLeft % 60)}
                    </TimerText>
                  )}
                  {errors.confirmEmail && <ErrorText>{errors.confirmEmail}</ErrorText>}
                  {emailConfirm.emailConfirmed && <ConfirmedText>이메일 인증이 완료되었습니다.</ConfirmedText>}
                </>
              )}

              {/* 비밀번호 입력 input */}
              <Input
                className="password-input"
                placeholder="비밀번호"
                type="password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
                onBlur={() => {
                  let passwordError: string | null | undefined = undefined;
                  if (!formData.password) {
                    passwordError = '비밀번호를 입력하세요';
                  }
                  if (formData.password) {
                    passwordError = !passwordRegex.test(formData.password)
                      ? '비밀번호는 영문/숫자/특수문자를 반드시 포함한 8자 이상이어야 합니다.'
                      : formData.password.length < 8
                      ? '비밀번호는 8자 이상이어야 합니다.'
                      : undefined;
                  }
                  setErrors({ ...errors, password: passwordError });
                }}
              />
              {errors.password ? (
                <ErrorText>{errors.password}</ErrorText>
              ) : (
                <Info>비밀번호는 영문/숫자/특수문자를 반드시 포함한 8자 이상이어야 합니다.</Info>
              )}

              {/* 비밀번호 확인 input */}
              <Input
                className="password-check-input"
                placeholder="비밀번호 확인"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={changeHandler}
                onBlur={() => {
                  let confirmPasswordError: string | null | undefined = undefined;
                  if (!formData.confirmPassword) {
                    confirmPasswordError = '비밀번호를 다시 한 번 입력하세요.';
                  } else if (formData.confirmPassword !== formData.password) {
                    confirmPasswordError = '비밀번호가 일치하지 않습니다.';
                  }
                  setErrors({ ...errors, confirmPassword: confirmPasswordError });
                }}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}

              {/* 닉네임 input */}
              <Input
                className="username-input"
                placeholder="닉네임"
                type="text"
                name="username"
                value={formData.username}
                onChange={changeHandler}
                onBlur={() => {
                  let usernameError: string | null | undefined = undefined;
                  if (!formData.username) {
                    usernameError = '닉네임을 입력하세요.';
                  } else {
                    usernameError = !usernameRegex.test(formData.username)
                      ? '닉네임 형식이 맞지 않습니다.'
                      : formData.username.length < 2
                      ? '닉네임은 2자 이상이어야 합니다.'
                      : formData.username.length > 20
                      ? '닉네임은 20자 이하로 설정하세요.'
                      : undefined;
                  }
                  setErrors({ ...errors, username: usernameError });
                }}
              />
              {errors.username ? (
                <ErrorText>{errors.username}</ErrorText>
              ) : (
                <Info>닉네임은 공백을 포함할 수 없으며, 한글/영문/숫자 포함 4자 이상 20자 이하여야 합니다.</Info>
              )}

              {/* 가입버튼 */}
              <ButtonWrapper>
                <SubmitButton
                  className="sign-up-submit"
                  disabled={
                    //오류도 없고, 이메일 인증도 했고, formData값들이 모두 있는 상태(false가 아닌 상태) => false
                    !(
                      Object.values(errors).every(error => !error) &&
                      emailConfirm.emailConfirmed &&
                      formData.email &&
                      formData.password &&
                      formData.confirmPassword &&
                      formData.username
                    )
                  }>
                  Sign up
                </SubmitButton>
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
  gap: 0.5rem;
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

const ConfirmEmailModal = styled(Modal)`
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
  background-color: ${props => (props.disabled ? '#d4e2f1' : '#7092bfe4')};
  color: #fff;
  margin-left: 5px;
  border-radius: 10px;
  border: #7092bfe4;
  cursor: ${props => props.disabled && 'default'};
  &:hover {
    background-color: #d4e2f1;
  }
`;

const SubmitButton = styled(Button)`
  padding: 16px;

  &.sign-up-submit {
    cursor: ${props => props.disabled && 'default'};
    background-color: ${props => (props.disabled ? '#d4e2f1' : '#7092bf')};
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
  color: #e73e3e;
  font-size: 12px;
  text-align: left;
`;

const TimerText = styled.div`
  color: black;
  width: 50px;
  font-size: 15px;
  position: relative;
  font-weight: 500;
  margin-left: 140px;
  bottom: 35px;
  text-align: right;
  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    margin-left: 120px;
  }
`;

const ConfirmedText = styled.div`
  color: #1b9c1b;
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
