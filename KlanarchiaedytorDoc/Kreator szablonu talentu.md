# Kreator szablonu talentu

Aktualizacja 2026-11-09: dokument zawiera również opisy wcześniejszych etapów. Aktualny zapis i eksport opisują Baza danych.md oraz Skład tekstu i fonty.md; jedna kolejka dalszych prac jest w [TODO.md](TODO.md).

Stan lokalny: 2026-11-06. Wejście: „Projektowanie” → „Kreator szablonów talentów”. Nadal tylko dla administratora WordPressa. Bez bazy i eksportu PDF.

## Ekran wyboru szablonu

Po wejściu do kreatora otwieramy bibliotekę. „Nowy szablon” rozpoczyna projekt, a zapisane pozycje mają miniaturę układu, nazwę, datę zmiany oraz „Otwórz” i „Duplikuj”. Kliknięcie miniatury także otwiera projekt. Duplikat dostaje nowy UUID i własną kopię danych, bez zmiany oryginału.

W kreatorze jest „Wróć do szablonów”. Powrót z niezapisanymi zmianami wymaga potwierdzenia. Przejście do innej sekcji głównego menu zachowuje bieżący stan pracy; odświeżenie ponownie zaczyna od biblioteki.

Tymczasowo lista jest zapisywana przez `localStorage`, bez bazy i bez synchronizacji między przeglądarkami. Klucz `ke:talent-templates:<WordPress userId>` rozdziela biblioteki kont w interfejsie. To magazyn tej przeglądarki, nie dodatkowy mechanizm kontroli dostępu; serwer nadal dopuszcza wyłącznie administratora. Wyczyszczenie danych witryny usuwa lokalną bibliotekę, dlatego pozostaje eksport JSON.

- „Zapisz” oraz Ctrl+S/Cmd+S zapisują lub aktualizują pozycję w lokalnej bibliotece.
- „Zapisz JSON” pobiera kopię dokumentu i nie aktualizuje wpisu biblioteki.
- „Wczytaj JSON” otwiera dokument jako nowy projekt; trzeba wybrać „Zapisz”, aby dodać go do listy.
- Format biblioteki zawiera wersję, listę identyfikatorów, daty utworzenia i zmiany oraz dokumenty szablonów. Sam eksportowany szablon nadal ma format JSON 2.
- Przed zapisem ponownie odczytujemy bibliotekę; nowszy zapis tego samego szablonu w innej karcie blokuje nadpisanie starszą edycją.
- Błędny magazyn lub odmowa zapisu nie zastępuje danych ani nie oznacza pracy jako zapisanej. Eksport pliku pozostaje dostępny.

To rozwiązanie przejściowe do podłączenia uzgodnionej bazy. Nie wykonano migracji ani utworzenia tabel.
## Układ i obsługa

- Lewy panel: wybór obiektu — tło, grafika albo tekst. Wiersze zawierają miniatury/symbole, nazwy i niezależne checkboxy widoczności. Kliknięcie wiersza zaznacza, checkbox tylko pokazuje/ukrywa.
- Środek: podgląd z powiększeniem, wyborem elementu, obrysami i uchwytem skalowania.
- Prawy panel: wyłącznie właściwości wybranego obiektu. Grafika ma geometrię i blokadę, tekst także własną typografię, a tło — kolor i wymiary karty.
- Nad nimi zwarty pasek nazwy szablonu, cofania, ponawiania oraz zapisu/odczytu JSON. Bez osobnego wysokiego nagłówka sekcji.
- Na telefonie podgląd jest pierwszy, a panele przechodzą pod niego.

Kliknij element na karcie lub jego nazwę na liście. Przeciągnij, aby przesunąć; uchwyt w prawym dolnym rogu zmienia rozmiar. Pozycję X/Y oraz szerokość/wysokość można też wpisać liczbowo.

