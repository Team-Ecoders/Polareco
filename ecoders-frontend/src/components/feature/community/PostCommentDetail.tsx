import { styled } from 'styled-components';
import { FiX } from 'react-icons/fi';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

import { logout } from '../../../redux/slice/loginSlice';

import { comment } from '../../../interfaces/communityInterfaces';
// import { useNavigate } from 'react-router-dom';
import { setComments } from '../../../redux/slice/postSlice';
import axios from 'axios';
import Button from '../../atoms/Button';

import { tokenExpirationHandler } from '../user/Session';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

const CommentButtons = ({
  comment,
  commentList,
  setIsCommentModify,
}: {
  comment: comment;
  commentList: Array<comment>;
  setIsCommentModify: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const USERACCESSTOKEN = localStorage.getItem('accessToken');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dispatch = useDispatch();

  function commentModifyHandler() {
    // 댓글 정보를 가지고 수정..
    setIsCommentModify(comment.commentId);
  }

  function commentDeleteHandler() {
    // // 댓글 삭제 낙관적 업데이트
    setIsDeleteModalOpen(false);

    if (commentList !== undefined) {
      const deletedCommentList = commentList.filter(item => {
        return item.commentId !== comment.commentId;
      });
      dispatch(setComments([...deletedCommentList]));
    }
    axios
      .delete(`${APIURL}/posts/comment/${comment.commentId}`, {
        headers: {
          Authorization: `${USERACCESSTOKEN}`,
        },
      })
      .then(function (response) {
        console.log(response.status);
      })
      .catch(function (error) {
        if (error.response.status === 403) {
          tokenExpirationHandler(commentDeleteHandler);
        } else {
          console.log(error);
          dispatch(setComments(commentList));
          dispatch(logout());
        }
      });
  }

  function deleteModalOpenHandler() {
    setIsDeleteModalOpen(true);
  }
  function deleteModalCloseHandler() {
    setIsDeleteModalOpen(false);
  }
  return (
    <div className="comment-buttons">
      {isDeleteModalOpen ? (
        <Container className="post-delete">
          <Overlay onClick={deleteModalCloseHandler} />
          <Content>
            <IconBox>
              <FiX className="close-icon" onClick={deleteModalCloseHandler} />
            </IconBox>
            <TextBox>
              <div>해당 댓글을 삭제하시겠습니까?</div>
              <ModalButtons>
                <Button onClick={commentDeleteHandler}>예</Button>
                <Button onClick={deleteModalCloseHandler}>아니요</Button>
              </ModalButtons>
            </TextBox>
          </Content>
        </Container>
      ) : null}

      <Button
        width="30px"
        fontSize={0.8}
        border="0px"
        hoverBgColor="#7092bf"
        hoverColor="white"
        onClick={commentModifyHandler}>
        수정
      </Button>
      <Button
        width="30px"
        fontSize={0.8}
        border="0px"
        hoverBgColor="#7092bf"
        hoverColor="white"
        onClick={deleteModalOpenHandler}>
        삭제
      </Button>
    </div>
  );
};

function CommentModify({
  initComment,
  commentList,
  setIsCommentModify,
}: {
  initComment: comment;
  commentList: Array<comment>;
  setIsCommentModify: React.Dispatch<React.SetStateAction<number>>;
}) {
  const USERACCESSTOKEN = localStorage.getItem('accessToken');
  const [comment, setComment] = useState(initComment.content);

  const dispatch = useDispatch();

  function changeCommentHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment((event.target as HTMLTextAreaElement).value);
  }

  async function patchComment(patchCommentData: { content: string }) {
    axios({
      method: 'patch',
      url: `${APIURL}/posts/comment/${initComment.commentId}`,
      data: JSON.stringify(patchCommentData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${USERACCESSTOKEN}`,
      },
    })
      .then(function () {
        //console.log('댓글 수정 성공');
        setIsCommentModify(0);
        // window.location.reload();
      })
      .catch(error => {
        if (error.response.status === 403) {
          tokenExpirationHandler(submitCommentHandler);
        } else {
          console.log(error);
          //댓글 수정 실패 시 댓글 이전으로 다시 설정
          dispatch(setComments(commentList));
          dispatch(logout());
        }
      });
  }
  // 댓글 수정 버튼 클릭 함수
  function submitCommentHandler() {
    //console.log(comment);
    const commentData = {
      content: comment,
    };
    if (comment === '') {
      alert('댓글 내용을 작성해야합니다.');
    } else {
      //댓글 수정 낙관적 업데이트
      if (commentList !== undefined) {
        const modifyCommentList = commentList.map(item => {
          if (item.commentId === initComment.commentId) {
            return {
              ...item,
              memberId: initComment.memberId,
              content: comment,
              username: initComment.username,
              createdAt: initComment.createdAt,
              updatedAt: initComment.updatedAt,
            };
          }
          return item;
        });
        dispatch(setComments(modifyCommentList));
      }
      patchComment(commentData);
    }
  }
  return (
    <div className="post-comment-add">
      <div className="post-comment-add-user">{initComment.username}</div>
      <textarea
        className="post-comment-add-content"
        placeholder="댓글을 남겨주세요"
        value={comment}
        onChange={changeCommentHandler}></textarea>
      <div className="post-comment-submit">
        <Button width="70px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={submitCommentHandler}>
          수정
        </Button>
      </div>
    </div>
  );
}

function CommentAdd({ commentList, postid }: { commentList: Array<comment> | undefined; postid: number | undefined }) {
  const USERACCESSTOKEN = localStorage.getItem('accessToken');
  const USERID = useSelector((state: RootState) => state.user.userId);
  const USERNAME = useSelector((state: RootState) => state.user.userName);

  const dispatch = useDispatch();

  const [comment, setComment] = useState('');

  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const hours = ('0' + today.getHours()).slice(-2);
  const minutes = ('0' + today.getMinutes()).slice(-2);
  const seconds = ('0' + today.getSeconds()).slice(-2);

  const dateString = year + '-' + month + '-' + day;
  const timeString = hours + ':' + minutes + ':' + seconds;

  function changeCommentHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment((event.target as HTMLTextAreaElement).value);
  }

  async function postComment(commentData: { content: string }) {
    axios({
      method: 'post',
      url: `${APIURL}/posts/${postid}/comment`,
      data: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${USERACCESSTOKEN}`,
      },
    })
      .then(response => {
        console.log(response.data.commentId);
        if (commentList !== undefined) {
          dispatch(
            setComments([
              ...commentList,
              {
                memberId: USERID,
                commentId: response.data.commentId,
                content: comment,
                username: USERNAME,
                createdAt: `${dateString} ${timeString}`,
                updatedAt: null,
              },
            ]),
          );
          setComment('');
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          tokenExpirationHandler(postComment);
        } else {
          console.log(error);
          //댓글 등록 실패 시 댓글 이전으로 다시 설정
          setComments(commentList);
          dispatch(logout());
        }
      });
  }
  // 댓글 등록 버튼 클릭 함수
  function submitCommentHandler() {
    const commentData = {
      content: comment,
    };

    if (comment === '') {
      alert('댓글 내용을 작성해야합니다.');
    } else {
      if (commentList !== undefined) {
        let initCommentId;
        if (commentList.length === 0) {
          initCommentId = 1;
        } else {
          initCommentId = commentList[commentList?.length - 1].commentId + 1;
        }
        dispatch(
          setComments([
            ...commentList,
            {
              memberId: USERID,
              commentId: initCommentId,
              content: comment,
              username: USERNAME,
              createdAt: `${dateString} ${timeString}`,
              updatedAt: null,
            },
          ]),
        );
        setComment('');
      }

      postComment(commentData);
    }
  }
  return (
    <div className="post-comment-add">
      <div className="post-comment-add-user">{USERNAME}</div>
      <textarea
        className="post-comment-add-content"
        placeholder="댓글을 남겨주세요"
        value={comment}
        onChange={changeCommentHandler}></textarea>
      <div className="post-comment-submit">
        <Button width="70px" fontSize={1} hoverBgColor="#7092bf" hoverColor="white" onClick={submitCommentHandler}>
          등록
        </Button>
      </div>
    </div>
  );
}

