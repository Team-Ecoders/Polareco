import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import PostCard from '../components/feature/community/PostCard';
import ButtonGroup from '../components/feature/community/ButtonGroup';
import Button from '../components/atoms/Button';

import Loading from '../assets/Loading.svg';

import { card } from '../interfaces/communityInterfaces';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

function CommunityBoardPage() {
  // 마지막 포스트 아이디
  const [lastPostId, setlastPostId] = useState(99999);
  //포스트 데이터
  const [post, setPosts] = useState<Array<card>>([]);
  // 포스트 무한 스크롤 위한 위치
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 검색어ref
  const searchText = useRef('');
  // 검색어state
  const [keyWord, setKeyWord] = useState('');

  //카테고리 상태 (카드 컴포넌트에 넘겨주기 -> 조건부 렌더링 진행)
  const [category, setCategory] = useState('전체');
  const categoryOption: Array<string> = ['전체', '모집글', '인증글'];
  //카테고리로 필터링된 데이터 state
  const [filteredData, setFilteredData] = useState<Array<card>>([]);

  //로딩 state
  const [isLoading, setIsLoading] = useState(false);

  // 페이지에서 무한스크롤로 lastPostId가 변경되면서 posts를 get하는 함수
  async function getPosts() {
    let getPostCount = 10;
    let searchKeyWord = keyWord;

    if (lastPostId === 99999) {
      getPostCount = 20;
    }
    //키워드 있는 경우 keyword설정
    if (keyWord) {
      searchKeyWord = `&keyword=${keyWord}`;
    }
    axios
      .get(`${APIURL}/posts/all?lastPostId=${lastPostId}&size=${getPostCount}${searchKeyWord}`)
      .then(function (response) {
        if (getPostCount === 20) {
          setPosts(response.data);
        } else {
          setPosts(prevData => [...prevData, ...response.data]);
        }

        if (response.data.length < getPostCount) {
          setlastPostId(0);
        } else {
          setlastPostId(response.data[response.data.length - 1].postId);
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // 스크롤 이벤트 핸들러를 창에 추가
  useEffect(() => {
    //무한스크롤 이벤트 발생시
    const handleScroll = () => {
      // 스크롤이 아래로 내려가면서 로딩중이 아니라면 새로운 데이터 로드
      if (
        containerRef.current &&
        containerRef.current.getBoundingClientRect().bottom <= window.innerHeight + 100 &&
        !isLoading &&
        post.length >= 10
      ) {
        setIsLoading(true);
        if (lastPostId !== 0) {
          getPosts();
        } else {
          setIsLoading(false);
        }
      }
    };

    if (lastPostId === 99999) {
      getPosts();
      return;
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  //필터 기능(특정 state(여기선 filteredData)가 바뀔 때마다 실행)
  useEffect(() => {
    if (category === '전체') {
      setFilteredData(post);
    } else {
      setFilteredData(
        post.filter(item => {
          return item.category === category;
        }),
      );
    }
  }, [category, post]);

  // 카테고리 변경시
  function changeCategoryHandler(event: React.MouseEvent<HTMLButtonElement>) {
    setCategory((event.target as HTMLButtonElement).innerText);
  }

  // 검색어 변경시
  function submitSearchWordHandle(event: React.KeyboardEvent<HTMLInputElement>) {
    // 엔터 키를 눌렀을 때 이벤트를 처리
    if (event.key === 'Enter') {
      // 입력한 내용을 처리하거나 원하는 동작 수행
      setKeyWord((event.target as HTMLInputElement).value);
      setlastPostId(99999);
    }
  }

  return (
    <BoardLayout>
      <BoardHead>
        <div className="board-header-container">
          <div className="board-header-btn-container">
            {categoryOption.map((item, index) => {
              return (
                <>
                  <Button
                    key={index}
                    className={category === item ? 'clicked-category' : ''}
                    width="70px"
                    fontSize={1}
                    hoverBgColor="#7092bf"
                    hoverColor="white"
                    onClick={changeCategoryHandler}>
                    {item}
                  </Button>
                </>
              );
            })}
          </div>
          <div className="board-header-serch-input-container">
            <SearchInput
              type="search"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                searchText.current = event.target.value;
              }}
              onKeyUp={submitSearchWordHandle}
            />
          </div>
        </div>
      </BoardHead>
      <br />
      <BoardBody>
        <div className="board-body-container" ref={containerRef}>
          {/* 필터된 데이터 전달 */}
          {/*  likedPosts={likedPosts}  전달...*/}
          <PostCard data={filteredData}></PostCard>
          {isLoading && <svg href={Loading} />}
        </div>
      </BoardBody>
      <ButtonGroup top="15%" />
    </BoardLayout>
  );
}

export default CommunityBoardPage;

const BoardLayout = styled.div`
  width: 100%;
`;

const BoardHead = styled.div`
  border: 1px solid #a8adaf;
  width: 66%;
  background-color: #eceff1;
  display: flex;
  margin: 0 auto;
  border-radius: 15px;
  div.board-header-container {
    width: 100%;
    margin: 20px 25px 20px 25px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  div.board-header-btn-container {
    display: flex;
  }
  div.board-header-btn-container button {
    margin: 0 4px;
  }
  div.board-header-btn-container button.clicked-category {
    background-color: #7092bf;
    color: #ffffff;
    border: 1px solid #ffffff;
  }
  @media all and (max-width: 740px) {
    width: 70%;
    background-color: #eceff1;
    display: flex;
    border-radius: 15px;
    div.board-header-container {
      display: block;
      align-items: center;
    }
    div.board-header-btn-container {
      margin: 0 auto;
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }
    div.board-header-btn-container button {
      margin: 3px;
    }
    div.board-header-serch-input-container {
      margin: 0 auto;
      display: flex;
      justify-content: center;
    }
  }
`;

const BoardBody = styled.div`
  border: 1px solid #a8adaf;
  width: 66%;
  background-color: #eceff1;
  display: flex;
  margin: 0 auto;
  border-radius: 15px;
  div.board-body-container {
    width: 100%;
  }
  div.board-body-container div.board-card-container {
    margin: 20px;
    /* display: flex;
    flex-wrap: wrap;
    justify-content: center; */
    display: grid;
    grid-template-columns: repeat(4, minmax(20%, auto));
    grid-gap: 15px;
    justify-content: center;
    align-items: center;
  }
  div.board-card {
    border: 1px solid #566e915a;
  }
  /* 카드 hover시 효과 */
  div.board-card:hover {
    box-shadow: 1.5px 1.5px 3px 0px #7092bf;
    cursor: pointer;
  }
  /* 그리드 속성이.. 너무 엉망인것같아요.. ㅠㅁㅠ~ 여쭤봐야징 */
  @media all and (max-width: 1355px) {
    div.board-body-container div.board-card-container {
      margin: 20px;
      /* display: flex;
    flex-wrap: wrap;
    justify-content: center; */
      display: grid;
      grid-template-columns: repeat(3, minmax(30%, auto));
      grid-gap: 5px;
      justify-content: center;
      align-items: center;
    }
  }
  @media all and (max-width: 1045px) {
    div.board-body-container div.board-card-container {
      margin: 20px;
      /* display: flex;
    flex-wrap: wrap;
    justify-content: center; */
      display: grid;
      grid-template-columns: repeat(2, minmax(40%, auto));
      grid-gap: 5px;
      justify-content: center;
      align-items: center;
    }
  }
  @media all and (max-width: 770px) {
    div.board-body-container div.board-card-container {
      margin: 20px;
      /* display: flex;
    flex-wrap: wrap;
    justify-content: center; */
      display: grid;
      grid-template-columns: repeat(1, minmax(50%, auto));
      grid-gap: 5px;
      justify-content: center;
      align-items: center;
    }
  }
  @media all and (max-width: 480px) {
    width: 64%;
    background-color: #eceff1;
    display: flex;
    margin: 0 auto;
    border-radius: 15px;
    div.board-body-container {
      display: flex;
      flex-wrap: wrap;
    }
    div.board-body-container div.board-card-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 auto;
    }
  }
`;

const SearchInput = styled.input`
  width: 200px;
  border: 1.5px solid #afafaf;
  padding: 0 10px;
  height: 30px;
  border-radius: 50px;
  @media all and (min-width: 900px) {
    width: 300px;
    margin: 0;
  }
`;
