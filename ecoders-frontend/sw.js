// sw.js

// install event
self.addEventListener('install', e => {
  // console.log('[Service Worker] installed');
});

// activate event
self.addEventListener('activate', e => {
  // console.log('[Service Worker] actived', e);
});

// fetch event
self.addEventListener('fetch', e => {
  // console.log('[Service Worker] fetched resource ' + e.request.url);
});

// 등등 앱에 따라 pwa 기능을 추가하고 sw.js에 작성할 수 있습니다.
