# Klanarchia_edytor

Nowy edytor online talentów i kart postaci do Klanarchii.

## Założenia

- Projekt rozwijamy osobno w `D:\GIT\Dimundi\Klanarchia_edytor`.
- Doświadczenia z `Klanarchia_karty_postaci` służą do określenia potrzebnych poprawek w nowym edytorze.
- `Klanarchia_karty_postaci` pozostaje 1:1, bez zmian. Część jego funkcji jest nadal używana.
- Ze starego projektu będziemy częściowo przenosić dane i bazę. Zakres oraz sposób przeniesienia ustalimy przed migracją.
- Odczyt materiałów źródłowych nie upoważnia do ich zmieniania ani przenoszenia przez usunięcie ze źródła.
- Nie zakładamy automatycznego kopiowania wszystkich funkcji starej aplikacji.

## Punkt odniesienia

Dokumentacja poprzedniego projektu: `../../Klanarchia_karty_postaci/klanarchiaDoc/start.md`.

Poprzednia aplikacja rozdziela Portal dla graczy i Workshop do przygotowania materiałów. Korzysta z Reacta, TypeScriptu, Webpacka, Dockera i danych JSON. Są to informacje o źródle. Bieżący zakres nowego edytora opisuje `Zakres prac.md`.

## Stan prac

2026-11-05: uruchomiono lokalne środowisko React + TypeScript + Vite oraz osobną wtyczkę WordPressa. Dostępna jest strona startowa „Witaj” z ikonami i skrótami, górne menu oraz puste ekrany poszczególnych modułów. Logo Klanarchii prowadzi do strony Witaj. Wejście przez moduł „Edytor postaci” pozostaje dostępne wyłącznie dla administratora. Uruchamianie, budowanie i wyniki kontroli: `Srodowisko-deweloperskie.md`. Nie wykonano migracji danych ani wdrożenia na produkcję.

2026-11-06: kreator szablonu talentu obsługuje pozycjonowanie i skalowanie elementów, niezależne style trzech części tekstu oraz zapis/odczyt JSON 2 (z konwersją formatu 1), bez bazy danych. Szczegóły: `Kreator szablonu talentu.md`.

Kreator ma ekran wyboru wielu szablonów z miniaturami, otwieraniem i duplikowaniem. Od 2026-11-07 biblioteka szablonów zapisuje wersje w bazie WordPressa. Import wcześniejszych danych z przeglądarki wymaga podglądu i zatwierdzenia; ręczny import i eksport plików JSON usunięto z interfejsu.

## Dokumenty

- `Projekt bazy danych.md` — propozycja modelu danych do omówienia, bez wdrożonych tabel.

- `Zakres prac.md` — ustalany zakres funkcji i architektury.
- `Srodowisko-deweloperskie.md` — uruchamianie, kod i weryfikacja środowiska.

- `PROJEKT.md` — potwierdzone założenia i aktualny stan projektu.
- `AI.md` — roboczy dziennik zmian i kontekst dla kolejnych sesji AI.
- `../AGENTS.md` — instrukcje pracy w projekcie.


## Wspólne style oznaczeń i kolory

- Talent będzie przechowywał oznaczenia fragmentów (np. Aspekt, Cecha), a ich styl będzie wspólny dla wszystkich szablonów. Wielkość czcionki dziedziczy z tekstu szablonu.
- Style wskazują nazwany kolor z jednej palety przez identyfikator. Zmiana koloru aktualizuje korzystające z niego style.
- Lokalnie działa panel „Style i kolory” z paletą, oznaczeniami i podglądem. Od 2026-11-07 zapisuje dane wspólne w bazie WordPressa przez chronione API. Podłączanie oznaczeń do treści talentów pozostaje osobnym etapem.

