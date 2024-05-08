
/**
 * 
 * Detta är applikationens skapande av service-workern
 * 
 */

const staticCacheName = "site-static";
const assets = [
'/',
'/sw.js',
'/404.html',
'/index.html',
'/budget.html',
'/Backend/DB.js',
'/Frontend/src/js/Api.js',
'/Frontend/src/js/Budget.js',
'/Frontend/src/js/Expense.js',
'/Frontend/src/js/Form.js',
'/Frontend/src/js/App.js',
'/Frontend/src/js/Window.js',
'/Frontend/src/js/Main.js',
'/Frontend/src/js/Home.js', 
'/Frontend/src/js/CostOfLiving.js',
'/Frontend/src/js/SelectedBudget.js',
'/Frontend/src/js/Suggestion.js',
'/Frontend/src/js/Toast.js',
'/Frontend/src/js/Loading.js', 
'/Frontend/src/css/components/addButton.css',
'/Frontend/src/css/components/budgetWindow.css',
'/Frontend/src/css/components/form.css',
'/Frontend/src/css/components/expense.css',
'/Frontend/src/css/components/loader.css',
'/Frontend/src/css/components/selectedBudget.css',
'/Frontend/src/css/components/suggestion.css',
'/Frontend/src/css/components/toastnotification.css',
'/Frontend/src/css/main.css',
'/Frontend/src/img/icon48.png',
'/Frontend/src/img/icon72.png',
'/Frontend/src/img/icon96.png',
'/Frontend/src/img/icon144.png',
'/Frontend/src/img/icon192.png',
'/Frontend/src/img/icon512-1.png',
'/Frontend/src/img/primary/android_chrome512.png',
'/Frontend/src/img/primary/apple180.png',
'/Frontend/src/img/primary/Bb192.png',
'/Frontend/src/img/primary/favicon-16x16.png',
'/Frontend/src/img/primary/favicon-32x32.png',
];

// installerings event för service worker

self.addEventListener('install', e => {
    e.waitUntil(
        caches
        .open(staticCacheName)
        .then(cache => {
            cache.addAll(assets);
    }));
});

// aktiverings event för service worker

self.addEventListener('activate', e => {
    console.log('service worker has benn activated');
});


// Cache hanteringen

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(cacheRes => {
            return cacheRes || fetch(e.request);
        })
    );
});