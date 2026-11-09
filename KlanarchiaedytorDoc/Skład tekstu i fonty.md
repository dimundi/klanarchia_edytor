# Skład tekstu i fonty

## Działa lokalnie

Podgląd talentu i kreator szablonów korzystają z jednego silnika składu. Silnik odczytuje dołączone pliki TTF, wyznacza podziały wyrazów i gotowe wiersze, a litery rysuje jako krzywe SVG. Przeglądarka nie mierzy ani nie łamie tekstu karty. PDF klonuje ten sam SVG; nie składa tekstu ponownie.

- Font: Linux Libertine, konkretne pliki regular/bold/italic/bold italic z repozytorium. Odczyt metryk i konturów przez przypięte opentype.js 2.0.0 (MIT). Brak fontu lub znaku oznacza jawny błąd; brak zamiany na systemowy. Nowe wybory Georgia/Arial wyłączone; dawne rekordy nie są przepisywane i wymagają wyboru dołączonego fontu, jeśli ich używały.
- Dzielenie: wzorce TeX PL i EN-US przechowywane w źródłach, nie pobierane z internetu podczas pracy użytkownika. Polski hyph-pl.tex 3.0a (MIT), angielski hyph-en-us.tex 2005-05-30 (własna zgoda na rozpowszechnianie z zachowaniem noty). Źródło: [tex-hyphen](https://github.com/hyphenation/tex-hyphen/tree/master/hyph-utf8/tex/generic/hyph-utf8/patterns/tex). Oryginalne noty zachowane w plikach i public/licenses. Licencja fontów: public/LinuxLibertine-OFL.txt.
- Algorytm Liang/TeX: dozwolone podziały i wyjątki dostarczone z wzorcami; minima PL 2/2, EN 2/3. Jeden silnik dobiera podział według pozostałego miejsca w wierszu. Jawne nowe linie i twarde spacje są respektowane. Wyjątkowo długi niedzielący się ciąg zgłasza przepełnienie zamiast arbitralnie dzielić znaki.
- W bazie nadal czysta treść ze znacznikami oraz parametry typografii. Automatyczne łączniki, wiersze i glify są wyłącznie wynikiem renderowania, bez zapisywania ich do wersji talentu.
- Oznaczenia mechaniki korzystają ze wspólnych stylów/kolorów; tytuł i fabuła ze stylów szablonu. Rozmiary, interlinia i odstępy liter uwzględniane niezależnie. Wagi 600/700 używają dołączonej odmiany bold. Kapitaliki są składane deterministycznie z wielkich liter w skali .8 dla liter małych. Ligatury automatyczne nie są używane; kerning liczony z fontu.
- Napisy nieodnawialny i ograniczenie dostępności również są krzywymi, z tymi samymi metrykami. Tło ograniczenia dopasowywane do wyniku składu, bez pomiarów DOM.
- Przycisk PDF przy Zapisz w edytorze talentu używa bieżącego podglądu, również niezapisanych zmian. PDF nie jest przygotowywany, gdy tekst ma błąd fontu lub jeszcze się ładuje.

## Granice rozwiązania

Powtarzalne są pozycje, podziały, rozmiary i geometria liter. Wygładzanie pikseli na ekranie może różnić się między przeglądarkami. Tekst w eksportowanym PDF jest krzywymi, więc nie jest tekstem do wyszukiwania lub zaznaczania. W edytorze źródło pozostaje zwykłym, edytowalnym tekstem.

Aktualny zakres języków to PL i EN-US. Własne wyjątki Klanarchii i ich panel pozostają do zaprojektowania; to osobny zasób od słownika znaczeń terminów. Korektę pisowni pozostawiamy przeglądarce.

## Weryfikacja

- `npm test`: sześć stałych testów składu, wzorców/wyjątków PL/EN, powtarzalności, NBSP, fontów, odstępów, nowych linii, przepełnienia i brakujących glifów.
- Test trzech przeglądarek: identyczne linie, metryki i krzywe dla PL/EN w Chrome, Edge i Firefox, bez ich natywnego dzielenia.
- Interfejs: zapisany Prymat potępieńca, poprawny tytuł, oznaczenia, napisy dodatkowe oraz pojawianie/znikanie ostrzeżenia przepełnienia.
- PDF: krzywe i linie dokładnie jak w podglądzie; zachowany fizyczny rozmiar karty i A4. Symulowany brak pliku fontu pokazał błąd bez zamiany na inny font.
- Bez zmian rekordów bazy i bez wdrożenia produkcyjnego.

## PDF — bezpośredni eksport (2026-11-09)

Przyciski PDF w edytorze talentu i kreatorze szablonu pobierają gotowy plik .pdf. Nie otwierają okna drukowania ani nowej karty. Wspólny moduł export-talent-pdf.ts zastąpił dawny print-talent.ts.

Generator jsPDF + svg2pdf.js (przypięte wersje w package-lock.json, licencje MIT w public/licenses), ładowany dopiero przy eksporcie. Jedna strona A4, karta w skali 1:1, 10 mm od góry i lewej. Treść i większość grafiki pozostają wektorowe; grafiki z maską alfa są spłaszczane do przezroczystego PNG 600 dpi, ponieważ konwerter nie obsługuje tych masek. Litery pozostają dokładnymi krzywymi z podglądu. Obrysy zaznaczenia i narzędzia kreatora nie trafiają do pliku. Eksport nie zapisuje talentu ani szablonu.

Sprawdzono rzeczywiste pobrania z obu przycisków, brak window.print/window.open i błędów JS. Niezależny odczyt PDF potwierdził poprawną jedną stronę A4 i krzywe wektorowe. Wyrenderowano i obejrzano oba pliki, łącznie z ikonami i ograniczeniem dostępności.
