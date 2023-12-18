import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { RootState } from '../redux/store/store';
import { useEffect, useState } from 'react';

import LogoutMain from '../assets/Main.png';
import LoginBG from '../assets/LoginBG.png';
import TextPolarbear from '../assets/TextPolarBear️.png';

import EcoHabitButton from '../assets/EcoHabitDefaultButton.png';
import EcoHabitHoveringButton from '../assets/EcoHabitHoveringButton.png';

import Bear1 from '../assets/bear1.png';
import State1 from '../assets/state1_sad.png';

function HomePage() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  const [isHovered, setIsHovered] = useState(false);
  const [bearImage, setBearImage] = useState(Bear1); // BearImage의 초기 이미지를 설정
  const [stateImage, setStateImage] = useState(State1);

  useEffect(() => {
    setBearImage(Bear1);
    setStateImage(State1);
  }, []);
  return (
    <>
      <Container>
        {isLoggedIn ? (
          <>
            <Wrapper>
              <Container>
                <StyledImage src={LoginBG} />
                <ImageContainer>
                  <BearState src={stateImage} />
                  <TextImage src={TextPolarbear} />
                  <BearImage src={bearImage} />
                </ImageContainer>
              </Container>
              <ButtonImage
                src={isHovered ? EcoHabitHoveringButton : EcoHabitButton}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
                onClick={() => navigate('/eco-habit')}
              />
            </Wrapper>
          </>
        ) : (
          <>
            <StyledImage src={LogoutMain} />
          </>
        )}
      </Container>
    </>
  );
}

export default HomePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 52%; // 버튼의 상단 위치를 조정하세요
  left: 50%; // 버튼의 좌측 위치를 조정하세요
  transform: translate(-50%, -50%); // 이 코드는 버튼의 중앙을 정확히 설정하기 위함입니다
`;
const Wrapper = styled.div`
  /* position: relative; */
  margin-top: 100px;
  max-width: 960px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const StyledImage = styled.img`
  display: flex;
  flex-direction: column;
  /* max-width: 1080px; */
  width: 70%;

  @media (max-width: 1152px) {
    // 화면 크기가 1152px 이하일 때
    width: 85%;
  }
`;

const TextImage = styled.img`
  /* position: absolute;
  top: 30%; // 버튼의 상단 위치를 조정하세요
  left: 50%; // 버튼의 좌측 위치를 조정하세요
  transform: translate(-50%, -50%); // 이 코드는 버튼의 중앙을 정확히 설정하기 위함입니다 */
  width: 400px;
`;

const BearState = styled.img`
  width: 500px;
  margin-bottom: 10px;
`;

const BearImage = styled.img`
  /* position: absolute;
  top: 57%; // 버튼의 상단 위치를 조정하세요
  left: 50%; // 버튼의 좌측 위치를 조정하세요
  transform: translate(-50%, -50%); // 이 코드는 버튼의 중앙을 정확히 설정하기 위함입니다 */
  margin-top: 40px;
  width: 400px;
`;

const ButtonImage = styled.img`
  /* position: absolute; */
  max-width: 284px;
  margin-bottom: 30px;

  /* @media (max-width: 1152px) {
    // 화면 크기가 1152px 이하일 때
    max-width: 200px; // 이미지의 최대 가로 폭을 500px로 제한
  }

  @media (max-width: 768px) {
    // 화면 크기가 768px 이하일 때
    max-width: 113.6px; // 이미지의 최대 가로 폭을 500px로 제한
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때
    max-width: 71px; // 이미지의 최대 가로 폭을 300px로 제한
  } */
`;
