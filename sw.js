// TradeSinyalPro Service Worker
// Sadece push bildirimlerini almak ve gostermek icin kullanilir.
// Offline calisma / dosya onbellekleme YAPMAZ - PWA'nin geri kalani
// her zaman network'ten guncel veri ceker, bu dosya sadece bildirimle ilgilenir.

self.addEventListener("install", function(event) {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function(event) {
  var veri = {};
  try {
    veri = event.data ? event.data.json() : {};
  } catch (e) {
    veri = {};
  }
  var baslik = veri.baslik || "TradeSinyalPro";
  var secenekler = {
    body: veri.govde || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    requireInteraction: true,
    data: { url: veri.url || "/" }
  };
  event.waitUntil(self.registration.showNotification(baslik, secenekler));
});

// Bildirime tiklaninca: site ZATEN aciksa yeni pencere/sekme ACILMAZ - mevcut
// pencere one getirilir ve sayfaya "bildirim-git" mesaji gonderilir (sayfa
// kendi icinde ilgili sekmeye/coine gecer). Site kapaliysa bildirimin adresiyle
// (orn. /?git=dd&coin=SOLUSDT) yeni pencere acilir, sayfa acilista adresi okur.
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  var hedefUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if ("focus" in c) {
          var mesajGonder = function() {
            try { c.postMessage({ tip: "bildirim-git", url: hedefUrl }); } catch (e) {}
          };
          return c.focus().then(mesajGonder, mesajGonder);
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(hedefUrl);
    })
  );
});
