import { styled } from 'styled-components';
import logo from '../assets/Logo.png';
function ErrorPage() {
  return (
    <ErrorContainer>
      <ErrorImgContainer>
        <h1>4</h1>
        <img src={logo} />
        <h1>4</h1>
      </ErrorImgContainer>
      <ErrorMessageContainer>
        <div>
          <p className="title">페이지를 찾을 수 없습니다.</p>
          <p className="content"> 페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
          <p className="content">입력하신 주소가 정확한지 다시 한 번 확인해주세요.</p>
        </div>
      </ErrorMessageContainer>
    </ErrorContainer>
  );
}
export default ErrorPage;

const ErrorContainer = styled.div`
  padding: 100px;

  @media (max-width: 1024px) {
    padding: 150px 50px;
  }
  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때 moble
    padding: 100px 50px;
  }
`;

const ErrorImgContainer = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  h1 {
    font-size: 200px;
  }
  img {
    margin: 0 10px;
    width: 300px;
    height: 100%;
  }

  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때 moble
    h1 {
      font-size: 90px;
    }
    img {
      margin: 0 10px;
      width: 150px;
      height: 100%;
    }
  }
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  p.title {
    padding: 10px;
    font-size: 40px;
    font-weight: 600;
  }
  p.content {
    padding: 3px 20px;
    font-size: 15px;
  }
  @media (max-width: 480px) {
    // 화면 크기가 480px 이하일 때 moble
    p.title {
      padding: 2px;
      font-size: 22px;
    }
    p.content {
      padding: 2px;
      font-size: 10px;
    }
  }
`;
