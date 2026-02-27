import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['*.svg', '*.png', '*.ico'],
      manifest: {
        name: 'K-POP Korean Learning Game',
        short_name: 'Korean Game',
        description: 'Learn Korean with fun K-POP themed games!',
        theme_color: '#0a0a1a',
        background_color: '#0a0a1a',
        display: 'standalone',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🎵</text></svg>',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // 캐싱 전략 설정
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],

        // 런타임 캐싱 설정
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1년
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1년
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'jsdelivr-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1주일
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // production에서 console 제거
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // 청크 분할 설정
        manualChunks: {
          'vendor-charts': ['chart.js'],
          'vendor-confetti': ['canvas-confetti'],
          'vendor-hangul': ['hangul-js'],
          'vendor-storage': ['localforage']
        }
      }
    },
    // CSS 최적화
    cssCodeSplit: true,
    cssMinify: true,
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 500,
    // 소스맵 생성 (개발 시 유용)
    sourcemap: false
  },
  // 개발 서버 설정
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  // CSS 전처리기 설정
  css: {
    postcss: {
      plugins: [
        // autoprefixer 등 필요한 플러그인 추가 가능
      ]
    }
  }
});
