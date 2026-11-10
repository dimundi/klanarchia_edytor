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


## 2026-11-10 — Podstawowe Dary Ciemności
- Źródło: Talenty_dary ciemnosci_x.pdf, 20 stron. Zaimportowano strony 1–19; ostatni Cyrograf z tekstem zastępczym pominięto. Grupa Dary Ciemności / podgrupa podstawowe, 19 rekordów, status dev, aktualny szablon Dary Ciemności.
- Przeniesiono tytuły, fabułę, mechanikę i formatowanie stanów, akcje (strony 3, 14, 15, 16), użycia i raz na scenę. Dar Ciemności włączony, ekskluzywność wyłączona, bez ikony kosztu zgodnie z PDF.
- Nowe kody bazowe, historia import_pdf z plikiem, SHA-256 i stroną źródłową. Zapisano body_overflow dla Prymatu potępieńca; pozostałe 18 bez błędów preflight.
- Kopia bazy i 15 tabel: wtf_www/backups/klanarchia-editor/20261110/before-dark-basic-import/. Narzędzia, manifest, mapowanie i próba z rollbackiem: local-scripts/one-off/dark-basic-import-20261110/. Istniejące rekordy porównano i zachowano.


## 2026-11-10 — Talenty ogólne

Źródło: Talenty_ogolne_.pdf, 110 stron, SHA-256 db8b74e235fd757c78cce729095c7e50cfbf092f1174b304fd61bb3e9ca27dd4. Utworzono grupę „talenty ogólne” i wszystkie 11 podgrup według zakresów użytkownika. Zaimportowano 59 nazwanych talentów; pominięto 51 pustych kart z ogólnymi tytułami i tekstem zastępczym. „Hymn Dawnych Dni” i „Mantra stalowego tańca” zachowane jako nazwane, niedokończone materiały z błędami.

| Podgrupa | Talenty |
| --- | ---: |
| Stymulanty | 10 |
| Implanty i protezy | 1 |
| Fetysz i tatuaże | 8 |
| Mantry i pieśni | 4 |
| Pisma i księgi | 4 |
| Relikwie | 0 |
| Techno-sprzęt | 7 |
| Artefakty | 3 |
| Egzopancerz Modliszka | 8 |
| Egzopancerz Kafar | 6 |
| Egzopancerz Pielgrzym | 8 |

Aktualny szablon Talent podstawowy, status dev, historia Import z PDF z plikiem/stroną/hashem i oryginalnymi wartościami kosztów. Przeniesiono formatowanie, akcje, koszt 0–9, heksy, użycia, nieodnawialność i zasady specjalne.

Ograniczenia zapisane jako source_review_required z notatkami:
- Proteza egzorękawicy: główny koszt 4; dodatkowy koszt 3 i towarzyszący znak wymagają obsługi.
- Cesarski dzwon „Karmiciel”: koszt źródłowy 10 przekracza obecne 0–9. Ikonę kosztu wyłączono, źródłowe 10 zachowano w historii i notatce; nie pokazujemy fałszywego kosztu zastępczego. Tekst PDF urwany na „z zamiarem wydarcia jej”; bez dopisywania zakończenia.
- Dodatkowe znaki w tle na stronach 27, 28, 31, 32, 33, 66, 67 nie zostały przeniesione.
- Strony 31 i 34 mają brakujące opisy źródłowe; strony 61/62 rozdzieloną ligaturę „fi ltr”, połączoną podczas importu i oznaczoną do kontroli.

17 talentów ma łącznie 19 zapisanych błędów (4 przepełnienia, 3 brakujące numery stron, 12 raportów kontroli źródła):
- Strona 107: Hak na truchło — page_reference_missing.
- Strona 101: Egzopancerz Pielgrzym — body_overflow.
- Strona 73: Cesarski dzwon „Karmiciel” — page_reference_missing, source_review_required.
- Strona 72: Sztandar Krawędziarzy — body_overflow.
- Strona 67: Eteryczny nadajnik — source_review_required.
- Strona 66: Odrutowany — source_review_required.
- Strona 63: Pyrokapsuła — body_overflow.
- Strona 62: Kolektor iskrowy — source_review_required.
- Strona 61: Filtr nosowy — source_review_required.
- Strona 34: Mantra stalowego tańca — source_review_required.
- Strona 33: Elegia Uzura — source_review_required.
- Strona 32: Dumka “Kwiaty we krwi” — source_review_required.
- Strona 31: Hymn Dawnych Dni — source_review_required.
- Strona 28: Blizny posiekańca — source_review_required.
- Strona 27: Tatuaż Turiela — source_review_required.
- Strona 11: Proteza egzorękawicy — page_reference_missing, source_review_required.
- Strona 4: Dekokt Dagona — body_overflow.

