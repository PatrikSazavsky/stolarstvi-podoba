# Stolařství Podoba — Webová prezentace

Kompletní nová webová prezentace pro rodinnou stolařskou a truhlářskou firmu **Stolařství Podoba (Dolní Bečva)**.

## Hlavní přednosti řešení

1. **Čisté řemeslné zpracování bez AI slopu:**
   - Autentická paleta: tmavé uhlí, masivní dřevo, medový jantar.
   - Elegantní řemeslná typografie (Cormorant Garamond + Plus Jakarta Sans).
   - Žádné generické ikony v kroužcích, žádné em dashes, žádné bullet CTA buttony ani umělé marketingové fráze.
   - Textace 100% zachovává skutečné sdělení a údaje klienta ze stávajícího webu.

2. **100% responzivita a optimalizace pro mobily:**
   - Plynulé zobrazení od nejmenších displejů (320 px) až po velkoformátové 4K monitory.
   - **Splněn požadavek klienta:** Žádná spodní mobilní lišta ani žádný obtěžující sticky bar, který by zakrýval displej telefonu.

3. **Interaktivní 3D manipulace s fotografiemi (bez zbytečných šipek):**
   - **Plynulý 3D pruh:** Uživatel může posouvat a táhnout fotky myší i prstem. Podle směru a rychlosti pohybu se karty přirozeně natáčejí v 3D prostoru.
   - **3D náklon s odleskem:** Při přejetí myší se karta realisticky naklání a odráží světlo jako lakované masivní dřevo.
   - **3D inspekční prohlížeč (Turntable):** Po kliknutí na kteroukoli fotografii lze snímek tažením doleva a doprava plynule otáčet v 3D prostoru s dynamickým úhlem a odleskem.
   - Žádné šipky vyžadující úmorné proklikávání.

4. **Připraveno pro snadné vložení finálních fotografií klienta:**
   - Fotografie jsou uloženy v `assets/images/` pod názvy `prace_1.jpg` až `prace_102.jpg`.
   - Stačí nahrát nové fotky od klienta do této složky se stejnými názvy nebo aktualizovat atributy `src` v `index.html`.

5. **Maximální SEO a dohledatelnost:**
   - Kompletní strukturovaná data Schema.org (`HomeAndConstructionBusiness`).
   - Open Graph a Twitter Card pro perfektní sdílení na sítích.
   - `sitemap.xml` a `robots.txt`.
   - Sémantické HTML5 značky a optimalizace Core Web Vitals (LCP preload).

6. **Prověřená bezpečnost (A+):**
   - Přísná Content Security Policy (CSP).
   - Ochrana proti Clickjackingu (`X-Frame-Options: SAMEORIGIN`, `frame-ancestors 'self'`).
   - Ochrana proti MIME Sniffingu (`X-Content-Type-Options: nosniff`).
   - Zero zranitelných DOM sinků v JavaScriptu.
   - Připravené konfigurační soubory `.htaccess` (Apache/WEDOS) i `nginx.conf`.

---

## Struktura souborů

```
outputs/stolarstvi-podoba/
├── index.html              # Hlavní stránka se strukturou a SEO
├── robots.txt              # Pravidla pro roboty vyhledávačů
├── sitemap.xml             # XML mapa stránek pro Google/Seznam
├── .htaccess               # Produkční konfigurace pro Apache / WEDOS (HTTPS + hlavičky)
├── nginx.conf              # Alternativní konfigurace pro Nginx
├── SECURITY_AUDIT.md       # Bezpečnostní prověrka
└── assets/
    ├── css/
    │   └── style.css       # Kompletní řemeslný styl a 3D scény
    ├── js/
    │   └── main.js         # Interaktivní 3D engine a manipulace snímků
    └── images/
        ├── logo.jpg        # Původní logo
        ├── prace_1.jpg     # Ukázky prací klienta
        ├── prace_12.jpg
        ├── prace_18.jpg
        ├── prace_25.jpg
        ├── prace_34.jpg
        ├── prace_45.jpg
        ├── prace_52.jpg
        ├── prace_63.jpg
        ├── prace_78.jpg    # Hero vizuál a ukázka
        ├── ...
        └── prace_102.jpg
```

---

## Jak spustit lokální náhled

V terminálu ve složce projektu stačí spustit:
```bash
python3 -m http.server 8080 --directory outputs/stolarstvi-podoba
```
A v prohlížeči otevřít `http://localhost:8080`.
