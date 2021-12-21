// service worker for basic offline view
const authStatusRoute = '/api/users/authStatus';
const loginRoute = '/api/users/login';

const CACHE = 'waiter-cache-v1';
const offlineFallbackpage = '/offline.html';
const coffeeMugImg = '/coffeeMug.png';

const urlsToCache = [
  '/index.html',
  '/manifest.json',
  offlineFallbackpage,
  coffeeMugImg,
  '/',
  'logo192.png',
  'logo512.png',
  'favicon.ico',
];

//install event only occurs after first call
self.addEventListener('install', async event => {
  // store offline html and other static assets in cache
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache =>
        cache
          .addAll(urlsToCache)
          .catch(error => console.log(`Error while chaching ${error} `))
      )
  );
});

// delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheKeys => {
      return Promise.all(
        cacheKeys.filter(key => key !== CACHE).map(key => caches.delete(key))
      );
    })
  );
});

// network first strategy
self.addEventListener('fetch', event => {
  const networkFirstStrategy = true; // best strategy for our use case is network first
  const cacheFirstStrategy = false; // not suitable strategy because of authentication issues (always displays cache data first)

  if (networkFirstStrategy) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          return caches.open(CACHE).then(cache => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        })
        .catch(err => {
          return caches
            .match(event.request)
            .then(res => {
              if (res !== undefined) {
                return res;
              }
              if (
                event.request.method === 'GET' &&
                event.request.destination === 'image'
              ) {
                return caches.match(coffeeMugImg);
              }
              return caches.match(offlineFallbackpage);
            })
            .catch(err => {
              if (
                event.request.method === 'GET' &&
                event.request.destination === 'image'
              ) {
                return caches.match(coffeeMugImg);
              }
              return caches.match(offlineFallbackpage);
            });
        })
    );
  } else if (cacheFirstStrategy) {
    event.respondWith(
      caches
        .match(event.request)
        .then(cacheRes => {
          return (
            cacheRes ||
            fetch(event.request).then(res => {
              return caches.open(CACHE).then(cache => {
                cache.put(event.request.url, res.clone());
                return res;
              });
            })
          );
        })
        .catch(err => {
          if (
            event.request.method === 'GET' &&
            event.request.destination === 'image'
          ) {
            return caches.match(coffeeMugImg);
          }
          return caches.match(offlineFallbackpage);
        })
    );
  }
});

self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: 'Wir wünschen guten APPetit',
    icon: '/logo192.png',
  });
});
