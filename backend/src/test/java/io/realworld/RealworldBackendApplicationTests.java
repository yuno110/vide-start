package io.realworld;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("PostgreSQL 데이터베이스가 필요합니다. Docker로 DB를 실행한 후 테스트를 활성화하세요.")
class RealworldBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
