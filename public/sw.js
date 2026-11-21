// 설치 가능한 PWA로 인식되기 위한 최소 서비스 워커.
// 캐시를 두지 않아서 배포하면 바로 새 화면이 뜬다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
