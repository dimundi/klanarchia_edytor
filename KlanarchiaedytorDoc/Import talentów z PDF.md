# Import talentów z PDF

## Talenty archetypów — 2026-11-09

Lokalnie zaimportowano 81 talentów PL z Talenty_archetypu.pdf (90 stron). Pominięto puste strony 10, 20, …, 90. Bloki po 9 talentów przypisano kolejno: Egzorcysta, Szabrownik, Wiedźmiarz, Siepacz, Rzecznik, Kronikarz, Żerca, Żarmistrz, Inkwizytor.

Na polecenie użytkownika zastąpiono dotychczasowy 1 talent wraz z jego wersjami i raportami. Grupy, szablony, style i kolory zachowano. Nowe talenty mają wersję 1, szablon Talent podstawowy / 44 oraz wpis historii Import z PDF. Zdarzenie przechowuje nazwę pliku, SHA-256 i numer strony źródłowej. Lista w podgrupie zachowuje kolejność PDF do czasu kolejnych zapisów (obecne sortowanie według daty edycji).

Przeniesiono tytuł, fabułę, mechanikę, oznaczenie akcji i użycia. Usunięto techniczne dzielenie wyrazów z końców wierszy; zachowano właściwe łączniki, liczby i treść źródła. Pogrubienia, cechy, stany oraz podświetlone aspekty przełożono na istniejące znaczniki. Źródło i stary projekt bez zmian; bez automatycznego tłumaczenia EN.

## Zapisane błędy

- Brak numeru strony: Dzikie zaklęcie (23), Szkaradny Mlaskacz (29), Poplecznicy (44), Moc trucheł (61), Algorytm życia (72). Odniesienia zachowano dokładnie, także czarne i z nietypową interpunkcją. Kod page_reference_missing jest ponownie obliczany z treści; znika po zastąpieniu xxx numerem.
- Teza omni-maszyny (75): body_overflow w bieżącym szablonie. Bez samoczynnego zmniejszania pisma ani skracania tekstu.
- Skryba nekrorytów (54): source_review_required. Źródło zawiera urwany fragment „do rytuałów, analizowaniu paktów, odczytywaniu grimuarów itp.”. Zachowano go bez dopowiadania zasad. Uwaga pochodzi z historii importu i pozostaje przy ponownej kontroli; edycja mechaniki usuwa zgodność z hashowaną wersją wymagającą sprawdzenia.
- Zatuszowanie sprawy (49): w tekście PDF jest symbol monet. Zachowano jawny znacznik [ikona-kosztu: koszt], obecnie oznaczany unknown_annotation. Obsługa grafiki wewnątrz tekstu pozostaje w T-05; symbol nie został pominięty ani zastąpiony wymyśloną zasadą.

Łącznie 8 talentów z błędem, po jednym błędzie na talent. Wszystkie 81 przeszły kontrolę składu lokalnymi fontami i mają raport checked; checked nie oznacza braku błędów.

## Kopie i narzędzia

W wtf_www: backups/klanarchia-editor/20261109/before-pdf-import/database.sql (pełna baza) i records.json (tabele talentów oraz powiązania). Narzędzia, kopia PDF, ekstrakcja z fontami/kolorami/obszarami aspektów, arkusze kontrolne, manifest i UUID: local-scripts/one-off/talent-pdf-import-20261109/. Katalogi są ignorowane przez Git.

Import jednorazowy w transakcji: najpierw sprawdzanie wszystkich rekordów i stanu bazy, następnie usunięcie talentów, zapis, odczyt porównawczy i kontrola liczników. Próba została wycofana przed właściwym zatwierdzeniem. Nie uruchamiać ponownie skryptu na zmienionej bazie; zabezpieczenie porównuje dane z kopią sprzed importu. Ewentualny rollback ma przywrócić wyłącznie tabele talentów z kopii records.json w transakcji, po kopii aktualnego stanu; nie zastępować całej bazy WordPressa.

## Talenty frakcji — 2026-11-10

Dodano 36 talentów PL z Talenty_frakcje.pdf (40 stron), bez usuwania dotychczasowych. Nowa grupa Talenty frakcji, podgrupy w kolejności Soldaci, Mechaniści, Hanzyci, Rytualiści — po 9 talentów. Pominięto 10, 20, 30, 40: strony 20/30 mają tekst przekreślonych talentów, ale zgodnie z poleceniem są kartami do pominięcia, nie dodatkowymi rekordami.

Wersja początkowa 1, status dev, aktualny Talent podstawowy / 45. Odczytano wszystkie 36 wartości kosztu (również 0), pola użyć/raz na scenę, zaznaczenie heksa Pisany bluzg, akcje, fabułę/mechanikę, cechy/aspekty/stany i pogrubienia. Techniczne łamanie wyrazów usunięte, bez przerabiania zasad. Historia Import z PDF przechowuje nazwę, SHA-256, stronę, autora i datę; nowe krótkie kody z oznaczeniem wersji.

Cztery talenty z błędami:

- Doraźny wierzchowiec (8): body_overflow, page_reference_missing, unknown_annotation — symbol kosztu w treści zachowany jako [ikona-kosztu: koszt].
- Wzniesienie sztandaru (9): body_overflow.
- Prototypowy egzopancerz (19): page_reference_missing, unknown_annotation — drugi symbol kosztu w treści.
- Wsparcie floty (29): page_reference_missing.

Łącznie 7 zgłoszeń na 4 talentach; nie skracano treści ani nie dobierano samodzielnie numerów stron. Wykrywanie braków rozszerzone o odnośnik s. xxx. bez nawiasów. Symbole w tekście pozostają w T-05.

Pełna kopia i migawka 15 tabel w wtf_www/backups/klanarchia-editor/20261110/before-factions-import/. Narzędzia, PDF, manifest, arkusze wszystkich stron, raport i mapa kodów: wtf_www/local-scripts/one-off/talent-factions-import-20261110/. Próba w transakcji wycofana przed właściwym dopisaniem; ochrona SHA-256 przed powtórzeniem oraz porównanie wszystkich istniejących wierszy. Audyt potwierdził zachowanie 82 wcześniejszych talentów i powiązań, 118 łącznie po imporcie.

Sprawdzono API wszystkich 36 rekordów: treść, ustawienia, koszty, status, rewizja i kolejność. UI dla stron 1/4/8/9/14/19/29/36: podgląd, zero kosztu, heks, akcja, formatowania, błędy i historia; brak błędów JS. Trwałość i usuwanie błędów numeracji po korekcie sprawdzone w wycofanej transakcji dla trzech odnośników. Źródło i stary projekt bez zmian, brak wdrożenia.

## Aktualizacja 2026-11-10 — symbole kosztu obsługiwane

Znaczniki w Zatuszowaniu sprawy, Doraźnym wierzchowcu i Prototypowym egzopancerzu renderują już monety. Odświeżono ich raporty bez zmiany treści i rewizji; unknown_annotation zniknął. Zatuszowanie sprawy ma raport bez błędów; pozostałe dwa zachowują page_reference_missing. Doraźny wierzchowiec po zastąpieniu długiego znacznika symbolem mieści się w ramce, więc jego body_overflow również zniknął. Wcześniejsze liczby błędów w rozdziałach importów opisują stan w chwili importowania.
