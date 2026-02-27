/**
 * Keyboard Navigation Module
 * 한글 학습 게임 접근성 향상을 위한 키보드 네비게이션
 * WCAG 2.1 Keyboard Accessible (Guideline 2.1) 준수
 */

(function() {
  'use strict';

  // 키보드 네비게이션 상태
  const KeyboardNav = {
    currentFocusIndex: 0,
    focusableElements: [],
    isModalOpen: false,
    trapFocusElement: null,

    /**
     * 초기화 함수
     */
    init() {
      this.setupEventListeners();
      this.updateFocusableElements();
      console.log('[접근성] 키보드 네비게이션 초기화 완료');
    },

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
      document.addEventListener('keydown', this.handleKeydown.bind(this));

      // 동적 콘텐츠 변경 감지 (게임 모드 전환 등)
      const observer = new MutationObserver(() => {
        this.updateFocusableElements();
      });

      const gameArea = document.getElementById('gameArea');
      if (gameArea) {
        observer.observe(gameArea, { childList: true, subtree: true });
      }
    },

    /**
     * 포커스 가능한 요소 목록 업데이트
     */
    updateFocusableElements() {
      const selector = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '.quiz-option:not(.disabled)',
        '.memory-card:not(.matched)',
        '.flashcard',
        '.nav-btn',
        '.cat-btn',
        '.power-btn:not(:disabled)'
      ].join(',');

      this.focusableElements = Array.from(document.querySelectorAll(selector))
        .filter(el => this.isVisible(el));
    },

    /**
     * 요소가 화면에 보이는지 확인
     */
    isVisible(el) {
      return el.offsetParent !== null &&
             window.getComputedStyle(el).visibility !== 'hidden' &&
             window.getComputedStyle(el).display !== 'none';
    },

    /**
     * 키보드 이벤트 핸들러
     */
    handleKeydown(e) {
      const handlers = {
        'Enter': () => this.handleEnter(e),
        ' ': () => this.handleSpace(e),
        'Escape': () => this.handleEscape(e),
        'ArrowUp': () => this.handleArrow(e, -1),
        'ArrowDown': () => this.handleArrow(e, 1),
        'ArrowLeft': () => this.handleArrowHorizontal(e, -1),
        'ArrowRight': () => this.handleArrowHorizontal(e, 1),
        'Tab': () => this.handleTab(e),
        'h': () => this.handleShortcut(e, 'help'),
        's': () => this.handleShortcut(e, 'sound'),
        'n': () => this.handleShortcut(e, 'next')
      };

      const handler = handlers[e.key];
      if (handler) {
        handler();
      }
    },

    /**
     * Enter 키 처리
     */
    handleEnter(e) {
      const target = e.target;

      // 플래시카드 뒤집기
      if (target.classList.contains('flashcard')) {
        e.preventDefault();
        target.click();
        this.announce('카드를 뒤집었습니다');
        return;
      }

      // 퀴즈 옵션 선택
      if (target.classList.contains('quiz-option')) {
        e.preventDefault();
        target.click();
        return;
      }

      // 버튼 클릭
      if (target.tagName === 'BUTTON') {
        e.preventDefault();
        target.click();
        return;
      }
    },

    /**
     * Space 키 처리
     */
    handleSpace(e) {
      const target = e.target;

      // 입력 필드가 아닌 경우에만 처리
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        if (target.classList.contains('flashcard') ||
            target.classList.contains('quiz-option') ||
            target.tagName === 'BUTTON') {
          e.preventDefault();
          target.click();
        }
      }
    },

    /**
     * Escape 키 처리 (모달 닫기)
     */
    handleEscape(e) {
      // 팝업 닫기
      const popup = document.getElementById('popup');
      const overlay = document.getElementById('overlay');

      if (popup && overlay) {
        const isPopupVisible = overlay.style.display !== 'none' &&
                               overlay.style.display !== '';
        if (isPopupVisible) {
          e.preventDefault();
          if (typeof closePopup === 'function') {
            closePopup();
          }
          this.announce('팝업을 닫았습니다');
          return;
        }
      }

      // 포커스 트랩 해제
      if (this.isModalOpen) {
        this.isModalOpen = false;
        this.trapFocusElement = null;
      }
    },

    /**
     * 화살표 키 (상하) 처리
     */
    handleArrow(e, direction) {
      const target = e.target;

      // 퀴즈 옵션 간 이동
      if (target.classList.contains('quiz-option')) {
        e.preventDefault();
        const options = Array.from(document.querySelectorAll('.quiz-option'));
        const currentIndex = options.indexOf(target);
        const nextIndex = (currentIndex + direction + options.length) % options.length;
        const nextOption = options[nextIndex];

        if (nextOption) {
          nextOption.focus();
          this.announce(`옵션 ${nextIndex + 1} / ${options.length}`);
        }
        return;
      }

      // 일반 포커스 이동
      this.moveFocus(direction);
    },

    /**
     * 화살표 키 (좌우) 처리
     */
    handleArrowHorizontal(e, direction) {
      const target = e.target;

      // 네비게이션 탭 간 이동
      if (target.classList.contains('nav-btn')) {
        e.preventDefault();
        const tabs = Array.from(document.querySelectorAll('.nav-btn'));
        const currentIndex = tabs.indexOf(target);
        const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
        const nextTab = tabs[nextIndex];

        if (nextTab) {
          nextTab.focus();
          nextTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          this.announce(`${nextTab.textContent} 모드`);
        }
        return;
      }

      // 카테고리 필터 간 이동
      if (target.classList.contains('cat-btn')) {
        e.preventDefault();
        const categories = Array.from(document.querySelectorAll('.cat-btn'));
        const currentIndex = categories.indexOf(target);
        const nextIndex = (currentIndex + direction + categories.length) % categories.length;
        const nextCategory = categories[nextIndex];

        if (nextCategory) {
          nextCategory.focus();
          this.announce(`${nextCategory.textContent} 카테고리`);
        }
        return;
      }
    },

    /**
     * Tab 키 처리 (포커스 트랩)
     */
    handleTab(e) {
      if (!this.isModalOpen) return;

      const focusableInModal = Array.from(
        this.trapFocusElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => this.isVisible(el));

      if (focusableInModal.length === 0) return;

      const firstElement = focusableInModal[0];
      const lastElement = focusableInModal[focusableInModal.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },

    /**
     * 단축키 처리
     */
    handleShortcut(e, action) {
      // Ctrl 또는 Alt 키와 함께 눌렀을 때만
      if (!e.ctrlKey && !e.altKey) return;

      e.preventDefault();

      switch(action) {
        case 'help':
          this.showKeyboardHelp();
          break;
        case 'sound':
          const soundBtn = document.getElementById('soundBtn');
          if (soundBtn) soundBtn.click();
          break;
        case 'next':
          // "Next" 버튼 찾아서 클릭
          const nextBtn = document.querySelector('[id*="next"], [id*="Next"]');
          if (nextBtn) nextBtn.click();
          break;
      }
    },

    /**
     * 포커스 이동
     */
    moveFocus(direction) {
      this.updateFocusableElements();

      if (this.focusableElements.length === 0) return;

      const currentElement = document.activeElement;
      const currentIndex = this.focusableElements.indexOf(currentElement);

      let nextIndex;
      if (currentIndex === -1) {
        nextIndex = direction > 0 ? 0 : this.focusableElements.length - 1;
      } else {
        nextIndex = (currentIndex + direction + this.focusableElements.length) % this.focusableElements.length;
      }

      const nextElement = this.focusableElements[nextIndex];
      if (nextElement) {
        nextElement.focus();
        nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },

    /**
     * 스크린 리더 알림
     */
    announce(message) {
      const announcer = document.getElementById('a11y-announcer');
      if (announcer) {
        announcer.textContent = message;

        // 메시지를 지워서 동일한 메시지도 다시 읽도록
        setTimeout(() => {
          announcer.textContent = '';
        }, 1000);
      }
    },

    /**
     * 키보드 도움말 표시
     */
    showKeyboardHelp() {
      const helpText = `
키보드 단축키:
- Enter/Space: 선택 및 실행
- Arrow Keys: 옵션 이동
- Escape: 닫기
- Tab: 다음 요소로 이동
- Shift+Tab: 이전 요소로 이동
- Ctrl+H: 도움말
- Ctrl+S: 사운드 토글
- Ctrl+N: 다음
      `.trim();

      this.announce('키보드 도움말을 표시합니다');

      // 팝업이 있다면 활용
      if (typeof showPopup === 'function') {
        showPopup('키보드 단축키', helpText.replace(/\n/g, '<br>'));
      } else {
        alert(helpText);
      }
    },

    /**
     * 모달 포커스 트랩 설정
     */
    setFocusTrap(element) {
      this.isModalOpen = true;
      this.trapFocusElement = element;

      // 첫 번째 포커스 가능한 요소에 포커스
      const firstFocusable = element.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    },

    /**
     * 모달 포커스 트랩 해제
     */
    removeFocusTrap() {
      this.isModalOpen = false;
      this.trapFocusElement = null;
    }
  };

  // DOM 로드 완료 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KeyboardNav.init());
  } else {
    KeyboardNav.init();
  }

  // 전역으로 노출 (필요 시 다른 스크립트에서 사용)
  window.KeyboardNav = KeyboardNav;

})();
