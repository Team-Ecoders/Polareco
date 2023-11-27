package ecoders.polareco.post.service;


import ecoders.polareco.error.exception.BusinessLogicException;
import ecoders.polareco.error.exception.ExceptionCode;
import ecoders.polareco.member.entity.Member;
import ecoders.polareco.member.repository.MemberRepository;
import ecoders.polareco.post.entity.Comment;
import ecoders.polareco.post.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentService {

    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;

    public CommentService(MemberRepository memberRepository,
                          CommentRepository commentRepository) {
        this.memberRepository = memberRepository;
        this.commentRepository = commentRepository;

    }
    public Comment updateComment(long commentId, String email){
        Comment newComment = commentRepository.findById(commentId).orElseThrow(()->new BusinessLogicException(ExceptionCode.COMMENT_NOT_FOUND));
        verifyAuthor(newComment,email);
        return newComment;
    }

    public void deleteComment(long commentId, String email) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(()->new BusinessLogicException(ExceptionCode.COMMENT_NOT_FOUND));
        verifyAuthor(comment, email);
       commentRepository.delete(comment);
    }
    private void verifyAuthor(Comment comment, String email) {
        String authorEmail = comment.getMember().getEmail();;
        if (!email.equals(authorEmail)) {
            throw new BusinessLogicException(ExceptionCode.CANNOT_CHANGE_POST);
        }
    }

    public Member findMemberByEmail(String email) {
        Member member = memberRepository.findByEmail(email);
        if (member == null) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND);
        }
        return member;
    }
}
