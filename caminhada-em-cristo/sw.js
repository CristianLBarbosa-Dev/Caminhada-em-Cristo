/* Service Worker — Caminhada em Cristo
   Estratégia:
   - App shell (HTML/CSS/JS/ícones): cache-first, com atualização em segundo plano.
   - firebase-config.js: rede primeiro (network-first) — é um arquivo que você
     edita depois de publicar o site, então nunca deve ficar "preso" em cache
     com os valores antigos; só usa o cache se estiver realmente offline.
   - Navegação (index.html, admin.html, etc.): rede primeiro, cai para a cópia
     em cache da MESMA página se estiver offline (cada página no seu próprio
     espaço de cache — nunca mistura o conteúdo de uma página com o de outra).
   - Fontes do Google Fonts: stale-while-revalidate (best effort; o site funciona sem elas). */

const VERSION = 'cec-v5';
const SHELL_CACHE = VERSION + '-shell';
const RUNTIME_CACHE = VERSION + '-runtime';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(function (cache) { return cache.addAll(SHELL_FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key.indexOf(VERSION) !== 0; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isConfigFile(url) {
  return url.pathname.indexOf('firebase-config.js') !== -1;
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  // Navegação (HTML de qualquer página: index.html, admin.html, etc.):
  // tenta a rede primeiro; cada página é guardada sob a sua própria URL,
  // nunca sob um nome fixo — assim uma nunca sobrescreve o cache da outra.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(SHELL_CACHE).then(function (cache) { cache.put(request, copy); });
          return response;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            return cached || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // firebase-config.js: rede primeiro. Só usa o cache se a rede falhar
  // (offline de verdade) — assim uma edição sua nesse arquivo aparece
  // no próximo carregamento, em vez de ficar presa em cache.
  if (isConfigFile(url)) {
    event.respondWith(
      fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(SHELL_CACHE).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      }).catch(function () { return caches.match(request); })
    );
    return;
  }

  // Mesma origem (CSS/JS/ícones embutidos no HTML, etc.): cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(SHELL_CACHE).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        });
      })
    );
    return;
  }

  // Origens externas (ex.: fontes): stale-while-revalidate best effort.
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(function (cache) {
      return cache.match(request).then(function (cached) {
        var fetchPromise = fetch(request).then(function (response) {
          if (response && response.ok) cache.put(request, response.clone());
          return response;
        }).catch(function () { return cached; });
        return cached || fetchPromise;
      });
    })
  );
});