Kopia pełnej bazy i 15 tabel: wtf_www/backups/klanarchia-editor/20261110/before-general-talents-import/. Po wykryciu nowego zapisu użytkownika pierwszą próbę wycofano; odświeżony snapshot records-current.json uwzględnia ten zapis. Następnie próba rollback i commit z porównaniem wszystkich wcześniejszych wierszy, bez nadpisywania ich. Narzędzia/manifesty/pominięte strony/mapowanie: local-scripts/one-off/general-talents-import-20261110/.


## 2026-11-10 — Krew lodowej zmarzliny

Źródło: Talenty_krew_lodowej.pdf, 21 stron, SHA-256 2f2db69ac1cd9a0b52f8e213ab84bd22c5d4d795a3d9be72f54166bd2d674bd0. Nowa grupa Krew lodowej zmarzliny. Import wyłącznie podanych zakresów:

| Podgrupa | Strony | Talenty |
| --- | --- | ---: |
| Lewiatan | 1–3 | 3 |
| Drzewiec | 5–6 | 2 |
| Szaman Żywicokrwistych | 8–9 | 2 |
| Ulepiacz | 11–14 | 4 |
| Sprężysta | 19–21 | 3 |

14 talentów, 7 pustych kart poza zakresami pominięto (4, 7, 10, 15–18). Dar Ciemności na stronach 9, 11, 12, 13: szablon Dary Ciemności; pozostałe 10: Talent podstawowy. Bez ekskluzywności i bez kosztu, zgodnie ze źródłem. Zachowano akcje, pojedynczą zagrywkę, użycia i formatowanie cech/stanów/pogrubień; końcową kropkę fabuły strony 3 przeniesiono z początku mechaniki do fabuły, bez zmiany treści.

Pięć zapisanych source_review_required: strony 1, 6, 8, 9, 12 mają dwa symbole zagrywki, a model pozwala pokazać jeden (zagrywka włączona). Strona 12 ma również dwa pola użyć, których model obecnie nie obsługuje — nie pokazano zastępczej liczby. Faktyczne liczby symboli i pól zachowane w source.symbols historii import_pdf oraz opisane w błędach. Wszystkie 14 tekstów mieści się w aktualnych szablonach.

Kopia SQL i 15 tabel: wtf_www/backups/klanarchia-editor/20261110/before-frozen-blood-import/. Próba rollback, następnie commit z porównaniem wcześniejszych wierszy; poprzednie 424 talenty zachowano, 438 łącznie. Narzędzia, manifest, mapowanie i zrzuty: local-scripts/one-off/frozen-blood-import-20261110/.


## 2026-11-11 — Import Talenty_wyzwan.pdf
- Lokalnie dodano 28 talentów do Splugawieni: Drzewiec 4 (strony 1–4), Wilkołaki 8 (11–18), Technoid 10 (21–30), Koroder 6 (31–36). Pominięto 12 kart wzorcowych. Kolejność w każdej podgrupie 1..N zgodna z PDF.
- Treści i formatowanie, akcje, zaznaczenie heksa, pojedyncze/podwójne zagrywki, użycia oraz trzy ograniczenia dostępności zachowane. Sześć Darów Ciemności korzysta z odpowiedniego szablonu. Historia import_pdf (Import z PDF), plik/hash/strona/symbole.
- Cuchnąca żywica: body_overflow; Zarażenie likantropią: brak numeru strony, zachowano s. xxx i notatkę. Statusy dev.
- Kopia SQL i snapshot: wtf_www/backups/klanarchia-editor/20261111/challenges/. Narzędzia i manifest: wtf_www/local-scripts/one-off/challenges-import-20261111/. Preflight oraz próbny rollback poprawne; import zatwierdzony, odczyt treści/ustawień zgodny, wcześniejsze rekordy wszystkich 15 tabel niezmienione. Bez wdrożenia i zmian starego projektu.
