package ecoders.polareco.post.service;

import com.amazonaws.services.s3.AmazonS3;
import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.repository.MemberRepository;
import ecoders.polareco.member.service.MemberService;
import ecoders.polareco.post.dto.PostDto;
import ecoders.polareco.post.entity.Comment;
import ecoders.polareco.post.entity.Post;
import ecoders.polareco.post.repository.CommentRepository;
import ecoders.polareco.post.repository.PostRepository;
import ecoders.polareco.redis.service.RedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class PostService {
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final MemberService memberService;
    private final CommentRepository commentRepository;

    private final RedisService redisService;
    public PostService(MemberRepository memberRepository,
                       PostRepository postRepository,
                       CommentRepository commentRepository,
                       MemberService memberService,
                       RedisService redisService) {
        this.memberRepository = memberRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.memberService = memberService;
        this.redisService = redisService;
    }



    public Post findPost(long postId){
        return postRepository.findById(postId).orElseThrow(()->new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
    }

    public Member findMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email);
        if (member == null) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND);
        }
        return member;
    }

    public PostDto.PostResponseDtoV1 getPost(long postId){
        Post post = findPost(postId);
        PostDto.PostResponseDtoV1 newPost = new PostDto.PostResponseDtoV1();
        long likescount = getLikeCountForPost(postId);
        Set<Member> likedByMembers = post.getLikedBy();
        Set<UUID> likedByUserIds = new HashSet<>();
        for (Member member : likedByMembers) {
            likedByUserIds.add(member.getUuid());
        }
        newPost.setPostId(post.getPostId());
        newPost.setTitle(post.getTitle());
        newPost.setContent(post.getContent());
        newPost.setCategory(post.getCategory());
        newPost.setThumbnailUrl(post.getThumbnailUrl());
        newPost.setUsername(post.getMember().getUsername());
        newPost.setMemberId(post.getMember().getUuid());
        newPost.setViews(post.getViews());
        newPost.setLikes(likescount);
        newPost.setLikedByUserIds(likedByUserIds);
        newPost.setCreatedAt(post.getCreatedAt());
        newPost.setUpdatedAt(post.getModifiedAt());
        List<PostDto.CommentResponseDTO> commentResponseDTOs = new ArrayList<>();
        List<Comment> comments = commentRepository.findByPostId(postId);
        for(Comment comment : comments){

            PostDto.CommentResponseDTO commentDTO = new PostDto.CommentResponseDTO();

            commentDTO.setCommentId(comment.getCommentId());
            commentDTO.setContent(comment.getContent());
            commentDTO.setUsername(comment.getMember().getUsername());
            commentDTO.setMemberId(comment.getMember().getUuid());
            commentDTO.setCreatedAt(comment.getCreatedAt());
            commentDTO.setUpdatedAt(comment.getModifiedAt());
            commentResponseDTOs.add(commentDTO);
        }
        newPost.setComments(commentResponseDTOs);
        return newPost;
    }

    public List<PostDto.PostResponseDtoV2> getPosts(Long lastPostId, int size, String keyword){
        PageRequest pageRequest = PageRequest.of(0, size);
        Page<Post> entityPage;
        if(keyword !=null && !keyword.isEmpty()){
            entityPage = postRepository.findByPostIdLessThanAndTitleContainingOrContentContainingOrderByPostIdDesc(
                    lastPostId, keyword, keyword, pageRequest);
        }else{
            entityPage = postRepository.findByPostIdLessThanOrderByPostIdDesc(lastPostId, pageRequest);
        }

        List<Post> entityList = entityPage.getContent();

        List<PostDto.PostResponseDtoV2> resultList = entityList.stream()
                .map(post -> {
                    PostDto.PostResponseDtoV2 dto = new PostDto.PostResponseDtoV2();
                    long likescount = getLikeCountForPost(post.getPostId());
                    Set<Member> likedByMembers = post.getLikedBy();
                    Set<UUID> likedByUserIds = new HashSet<>();
                    for (Member member : likedByMembers) {
                        likedByUserIds.add(member.getUuid());
                    }
                    dto.setPostId(post.getPostId());
                    dto.setTitle(post.getTitle());
                    dto.setCategory(post.getCategory());
                    dto.setThumbnailUrl(post.getThumbnailUrl());
                    dto.setUsername(post.getMember().getUsername());
                    dto.setCreatedAt(post.getCreatedAt());
                    dto.setLikes(likescount);
                    dto.setLikedByUserIds(likedByUserIds);

                    return dto;
                })
                .collect(Collectors.toList());

        return resultList;
    }


    public void toggleLike(Long postId, UUID memberId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));

        if (post != null && member != null) {
            if (post.getLikedBy().contains(member)) {
                post.getLikedBy().remove(member);
                // 이미 좋아요한 경우 취소
            } else {
                post.getLikedBy().add(member);
                // 아직 좋아요하지 않은 경우 추가
            }
            postRepository.save(post);
        }
    }

    public int getLikeCountForPost(Long postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post != null) {
            return post.getLikeCount();
        }
        return 0; // 게시글이 존재하지 않는 경우
    }



    public Post updatePost(long postId, String email){
        Post newPost = postRepository.findById(postId).orElseThrow(()->new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
        verifyAuthor(newPost,email);
        return newPost;
    }

    public void deletePost(long postId, String email) {
        Post post = postRepository.findById(postId).orElseThrow(()->new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
        verifyAuthor(post, email);
        postRepository.delete(post);
    }
    private void verifyAuthor(Post post, String email) {
        String authorEmail = post.getMember().getEmail();;
        if (!email.equals(authorEmail)) {
            throw new BusinessLogicException(ExceptionCode.CANNOT_CHANGE_POST);
        }
    }

    public void updateView(long postId,String memberId) {
        String viewCount = redisService.getData(String.valueOf(memberId));
        if (viewCount == null) {
            redisService.setDateExpire(String.valueOf(memberId), postId + "_", calculateTimeUntilMidnight());
            postRepository.updateView(postId);
        } else {
            String[] strArray = viewCount.split("_");
            List<String> redisPortfolioList = Arrays.asList(strArray);

            boolean isView = false;

            if (!redisPortfolioList.isEmpty()) {
                for (String redisPortfolioId : redisPortfolioList) {
                    if (String.valueOf(postId).equals(redisPortfolioId)) {
                        isView = true;
                        break;
                    }
                }
                if (!isView) {
                    viewCount += postId + "_";

                    redisService.setDateExpire(String.valueOf(memberId), viewCount, calculateTimeUntilMidnight());
                    postRepository.updateView(postId);
                }
            }
        }

    }

    public long calculateTimeUntilMidnight() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime midnight = now.truncatedTo(ChronoUnit.DAYS).plusDays(1);
        return ChronoUnit.SECONDS.between(now, midnight);
    }
}