Opcja „Zachowaj proporcje” utrzymuje stosunek szerokości do wysokości przy wpisywaniu wymiarów i skalowaniu uchwytem. Rozmiar jest ograniczony granicami karty. Ustawienie jest zapisywane przy elemencie jako `proportional`; brak pola w starszym pliku oznacza `false`.

Współrzędne są w punktach PDF, od lewego górnego rogu. 72 pt = 25,4 mm. Domyślna karta ma 185,67 × 101,76 pt, około 65,5 × 35,9 mm. Elementy pozostają w granicach karty; przy zmniejszeniu karty są do nich dopasowywane.

Po wybraniu elementu na podglądzie strzałki przesuwają go o 1 pt, Shift+strzałki o 10 pt. Zablokowany element nie może być przesuwany ani skalowany; odblokowanie odbywa się ikoną kłódki w lewym wierszu obiektu. Ramka jest początkowo zablokowana.

„Cofnij” i „Ponów” przechowują do 100 zmian. Przeciągnięcie jest jedną operacją. Ctrl+Z/Cmd+Z działa poza polami formularza; Shift+Ctrl+Z/Shift+Cmd+Z ponawia. W polach zachowujemy zwykłe cofanie wpisywanego tekstu.

## Elementy szablonu

Na liście wybieramy tło, ramkę, heks, Dar Ciemności, osobne obiekty „Pola użyć” i „Raz na scenę” i teksty. Podgląd pozwala wybrać między wariantami: pola na misję oraz symbol „Raz na scenę”; nigdy nie pokazujemy ich jednocześnie. W JSON 2 zachowujemy geometrię obu wariantów dla zgodności z wcześniejszymi plikami.

Tytuł, fabuła i mechanika płyną razem we wspólnym bloku i zachowują niezależne style. Opcję osobnych bloków usunięto. Starsze pliki z trybem `separate` są wczytywane jako `flow`; dawna geometria pozostaje w dokumencie dla zgodności. Nie dodajemy jeszcze dowolnych nowych obiektów ani osobnych warstw.

## Kontrolki pod podglądem

- Włącznik obrysów obejmuje również zaznaczenie i uchwyt; po wyłączeniu podgląd jest bez pomocniczych ramek.
- Miniatury i przełączniki grafik przeniesiono na lewą listę obiektów; pod podglądem nie ma już ich kopii.
- Liczbę pól użyć 0–3 ustawiamy w lewej kolumnie, bezpośrednio obok nazwy „Pola użyć”, w tym samym wierszu. Włączenie „Raz na scenę” przełącza podgląd na jego symbol; zmiana liczby ponownie aktywuje pola. Te warianty nie są wyświetlane jednocześnie. Selektor spod podglądu został usunięty.
- „Pola użyć” i „Raz na scenę” wybieramy osobno na liście. Każdy obiekt ma własną ikonę, widoczność i geometrię. Zaznaczenie obiektu nie przełącza wariantu; włączenie jego checkboxa aktywuje odpowiedni wariant podglądu. Zasada wykluczania obu wariantów pozostaje zachowana.
- Dane testowe znajdują się w zwijanym panelu pod podglądem, nie w panelu właściwości.
- W trybie wspólnego bloku tytuł, fabułę i mechanikę nadal wybieramy po lewej. Po prawej zmienia się ich własny styl; geometria dotyczy wspólnego bloku, co opisuje podpowiedź. Nie ma osobnych zakładek stylów po prawej.
## Niezależne style tekstu

Każdy z trzech tekstów ma własne:

- Font: Linux Libertine, Georgia albo Arial.
- Wielkość (9–48 pt), kolor, pogrubienie i kursywę.
- Interlinię (mnożnik 0,75–3).
- Odstęp między literami (od −2 do 10 pt, również wartości ujemne).

Ustawienia są niezależne także w trybie wspólnego bloku. Przepełnienie tekstu sygnalizujemy z nazwą elementu; nie pomniejszamy automatycznie fontu poniżej 9 pt. Zapis dokumentu jest możliwy mimo ostrzeżenia dotyczącego danych testowych.

