// Create The Cache

var CACHE_NAME = "AfterSchoolClub-v1";

// Files to cache
var cacheFiles = [
    "index.html",
    "Lessons.json",
    "Images/Arabic.png",
    "Images/English.png",
    "Images/French.png",
    "Images/Japanese.png",
    "Images/Java.png",
    "Images/Python.png",
    "Images/Maths.png",
    "Images/Spanish.png",
    "Images/Art.png",
    "Images/Mandarin.png",
    "Images/favicon.ico",
    "Images/icon.png",
    "Images/icon-512.png",
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