- Oznaczenie ma osobną nazwę i unikalny znacznik tekstowy. Po zapisie znacznik pozostaje stały; nazwę i wygląd można zmieniać. Obsługiwane są znaczniki [cecha: tekst], [aspekt: tekst], [stan: tekst] oraz *tekst* i **tekst**.
- Gotowe style odtwarzają starą aplikację: Cecha — bold italic; Aspekt — tło #b1b7c6; Stan — small-caps, 600, bez kursywy. Dostępne są kolor tekstu/tła z palety, grubość 400/600/700, kursywa, podkreślenie i kapitaliki.
- Kolor zawiera niezależnie RGB (HEX i kanały 0–255) oraz opcjonalne CMYK (0–100%). CMYK nie zmienia podglądu RGB. Przeliczenie RGB → CMYK bez profilu ICC jest wyłącznie orientacyjne i uruchamiane ręcznie.

2026-11-07: uruchomiono 7 tabel palety, oznaczeń i wersjonowanych szablonów talentów. Procedura i API: [Baza danych](Baza%20danych.md). Bez wdrożenia produkcyjnego i bez zmian starego projektu.

- Podstawowy kolor ramki: „Błękit Zmroku” RGB #3e5074 (oryginalny SVG), zapisany we wspólnej palecie. Dodano również czarny #000000 i biały #ffffff. Ramka wybiera wyłącznie kolor palety, przez frameColourId, bez własnego pola dowolnego HEX. Dotyczy podglądu i miniatur.

- Wszystkie grafiki talentu (ramka, heks, Dar Ciemności, pola użyć, raz na scenę) wybierają kolor przez wspólny komponent z próbkami palety. Dar Ciemności ma domyślnie czarny kolor. Wybory są zapisywane w wersji szablonu i stosowane w miniaturach.

- Lista elementów kreatora: checkboxy zaznaczenia po lewej i ikony widoczności po prawej. Shift + klik pozwala zaznaczać wiele elementów na liście i podglądzie; nad podglądem są narzędzia wyrównania. Wyrównanie i ruch zaznaczenia respektują blokady i obsługują Cofnij.

- Znacznik V pochodzi z oryginalnego checked_v.svg i jest osobnym obiektem „Zaznaczenie heksa” na liście. Ma niezależną geometrię, widoczność, blokadę i kolor z palety. Parametry obiektu pojawiają się wyłącznie w prawym panelu po jego wybraniu.

- „Nieodnawialny” jest niezależnym obiektem tekstowym na liście za Darem Ciemności; domyślnie pogrubiony i kursywą. Ma własny rozmiar, typografię, widoczność i blokadę; jego pozycją zarządza automatyczny rząd za heksem. Ustawienia zapisują się w wersji szablonu.

- Heks i jego zaznaczenie pozostają poza automatycznym układem. Za nimi widoczne elementy rzędu przesuwają się do lewej bez pustych miejsc; obecnie Koszt → Zagrywka → Dar Ciemności → Zasady specjalne → Nieodnawialny. Kolejność docelowa: Koszt → Zagrywka → Dar Ciemności → Zasady specjalne → Nieodnawialny.

- W elementach rzędu X jest automatyczne, a Y regulowane niezależnie dla każdego obiektu (również przeciąganiem i strzałkami). Pola użyć i Raz na scenę nie wykluczają się i mogą być widoczne jednocześnie.

- Symbol Zagrywki pochodzi z pliku użytkownika zagrywka.svg (Google Drive), skopiowanego do projektu. Jest osobnym obiektem play przed Darem Ciemności, z paletą, niezależnym Y i automatycznym X. Domyślnie czarny.

- Ikona Zasad specjalnych to autorski SVG: wąski, lekko nieregularny owal z wykrzyknikiem. Osobny obiekt specialRules po Darze Ciemności, z paletą, własnym Y i automatycznym X.

- Kolory wszystkich tekstów szablonu również wybieramy wyłącznie ze wspólnej palety. Dawne odcienie zastąpiono czernią i Błękitem Zmroku; style zapisują identyfikator koloru, a podgląd korzysta z jego aktualnego RGB.

