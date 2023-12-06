import styled from 'styled-components';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  setCategory,
  setComments,
  setContent,
  setCreatedAt,
  setLikedByUserIds,
  setLikes,
  setMemberId,
  setPost,
  setPostId,
  setThumbnailUrl,
  setTitle,
  setUpdatedAt,
  setUserName,
  setViews,
} from '../redux/slice/postSlice';

import ButtonGroup from '../components/feature/community/ButtonGroup';
import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import PostCommentDetail from '../components/feature/community/PostCommentDetail';

import { RootState } from '../redux/store/store';
import { closeModal, openModal } from '../redux/slice/modalSlice';
//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

function PostDetailHeaderButtons() {
  // const USERID = useSelector((state: user) => state.user.userId);
  const POST = useSelector((state: RootState) => state.post);

  const USERACCESSTOKEN = localStorage.getItem('accesstoken');
  const USERREFRESHTOKEN = localStorage.getItem('refreshtoken');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function postModifyHandler() {
    // 게시물 정보와 함께 postwrite로 이동
    navigate(`/community/postwrite`, { state: { POST } });
  }

  function postDeleteHandler() {
    // 게시글 삭제 요청 처리 후 게시판으로 이동
    axios
      .delete(`${APIURL}/posts/${POST.postId}`, {
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
          'Refresh-Token': `${USERREFRESHTOKEN}`,
        },
      })
      .then(function () {
        //게시글 삭제 성공, 게시판 이동
        dispatch(closeModal('deletePostModal'));
        navigate(`/community`);
      })
      .catch(function (error) {
        //console.log('게시물 삭제 실패');
        console.log(error);
      });
  }

  function postDeleteModalHandler() {
    dispatch(openModal('deletePostModal'));
  }

  return (
    <div className="header-buttons">
      {/* 삭제 예 -> 서버에 delete 요청 */}
      <Modal className="post-delete" modaltype="deletePostModal">
        <div>해당 게시글을 삭제하시겠습니까?</div>
        <ModalButtons>
          <Button onClick={postDeleteHandler}>예</Button>
          <Button
            onClick={() => {
              dispatch(closeModal('deletePostModal'));
            }}>
            아니요
          </Button>
        </ModalButtons>
      </Modal>

      <Button width="60px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={postModifyHandler}>
        수정
      </Button>
      <Button width="60px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={postDeleteModalHandler}>
        삭제
      </Button>
    </div>
  );
}

