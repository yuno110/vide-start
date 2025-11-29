package io.realworld.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 팔로우 엔티티 (사용자 간 팔로우 관계)
 */
@Entity
@Table(name = "follows")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Follow {

    @EmbeddedId
    private FollowId id;

    @MapsId("followerId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id")
    private User follower;

    @MapsId("followingId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id")
    private User following;

    public Follow(User follower, User following) {
        if (follower.getId().equals(following.getId())) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }
        this.id = new FollowId(follower.getId(), following.getId());
        this.follower = follower;
        this.following = following;
    }

    /**
     * 복합 키 클래스
     */
    @Embeddable
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class FollowId implements Serializable {
        private Long followerId;
        private Long followingId;
    }
}
