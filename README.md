# K-POP Korean Learning Game

> Learn Korean with fun K-POP themed games! Flashcards, quizzes, memory games, AI-powered features, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)]()
[![WCAG 2.1](https://img.shields.io/badge/WCAG%202.1-Level%20A-green.svg)]()

---

## Features

### 110+ Game Modes across 8 Categories

| Category | Modes | Description |
|----------|-------|-------------|
| **Learn** | Flashcards, Hangul Basics, Grammar, Wiki Quiz, Weather, Dictionary | Core learning with real-time API data |
| **Play** | Memory Match, Speed Challenge, Word Puzzle, Boss Battle | Fun competitive games |
| **Culture** | K-POP Quiz, Drama Lines, Korea Map, Idol Quiz, Fandom Roleplay | Korean culture immersion |
| **Practice** | Writing, Pronunciation, Conversation Sim, Listening | Skill-building exercises |
| **Smart** | Adaptive Quiz, Spaced Repetition (SM-2), AI Report, Weakness Training | AI-powered personalized learning |
| **Social** | Rankings, Daily Challenge, Multiplayer | Community features |
| **Progress** | Study Stats, Word Collection, Achievements | Track your journey |
| **Settings** | Theme, Sound, Accessibility, Language | Customization |

### AI-Powered Features

| Feature | Technology | Description |
|---------|-----------|-------------|
| **Pronunciation Evaluation** | Web Speech API | Real-time pronunciation scoring with Levenshtein + Jamo analysis |
| **Spaced Repetition** | SM-2 Algorithm | Forgetting curve-based review scheduling |
| **Adaptive Learning** | Custom Engine | Auto-adjusting difficulty based on performance |
| **Conversation Simulator** | Pattern Matching + STT | 8 real-life scenarios (cafe, restaurant, taxi, etc.) |
| **Handwriting Recognition** | Canvas API | Write Korean characters with stroke order guides |

### External API Integrations

| API | Features | Auth |
|-----|----------|------|
| **ko.wikipedia.org** | Culture/History quiz, Daily facts, Wiki Explorer | No key needed |
| **en.wiktionary.org** | Dictionary search, Word of the Day, Etymology | No key needed |
| **api.open-meteo.com** | Real-time Korean city weather, Weather conversation | No key needed |

### Quality & Accessibility

- **WCAG 2.1 Level A**: 96.6% compliance
- **Keyboard Navigation**: Full support (Arrow keys, Enter, Escape, shortcuts)
- **Screen Reader**: ARIA labels, live regions, skip links
- **Reduced Motion**: `prefers-reduced-motion` support
- **105 Unit Tests**: Jest test suite with core function coverage
- **CSP Hardened**: No `unsafe-inline` in script-src

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (ES2021+), HTML5, CSS3 |
| **Styling** | Neon/Cyberpunk theme with CSS custom properties |
| **Build** | Vite 5.0 with PWA plugin |
| **Testing** | Jest 29.7 with jsdom |
| **Linting** | ESLint 8.57 + Prettier 3.2 |
| **PWA** | Service Worker v12, manifest.json |
| **Speech** | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| **Drawing** | Canvas API with PointerEvent |
| **Charts** | Chart.js 4.4 (CDN) |

---

## Quick Start

### Option 1: Direct Open (No Build)

```bash
# Just open in browser
open index.html
# or use a local server
npx http-server -c-1
```

### Option 2: Development Mode (Vite)

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Open http://localhost:3000
```

### Option 3: Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
korean-learning-game/
├── index.html              # Main app (SPA)
├── main-app.js             # Core game logic (extracted from HTML)
├── styles.css              # Extracted CSS styles
├── accessibility.css       # WCAG accessibility styles
├── sw.js                   # Service Worker v12
├── manifest.json           # PWA manifest
│
├── # Game Content
├── content-data.js         # Vocabulary data (2,000+ words)
├── more-content.js         # Extended content
├── bonus-content.js        # Bonus game content
├── bonus-modes.js          # Bonus game modes
├── more-modes.js           # Additional modes
├── new-modes.js            # New game modes
├── game-engine.js          # Game engine (6 data analysis games)
├── mini-games.js           # Arcade mini-games
├── connection-map.js       # Word connection maps
│
├── # AI Features
├── ai-pronunciation.js     # Speech recognition & scoring
├── ai-spaced-repetition.js # SM-2 spaced repetition
├── ai-adaptive-engine.js   # Adaptive difficulty system
├── ai-conversation.js      # Conversation simulator (8 scenarios)
├── ai-handwriting.js       # Handwriting recognition
│
├── # External API
├── api-wikipedia-quiz.js   # Wikipedia culture quiz
├── api-wiktionary-dict.js  # Wiktionary dictionary
├── api-weather-chat.js     # Weather-based learning
├── api-kpop-learn.js       # K-POP learning (32 idols, 22 songs)
│
├── # System
├── smart-analytics.js      # Analytics engine
├── social-features.js      # Social/competitive features
├── system-features.js      # System utilities
├── ui-enhancements.js      # Theme, animations, tutorial
├── external-integrations.js # CDN integrations
├── logger.js               # Structured logging utility
├── security-utils.js       # Sanitization & validation
├── event-handlers.js       # Centralized event delegation
├── keyboard-navigation.js  # Keyboard navigation module
├── aria-helper.js          # Dynamic ARIA management
│
├── # Refactored Modules
├── analytics/
│   ├── word-analyzer.js
│   ├── learning-profile.js
│   ├── smart-recommender.js
│   ├── data-combiner.js
│   └── analytics-ui.js
├── bonus-modes/
│   ├── game-data.js
│   ├── color-quiz.js
│   ├── body-parts-quiz.js
│   ├── korea-map.js
│   ├── slang-quiz.js
│   ├── number-converter.js
│   ├── learning-tools.js
│   └── study-stats.js
│
├── # Config
├── package.json
├── vite.config.js
├── jest.config.cjs
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

---

## Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run Jest tests
npm run test:coverage # Test with coverage report
npm run test:watch   # Watch mode
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint issues
npm run format       # Prettier format
npm run analyze      # Bundle size analysis
```

---

## Data & Content

### Vocabulary

- **2,000+ Korean words** across 20+ categories
- Categories: Greetings, Food, Animals, Colors, Numbers, Family, Emotions, Weather, K-POP Terms, etc.
- Each word includes: Korean, English, Romanization, Category, Rarity

### K-POP Content

- **32 K-POP idols** from 10 groups (BTS, BLACKPINK, Stray Kids, TWICE, aespa, NewJeans, IVE, LE SSERAFIM, WINNER, IU)
- **22 song lyrics** for fill-in-the-blank quizzes
- **35 K-POP terms** with definitions
- **22 drama quotes** from popular K-dramas

### Conversation Scenarios

8 real-life scenarios with branching dialog:
Cafe, Restaurant, Shopping, Taxi, Hospital, Hotel, School, Meeting Friends

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge | Full support |
| Firefox | Full support |
| Safari | Partial (Speech API limited) |
| Mobile Chrome | Full support |
| Mobile Safari | Partial |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Select, flip card |
| `Arrow Keys` | Navigate options |
| `Escape` | Close modal/popup |
| `Ctrl + H` | Help |
| `Ctrl + S` | Toggle sound |
| `Ctrl + N` | Next question/card |
| `Tab` | Focus navigation |

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with Claude Code