function CommunityPostDetailPage() {
  const USERID = useSelector((state: RootState) => state.user.userId);
  const POST = useSelector((state: RootState) => state.post);

  const USERACCESSTOKEN = localStorage.getItem('accesstoken');
  const USERREFRESHTOKEN = localStorage.getItem('refreshtoken');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  //post 정보 요청
  async function getPost() {
    console.log(USERACCESSTOKEN);
    axios
      .get(`${APIURL}/posts/${params.postnumber}`, {
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
          //ngrok 사용시에만 넣음
          'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
      })
      .then(function (response) {
        // console.log(response.data);
        dispatch(setTitle(response.data.title));
        dispatch(setCategory(response.data.category));
        dispatch(setLikedByUserIds(response.data.likedByUserIds));
        dispatch(setLikes(response.data.likes));
        dispatch(setPostId(response.data.postId));
        dispatch(setMemberId(response.data.memberId));
        dispatch(setThumbnailUrl(response.data.thumbnailUrl));
        dispatch(setUpdatedAt(response.data.updatedAt));
        dispatch(setCreatedAt(response.data.createdAt));
        dispatch(setComments(response.data.comments));
        dispatch(setContent(response.data.content));
        dispatch(setUserName(response.data.username));
        dispatch(setViews(response.data.views));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function changeLikeHandler() {
    if (USERID === '') {
      const tryLogin = confirm('회원만 이용 가능한 기능입니다. 로그인 하시겠습니까?');
      console.log(tryLogin);
      if (tryLogin) {
        navigate('/login');
      }
    } else {
      if (POST.likedByUserIds?.includes(USERID)) {
        //좋취
        dispatch(setLikes(POST.likes - 1));
        dispatch(
          setLikedByUserIds(
            POST.likedByUserIds.filter(item => {
              item !== USERID;
            }),
          ),
        );
      } else {
        //좋추
        dispatch(setLikes(POST.likes + 1));
        dispatch(setLikedByUserIds([...POST.likedByUserIds, USERID]));
      }
      axios({
        method: 'post',
        url: `${APIURL}/posts/${POST.postId}/likes`,
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
        },
      })
        .then(() => {})
        .catch(error => {
          console.log(error);
          // if(error.response.status === 403){

          // }
        });
    }
  }
  useEffect(() => {
    getPost();
  }, []);

  return (
    <PostDetailLayout>
      <PostDetailHeader>
        <h2>{POST.title}</h2>
        <div className="header-detail-container">
          <div className="header-detail">
            <div className="post-user">{POST.username}</div>
            <div className="post-date">{POST.createdAt}</div>
            <div className="post-view"> 조회수: {POST.views}</div>
          </div>
          {USERID === POST.memberId ? <PostDetailHeaderButtons /> : null}
        </div>
      </PostDetailHeader>
      <PostDetailContent>
        <div>{POST.content ? <div dangerouslySetInnerHTML={{ __html: POST.content }}></div> : null}</div>
      </PostDetailContent>
      <PostDetailFooter>
        <div className="lick-count-container">
          {POST.likedByUserIds && POST.likedByUserIds.includes(USERID) ? (
            <AiFillHeart className="aifillheart" onClick={changeLikeHandler} />
          ) : (
            <AiOutlineHeart className="aioutlineheart" onClick={changeLikeHandler} />
          )}
          <div>{POST.likes}</div>
        </div>
        <Button
          width="65px"
          height="30px"
          borderRadius="15px"
          fontSize={1}
          hoverBgColor="#7092bf"
          hoverColor="white"
          onClick={() => {
            navigate(`/community`);
          }}>
          목록
        </Button>
      </PostDetailFooter>

      <PostFooter>
        {/* 댓글 리스트 map으로 */}
        {POST.comments ? <PostCommentDetail /> : null}
      </PostFooter>

      <ButtonGroup left="77%" top="85%" />
    </PostDetailLayout>
  );
}
export default CommunityPostDetailPage;

const PostDetailLayout = styled.div`
  width: 748px;
  height: auto;
  border: 1px solid #9a9fa1;
  background-color: #eceff1;
  margin: 0 auto;
  padding: 20px;
  border-radius: 15px;
  justify-content: center;
  @media all and (max-width: 770px) {
    width: 80%;
  }
`;

const PostDetailHeader = styled.div`
  padding: 15px;
  background-color: #fcfcfc;
  border: 1px solid #a8adaf;
  border-radius: 15px;
  margin-bottom: 20px;
  div.header-detail-container {
    display: flex;
    justify-content: space-between;
  }
  div.header-detail-container div.header-detail {
    font-size: 15px;
    display: flex;
  }
  div.header-detail-container div.header-detail div {
    margin: 3px 4px;
  }
  div.header-detail-container div.post-date {
    font-size: 15px;
  }
  div.header-buttons button {
    margin-left: 5px;
  }
  @media all and (max-width: 580px) {
    div.header-detail-container {
      display: block;
      /* justify-content: space-between; */
    }
  }
`;

const PostDetailContent = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 20px;
  background-color: #fcfcfc;
  border: 1px solid #a8adaf;
  border-radius: 15px;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 100%;
    //이미지 사이즈
    object-fit: contain;
  }
`;

const PostDetailFooter = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
  margin-bottom: 20px;
  div.lick-count-container {
    display: flex;
    margin: 0 10px;
    font-size: 20px;
  }
  div.lick-count-container svg {
    font-size: 30px;
    margin: 0 5px;
  }
  div.lick-count-container svg.aifillheart {
    font-size: 30px;
    margin: 0 5px;
    color: #e7325f;
  }
  div.lick-count-container svg:hover {
    font-size: 32px;
    cursor: pointer;
  }
  button {
    margin: 0 15px;
  }
`;

const PostFooter = styled.div`
  div.not-login-comment {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fcfcfc;
    border: 1px solid #a8adaf;
    border-radius: 15px;
  }
  div.post-comment-container div.post-comment {
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fcfcfc;
    border: 1px solid #a8adaf;
    border-radius: 15px;
    /* display: flex; */
  }

  div.post-comment-container div.post-comment div.is-not-comment-btn {
    height: 10px;
  }

  div.post-comment div.comment-user {
    width: 80px;
    font-size: 16px;
    font-weight: 600;
    padding: 0 15px;
  }
  div.post-comment div.comment-content {
    font-size: 16px;
    padding: 0px;
    padding: 10px 15px;
    justify-content: left;
  }
  div.post-comment div.comment-date {
    display: flex;
    justify-content: right;
    font-size: 12px;
    color: gray;
  }
  div.post-comment div.comment-buttons {
    display: flex;
    justify-content: right;
    padding: 0px 10px;
  }
  div.post-comment-add {
    margin: 5px 0px;
    padding: 10px;
    background-color: #fcfcfc;
    border: 1px solid #a8adaf;
    border-radius: 15px;
  }
  div.post-comment-add div.post-comment-add-user {
    font-size: 16px;
    font-weight: 600;
    padding: 10px;
  }
  div.post-comment-add textarea.post-comment-add-content {
    margin-top: 5px;
    width: 100%;
    height: 100px;
    border-radius: 10px;
    padding: 1%;
  }
  div.post-comment-add div.post-comment-submit {
    margin-top: 5px;
    display: flex;
    justify-content: right;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  button {
    width: 100px;
    margin: 0px 10px;
  }
`;
