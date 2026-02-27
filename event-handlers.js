/**
 * event-handlers.js
 * Centralized event handler bindings using addEventListener.
 * Replaces all inline onclick attributes for CSP compliance.
 */
(function () {
  "use strict";

  // --- Static HTML Element Bindings ---

  // Popup close button
  var popupEl = document.getElementById("popup");
  if (popupEl) {
    var popupCloseBtn = popupEl.querySelector(".game-btn");
    if (popupCloseBtn) {
      popupCloseBtn.addEventListener("click", function () {
        if (typeof closePopup === "function") closePopup();
      });
    }
  }

  // Sound toggle button
  var soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.addEventListener("click", function () {
      if (typeof toggleSound === "function") toggleSound();
    });
  }

  // Mascot interaction
  var mascotBtn = document.getElementById("mascotBtn");
  if (mascotBtn) {
    mascotBtn.addEventListener("click", function () {
      if (typeof mascotTalk === "function") mascotTalk();
    });
  }

  // Power-up buttons
  var power2x = document.getElementById("power2x");
  if (power2x) {
    power2x.addEventListener("click", function () {
      if (typeof usePower === "function") usePower("2x");
    });
  }

  var powerSkip = document.getElementById("powerSkip");
  if (powerSkip) {
    powerSkip.addEventListener("click", function () {
      if (typeof usePower === "function") usePower("skip");
    });
  }

  var powerHint = document.getElementById("powerHint");
  if (powerHint) {
    powerHint.addEventListener("click", function () {
      if (typeof usePower === "function") usePower("hint");
    });
  }

  // --- Global Event Delegation for Dynamic Content ---
  // Handles data-action attributes set by JS-generated HTML

  document.addEventListener("click", function (e) {
    var target = e.target;

    // Walk up the DOM tree to find the element with data-action
    // (handles clicks on child elements within buttons)
    var actionEl = target.closest("[data-action]");
    if (!actionEl) return;

    var action = actionEl.getAttribute("data-action");
    var gameArea = document.getElementById("gameArea");

    switch (action) {
      case "clearRanking":
        if (typeof clearRanking === "function") clearRanking();
        break;

      case "storyChoice":
        var idx = parseInt(actionEl.getAttribute("data-idx"), 10);
        if (typeof storyChoice === "function") storyChoice(idx, actionEl);
        break;

      case "showStory":
        if (typeof showStory === "function" && gameArea) showStory(gameArea);
        break;

      case "startListening":
        if (typeof startListening === "function") startListening();
        break;

      case "showVoice":
        if (typeof showVoice === "function" && gameArea) showVoice(gameArea);
        break;

      case "speakKorean":
        var korean = actionEl.getAttribute("data-korean");
        if (typeof speakKorean === "function" && korean)
          speakKorean(korean);
        break;

      case "survivalAnswer":
        var koreanVal = actionEl.getAttribute("data-korean");
        if (typeof survivalAnswer === "function")
          survivalAnswer(actionEl, koreanVal);
        break;

      case "showSurvival":
        if (typeof showSurvival === "function" && gameArea)
          showSurvival(gameArea);
        break;

      case "showChain":
        if (typeof showChain === "function" && gameArea) showChain(gameArea);
        break;

      case "chainSelect":
        var chainKorean = actionEl.getAttribute("data-korean");
        if (typeof chainSelect === "function" && chainKorean)
          chainSelect(chainKorean);
        break;

      case "shareScore":
        if (typeof shareScore === "function") shareScore();
        break;

      case "showKpopVideo":
        if (typeof showKpopVideo === "function" && gameArea)
          showKpopVideo(gameArea);
        break;

      // --- AI Conversation Simulator actions ---
      case "convSelectScenario":
        var scnId = actionEl.getAttribute("data-id");
        if (typeof startConvScenario === "function" && gameArea && scnId)
          startConvScenario(gameArea, scnId);
        break;

      case "convChoice":
        var choiceIdx = parseInt(actionEl.getAttribute("data-idx"), 10);
        if (typeof handleConversationChoice === "function")
          handleConversationChoice(choiceIdx);
        break;

      case "convSpeak":
        var convText = actionEl.getAttribute("data-text");
        if (typeof convSpeakText === "function" && convText)
          convSpeakText(convText);
        break;

      case "convPronounce":
        var pronText = actionEl.getAttribute("data-text");
        if (typeof convStartPronounce === "function" && pronText)
          convStartPronounce(pronText);
        break;

      case "showConvSelect":
        if (typeof showScenarioSelect === "function" && gameArea)
          showScenarioSelect(gameArea);
        break;

      case "showFreeConvChat":
        if (typeof showFreeChat === "function" && gameArea)
          showFreeChat(gameArea);
        break;

      case "convFreeSend":
        if (typeof handleFreeChatSend === "function")
          handleFreeChatSend();
        break;

      case "convMicInput":
        if (typeof convMicInput === "function")
          convMicInput();
        break;

      // --- Weather API Chat actions ---
      case "weatherRefresh":
        if (typeof loadAllCityWeather === "function")
          loadAllCityWeather();
        break;

      case "weatherCitySelect":
        var weatherCity = actionEl.getAttribute("data-city");
        if (typeof startWeatherChat === "function" && weatherCity)
          startWeatherChat(weatherCity);
        break;

      case "weatherChatAnswer":
        var isCorrect = actionEl.getAttribute("data-correct") === "1";
        var ansKr = actionEl.getAttribute("data-kr");
        var ansEn = actionEl.getAttribute("data-en");
        if (typeof handleWeatherChatAnswer === "function")
          handleWeatherChatAnswer(isCorrect, ansKr, ansEn);
        break;

      case "showWeatherChat":
        if (typeof showWeatherChat === "function" && gameArea)
          showWeatherChat(gameArea);
        break;

      case "weatherQuizAnswer":
        var quizCorrect = actionEl.getAttribute("data-correct") === "1";
        if (typeof handleWeatherQuizAnswer === "function")
          handleWeatherQuizAnswer(quizCorrect, actionEl);
        break;

      case "showWeatherQuiz":
        if (typeof showWeatherQuiz === "function" && gameArea)
          showWeatherQuiz(gameArea);
        break;

      case "showWeatherVocab":
        if (typeof showWeatherVocab === "function" && gameArea)
          showWeatherVocab(gameArea);
        break;

      case "showWeatherDashboard":
        if (typeof showWeatherDashboard === "function" && gameArea)
          showWeatherDashboard(gameArea);
        break;

      default:
        break;
    }
  });
})();
