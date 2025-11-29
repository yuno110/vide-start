-- tags 테이블 생성
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 인덱스 생성
CREATE INDEX idx_tags_name ON tags(name);
