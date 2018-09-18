const CACHE_VERSION = 'v1'
let urlsToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js'
]

for (i = 1; i <= 10; i++) {
  urlsToCache.push('/img/'+i+'.jpg')
}

// Credit to Matt Guant "Service Workers: an Introduction" accessed 9/17/2018
// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Credit to Matt Guant "Service Workers: an Introduction" accessed 9/17/2018 
// https://developers.google.com/web/fundamentals/primers/service-workers/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) return(response);
        // Clone the request, since a request can only be consumed once (stream)
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            let responseToCache = response.clone();
            caches.open(CACHE_VERSION)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});
