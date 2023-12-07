import { styled } from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../redux/slice/modalSlice';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import Button from '../components/atoms/Button';
import Modal from '../components/atoms/Modal';
import DefaultThumbnail from '../assets/DefaultThumbnail.png';

import { postWriteDataState } from '../interfaces/communityInterfaces';

import { tokenExpirationHandler } from '../components/feature/user/Session';

import axios from 'axios';
import { RootState } from '../redux/store/store';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

function CommunityPostWritePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const USERACCESSTOKEN = localStorage.getItem('accessToken');

  const [title, setTitle] = useState<string | undefined>('');
  // const title = useRef('');
  const [category, setCategory] = useState<string | undefined>('');
  const [content, setContent] = useState<string | undefined>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModify, setIsModify] = useState<boolean>(false);

  const editorRef = useRef<Editor>(null);

  const postData: postWriteDataState = {
    title: title,
    content: content,
    thumbnailUrl: thumbnailUrl,
    category: category,
  };

  async function postWrite() {
    const method = isModify ? 'patch' : 'post';
    const url = isModify ? `${APIURL}/posts/${state.POST.postId}` : `${APIURL}/posts`;
    const nextLocation = isModify ? `/community/postdetail/${state.POST.postId}` : `/community`;

    console.log(USERACCESSTOKEN);
    await axios({
      method: method,
      url: url,
      data: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${USERACCESSTOKEN}`,
      },
    })
      .then(response => {
        if (response.status === 200) {
          navigate(nextLocation);
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          tokenExpirationHandler(postWrite);
        } else {
          console.log(error);
        }
      });
  }

  //게시글 수정일 경우 게시글 정보 설정
  useEffect(() => {
    // console.log(state);
    if (state !== null) {
      console.log(state);
      setIsModify(true);
      setTitle(state.POST.title);
      editorRef.current?.getInstance().setHTML(state.POST.content);
      setContent(state.POST.content);
      setCategory(state.POST.category);
    }
  }, []);

  //게시글 등록
  useEffect(() => {
    if (isSubmit) {
      if (postData.title !== '' && postData.content !== '<p><br></p>') {
        postWrite();
      } else {
        //제목, 내용이 비어있는 경우 등록 불가..!
        alert('게시글 제목, 내용을 작성해야합니다.');
        window.location.reload();
      }
    }
  }, [isSubmit]);

  type HookCallback = (url: string, text?: string) => void;
  const uploadImageHandler = async (blob: Blob | File, callback: HookCallback) => {
    const formData = new FormData();
    formData.append('imageFile', blob);

    axios({
      method: 'post',
      url: `${APIURL}/posts/uploadImage`, // 적절한 엔드포인트로 변경해야 합니다. (이거 맞나..?)
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        const imageUrl = `${response.data}`;
        callback(imageUrl, 'img');
      })
      .catch(error => {
        if (error.response.status === 403) {
          tokenExpirationHandler(uploadImageHandler);
        } else {
          console.error('axios 이미지 업로드 실패', error);
          callback('image_load_fail', 'image_load_fail');
        }
      });
    return false;
  };

  const submitButtonClickHandler = () => {
    // 확인 모달
    const data = editorRef.current?.getInstance().getHTML() || '';
    // markdown.. or 내용만 필요할 경우:
    // const markdownData = editorRef.current?.getInstance();
    // const content = markdownData.getMarkdown();

    // content 설정
    //console.log(data);
    setContent(data);

    // thumbnailUrl설정
    const imgTags: HTMLImageElement[] = Array.from(
      new DOMParser().parseFromString(data, 'text/html').querySelectorAll('img'),
    );
    if (imgTags.length === 0) {
      console.log('data에 img 태그가 없습니다. default 썸네일로 설정합니다.');
      setThumbnailUrl(DefaultThumbnail);
    } else {
      // img 태그가 존재할 경우 첫 등록한 이미지를 썸네일로 지정
      // imgTags 배열에 있음 imgTag.getAttribute('src');
      setThumbnailUrl(imgTags[0].getAttribute('src'));
    }
    dispatch(openModal('postModal'));
  };

  return (
    <PostWriteLayout>
      <PostWriteForm>
        <div className="post-write-header">
          <input
            className="post-write-title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value);
            }}
          />
          <select
            className="post-select-category"
            name="category"
            defaultValue="전체"
            value={category}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setCategory(event.target.value);
            }}>
            <option value="전체">전체</option>
            <option value="모집글">모집글</option>
            <option value="인증글">인증글</option>
          </select>
        </div>
        <>
          {/* 등록 버튼 클릭시 모달 */}
          <Modal className="post-upload" modaltype="postModal">
            <div>해당 게시글을 등록하시겠습니까?</div>
            <ModalButtons>
              <Button
                onClick={() => {
                  dispatch(closeModal('postModal'));
                  setIsSubmit(true);
                }}>
                예
              </Button>
              <Button
                onClick={() => {
                  dispatch(closeModal('postModal'));
                }}>
                아니요
              </Button>
            </ModalButtons>
          </Modal>
          <div className="post-write-body">
            <Editor
              height="490px"
              initialEditType="wysiwyg"
              hideModeSwitch={true}
              useCommandShortcut={false}
              ref={editorRef}
              autofocus={false}
              hooks={{
                addImageBlobHook: uploadImageHandler,
              }}
            />
            <div className="submit-button-container">
              <Button
                width="80px"
                fontSize={1}
                hoverBgColor="#7092bf"
                hoverColor="white"
                onClick={submitButtonClickHandler}>
                등록
              </Button>
            </div>
          </div>
        </>
      </PostWriteForm>
    </PostWriteLayout>
  );
}

export default CommunityPostWritePage;

const PostWriteLayout = styled.div`
  width: 100%;
`;

const PostWriteForm = styled.div`
  border: 1px solid #a8adaf;
  width: 65%;
  height: auto;
  background-color: #eceff1;
  margin: 0 auto;
  padding: 10px;
  border-radius: 15px;
  justify-content: center;

  div.post-write-header {
    display: flex;
    margin: 5px 0 10px 0;
    justify-content: space-between;
  }
  div.post-write-header .post-select-category {
    width: 100px;
    border-radius: 10px;
    border: 1.5px solid #afafaf;
  }
  div.post-write-header .post-write-title {
    width: 83%;
    border: 1.5px solid #afafaf;
    padding: 0 10px;
    height: 35px;
    border-radius: 10px;
  }
  div.post-write-body {
  }
  div.submit-button-container {
    display: flex;
    height: 30px;
    justify-content: right;
    margin-top: 10px;
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