function PostCommentDetail() {
  const USERID = useSelector((state: RootState) => state.user.userId);
  const POST = useSelector((state: RootState) => state.post);
  const commentList = useSelector((state: RootState) => state.post.comments);
  const [isCommentModify, setIsCommentModify] = useState(0);

  return (
    <>
      <div className="post-comment-container">
        {commentList &&
          commentList.map((item, index) => {
            const commentItem = item;
            if (commentItem.commentId === isCommentModify) {
              return (
                <CommentModify
                  initComment={commentItem}
                  commentList={commentList}
                  setIsCommentModify={setIsCommentModify}
                />
              );
            }
            return (
              <div className="post-comment" key={index}>
                {/* 헤더 유저네임, item.usename 같은지 조건부 버튼 렌더 */}
                {commentItem.memberId === USERID ? (
                  <CommentButtons
                    comment={commentItem}
                    setIsCommentModify={setIsCommentModify}
                    commentList={commentList}
                  />
                ) : (
                  <div className="is-not-comment-btn"></div>
                )}
                <div className="comment-detail">
                  <div className="comment-user">{item.username}</div>
                  <div className="comment-detail-content">
                    <div className="comment-content">{item.content}</div>
                    <div className="comment-date">{item.createdAt}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {USERID !== '' && <CommentAdd commentList={POST.comments} postid={POST.postId} />}
    </>
  );
}

export default PostCommentDetail;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  button {
    width: 100px;
    margin: 0px 10px;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  z-index: 30;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
`;

const Content = styled.section`
  display: flex;
  flex-direction: column;
  width: 20rem;
  max-height: 20rem;
  background-color: #fff;
  border-radius: 30px;
  padding: 2rem;
  z-index: 1;
  overflow: auto;
`;

const IconBox = styled.div`
  display: flex;
  justify-content: flex-end;

  .close-icon {
    cursor: pointer;
  }
`;

const TextBox = styled.div``;
