import { GoMoveToTop } from 'react-icons/go';
import { styled } from 'styled-components';

import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface positionSetting {
  left?: string;
  top?: string;
}

function ButtonGroup(props: positionSetting) {
  const USERACCESSTOKEN = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  function moveToTopButtonClickHandler() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function conFirmLoginHandler() {
    if (!isLoggedIn) {
      if (confirm('회원만 이용 가능한 기능입니다. 로그인 하시겠습니까?')) {
        navigate(`/login`);
      }
    } else {
      navigate(`/community/postwrite`);
    }
  }

  return (
    <ButtonGroupBody {...props}>
      {USERACCESSTOKEN !== null ? (
        <Link to="/community/postwrite">
          <HasWriteButton> + 글쓰기</HasWriteButton>
        </Link>
      ) : (
        <HasWriteButton onClick={conFirmLoginHandler}> + 글쓰기</HasWriteButton>
      )}

      <HasIconButton onClick={moveToTopButtonClickHandler}>
        <GoMoveToTop />
      </HasIconButton>
    </ButtonGroupBody>
  );
}
export default ButtonGroup;

const ButtonGroupBody = styled.div<positionSetting>`
  position: fixed;
  left: ${props => (props.left ? props.left : '85%')};
  top: ${props => (props.top ? props.top : '10%')};
  z-index: 0.5;
  button {
    margin: 5px;
  }
  @media all and (max-width: 680px) {
    left: 75%;
    top: 80%;
  }
`;

const HasWriteButton = styled.button`
  width: 100px;
  height: 50px;
  border: 1.5px solid black;
  border-radius: 10rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: white;
  color: black;

  &:hover {
    border: none;
    background-color: #7092bf;
    color: white;
  }
  @media all and (max-width: 480px) {
    width: 55px;
    height: 35px;
    font-size: 0.6rem;
  }
`;

const HasIconButton = styled.button`
  width: 45px;
  height: 45px;
  border: 1.5px solid black;
  border-radius: 10rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: white;
  color: black;

  svg {
    stroke-width: 4%;
  }
  &:hover {
    border: none;
    background-color: #7092bf;
    color: white;
  }

  @media all and (max-width: 480px) {
    width: 55px;
    height: 35px;
    font-size: 0.6rem;
  }
`;
