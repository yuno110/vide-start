package io.realworld.api;

import io.realworld.api.dto.CommentCreateRequest;
import io.realworld.api.dto.CommentListResponse;
import io.realworld.api.dto.CommentResponse;
import io.realworld.domain.Comment;
import io.realworld.domain.CommentService;
import io.realworld.domain.FollowRepository;
import io.realworld.domain.User;
import io.realworld.domain.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 댓글 컨트롤러
 */
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    /**
     * 댓글 목록 조회
     */
    @GetMapping("/{slug}/comments")
    public ResponseEntity<CommentListResponse> getComments(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUser(userDetails);
        List<Comment> comments = commentService.getCommentsByArticle(slug);

        List<CommentResponse> commentResponses = comments.stream()
                .map(comment -> toCommentResponse(comment, currentUser))
                .toList();

        return ResponseEntity.ok(CommentListResponse.of(commentResponses));
    }

    /**
     * 댓글 작성
     */
    @PostMapping("/{slug}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable String slug,
            @Valid @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        CommentCreateRequest createRequest = extractCommentCreateRequest(request);
        User currentUser = getCurrentUserRequired(userDetails);

        Comment comment = commentService.createComment(slug, createRequest.getBody(), currentUser);
        CommentResponse response = toCommentResponse(comment, currentUser);

        return ResponseEntity.ok(response);
    }

    /**
     * 댓글 삭제
     */
    @DeleteMapping("/{slug}/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String slug,
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = getCurrentUserRequired(userDetails);
        commentService.deleteComment(slug, id, currentUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * Comment를 CommentResponse로 변환
     */
    private CommentResponse toCommentResponse(Comment comment, User currentUser) {
        boolean following = isFollowing(comment.getAuthor(), currentUser);
        return CommentResponse.of(comment, following);
    }

    /**
     * 팔로우 여부 확인
     */
    private boolean isFollowing(User target, User currentUser) {
        if (currentUser == null) {
            return false;
        }
        return followRepository.existsByFollowerAndFollowing(currentUser, target);
    }

    /**
     * 현재 사용자 조회 (Optional)
     */
    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        return userRepository.findByUsername(userDetails.getUsername()).orElse(null);
    }

    /**
     * 현재 사용자 조회 (Required)
     */
    private User getCurrentUserRequired(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("인증된 사용자를 찾을 수 없습니다"));
    }

    /**
     * CommentCreateRequest 추출
     */
    private CommentCreateRequest extractCommentCreateRequest(Map<String, Object> request) {
        Map<String, Object> comment = (Map<String, Object>) request.getOrDefault("comment", request);
        return new CommentCreateRequest((String) comment.get("body"));
    }
}
