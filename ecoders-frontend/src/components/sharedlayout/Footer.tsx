import styled from 'styled-components';
import Logo from '../../assets/Logo.png';

function Footer() {
  return (
    <Entire>
      <FooterContainer>
        <FooterInfoContainer>
          <FooterSectionContainer>
            <FooterLogoTitle>
              <FooterLogo src={Logo} />
              POLARECO
            </FooterLogoTitle>
            <FooterLogoContent>
              건강한 지구, 건강한 라이프 <br />
              건강한 가치를 추구하는 에코 플랫폼 <br />
              폴라레코입니다.
            </FooterLogoContent>
          </FooterSectionContainer>
          <FooterSectionContainer>
            <FooterSectionTitle>Company</FooterSectionTitle>
            <FooterSectionContent>
              <div className="footer-content">About Us</div>
              <div className="footer-content">Contact Us</div>
              <div className="footer-content">Features</div>
            </FooterSectionContent>
          </FooterSectionContainer>
          <FooterSectionContainer>
            <FooterSectionTitle>Services</FooterSectionTitle>
            <FooterSectionContent>
              <div className="footer-content">Eco-Habit</div>
              <div className="footer-content">Challenge</div>
              <div className="footer-content">Community</div>
              <div className="footer-content">Sponsor</div>
            </FooterSectionContent>
          </FooterSectionContainer>
          <FooterSectionContainer>
            <FooterSectionTitle>Contact</FooterSectionTitle>
            <FooterSectionContent>
              <div className="footer-content">(+82) 10-0000-0000</div>
              <div className="footer-content">polareco.official@gmail.com</div>
              <div className="footer-content">
                Address: Gangnamgu, <div>Seoul, 03232</div>
              </div>
            </FooterSectionContent>
          </FooterSectionContainer>
          <FooterSectionContainer>
            <FooterSectionTitle>Link</FooterSectionTitle>
            <FooterSectionContent>
              <div className="footer-content">Terms of Service</div>
              <div className="footer-content">Privacy Policy</div>
              <div className="footer-content">Career</div>
            </FooterSectionContent>
          </FooterSectionContainer>
        </FooterInfoContainer>
        <FooterLine />
        <RigthInfo>© 2023 Polareco - All Rights Reserved</RigthInfo>
      </FooterContainer>
    </Entire>
  );
}

export default Footer;

const Entire = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
  background-color: #131313;
`;

const FooterLogo = styled.img`
  width: 51px;
  height: 37px;
  margin-right: 8px;
`;

const FooterContainer = styled.div`
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 0;

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

const FooterInfoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const FooterSectionContainer = styled.div`
  margin-top: 40px;
`;

const FooterSectionTitle = styled.div`
  font-size: 25px;
  color: var(--White, #fdfdfd);
  /* H2 */
  font-family: 'Inter';
  text-align: left;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 46.8px */
  margin-bottom: 40px;
`;

const FooterLogoTitle = styled(FooterSectionTitle)`
  font-weight: 900;
`;

const FooterSectionContent = styled.div`
  color: #b2afaf;
  /* H4 */
  font-family: 'Inter';
  font-size: 16px;
  text-align: left;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /*31.2px*/

  > .footer-content {
    margin-bottom: 20px;
    white-space: nowrap;
  }
`;

const FooterLogoContent = styled(FooterSectionContent)`
  color: #b2afaf;

  font-family: 'Inter';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  width: 304px;
`;

const FooterLine = styled.hr`
  border: none;
  height: 1px;
  background-color: #b2afaf;
  width: 100%;
`;

const RigthInfo = styled.div`
  color: var(--White, #fdfdfd);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: 'Inter';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-top: 30px;
`;
