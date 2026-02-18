var CACHE_NAME="kpop-korean-v6";
var urlsToCache=["./","./index.html","./manifest.json","./connection-map.js","./content-data.js","./new-modes.js","./system-features.js"];

self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(urlsToCache)}))});

self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(response){if(response)return response;return fetch(e.request).then(function(resp){if(resp&&resp.status===200&&resp.type==="basic"){var clone=resp.clone();caches.open(CACHE_NAME).then(function(cache){cache.put(e.request,clone)})}return resp}).catch(function(){return caches.match("./index.html")})}))});

self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(names){return Promise.all(names.filter(function(name){return name!==CACHE_NAME}).map(function(name){return caches.delete(name)}))}))});