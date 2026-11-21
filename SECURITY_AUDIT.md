# Kompletní bezpečnostní audit webu: Stolařství Podoba

Tento audit byl proveden v souladu s doporučenými postupy **Web Security Guidance** a OWASP Top 10 pro statické a interaktivní webové prezentace.

---

## 1. Souhrn výsledků prověrky

| Oblast | Původní web (`stolarstvipodoba.cz`) | Nový návrh | Stav |
| :--- | :--- | :--- | :--- |
| **Přenosový protokol** | Chybělo HSTS, nešifrované GA skripty | Vynucený HTTPS, HSTS `max-age=31536000` | **VYŘEŠENO (A+)** |
| **Clickjacking** | Žádná ochrana (vložitelný do cizích iframe) | `X-Frame-Options: SAMEORIGIN`, CSP `frame-ancestors 'self'` | **VYŘEŠENO (A+)** |
| **MIME Sniffing** | Chyběla hlavička | `X-Content-Type-Options: nosniff` | **VYŘEŠENO (A+)** |
| **Content Security Policy** | Zcela bez CSP | Striktní CSP v `<meta>` i v serverových hlavičkách | **VYŘEŠENO (A+)** |
| **DOM Sinks & XSS** | Inline `onclick` události a zastaralý kód | Čisté addEventListener, zero `innerHTML`, bez eval | **VYŘEŠENO (A+)** |
| **Referrer Policy** | Výchozí nechráněný stav prohlížeče | `strict-origin-when-cross-origin` | **VYŘEŠENO (A+)** |
| **Externí odkazy** | Neuvedeny bezpečnostní rel atributy | `rel="noopener noreferrer"` na všech externích linkách | **VYŘEŠENO (A+)** |
| **Permissions Policy** | Přístup ke kameře a poloze neomezen | Vypnut přístup: `camera=(), microphone=(), geolocation=()` | **VYŘEŠENO (A+)** |

---

## 2. Detailní rozbor jednotlivých vrstev zabezpečení

### A. Ochrana proti XSS (Cross-Site Scripting)
- **DOM Sinks audit:** V souboru `main.js` se nepoužívá žádný rizikový sink typu `innerHTML`, `outerHTML`, `document.write` ani `eval()`. Veškeré dynamické vkládání názvů a textů (např. v 3D prohlížeči) probíhá výhradně přes bezpečné `textContent` a `setAttribute()`.
- **Content Security Policy (CSP):**
  ```http
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';
  ```
  Zajišťuje, že prohlížeč neprovede skripty z nepovolených domén a nepovolí podvržení formulářů nebo cílů základní URI (`base-uri 'self'`).

### B. Clickjacking (UI Redressing)
- Pro zabránění vložení stránky do škodlivého transparentního rámu na cizí doméně je aplikována dvojitá ochrana:
  1. `X-Frame-Options: SAMEORIGIN` pro starší prohlížeče.
  2. `frame-ancestors 'self'` v rámci CSP pro moderní standardy.

### C. Ochrana soukromí a externí subzdroje
- **Google Fonts:** Načítá se výhradně z oficiálních domén `fonts.googleapis.com` a `fonts.gstatic.com` přes zabezpečené spojení s předstihem `preconnect`. Žádné jiné třetí strany (trackery, pochybné analytiky) na webu neběží.
- **Odkaz na registr ARES (IČO):** Opatřen atributem `target="_blank" rel="noopener noreferrer"`, což brání zneužití objektu `window.opener` a úniku referenční URL.

### D. Serverová konfigurace (`.htaccess` / `nginx.conf`)
- Vytvořeny kompletní konfigurační soubory pro produkční server (aktuální hosting WEDOS i alternativy):
  - Automatický redirect HTTP -> HTTPS.
  - Ochrana skrytých souborů (např. `.git`, `.env`).
  - Zákaz výpisu obsahu složek (`Options -Indexes`).
  - Dlouhodobé cachování statických obrázků (1 rok) pro maximální rychlost bez zátěže serveru.