- Koszt ma uproszczony symbol plamy i monet z cyfrą 0–9. Wartość regulowana bezpośrednio przy pozycji na liście, jak liczba użyć. Kolor symbolu i cyfry z palety; zero pozostaje widoczne, a oko działa niezależnie.

- Ograniczenie dostępności jest osobnym obiektem tekstowym w prawym dolnym rogu (np. „Tylko Mechaniści”), domyślnie 7 pt, pogrubiona kursywa, wyrównanie do prawej, paleta kolorów. Napis jest warstwą nad mechaniką i nie rezerwuje miejsca. Tło pod samym napisem jest zgodne z tłem karty. Brak nachodzenia treści na napis kontrolujemy ręcznie. W szablonie zapisujemy układ i styl, treść próbna nie jest zapisywana jako treść talentu.
- W tuszowym zestawie każde z trzech pól użyć ma własny, stały kontur SVG. Zagrywka zachowuje spiralę z subtelnie nieregularnymi brzegami; oryginalny zestaw pozostaje dostępny.
- Koszt jest rozdzielony na costAmount (wartość 0–9) i cost (sam symbol). Oba obiekty mają niezależne parametry, widoczność i kolor palety; X ustala rząd. Bieżący wariant Tuszowy używa dwóch stosów monet o różnej wysokości, bez tła i cyfry. Osobny variants/ink/cost.svg oraz CostIcon/InlineCostIcon umożliwiają przyszłe osadzanie samego symbolu w tekście. Wstawianie do treści talentów pozostaje osobnym etapem. Parser i API odczytują stare dokumenty bez przepisywania historii.
- Wartość kosztu jest domyślnie w lewym górnym rogu symbolu, nad niższym stosem. Dwa obiekty zachowują niezależne ustawienia; gdy oba widoczne, automatyczny rząd rezerwuje wspólne miejsce i wyrównuje ich X. Własne Y pozostaje regulowane.
- Wartość kosztu używa rysowanych cyfr SVG 0–9 zamiast fontu. Jedynka ma tę samą krzywą co w symbolu Raz na scenę; kolor z palety i własna geometria pozostają regulowane.
- Ikony SVG obu zestawów mają viewBox dopasowane do kształtów, bez celowych pustych marginesów. Proporcje rysunków zachowane; wolne miejsce w obszarze obiektu może wynikać z różnicy jego proporcji względem SVG. Rysunki i ręczne poprawki zachowane.
- Ograniczenie dostępności jest na delikatnej jasnej plamie o nieregularnych krawędziach, bez obramowania; nadal nie rezerwuje miejsca na mechanikę. Twarde spacje obsługuje wspólna reguła Unicode, która nie myli końcowych liter polskich wyrazów z jednoliterowymi słowami.
- Próbny górny pas bieżącego szablonu (wersja 39): wspólny środek ikon, optyczne proporcje i symbole użyć we wspólnym miejscu po prawej. Tekst nadal płynie w jednym bloku. Poprzednie ustawienia zachowane w kopii before-header-arrangement.json oraz historii wersji; przywracanie opisane w AI.md. Kierunek pozostaje do oceny użytkownika.
- Pola użyć i Raz na scenę wykluczają się na właściwym talencie i zajmują to samo miejsce. W kreatorze ich widoczność pozostaje niezależna, aby można było projektować oba symbole jednocześnie.

