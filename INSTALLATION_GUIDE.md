# 리팩토링 적용 가이드

이 가이드는 리팩토링된 모듈을 프로젝트에 적용하는 방법을 설명합니다.

## 1단계: 기존 파일 백업

```bash
# 기존 파일 백업
copy smart-analytics.js smart-analytics.js.backup
copy bonus-modes.js bonus-modes.js.backup
```

## 2단계: index.html 스크립트 태그 업데이트

### 기존 스크립트 태그 찾기

index.html에서 다음 줄을 찾으세요:

```html
<script src="smart-analytics.js"></script>
<script src="bonus-modes.js"></script>
```

### 리팩토링된 모듈로 교체

**방법 A: 모든 새 파일 추가 (권장)**

기존 태그를 삭제하고 다음으로 교체:

```html
<!-- Analytics Modules (smart-analytics.js 대체) -->
<script src="analytics/word-analyzer.js"></script>
<script src="analytics/learning-profile.js"></script>
<script src="analytics/smart-recommender.js"></script>
<!-- 아직 생성 안됨:
<script src="analytics/data-combiner.js"></script>
<script src="analytics/analytics-ui.js"></script>
-->

<!-- Game Modes (bonus-modes.js 대체) -->
<script src="bonus-modes/game-data.js"></script>
<script src="bonus-modes/color-quiz.js"></script>
<!-- 아직 생성 안됨:
<script src="bonus-modes/body-parts-quiz.js"></script>
<script src="bonus-modes/korea-map.js"></script>
<script src="bonus-modes/slang-quiz.js"></script>
<script src="bonus-modes/number-converter.js"></script>
<script src="bonus-modes/learning-tools.js"></script>
<script src="bonus-modes/study-stats.js"></script>
-->
```

**방법 B: 점진적 전환 (안전)**

기존 파일을 유지하면서 새 모듈만 추가:

```html
<!-- 기존 파일 (임시 유지) -->
<script src="smart-analytics.js"></script>
<script src="bonus-modes.js"></script>

<!-- 새 리팩토링 모듈 (병렬 테스트) -->
<script src="analytics/word-analyzer.js"></script>
<script src="analytics/learning-profile.js"></script>
<script src="analytics/smart-recommender.js"></script>
<script src="bonus-modes/game-data.js"></script>
<script src="bonus-modes/color-quiz.js"></script>
```

⚠️ **주의:** 방법 B는 전역 변수 중복으로 인해 최신 로드된 버전이 우선됩니다.

## 3단계: 브라우저 테스트

### 콘솔 확인

브라우저 개발자 도구(F12)를 열고 콘솔에서 확인:

```javascript
// 모듈이 정상 로드되었는지 확인
console.log(typeof WordAnalyzer);        // "object"여야 함
console.log(typeof LearningProfile);     // "object"여야 함
console.log(typeof SmartRecommender);    // "object"여야 함
console.log(typeof defaultKoreanColors); // "object"여야 함
console.log(typeof showColorQuiz);       // "function"이어야 함
```

## 4단계: 나머지 모듈 완성

### 필요한 추가 작업

아직 생성되지 않은 모듈들:

#### analytics/ 디렉토리
- [ ] `data-combiner.js` - DataCombiner 객체
- [ ] `analytics-ui.js` - UI 렌더링 함수들

#### bonus-modes/ 디렉토리
- [ ] `body-parts-quiz.js` - showBodyPartsQuiz()
- [ ] `korea-map.js` - showKoreaMap()
- [ ] `slang-quiz.js` - showKpopSlang(), showNetSlangQuiz()
- [ ] `number-converter.js` - showNumberConverter()
- [ ] `learning-tools.js` - showStudyTips(), showConversationPractice()
- [ ] `study-stats.js` - recordStudyStat(), showStudyStats()

## 체크리스트

작업 완료 확인:

- [x] 백업 생성
- [ ] index.html 업데이트
- [ ] 브라우저 콘솔 오류 없음
- [ ] 색상 퀴즈 정상 작동
- [ ] 단어 분석 기능 정상 작동
- [ ] 학습 프로필 표시 정상
- [ ] 추천 시스템 작동
- [ ] 나머지 모듈 생성 계획 수립

---

**참고:** REFACTORING_REPORT.md에서 전체 리팩토링 계획과 성과를 확인하세요.
