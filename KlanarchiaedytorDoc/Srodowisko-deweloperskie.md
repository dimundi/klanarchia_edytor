# Środowisko deweloperskie

## Uruchamianie

Wymagany Docker Desktop oraz istniejąca konfiguracja `../wtf_www/deploy/dev/.env`. Node.js na Windows nie jest wymagany.

1. Uruchom `start-dev.bat` w katalogu projektu edytora.
2. Zaloguj się jako administrator lokalnego WordPressa.
3. Na stronie Klanarchii wybierz „Edytor”, a następnie przycisk „Edytor postaci” w module postaci.

Skrypt uruchamia lokalny WordPress, bazę i serwer Vite, czeka na ich gotowość i aktywuje wtyczkę. Nie zmienia konfiguracji ani treści produkcji. Stary projekt `Klanarchia_karty_postaci` nie jest podłączany ani modyfikowany.

WordPress działa na porcie 8081, Vite na 5174. Porty są udostępnione tylko na interfejsie lokalnym. Nakładka `compose.editor.yml` rozszerza Compose z `wtf_www`; ścieżki montowań są liczone względem jego pliku w `deploy/dev`.

Uruchamiaj środowisko przez skrypt edytora. Sam skrypt startowy `wtf_www` nie uwzględnia dodatkowego montowania wtyczki i serwera Vite.

## Kod i podgląd

- `src/main.tsx` — aplikacja React i słowniki PL/EN.
- `src/style.css` — style ograniczone do aplikacji, w ciemnej oprawie złoto/grafit.
- `plugin/klanarchia-edytor/klanarchia-edytor.php` — integracja z WordPressem i chronione API.
- Kod PHP jest montowany do kontenera WordPressa tylko do odczytu. Edytujemy go w tym projekcie.
- Vite odświeża aplikację po zmianach kodu; po zmianie PHP odśwież stronę. W `vite.config.js` włączono `watch.usePolling` (300 ms), ponieważ zdarzenia zmian plików montowanych z Windowsa nie docierały do kontenera i Vite wysyłał stare zasoby nawet po odświeżeniu strony.
- Zależności są instalowane przez `npm ci` z pliku `package-lock.json` w osobnym wolumenie Dockera. Po ich zmianie uruchom ponownie usługę `editor`.

## Pierwszy działający etap

Publiczna zajawka edytorów pod `/klanarchia/edytor/` pozostaje bez zmian w bazie. Wtyczka dodaje przycisk do modułu postaci wyłącznie użytkownikowi z uprawnieniem `manage_options` — domyślnie administratorowi.

Przycisk otwiera `/klanarchia/edytor/?ke_app=postaci`. Aplikacja zastępuje treść zajawki, zachowując nagłówek, stopkę i szablon Klanarchii. Wejście bez uprawnień zwraca HTTP 403. Odpowiedzi strony nie powinny być współdzielone przez cache.

WordPress przekazuje konfigurację: język `pl`/`en`, adres API i nonce REST. Język pochodzi z Polylang, a bez niego z ustawień lokalizacji WordPressa. Żadna strona EN nie została opublikowana.

`GET /wp-json/klanarchia-editor/v1/bootstrap` wymaga zalogowanej sesji, nonce REST i uprawnienia `manage_options`. Aplikacja pokazuje górne menu i puste ekrany: „Moje postacie”, „Moje talenty” oraz sekcję „Projektowanie” z talentami i dwoma kreatorami szablonów. Sekcja projektowania wymaga potwierdzenia dostępu przez API. Menu jest zwijane na telefonie; wybór ekranu zapisuje się w hashu adresu. Ekran Hello world i licznik kliknięć zastąpiono tym układem. Nie tworzymy jeszcze tabel danych edytora.

## Kompilacja

Po pierwszym uruchomieniu środowiska wykonaj `build.bat`. Skrypt sprawdza TypeScript i zapisuje build do `plugin/klanarchia-edytor/dist`. Nie reinstaluje zależności używanych przez działający serwer Vite.

Na środowisku bez zmiennej `KLANARCHIA_EDITOR_DEV_SERVER` wtyczka ładuje zasoby z manifestu kompilacji. Serwer developerski może być używany wyłącznie dla środowiska WordPress `local` lub `development`.

Wynik kompilacji jest pomijany przez Git. Przyszła paczka instalacyjna będzie musiała zawierać katalog wtyczki razem z `dist`. W tym etapie nie wykonujemy wdrożenia.

## Weryfikacja — 2026-11-05

- Konfiguracja Compose, składnia PHP oraz kompilacja TypeScript/Vite: poprawne.
- Przeglądarka: administrator uruchamia aplikację, API potwierdza dostęp, licznik reaguje na kliknięcie, nagłówek i stopka pozostają widoczne.
- Gość i zwykły klient nie widzą przycisku; bezpośrednie wejście i API odmawiają dostępu.
- Widok przy szerokości 320 px nie powoduje przewijania w poziomie.
- Teksty EN sprawdzono przez testową konfigurację aplikacji, bez publikowania stron EN. Pełne przejście z angielskiej strony WordPressa nie było testowane.
- Sprawdzono odczyt manifestu oraz podłączenie skompilowanych JS/CSS przez PHP bez Vite. Test przeglądarkowy dotyczył trybu developerskiego.
- Jednorazowe narzędzia sprawdzające zachowano poza Gitem w `../wtf_www/local-scripts/one-off/editor-dev/`. Nie zapisują haseł ani sesji do plików i nie zmieniają treści stron.

## Baza edytora — 2026-11-07

Utworzono lokalnie 7 tabel i podłączono paletę/oznaczenia oraz bibliotekę szablonów do API. Migracja jest jawna (`migrate-db.bat`), niezależna od aktywacji wtyczki. Szczegóły i kopia sprzed migracji: [Baza danych](Baza%20danych.md). Wcześniejsze stwierdzenia o braku tabel opisują stan początkowy.

## Gdy po uruchomieniu WordPressa nie widać edytora

Bazowy start wtf_www może odtworzyć kontener WordPress bez nakładki compose.editor.yml i odłączyć pliki wtyczki. Przywrócenie: uruchomić start-dev.bat z katalogu Klanarchia_edytor. Zachowuje bazę i zapisane szablony, dodaje montowanie wtyczki oraz jej konfigurację developerską. Potwierdzone 2026-11-09: aplikacja, biblioteka i przycisk PDF działają po takim uruchomieniu.
## Git

Repozytorium lokalne Klanarchia_edytor zainicjalizowano na main. .gitignore wyklucza node_modules, dist, eksporty próbne, kopie i lokalne sekrety; źródłowe warianty SVG, fonty z licencją, package-lock.json oraz dokumentacja są wersjonowane. .gitattributes normalizuje kod do LF, skrypty Windows do CRLF w katalogu roboczym, a zasoby binarne chroni przed konwersją. Repozytorium origin: https://github.com/dimundi/klanarchia_edytor.git. Gałąź main śledzi origin/main; pierwszy commit wysłano 2026-11-09.