// Create The Cache

var CACHE_NAME = "AfterSchoolClub-v1";

// Files to cache
var cacheFiles = [
    "index.html",
    "Lessons.json",
    "images/Arabic.png",
    "images/English.png",
    "images/French.png",
    "images/Japanese.png",
    "images/Java.png",
    "images/Python.png",
    "images/Maths.png",
    "images/Spanish.png",
    "images/Art.png",
    "images/Mandarin.png",
    "images/favicon.ico",
    "images/icon.png",
];

self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");

    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("[Service Worker] Caching cacheFiles");
            return cache.addAll(cacheFiles).catch(function (error) {
                console.error("[Service Worker] Cache error:", error);
            });
        })
    );
});

self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (cacheFiles) {
            if (cacheFiles) {
                console.log(
                    "[Service Worker] Fetched from Cache: ",
                    e.request.url
                );
                return cacheFiles;
            } else {
                console.log(
                    "[Service Worker] Fetched and saved in Cache: ",
                    e.request.url
                );

                return fetch(e.request).then(function (response) {
                    return caches.open(CACHE_NAME).then(function (cache) {
                        cache
                            .put(e.request, response.clone())
                            .catch(function (error) {
                                console.error(
                                    "[Service Worker] Cache error:",
                                    error
                                );
                            });
                        return response;
                    });
                });
            }
        })
    );
});
