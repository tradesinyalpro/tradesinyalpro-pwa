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
    data: { url: veri.url || "/" }
  };
  event.waitUntil(self.registration.showNotification(baslik, secenekler));
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  var hedefUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if ("focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(hedefUrl);
    })
  );
});
