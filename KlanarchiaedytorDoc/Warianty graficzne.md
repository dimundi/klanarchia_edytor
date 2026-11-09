# Warianty graficzne

Jeden wybór „Warianty graficzne” obejmuje cały komplet grafik: ramkę, heks i zaznaczenie, symbol kosztu, Zagrywkę, Dar Ciemności, zasady specjalne, trzy pola użyć, Raz na scenę i tło ograniczenia. Nie wybieramy osobno wariantu ramki ani kosztu. Pozycje, rozmiary, widoczność i kolory obiektów oraz teksty i ich style pozostają niezależne. Wartość kosztu jest nadal osobnym obiektem tekstowym, mimo że cyfry renderowane są jako krzywe.

Źródła: `src/assets/talent-template/variants/`.

| Katalog / ID | Wybór w edytorze | Ramka |
|---|---|---|
| `original` | Oryginalny | oryginalna |
| `ink` | Tuszowy | aktualna, do łączenia kart |

Każdy katalog ma fizycznie ten sam komplet 13 SVG:

- `frame.svg`, `frame-contour.svg` — ramka i dopasowany kontur jej tła.
- `hex.svg`, `hex-mark.svg` — heks i zaznaczenie.
- `cost.svg` — sam symbol kosztu, bez cyfry.
- `play.svg`, `dark-gift.svg`, `special-rules.svg` — pozostałe oznaczenia.
- `use-1.svg`, `use-2.svg`, `use-3.svg`, `once.svg` — użycia i Raz na scenę.
- `restriction-background.svg` — kształt jasnego tła ograniczenia; kolor bierze z bieżącej palety.

Rejestr i etykiety: `src/graphic-variants.ts`. Grafiki nie korzystają z zapasowych plików innego wariantu. Zmiana wariantu przełącza podgląd, ikonografię listy, miniaturę i wydruk/PDF.

Szablon zapisuje jedno pole `graphicVariant`. API i parser odczytują starsze `iconVariant`, `frameVariant`, `costVariant`, a nowy zapis zawiera tylko wspólny wariant. Historyczne dokumenty pozostają niezmienione. Wycofane warianty z wcześniejszymi ramkami przy odczycie przechodzą na Tuszowy. Ich pliki zachowano poza aktywnym projektem w katalogu retired-graphic-variants lokalnych kopii.

Kopie starych plików i bazy: `wtf_www/backups/klanarchia-editor/20261109/before-graphic-variants/`. Stare luźne SVG i moduły wybierające grafiki usunięto z aktywnego źródła dopiero po sprawdzeniu kopii. Fonty pozostały w dotychczasowym katalogu.