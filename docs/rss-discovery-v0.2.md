# RSS Discovery Categorization (v0.2)

- 기준 데이터: `/Users/ohjongtaek/Downloads/feedoong_subscriptions_ohjtack@gmail.com.csv`
- 분석일: 2026-02-21
- 대상 레코드: 318 rows (유효 RSS URL 315)

## 1) 도메인 분포 (blog URL 기준 상위)

1. `medium.com`: 38
2. `velog.io`: 34
3. `www.youtube.com` + `youtube.com`: 20
4. `brunch.co.kr`: 11
5. `blog.naver.com`: 4
6. `developer.chrome.com`: 2

## 2) 카테고리

1. `Direct feed`  
대부분의 일반 블로그는 HTML `<link rel="alternate" ...>` 또는 `/feed`, `/rss`, `/atom.xml` 루트 규칙으로 해결 가능

2. `Host-derived feed`  
호스트/경로 규칙으로 피드 URL을 직접 만들 수 있는 타입
- `velog.io/@{user}` -> `https://v2.velog.io/rss/{user}`
- `blog.naver.com/{blogId}` -> `https://rss.blog.naver.com/{blogId}.xml`
- `youtube channel_id` -> `https://www.youtube.com/feeds/videos.xml?channel_id={id}`
- `youtube @handle` -> `https://www.youtube.com/feeds/videos.xml?user={handle}` (fallback)
- `developer.chrome.com/*` -> `https://developer.chrome.com/static/blog/feed.xml` (legacy `/feeds/*.xml`는 fallback)

3. `HTML-discovered feed`  
규칙만으로 생성 불가능하고, 작성자 페이지/목록 페이지에서 feed link를 읽어와야 하는 타입
- `brunch.co.kr/@{writer}` -> `https://brunch.co.kr/rss/@@...` (작성자별 토큰형)

4. `Environment-blocked/unstable`  
규칙은 맞아도 네트워크/원격 정책 때문에 실패할 수 있는 타입
- `medium.com` 일부: `403/429`
- 일부 `tistory.com`: `406`

## 3) 전략 매핑

1. `velogStrategy`
2. `naverBlogStrategy`
3. `brunchStrategy`
4. `chromeDevStrategy`
5. `tistoryStrategy`
6. `mediumStrategy`
7. `youtubeStrategy`
8. `defaultStrategy` (fallback)

## 4) 이번 릴리즈에서 해결한 포인트

1. CSV 상위 반복 도메인 규칙(`naver`, `brunch`, `developer.chrome`)을 독립 전략으로 격리
2. YouTube `@handle` 타입의 fallback 후보(`feeds/videos.xml?user=`) 추가
3. 기본 fallback에 의존하던 도메인 규칙을 전략 레이어로 명시화
