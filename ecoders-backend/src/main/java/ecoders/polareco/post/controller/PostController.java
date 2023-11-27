package ecoders.polareco.post.controller;

import ecoders.polareco.auth.jwt.service.JwtService;
import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.service.MemberService;
import ecoders.polareco.post.dto.CommentDto;
import ecoders.polareco.post.dto.PostDto;
import ecoders.polareco.post.entity.Comment;
import ecoders.polareco.post.entity.Post;
import ecoders.polareco.post.repository.CommentRepository;
import ecoders.polareco.post.repository.PostRepository;
import ecoders.polareco.post.service.CommentService;
import ecoders.polareco.post.service.PostService;
import ecoders.polareco.s3.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/posts")
@RestController
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    private final MemberService memberService;
    private final JwtService jwtService;

    private final S3Service s3Service;
    private final CommentService commentService;

    private final CommentRepository commentRepository;

    public PostController(PostService postService,
                          PostRepository postRepository,
                          JwtService jwtService,
                          MemberService memberService,
                          S3Service s3Service,
                          CommentService commentService,
                          CommentRepository commentRepository) {
        this.postService = postService;
        this.postRepository = postRepository;
        this.jwtService = jwtService;
        this.memberService = memberService;
        this.s3Service = s3Service;
        this.commentService = commentService;
        this.commentRepository = commentRepository;
    }

    @PostMapping
    public ResponseEntity post(@RequestBody PostDto.PostCreateDto postDto,
                               @AuthenticationPrincipal String email){

        Member member = postService.findMemberByEmail(email);

        Post newPost = new Post();
        newPost.setTitle(postDto.getTitle());
        newPost.setContent(postDto.getContent());
        newPost.setCategory(postDto.getCategory());
        newPost.setThumbnailUrl(postDto.getThumbnailUrl());
        newPost.setMember(member);
        newPost.setCreatedAt(LocalDateTime.now());
        newPost.setModifiedAt(LocalDateTime.now());
        postRepository.save(newPost);

        return ResponseEntity.ok("Post successfully created.");
    }

    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestHeader("Content-Type") String contentType,
                                              @RequestParam("imageFile") MultipartFile imageFile){
        try{
        String imageUrl = s3Service.uploadImage(imageFile);
        return ResponseEntity.ok(imageUrl);
    } catch (Exception e){
        e.printStackTrace();
        return ResponseEntity.status(500).body("Image upload failed");
        }
    }



    @GetMapping("/{post-id}")
   public ResponseEntity<PostDto.PostResponseDtoV1> getPost(@PathVariable("post-id") long postId,
                                                            @AuthenticationPrincipal String email) {
        PostDto.PostResponseDtoV1 foundPost = postService.getPost(postId);
        if (!email.isEmpty()) {
            Member member = postService.findMemberByEmail(email);
            String memberId = member.getUuid().toString();
            postService.updateView(postId, memberId);
        }
        return ResponseEntity.ok(foundPost);
    }

    @GetMapping("/all")
    public List<PostDto.PostResponseDtoV2> getAllPosts(@RequestParam long lastPostId,
                                                       @RequestParam int size,
                                                       @RequestParam(required = false) String keyword){
        return postService.getPosts(lastPostId,size,keyword);
    }

    @PatchMapping("/{post-id}")
    public ResponseEntity patchPost(@PathVariable("post-id") @Positive long postId,
                                      @RequestBody PostDto.PostUpdateDto postDto,
                                    @AuthenticationPrincipal String email)
    {
        Post newPost = postService.updatePost(postId, email);
        newPost.setTitle(postDto.getTitle());
        newPost.setContent(postDto.getContent());
        newPost.setCategory(postDto.getCategory());
        newPost.setThumbnailUrl(postDto.getThumbnailUrl());
        newPost.setModifiedAt(LocalDateTime.now());

        postRepository.save(newPost);

        return ResponseEntity.ok("Post successfully Changed");
    }

    @DeleteMapping("/{post-id}")
    public ResponseEntity deletePost(@PathVariable("post-id") long postId,
                                     @AuthenticationPrincipal String email) {

        postService.deletePost(postId, email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{post-id}/likes")
    public ResponseEntity<String> toggleLike(@PathVariable("post-id") long postId,
                                             @AuthenticationPrincipal String email) {

        Member member = postService.findMemberByEmail(email);
        UUID memberId = member.getUuid();
        postService.toggleLike(postId, memberId);
        return ResponseEntity.ok("Like toggled successfully");
    }

    @PostMapping("/{post-id}/comment")
    public ResponseEntity<Map<String,Object>> postComment(@PathVariable("post-id") long postId,
                                                          @RequestBody CommentDto.CommentCreateDto commentDto,
                                                          @AuthenticationPrincipal String email) {
        Member member = commentService.findMemberByEmail(email);
        Post post = postRepository.findById(postId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        Comment newComment = new Comment();
        newComment.setContent(commentDto.getContent());
        newComment.setMember(member);
        newComment.setPost(post);
        newComment.setCreatedAt(LocalDateTime.now());
        newComment.setModifiedAt(LocalDateTime.now());

        commentRepository.save(newComment);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Comment successfully created.");
        response.put("commentId", newComment.getCommentId());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/comment/{comment-id}")
    public ResponseEntity patchComment(
            @PathVariable("comment-id") @Positive long commentId,
            @RequestBody CommentDto.CommentUpdateDto commentDto,
            @AuthenticationPrincipal String email)
    {
        Comment newComment = commentService.updateComment(commentId, email);
        newComment.setContent(commentDto.getContent());
        newComment.setModifiedAt(LocalDateTime.now());

        commentRepository.save(newComment);

        return ResponseEntity.ok("Comment successfully changed");
    }

    @DeleteMapping("/comment/{comment-id}")
    public ResponseEntity deleteAnswer(@PathVariable("comment-id") @Positive long commentId,
                                       @AuthenticationPrincipal String email) {

        commentService.deleteComment(commentId, email);
        return ResponseEntity.noContent().build();
    }




}
