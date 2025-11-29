-- favorites 테이블 생성 (사용자-아티클 좋아요 다대다 관계)
CREATE TABLE favorites (
    user_id BIGINT NOT NULL,
    article_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, article_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_article FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_article_id ON favorites(article_id);