## Interlinia konkretnego talentu — przygotowany kontrakt

Domyślne wartości należą do `styles.title`, `styles.flavor` i `styles.mechanics` w szablonie. W przyszłym edytorze talentu przewidujemy osobne `textOverrides`, np.:

```json
{
  "textOverrides": {
    "mechanics": { "lineHeight": 1.3 }
  }
}
```

Typ `TalentTextOverrides` i funkcja `resolveTextStyle` są w `src/talent-template-model.ts`. Nadpisanie zmienia tylko interlinię wskazanej części i nie modyfikuje szablonu. Brak nadpisania oznacza dziedziczenie. Nieprawidłowa wartość jest pomijana na rzecz domyślnej.

Nie ma jeszcze formularza nadpisania w edytorze talentów ani zapisu go do bazy. Nie umieszczamy danych konkretnego talentu w pliku szablonu.

Przełącznik „Akcja” znajduje się w lewej kolumnie, a nie w panelu danych testowych.

## Dane testowe i zachowanie pracy

Teksty testowe, flaga akcji, wybrany wariant użyć, wybór elementu, obrysy i zoom służą podglądowi; nie są eksportowane do JSON szablonu. Puste pola tekstowe pokazują teksty zastępcze. Włączniki grafik zapisują natomiast ich widoczność w szablonie.

Zmiany pozostają podczas przełączania menu. Przy zamykaniu lub odświeżaniu strony z niezapisanymi zmianami szablonu przeglądarka ostrzega. Nowy projekt lub wczytanie pliku wymaga potwierdzenia odrzucenia niezapisanych zmian.

Nie ma automatycznego zapisu ani bazy. „Zapisz” przechowuje szablon w lokalnej bibliotece tej przeglądarki; „Zapisz JSON” pobiera kopię do pliku. Ctrl+S/Cmd+S zapisuje do biblioteki, gdy kreator jest aktywny.

## Format JSON i zgodność

Nowy format: `schemaVersion: 2`, `kind: talent-template`.

| Pole | Zawartość |
| --- | --- |
| `name`, `page`, `background` | Nazwa, rozmiar i kolor tła karty. |
| `textMode` | `flow` albo `separate`. |
| `elements` | Stałe identyfikatory elementów, X/Y, rozmiar, widoczność i blokada. |
| `styles` | Osobne ustawienia `title`, `flavor`, `mechanics`. |

Wczytujemy również `schemaVersion: 1` z pierwszego nowego kreatora. Marginesy i parametry wspólne są przeliczane na geometrię elementów oraz trzy style; opis fabularny zachowuje kolor i kursywę. Stary plik nie jest modyfikowany. Kolejny zapis pobiera format 2. Nie jest to importer dowolnych JSON-ów starej aplikacji `Klanarchia_karty_postaci`.

Odczyt sprawdza wersję, rodzaj, geometrię i granice karty, fonty, kolory, typy i limity parametrów. Błędny plik nie zastępuje bieżącego projektu. Limit pliku: 1 MB. Do stanu kopiujemy wyłącznie znane pola; nie wykonujemy HTML, skryptów ani zewnętrznych zasobów podanych w JSON-ie.

## Materiały i kod

Wykorzystujemy ramkę i ikony z projektu źródłowego. Dla heksa, kwadratu i „Raz na scenę” dopasowano viewBox wyłącznie w nowych kopiach SVG. Font Linux Libertine ma cztery rzeczywiste odmiany: regular, bold, italic, bold italic. Licencja `public/LinuxLibertine-OFL.txt` jest kopiowana do buildu wtyczki. Georgia i Arial korzystają z fontów systemowych.

Nie zmieniono starego projektu ani nie importowano biblioteki talentów i prywatnych danych.

Kod: `TalentTemplateCreator.tsx` (interfejs i podgląd), `talent-template-model.ts` (model, walidacja, konwersja, nadpisania), `talent-template-strings.ts` (PL/EN), `talent-template.css` (układ).

## Sprawdzenie — 2026-11-06

