import React, { useEffect } from 'react';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../redux/slice/modalSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const sch = location.search;

  const params = new URLSearchParams(sch);
  const email = params.get('email');
  const token = params.get('token');

  useEffect(() => {
    //유효한 토큰인지 검사
    async function confirmToken() {
      const data = {
        email: email,
        token: token,
      };
      console.log(email);
      console.log(token);
      try {
        const response = await axios.get(`${APIURL}/password/forgot/verification`, {
          params: data,
          headers: { 'ngrok-skip-browser-warning': 'skip-browser-warning' },
        });
        if (response.status === 200) {
          console.log('유효한 토큰!');
        }
      } catch (err: any) {
        //재등록 실패 시... 토큰 만료..........?
        console.log('만료된 토큰!');
        navigate('/error');
      }
    }

    confirmToken();
  }, []);

  // 비밀번호가 형식에 맞지 않을 때
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+\[\]{}\\|;:'\",.<>\/?])[a-zA-Z\d`~!@#$%^&*()\-_=+\[\]{}\\|;:'\",.<>\/?]{8,20}$/;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const setNewPasswordHandler = async (e: any) => {
    e.preventDefault();
    if (formData.newPassword != formData.confirmNewPassword) {
      setErrors({ ...errors, confirmPassword: '비밀번호가 일치하지 않습니다.' });
      return;
    } else {
      const data = {
        //router기능으로 email, token받아와야함
        email: email,
        token: token,
        newPassword: formData.newPassword,
      };
      try {
        const response = await axios.patch(`${APIURL}/password/forgot/reset`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          dispatch(openModal('setNewPwModal'));
        }
      } catch (err: any) {
        //재등록 실패 시... 토큰 만료..........?
        navigate('/error');
      }
    }
  };
  return (
    <Container>
      <SetNewPwContainer>
        <EleWrapper>
          <Logo src={logo} />
          <Title>NEW PASSWORD</Title>
          <FormContainer>
            <SetNewPwForm onSubmit={setNewPasswordHandler}>
              {/* 새로운 비밀번호 입력 */}
              <Input
                className="password-input"
                placeholder="새로운 비밀번호"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={changeHandler}
                onBlur={() => {
                  let passwordError: string = '';
                  if (!formData.newPassword) {
                    passwordError = '새로운 비밀번호를 입력하세요';
                  }
                  if (formData.newPassword) {
                    passwordError = !passwordRegex.test(formData.newPassword)
                      ? '비밀번호는 영문/숫자/특수문자를 반드시 포함한 8자 이상이어야 합니다.'
                      : formData.newPassword.length < 8
                      ? '비밀번호는 8자 이상이어야 합니다.'
                      : '';
                  }
                  setErrors({ ...errors, password: passwordError });
                }}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}

              {/* 새로운 비밀번호 확인 입력*/}
              <Input
                className="password-input"
                placeholder="새로운 비밀번호 확인"
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={changeHandler}
                onBlur={() => {
                  let confirmPasswordError: string = '';
                  if (!formData.confirmNewPassword) {
                    confirmPasswordError = '새로운 비밀번호를 다시 한 번 입력하세요.';
                  } else if (formData.confirmNewPassword !== formData.confirmNewPassword) {
                    confirmPasswordError = '비밀번호가 일치하지 않습니다.';
                  }
                  setErrors({ ...errors, confirmPassword: confirmPasswordError });
                }}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}

              <ButtonWrapper>
                <SubmitButton
                  className="newpw-submit"
                  disabled={
                    !(
                      Object.values(errors).every(error => !error) &&
                      formData.newPassword &&
                      formData.confirmNewPassword
                    )
                  }
                  onClick={setNewPasswordHandler}>
                  비밀번호 재설정
                </SubmitButton>
              </ButtonWrapper>

              {/* 비밀번호 찾기 메일 발송 완료 모달 */}
              <SetNewPwModal modaltype="setNewPwModal">
                <div className="modal-cont-wrapper">
                  <div className="modal-title ">👋 비밀번호 재설정이 완료되었습니다.👋</div>
                  <br />
                  <Link
                    to={'/'}
                    onClick={() => {
                      dispatch(closeModal('setNewPwModal'));
                    }}>
                    Polareco 로그인하러가기
                  </Link>
                </div>
              </SetNewPwModal>
            </SetNewPwForm>
          </FormContainer>
        </EleWrapper>
      </SetNewPwContainer>
    </Container>
  );
}
export default ResetPasswordPage;

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
`;

const SetNewPwContainer = styled.div`
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

const SetNewPwForm = styled.form`
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
const SetNewPwModal = styled(Modal)`
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

  &.newpw-submit {
    cursor: ${props => props.disabled && 'default'};
    background-color: ${props => (props.disabled ? '#d4e2f1' : '#7092bf')};
    color: #fff;
    border: none;

    &:hover {
      background-color: #d4e2f1;
    }
  }
`;

const ErrorText = styled.div`
  color: #e73e3e;
  font-size: 12px;
  text-align: left;
`;
