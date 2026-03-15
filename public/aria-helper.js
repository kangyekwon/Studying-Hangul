/**
 * ARIA Helper Functions
 * 동적으로 생성되는 게임 요소에 접근성 속성 추가
 * WCAG 2.1 AA 준수를 위한 헬퍼 함수들
 */

(function() {
  'use strict';

  const AriaHelper = {
    /**
     * 퀴즈 옵션에 ARIA 속성 추가
     */
    enhanceQuizOptions(container) {
      const options = container.querySelectorAll('.quiz-option');
      options.forEach((option, index) => {
        // 기본 속성
        option.setAttribute('role', 'button');
        option.setAttribute('tabindex', '0');
        option.setAttribute('aria-label', `옵션 ${index + 1}: ${option.textContent.trim()}`);

        // 키보드 이벤트 추가
        if (!option.hasAttribute('data-keyboard-ready')) {
          option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              option.click();
            }
          });
          option.setAttribute('data-keyboard-ready', 'true');
        }
      });

      // 옵션 그룹에 설명 추가
      const optionsContainer = container.querySelector('.quiz-options');
      if (optionsContainer) {
        optionsContainer.setAttribute('role', 'group');
        optionsContainer.setAttribute('aria-label', '답안 선택');
      }
    },

    /**
     * 게임 버튼에 ARIA 속성 추가
     */
    enhanceGameButtons(container) {
      const buttons = container.querySelectorAll('.game-btn');
      buttons.forEach((button) => {
        // 버튼 텍스트를 기반으로 aria-label 추가
        const text = button.textContent.trim();
        if (!button.hasAttribute('aria-label')) {
          const labelMap = {
            'Next': '다음 문제로 이동',
            'Next Question': '다음 퀴즈 문제',
            'Play Again': '다시 플레이',
            'START!': '게임 시작',
            'Fight Again': '다시 도전',
            'New Game': '새 게임 시작',
            'Retry': '재시도',
            'Again': '다시하기',
            'Play Sound': '소리 듣기',
            'Listen': '발음 듣기',
            'Check': '정답 확인',
            'Clear': '입력 지우기',
            'Skip': '건너뛰기',
            'Reset Progress': '진행 상황 초기화'
          };

          button.setAttribute('aria-label', labelMap[text] || text);
        }
      });
    },

    /**
     * 플래시카드에 ARIA 속성 추가
     */
    enhanceFlashcard(container) {
      const flashcard = container.querySelector('.flashcard');
      if (flashcard) {
        flashcard.setAttribute('role', 'button');
        flashcard.setAttribute('tabindex', '0');
        flashcard.setAttribute('aria-label', '플래시카드 클릭하여 뒤집기');
        flashcard.setAttribute('aria-pressed', 'false');

        // 키보드 이벤트
        if (!flashcard.hasAttribute('data-keyboard-ready')) {
          flashcard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              flashcard.click();
              const isFlipped = flashcard.getAttribute('aria-pressed') === 'true';
              flashcard.setAttribute('aria-pressed', (!isFlipped).toString());
              this.announce(isFlipped ? '플래시카드를 뒤집었습니다' : '플래시카드 앞면');
            }
          });
          flashcard.setAttribute('data-keyboard-ready', 'true');
        }
      }
    },

    /**
     * 메모리 카드에 ARIA 속성 추가
     */
    enhanceMemoryCards(container) {
      const cards = container.querySelectorAll('.memory-card');
      cards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const isFlipped = card.classList.contains('flipped');
        const isMatched = card.classList.contains('matched');
        const text = card.textContent.trim();

        let label = `메모리 카드 ${index + 1}`;
        if (isMatched) {
          label += ': 매칭 완료';
          card.setAttribute('aria-disabled', 'true');
        } else if (isFlipped) {
          label += `: ${text}`;
        } else {
          label += ': 뒤집어진 상태';
        }

        card.setAttribute('aria-label', label);
        card.setAttribute('aria-pressed', isFlipped.toString());

        // 키보드 이벤트
        if (!card.hasAttribute('data-keyboard-ready') && !isMatched) {
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              card.click();
            }
          });
          card.setAttribute('data-keyboard-ready', 'true');
        }
      });

      // 메모리 그리드에 레이블 추가
      const grid = container.querySelector('.memory-grid');
      if (grid) {
        grid.setAttribute('role', 'group');
        grid.setAttribute('aria-label', '메모리 카드 게임');
      }
    },

    /**
     * 네비게이션 탭에 ARIA 속성 추가
     */
    enhanceNavTabs() {
      const navTabs = document.getElementById('navTabs');
      if (!navTabs) return;

      const buttons = navTabs.querySelectorAll('.nav-btn');
      buttons.forEach((button) => {
        button.setAttribute('role', 'tab');
        const isActive = button.classList.contains('active');
        button.setAttribute('aria-selected', isActive.toString());
        button.setAttribute('tabindex', isActive ? '0' : '-1');

        // 버튼 텍스트를 기반으로 aria-label 추가
        if (!button.hasAttribute('aria-label')) {
          const mode = button.textContent.trim();
          button.setAttribute('aria-label', `${mode} 게임 모드`);
        }
      });

      // 탭 리스트에 role 추가
      navTabs.setAttribute('role', 'tablist');
    },

    /**
     * 카테고리 필터에 ARIA 속성 추가
     */
    enhanceCategoryFilters() {
      const filters = document.getElementById('categoryFilters');
      if (!filters) return;

      const buttons = filters.querySelectorAll('.cat-btn');
      buttons.forEach((button) => {
        button.setAttribute('role', 'radio');
        const isActive = button.classList.contains('active');
        button.setAttribute('aria-checked', isActive.toString());
        button.setAttribute('tabindex', isActive ? '0' : '-1');

        // 버튼 텍스트를 기반으로 aria-label 추가
        if (!button.hasAttribute('aria-label')) {
          const category = button.textContent.trim();
          button.setAttribute('aria-label', `${category} 카테고리`);
        }
      });
    },

    /**
     * 게임 상태 알림
     */
    announce(message) {
      const announcer = document.getElementById('a11y-announcer');
      if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
          announcer.textContent = '';
        }, 1000);
      }
    },

    /**
     * 게임 영역 전체 접근성 향상
     */
    enhanceGameArea(container) {
      if (!container) return;

      // 게임 타이틀에 ID 추가 (aria-labelledby를 위해)
      const title = container.querySelector('.game-title, h2');
      if (title && !title.id) {
        title.id = 'current-game-title';
        container.setAttribute('aria-labelledby', 'current-game-title');
      }

      // 각 게임 요소 향상
      this.enhanceQuizOptions(container);
      this.enhanceGameButtons(container);
      this.enhanceFlashcard(container);
      this.enhanceMemoryCards(container);

      // 타이머가 있으면 aria-live 추가
      const timer = container.querySelector('.speed-timer, [id*="timer"], [id*="Timer"]');
      if (timer) {
        timer.setAttribute('role', 'timer');
        timer.setAttribute('aria-live', 'polite');
        timer.setAttribute('aria-atomic', 'true');
      }

      // 점수 표시에 aria-live 추가
      const scores = container.querySelectorAll('[style*="gold"], .stat-value');
      scores.forEach(score => {
        if (score.textContent.includes('Score') || score.textContent.includes('pts')) {
          score.setAttribute('aria-live', 'polite');
        }
      });
    },

    /**
     * MutationObserver로 동적 콘텐츠 감지
     */
    observeGameArea() {
      const gameArea = document.getElementById('gameArea');
      if (!gameArea) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // 새로운 게임 콘텐츠가 추가되면 접근성 향상 적용
            setTimeout(() => {
              this.enhanceGameArea(gameArea);
              this.enhanceNavTabs();
              this.enhanceCategoryFilters();
            }, 100);
          }
        });
      });

      observer.observe(gameArea, {
        childList: true,
        subtree: true
      });

      console.log('[접근성] 게임 영역 감시 시작');
    },

    /**
     * 초기화
     */
    init() {
      // 초기 요소들 향상
      const gameArea = document.getElementById('gameArea');
      if (gameArea) {
        this.enhanceGameArea(gameArea);
      }

      this.enhanceNavTabs();
      this.enhanceCategoryFilters();

      // 동적 콘텐츠 감시
      this.observeGameArea();

      // 전역 이벤트 리스너: 정답/오답 시 알림
      document.addEventListener('correct-answer', () => {
        this.announce('정답입니다!');
      });

      document.addEventListener('wrong-answer', () => {
        this.announce('오답입니다. 다시 시도해보세요.');
      });

      console.log('[접근성] ARIA Helper 초기화 완료');
    }
  };

  // DOM 로드 완료 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => AriaHelper.init(), 500);
    });
  } else {
    setTimeout(() => AriaHelper.init(), 500);
  }

  // 전역으로 노출
  window.AriaHelper = AriaHelper;

})();