- Przeglądarka: przeciąganie, skalowanie, strzałki, blokada, cofanie/ponawianie i dokładność przeciągania przy 100% oraz 300%.
- Niezależne style tekstów, tryby wspólny/osobny i liczbowy zapis geometrii.
- Pełny JSON 2: pobranie i ponowne wczytanie bez utraty danych; konwersja JSON 1.
- Odrzucenie nieprawidłowego fontu, wersji, koloru, współrzędnych i wielkości tekstu.
- Kontrakt nadpisania interlinii bez zmiany szablonu; dopasowanie geometrii do mniejszej karty.
- Widok 320 px bez przewijania poziomego, ostrzeżenie o przepełnieniu, EN i brak błędów JavaScript. Obejrzano zrzuty desktopu i telefonu.

Jednorazowa kontrola: `../wtf_www/local-scripts/one-off/editor-layout-20261106/check-layout.cjs`. Kopia poprzedniej implementacji w podkatalogu `before`. Dalsze osobne etapy: edytor talentów i jego nadpisania, baza/wersjonowanie, formatowanie treści i eksport PDF.


## Sprawdzenie biblioteki — 2026-11-06

Test `check-library.cjs` sprawdził nowy projekt, zapis, miniatury i daty, niezależne duplikowanie, odświeżenie, anulowanie odrzucenia zmian, import/eksport JSON, konflikt dwóch kart, widok 320 px i zachowanie uszkodzonych danych bez nadpisania. Obejrzano zrzut desktopu. Składnia PHP i kompilacja TypeScript/Vite poprawne.

- Ramka i?t?o maj? niezale?n? widoczno??. T?o jest przyci?te do zewn?trznego konturu widocznej ramki, zgodnie z?jej po?o?eniem i?rozmiarem; poza konturem pozostaje przezroczyste. Po ukryciu ramki t?o wype?nia ca?? kart?. Wy??czenie t?a pozostawia sam? ramk? i?pozosta?e elementy. Obecnie edytujemy kolor t?a; grafika b?dzie osobnym etapem. Miniatury stosuj? te same regu?y. Starsze szablony domy?lnie zachowuj? w??czone t?o.

- Pod podglądem dostępny jest wybór tła obszaru roboczego: szachownica, białe, szare, ciemne i własny kolor. To ustawienie widoku, niezależne od zapisywanego tła karty.

- Wybór tła podglądu jest schowany pod ikoną ustawień obok napisu „Podgląd”. Paleta obejmuje także przygaszony beż #b6aa91 z kafelków strony startowej.

## Aktualny zapis — 2026-11-07

Biblioteka szablonów zapisuje się w bazie WordPressa przez API. Każdy zapis tworzy niezmienną wersję z autorem i datą. Dotychczasowe opisy localStorage odnoszą się do prototypu; jego dane można importować po podglądzie. Eksport/import JSON nadal działa. Procedura: [Baza danych](Baza%20danych.md).

2026-11-07: usunięto przyciski i obsługę plików „Wczytaj JSON” / „Zapisz JSON” z biblioteki i kreatora. „Zapisz” zapisuje do bazy, pokazuje kręciołek i napis „Zapisywanie…” oraz blokuje ponowne kliknięcie. Stan kończy się również przy błędzie. Import dawnego localStorage po podglądzie nadal dostępny.

## Kolor ramki — 2026-11-07

Po wybraniu ramki lewym menu po prawej pojawia się lista „Kolor ramki”, zawierająca wyłącznie wspólną paletę. Szablon zapisuje frameColourId; miniatura i podgląd odczytują RGB wskazanego koloru. Ramka SVG służy jako maska alfa, zachowując oryginalne krzywe, otwory i przezroczystość. Domyślnie Błękit Zmroku #3e5074; dostępne również czarny i biały. Zapis palety odświeża kolory w podglądzie bez zmiany geometrii ramki.

## Wspólny wybór kolorów grafik — 2026-11-07