- Przycisk Drukuj / PDF przy podglądzie przygotowuje aktualną kartę do druku w skali 1:1 na A4, bez narzędzi edycyjnych. Zapis PDF przez dialog przeglądarki. Uwzględnia bieżące niezapisane dane przykładowe, osadza fonty i grafiki; nie zmienia geometrii ani przepełnienia tekstu.
- Ramka joined (Tuszowa — do łączenia) pozwala składać karty tego samego formatu bez odstępów: góra/dół i lewy/prawy mają wspólne przebiegi. Atramentowe boki pochodzą z oryginalnej ramki, z przejściami przy narożnikach. Kreskę renderujemy inline poza nominalną granicą komórki, aby sąsiednie ramki nakładały się bez podwajania grubości; tło dopasowane do obrysu. Poprzednie warianty zachowane. Próba 2×2: ../exports/ramka-laczona-2x2.svg.
- Paleta: Atrament zastąpiony Czarnym, Fiolet opowieści zastąpiony Błękitem Zmroku. Stare kolory wycofane z wyboru; dawne ID/HEX kierują do zastępników. Historia dokumentów zachowana bez przepisywania. Nowe style korzystają z czerni i Błękitu Zmroku.

- Warianty graficzne: jeden wybór całego kompletu grafik, z ramką i symbolem kosztu. Jedno pole graphicVariant; stare osobne ustawienia tylko do odczytu zgodności. Każdy wariant w osobnym katalogu z tymi samymi 13 nazwami SVG. Aktualny wybór: Tuszowy (ink). Szczegóły: [Warianty graficzne](Warianty%20graficzne.md).

- Dostępne są tylko dwa warianty graficzne i katalogi: Oryginalny (original) i Tuszowy (ink). Wycofane tuszowe odmiany odczytujemy jako ink.

## Biblioteka talentów — struktura startowa

Pierwsza grupa: Talenty archetypów. Podgrupy: Egzorcysta, Inkwizytor, Kronikarz, Rzecznik, Siepacz, Szabrownik, Wiedźmiarz, Żarmistrz, Żerca. Hierarchia i sposób pracy zatwierdzone w dokumencie [Biblioteka talentów](Biblioteka%20talentów.md). Zgodnie z poleceniem użytkownika na tym etapie bez kodowania i bez tworzenia tabel lub rekordów grup.
2026-11-09: uruchomiono bibliotekę grup w module Talenty. Drzewo, tworzenie grup/podgrup, zaznaczanie i eksport struktury zapisanej w dwóch nowych tabelach. Dodano Talenty archetypów z dziewięcioma podgrupami. Bez importu treści talentów; ich kreator, historia i eksport kart pozostają kolejnym etapem.

2026-11-09: uruchomiono trwały zapis talentów w bazie WordPressa z wersjami i historią autor/data/zmienione pola. Biblioteka pokazuje zapisane talenty, otwiera je ponownie i zlicza w grupach. Zapamiętywane są treści, oznaczenia, typografia i konkretna wersja szablonu. Bez zmian danych starego edytora, importu i wdrożenia produkcyjnego. Szczegóły: Biblioteka talentów.md oraz Baza danych.md.

## TODO — Asystent Klanarchii

- [ ] Zbudować asystenta AI dla wybranych użytkowników, pomagającego w opracowaniu talentów oraz w korekcie tekstu podręcznika Klanarchii.
- Zakres korekty podręcznika: ortografia, gramatyka, interpunkcja, styl oraz spójność terminologii i zapisów zasad. Wątpliwości dotyczące mechaniki zgłaszać osobno, bez samodzielnego zmieniania reguł.
- Wspólna wiedza asystenta: zatwierdzone materiały, słownik terminów, zasady redakcyjne i przykłady poprawnych talentów oraz korekt. Materiały wersjonowane i uzupełniane świadomie; zatwierdzenie odpowiedzi nie oznacza automatycznego uczenia modelu.
- Propozycje zmian do porównania i zatwierdzenia przez człowieka, z zachowaniem oryginalnego tekstu.
- Planowana integracja przez API, z uprawnieniami wybranych kont WordPressa, kluczem po stronie serwera i limitami użycia. Wybór modelu, koszty oraz sposób pracy nad rozdziałami podręcznika do ustalenia. Historia tej rozmowy nie jest automatycznie dostępna asystentowi w edytorze.

Status: pomysł do realizacji w kolejnym etapie; integracji AI jeszcze nie wdrożono. To osobny zakres od bieżącego sprawdzania pisowni przez przeglądarkę.