PaletteSelect.tsx to komponent listy z próbkami kolorów, nazwami i HEX. Obsługuje kliknięcia, strzałki/Home/End, Enter, Escape i zamknięcie po kliknięciu poza listą. Używany dla ramki, heksa, Daru Ciemności, pól użyć i „Raz na scenę”. Wybór wyłącznie z palety bazy.

Kolory czterech ikon zapisuje graphicColourIds (hex/gift/uses/once), ramka zachowuje frameColourId. Domyślnie Dar Ciemności używa czarnego, pozostałe grafiki Błękitu Zmroku. Starsze szablony otrzymują te ustawienia przy odczycie. TintedGraphic.tsx zachowuje kształt, otwory i przezroczystość SVG, nakładając wybrany kolor przez maskę alfa. Podgląd i miniatury korzystają z tego samego renderowania.

## Zaznaczenie i wyrównanie — 2026-11-07

- Checkbox po lewej zaznacza obiekt; ikona oka po prawej niezależnie pokazuje/ukrywa element. Ukrycie nie usuwa zaznaczenia. Tło karty jest osobnym wyborem właściwości, bez pozycji do wyrównania.
- Klik wybiera obiekt, Shift + klik na liście lub podglądzie dodaje/usuwa z zaznaczenia. Checkboxy pozwalają łączyć wybory bez Shift. Escape na podglądzie usuwa zaznaczenie.
- Między nagłówkiem Podgląd i powiększeniem pokazuje się sześć ikon: lewo/środek/prawo oraz góra/środek/dół. Jeden obiekt wyrównujemy do karty, kilka do obszaru obejmującego zaznaczenie. Każde wyrównanie jest jednym krokiem Cofnij.
- Zaznaczenie ma obrysy i wspólną ramkę. Można przesuwać grupę przeciąganiem lub strzałkami, z zachowaniem odstępów i ograniczeniem do karty. Blokady są respektowane; zablokowane elementy nie przesuwają się. Skalowanie uchwytem pozostaje dla pojedynczej geometrii.
- Tytuł/fabuła/mechanika we wspólnym bloku nadal dzielą jedną geometrię. Zaznaczenie kilku części nie tworzy niezależnych bloków i nie powoduje wielokrotnego przesunięcia tego samego bloku.
- Zaznaczenie jest stanem interfejsu; do bazy zapisują się zmienione pozycje i widoczność obiektów. Nie dodano tabel ani pól danych.

## Zaznaczenie heksa — 2026-11-07

Oryginalny checked_v.svg skopiowany bez zmian jest osobnym obiektem „Zaznaczenie heksa” na liście, bezpośrednio po heksie. Ma własny checkbox zaznaczenia, oko widoczności, blokadę i ikonę. Po wybraniu wszystkie parametry pojawiają się w prawym panelu: X/Y, szerokość/wysokość, zachowanie proporcji i kolor ze wspólnej palety.

Znak można przesuwać, skalować, wyrównywać i zaznaczać razem z innymi obiektami. Domyślnie leży na środku heksa i jest czarny, ale pozycja oraz widoczność są niezależne od heksa. Nie ma dodatkowych przełączników pod podglądem ani ustawień znaku we właściwościach heksa.

Szablon zapisuje elements.hexMark oraz graphicColourIds.hexMark. Dawny zapis hexMark {colourId,size} konwertuje się przy odczycie/zapisie, zachowując kolor i obliczony dotychczasowy rozmiar/położenie. Nie przepisujemy historycznych wersji w bazie. Miniatury pokazują widoczny obiekt tak jak pozostałe grafiki. Stan konkretnego talentu pozostaje tematem jego przyszłego edytora.
2026-11-07: kliknięcie „Otwórz” lub miniatury uruchamia kręciołek i napis „Otwieranie…” na przycisku danego szablonu. Na czas żądania blokowane są ponowne otwarcia i operacje biblioteki, a po błędzie stan wraca do normalnego. Ponowna udana próba odblokowuje również zapis szablonu.

## Obiekt Nieodnawialny — 2026-11-07

Na liście bezpośrednio za Darem Ciemności znajduje się tekstowy obiekt „Nieodnawialny”. Wyświetla stałe słowo „nieodnawialny” (EN: „non-renewable”), domyślnie Linux Libertine 7 pt, pogrubienie i kursywa. Po wybraniu w prawym panelu dostępne są jego własna geometria i typografia. Oko, blokada, proporcje, przesuwanie, zaznaczenie grupowe i wyrównanie działają jak dla pozostałych obiektów.

Zapis: elements.nonRenewable i styles.nonRenewable, niezależnie od wspólnego bloku tytułu/fabuły/mechaniki. Początkowo po prawej od Daru Ciemności; miniatura również pokazuje widoczny napis. Starsze szablony otrzymują domyślny obiekt podczas odczytu/zapisu bez przepisywania dawnych wersji.

2026-11-07: zmniejszono napis do 7 pt i wyśrodkowano tekst w pionie we własnym obszarze. Obszar napisu wyrównany środkiem do Daru Ciemności. Dla tego obiektu minimalna wielkość pisma wynosi 5 pt; pozostałe teksty zachowują swoje ograniczenia.

## Automatyczny rząd za heksem — 2026-11-07

Heks i jego zaznaczenie zachowują własne stałe pozycje. Obecnie za nimi automatycznie układają się Dar Ciemności, następnie „nieodnawialny”. Ukryte elementy nie zajmują miejsca ani odstępu. Koszt, Zagrywka i Zasady specjalne zostaną dodane później, w ustalonej kolejności: Koszt → Zagrywka → Dar Ciemności → Zasady specjalne → Nieodnawialny.

Szablon zapisuje headerRow {x, centerY, gap}. Właściwości rzędu są po prawej po wybraniu jednego z jego elementów. X konkretnego elementu wylicza układ; Y jest niezależne i edytowalne; szerokość, wysokość, kolor, widoczność i typografia nadal należą do obiektu. Przeciąganie i strzałki przesuwają wybrane elementy rzędu tylko w pionie; poziome wyrównania są dla nich wyłączone. Wspólne ustawienia początku rzędu, odstępu i przesunięcia Y pozostają dostępne po prawej. Heks i znak V nie są przesuwane przez zmianę rzędu.

Podgląd, miniatura, parser i serwer stosują te same reguły kolejności; indywidualne Y nie jest nadpisywane. Zapisane X elementów rzędu są normalizowane przy zapisie; Y pozostają osobne. Starszy dokument bez headerRow otrzymuje początek i środek z pozycji Daru Ciemności oraz odstęp 4 pt; wcześniejsze wersje nie są przepisywane. Rząd, który nie mieści się w karcie, nie jest zapisywany; panel prosi o zmniejszenie szerokości lub odstępu. Dla małych dawnych formatów nowo dodawany napis otrzymuje dostępną szerokość lub jest ukryty, gdy miejsca nie ma.

2026-11-07: usunięto wykluczanie widoczności „Pola użyć” / „Raz na scenę”. Oczka sterują oboma obiektami niezależnie, mogą być widoczne jednocześnie, również w miniaturze i po zapisie. Liczba pól 0 ukrywa tylko pola użyć; nie zmienia widoczności „Raz na scenę”.
## Zagrywka — 2026-11-07

Symbol z pliku zagrywka.svg użytkownika dodano jako obiekt play, przed Darem Ciemności. Aktualny rząd: Zagrywka → Dar Ciemności → Nieodnawialny. Koszt i Zasady specjalne nadal do dodania. Grafika ma własne Y, rozmiar, proporcje, blokadę, oko i kolor z palety (domyślnie czarny). X ustala rząd, a ukrycie przesuwa pozostałe elementy w lewo bez luki.

Źródłowy plik w Google Drive bez zmian; w kopii projektu przycięto wyłącznie viewBox do krzywej, usuwając puste marginesy. Zapis elements.play / graphicColourIds.play przez istniejące API. Starsze dokumenty otrzymują domyślny obiekt; jeżeli nowa ikona nie zmieściłaby się w dawnym rzędzie, startuje ukryta, zachowując pozostały układ.

## Zasady specjalne — 2026-11-08

Dodano wektorowy znak special-rules.svg: wąski pionowy owal z wykrzyknikiem, lekko nieregularny obrys zgodny z drukarskim charakterem pozostałych ikon. Bez fontu i zewnętrznych zależności. Domyślnie czarny, 12,6 × 22,1 pt, zachowanie proporcji.

Obiekt specialRules jest po Darze Ciemności, przed Nieodnawialnym. Wybór palety, oko, blokada, rozmiary i Y jak dla innych ikon; X automatyczne, ukrycie nie pozostawia luki. Podgląd i miniatura używają tego samego SVG. Zapis elements.specialRules i graphicColourIds.specialRules; starszy szablon otrzymuje domyślną ikonę lub ukrytą przy braku miejsca. Koszt pozostaje do dodania.

## Kolory tekstu z palety — 2026-11-08

Tytuł, fabuła, mechanika i Nieodnawialny wybierają kolor wyłącznie przez PaletteSelect (próbka/nazwa/HEX). Usunięto dowolny wybór koloru z właściwości tekstu. Styles.*.colourId wskazuje paletę; color pozostaje polem kompatybilności, a serwer wylicza jego RGB z wybranego ID. Podgląd i miniatury odczytują aktualną wartość palety.

Dotychczasowy #181818 nazwano Atramentem, #403466 — Fioletem opowieści. Pozostałe kolory wykryte we wcześniejszych wersjach szablonów dodano lub powiązano z istniejącymi wpisami. Dawne dokumenty otrzymują odwołania przy odczycie bez przepisywania historii. Nieznanego, niezdefiniowanego koloru nie można zapisać.

## Koszt — 2026-11-08

Dodano uproszczony SVG cost.svg inspirowany wzorem użytkownika: nieregularna plama i trzy stosy monet. TemplateCost nakłada cyfrę 0–9, domyślnie białą; tło symbolu domyślnie Błękit Zmroku. Kolory tła symbolu i cyfry wybierane wyłącznie z palety. Cyfra skaluje się wraz z całą ikoną.

Koszt to pierwszy element automatycznego rzędu: Koszt → Zagrywka → Dar Ciemności → Zasady specjalne → Nieodnawialny. Liczba jest edytowalna w lewej kolumnie bezpośrednio przy nazwie Koszt, tym samym polem liczbowym co liczba użyć. Zakres 0–9, zero jest wyświetlane i nie ukrywa obiektu. Oko steruje widocznością niezależnie od wartości. X automatyczne, Y i rozmiary edytowane po prawej.

Zapis elements.cost, graphicColourIds.cost, costValue i costTextColourId. Wartość w szablonie służy jako zapamiętana wartość domyślna/podgląd; przyszły edytor talentu dostarczy wartość konkretnego talentu. Podgląd i miniatura pokazują tę samą cyfrę. Domyślny obszar tekstu Nieodnawialny zwężono z 80 do 50 pt, bez zmiany czcionki, aby rząd mieścił komplet symboli. Ta korekta przy odczycie starych szablonów dotyczy tylko wcześniejszego standardowego tekstu Libertine 7 pt bold italic; inne ustawienia pozostają bez zmian. Nowo dodany koszt startuje ukryty, jeśli niestandardowy dawny rząd nie ma miejsca.

- Ograniczenie dostępności jest osobnym obiektem tekstowym w prawym dolnym rogu (np. „Tylko Mechaniści”), domyślnie 7 pt, pogrubiona kursywa, wyrównanie do prawej, paleta kolorów. Napis jest warstwą nad mechaniką i nie rezerwuje miejsca. Tło pod samym napisem jest zgodne z tłem karty. Brak nachodzenia treści na napis kontrolujemy ręcznie. W szablonie zapisujemy układ i styl, treść próbna nie jest zapisywana jako treść talentu.
- Koszt jest rozdzielony na costAmount (wartość 0–9) i cost (sam symbol). Oba obiekty mają niezależne parametry, widoczność i kolor palety; X ustala rząd. Bieżący wariant Tuszowy używa dwóch stosów monet o różnej wysokości, bez tła i cyfry. Osobny variants/ink/cost.svg oraz CostIcon/InlineCostIcon umożliwiają przyszłe osadzanie samego symbolu w tekście. Wstawianie do treści talentów pozostaje osobnym etapem. Parser i API odczytują stare dokumenty bez przepisywania historii.
- Wartość kosztu jest domyślnie w lewym górnym rogu symbolu, nad niższym stosem. Dwa obiekty zachowują niezależne ustawienia; gdy oba widoczne, automatyczny rząd rezerwuje wspólne miejsce i wyrównuje ich X. Własne Y pozostaje regulowane.
- Przycisk Drukuj / PDF przy podglądzie przygotowuje aktualną kartę do druku w skali 1:1 na A4, bez narzędzi edycyjnych. Zapis PDF przez dialog przeglądarki. Uwzględnia bieżące niezapisane dane przykładowe, osadza fonty i grafiki; nie zmienia geometrii ani przepełnienia tekstu.
- Ramka joined (Tuszowa — do łączenia) pozwala składać karty tego samego formatu bez odstępów: góra/dół i lewy/prawy mają wspólne przebiegi. Atramentowe boki pochodzą z oryginalnej ramki, z przejściami przy narożnikach. Kreskę renderujemy inline poza nominalną granicą komórki, aby sąsiednie ramki nakładały się bez podwajania grubości; tło dopasowane do obrysu. Poprzednie warianty zachowane. Próba 2×2: ../exports/ramka-laczona-2x2.svg.
- Paleta: Atrament zastąpiony Czarnym, Fiolet opowieści zastąpiony Błękitem Zmroku. Stare kolory wycofane z wyboru; dawne ID/HEX kierują do zastępników. Historia dokumentów zachowana bez przepisywania. Nowe style korzystają z czerni i Błękitu Zmroku.

- Warianty graficzne: jeden wybór całego kompletu grafik, z ramką i symbolem kosztu. Jedno pole graphicVariant; stare osobne ustawienia tylko do odczytu zgodności. Każdy wariant w osobnym katalogu z tymi samymi 13 nazwami SVG. Aktualny wybór: Tuszowy (ink). Szczegóły: [Warianty graficzne](Warianty%20graficzne.md).

## Numer wersji na karcie

Element Numer wersji (elements.version, styles.version) jest osobną warstwą tekstową: wybór i zaznaczanie po lewej, geometria oraz styl po prawej, przeciąganie, wyrównanie, blokada i oczko jak dla pozostałych elementów. Domyślnie mały tekst 5 pt przy dolnej lewej krawędzi (X=7, Y=wysokość−9, szerokość min(90, szerokość−14), wysokość 6 pt). Nie rezerwuje miejsca w mechanice.

Kreator i miniatury szablonów pokazują przykład A7K2-M9B4-091126-01. Rzeczywisty versionCode talentu pojawia się na karcie wyłącznie przy eksporcie po zaznaczeniu ID w PDF; wizualizacje w bibliotece i edytorze zawsze go ukrywają. Nowy niezapisany talent oraz niezapisane zmiany nie mają oznaczenia na karcie ani w nazwie PDF, aby nie przypisać szkicowi wcześniejszej wersji. Przykład nie jest zapisywany jako treść szablonu.

Aktualny szablon Talent podstawowy ma włączone pole numeru wersji talentu. Wszystkie przypisane talenty używają aktualnego układu bez ponownego zapisu talentu. Historia szablonu zostaje do audytu; osobny wygląd tworzymy jako nowy szablon. Oczko steruje obecnością pola zarówno w podglądzie, jak i eksporcie.
