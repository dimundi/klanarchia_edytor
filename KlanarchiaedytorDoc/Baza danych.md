# Baza danych edytora

Stan lokalny, 2026-11-10. Wspólna baza WordPressa, osobne tabele edytora. Bez zmian w produkcji i starym projekcie. Model pozostałych modułów: [Projekt bazy danych](Projekt%20bazy%20danych.md).

## Utworzone tabele

Nazwy mają prefiks `$wpdb->prefix`, nie wpisane na stałe `wp_`.

| Tabela | Zawartość |
| --- | --- |
| `ke_colours` | UUID, RGB, opcjonalne niezależne CMYK, kolejność, archiwizacja, autorstwo, blokada. |
| `ke_colour_texts` | Nazwy kolorów PL/EN. |
| `ke_text_annotations` | UUID, stały unikalny znacznik, dwa odwołania kolorów, grubość, kursywa, podkreślenie, kapitaliki, autorstwo i blokada. |
| `ke_text_annotation_texts` | Nazwy oznaczeń PL/EN. |
| `ke_catalogue_state` | Jeden licznik rewizji wspólnej palety i oznaczeń; blokuje równoległe nadpisanie całego katalogu. |
| `ke_templates` | UUID, rodzaj, nazwa, bieżąca wersja, autorstwo, licznik wersji. Na razie zapisujemy rodzaj `talent_card`. |
| `ke_template_versions` | Niezmienne wersje dokumentu szablonu z autorem i datą UTC. |

Silnik InnoDB, kodowanie WordPressa. Pięć kluczy obcych chroni nazwy, odwołania kolorów i wersje szablonów. Wskaźnik bieżącej wersji szablonu i jej przynależność ustala API w jednej transakcji. Konta i zasoby WordPressa nie otrzymują dodatkowych kluczy obcych.

Dokument szablonu przechowujemy jako `LONGTEXT` z JSON, walidowanym i normalizowanym przez API. Typografii i współrzędnych nie rozbijamy na kolumny. Numer formatu dokumentu to 2, numer schematu bazy to 1 (`ke_schema_version`). W oznaczeniach nie dublujemy `font_weight` kolumną `bold`; pole kompatybilności wylicza API.

## Migracja i dane początkowe

1. Wykonaj kopię lokalnej bazy.
2. Uruchom `migrate-db.bat` przy działającym środowisku edytora. Wywołuje jawne `wp ke migrate --allow-root` w lokalnym kontenerze.
3. Na nowej, pustej bazie uruchom `wp ke seed --user=ID_ADMINA --allow-root` w tym samym kontenerze. Polecenie dodaje znane formatowania i nazwy PL/EN wyłącznie przy niezmienionej, pustej palecie.

Aktywacja wtyczki i wejście na stronę nie tworzą tabel ani nie importują danych. Migracja i inicjalizacja mogą być uruchomione ponownie bez zastąpienia zapisanych materiałów. DDL nie jest transakcyjne; przerwaną migrację należy sprawdzić i ponowić przed użyciem API. Nie ma automatycznej migracji przy uruchamianiu strony.

Kopia sprzed pierwszej migracji: `../../wtf_www/backups/klanarchia-editor/20261107/before-schema.sql` (prywatna, poza Gitem). Wykonana `mysqldump --single-transaction` z kontenera bazy; kontener WordPressa nie zawiera mysqldump. Nie odtwarzać całej bazy jako sposobu cofnięcia pojedynczego rekordu.

## API i panel

Wszystkie trasy pod `/wp-json/klanarchia-editor/v1/` wymagają sesji administratora (`manage_options`) i nonce WordPress REST. Odpowiedzi mają `Cache-Control: no-store, private`. W przeglądarce nie ma danych dostępowych do MySQL.

| Operacja | Trasa |
| --- | --- |
| Odczyt wspólnej palety | `GET catalogue?language=pl` lub `en` |
| Transakcyjny zapis palety | `PUT catalogue?language=pl`, pola `data`, `revision` |
| Biblioteka szablonów | `GET templates?page=1` (50 dokumentów, `hasMore`; klient pobiera kolejne strony) |
| Zapis nowej wersji | `PUT templates/{uuid}`, pola `template`, `revision`; 0 tworzy nowy szablon |
| Zatwierdzony import nowych szablonów | `POST templates/import`, `items` — maks. 50, zapis całej wybranej partii albo żadnego dokumentu |

Konflikt rewizji zwraca 409 i pozostawia szkic w panelu. Błędny dokument nie jest zapisywany. Autorów, czas i numery wersji ustala serwer. Zmiana nazwy oznaczenia nie zmienia znacznika; zapisany znacznik jest niezmienny. Usuwanie oznaczeń oznacza archiwizację; ich znaczenie pozostaje w bazie. Używany kolor, także w zarchiwizowanym oznaczeniu, jest chroniony przed usunięciem.

Paleta i biblioteka szablonów są wspólne, niezależne od konta i komputera. Nazwy palety są przechowywane osobno dla języków; przy braku tłumaczenia API pokazuje dostępną nazwę, bez automatycznego tłumaczenia.

## Dane zapisane wcześniej w przeglądarce

Stare `ke:styles-colors:<userId>` i `ke:talent-templates:<userId>` nie są usuwane ani automatycznie wysyłane. Panel pokazuje opcję podglądu importu.

- Paleta: podgląd nazw, wartości i znaczników; zatwierdzenie scala dane. Zgodna nazwa koloru lub znacznik stylu aktualizuje istniejący wpis, zachowując jego serwerowy UUID. Pozostałe wpisy pozostają bez zmian. Konflikty nazw lub nieaktualna rewizja blokują zapis.
- Szablony: wybór maks. 50 pozycji, podgląd nazw; UUID już obecne w bazie są zablokowane. Import zachowuje UUID, a autor, daty i wersja 1 należą do nowego zapisu serwerowego. Cała partia jest transakcyjna.
- Uszkodzony stary zapis nie jest zastępowany. W kreatorze usunięto wczytywanie i pobieranie plików JSON. „Zapisz” wysyła szablon do bazy, pokazując wskaźnik postępu; przycisk jest zablokowany do zakończenia żądania. Import dawnych danych z przeglądarki pozostaje dostępny po podglądzie.

## Weryfikacja

Przeszły: kompilacja TypeScript/Vite, składnia PHP, ponowna migracja i inicjalizacja, zapis/odczyt w dwóch kontekstach przeglądarki, niezależne RGB/CMYK, niezmienność znaczników, walidacja dokumentów, konflikty rewizji, wersje szablonu z autorem i datą, podgląd i import starej palety/szablonów, rollback nieudanej partii, szerokość mobilna i brak błędów JavaScript. Potwierdzono 7 tabel i 5 kluczy obcych.

Gość, sesja klienta z poprawnym nonce i administrator bez nonce nie mają dostępu do danych. Administrator z nonce otrzymuje odpowiedź; sprawdzono również nazwy EN. Narzędzia lokalne: `../../wtf_www/local-scripts/one-off/editor-database-20261107/`. Materiały QA usunięto po sprawdzeniu wersji, paletę przywrócono. Wpisy autorstwa zachowują wykonane zapisy.

Historia wersji jest zapisywana, ale nie ma jeszcze interfejsu porównania/przywracania. Edytor talentów, podłączenie znaczników do jego treści, karty postaci, zestawy i eksport CMYK pozostają na kolejne etapy.
## Kolory podstawowe i ramka — 2026-11-07

Jawne `wp ke base-colours --user=ID_ADMINA --allow-root` dodaje brakujące kolory: Błękit Zmroku #3e5074, czarny #000000 i biały #ffffff. Ponowienie nie zastępuje danych. Polecenie `ke seed` również uzupełnia te kolory. Błękit ma na razie nieokreślone CMYK; czarny 0/0/0/100, biały 0/0/0/0.

Dokument szablonu ma `frameColourId` wskazujące UUID palety. Starsze dokumenty bez pola dziedziczą stały UUID Błękitu Zmroku (`3e507400-0000-4000-8000-000000000001`). API sprawdza dostępność koloru, a zapis szablonu współdzieli blokadę katalogu, aby nie zapisać odwołania równolegle z archiwizacją koloru. Koloru używanego w jakiejkolwiek wersji szablonu nie można zarchiwizować; obejmuje to domyślny kolor starszych dokumentów. Zmiana RGB nadal aktualizuje wygląd bieżących podglądów. Nie wymagało to dodatkowych tabel ani migracji DDL.

Dokument szablonu zawiera również graphicColourIds: hex, gift, uses, once. Każde pole wskazuje UUID z palety. Brak całego pola w starszym dokumencie oznacza czarny dla Daru Ciemności i Błękit Zmroku dla pozostałych ikon. Serwer waliduje wszystkie odwołania; ochrona archiwizacji koloru obejmuje również te cztery pola i ich historyczne/domniemane wartości. Bez dodatkowych tabel i zmian DDL.

Zaznaczenie heksa jest osobnym obiektem: elements.hexMark (geometria, widoczność, blokada, proporcje) i graphicColourIds.hexMark (UUID palety). Stary zapis hexMark {colourId,size} jest odczytywany i normalizowany do nowego formatu bez przepisywania dawnych wersji; domyślnie środek heksa, czarny i rozmiar 90% krótszego boku. API waliduje kolor i chroni wszystkie historyczne odwołania. Bez nowych tabel i DDL.

Obiekt nonRenewable zapisuje geometrię i widoczność w elements.nonRenewable oraz własny styl w styles.nonRenewable. Walidacja obejmuje typografię i granice karty. Brak pól w dawnym dokumencie uzupełniany jest domyślnym napisem bold italic 9 pt za Darem Ciemności. Bez zmian DDL i nowych tabel.

headerRow w dokumencie szablonu przechowuje x, centerY i gap (0–30 pt). Serwer wylicza X widocznych gift/nonRenewable kolejno od lewej, zachowuje indywidualne Y, pomijając ukryte elementy, i odrzuca rząd wychodzący poza kartę. Bez pola w dawnym zapisie przyjmuje start/środek z geometrii gift i odstęp 4 pt. Rozmiary i pozostałe parametry elementów pozostają niezależne. Heks i hexMark nie uczestniczą w układzie. Bez nowych tabel i DDL.

Widoczność elements.uses i elements.once jest niezależna — oba mogą być true. API i miniatura nie narzucają wykluczania. Indywidualne Y obiektów rzędu jest zapisywane w geometrii bez ponownego centrowania przy odczycie.

Zagrywka zapisuje się jako elements.play oraz graphicColourIds.play. Dołączono ją przed gift do normalizacji rzędu i ochrony kolorów. Starsze dokumenty otrzymują czarny symbol 22,1 × 22,1 pt (dopasowany do strony); przy braku miejsca domyślnie ukryty. Bez nowych tabel i DDL.

Zasady specjalne: elements.specialRules oraz graphicColourIds.specialRules. Normalizacja rzędu: play → gift → specialRules → nonRenewable. Starsze dokumenty bez nowych ikon otrzymują wartości domyślne; przy braku miejsca ukrywane są tylko dodawane domyślnie elementy. Walidacja kolorów i ochrona historycznych odwołań obejmuje specialRules. Bez zmian DDL.

Teksty: styles.title/flavor/mechanics/nonRenewable.colourId jest odwołaniem do palety. styles.*.color służy kompatybilności; dla poprawnego colourId API zwraca aktualne RGB z bazy, ignorując dowolną wartość koloru przesłaną jako cache. Dla dawnego HEX używa ke_legacy_text_colour_map lub dopasowania istniejącego RGB. Brak koloru w palecie blokuje zapis. Ochrona archiwizacji uwzględnia odwołania tekstowe i dawne kolory we wszystkich wersjach.

Jawne wp ke text-colours --user=ID_ADMINA inicjalizuje Atrament #181818, Fiolet opowieści #403466 oraz brakujące odcienie dotychczasowych tekstów; zachowuje istniejące wpisy. ke seed również uruchamia tę inicjalizację. Nie przepisuje wcześniejszych wersji szablonów. Bez nowych tabel i DDL.

Koszt: elements.cost i graphicColourIds.cost oraz costValue (liczba całkowita 0–9, domyślnie 0) i costTextColourId (UUID palety, domyślnie biały). API waliduje zakres/całkowitość, kolory i granice karty; ochrona historii obejmuje oba kolory symbolu. Dawny dokument otrzymuje domyślne ustawienia bez przepisywania wersji. Brak miejsca oznacza ukrycie tylko dodawanego domyślnie kosztu; standardowy dawny obszar Nieodnawialny 80 pt przy 7 pt Libertine bold italic zostaje ograniczony do 50 pt. Bez DDL.

- Ograniczenie dostępności jest osobnym obiektem tekstowym w prawym dolnym rogu (np. „Tylko Mechaniści”), domyślnie 7 pt, pogrubiona kursywa, wyrównanie do prawej, paleta kolorów. Napis jest warstwą nad mechaniką i nie rezerwuje miejsca. Tło pod samym napisem jest zgodne z tłem karty. Brak nachodzenia treści na napis kontrolujemy ręcznie. W szablonie zapisujemy układ i styl, treść próbna nie jest zapisywana jako treść talentu.
- Koszt jest rozdzielony na costAmount (wartość 0–9) i cost (sam symbol). Oba obiekty mają niezależne parametry, widoczność i kolor palety; X ustala rząd. Bieżący wariant Tuszowy używa dwóch stosów monet o różnej wysokości, bez tła i cyfry. Osobny variants/ink/cost.svg oraz CostIcon/InlineCostIcon umożliwiają przyszłe osadzanie samego symbolu w tekście. Wstawianie do treści talentów pozostaje osobnym etapem. Parser i API odczytują stare dokumenty bez przepisywania historii.
- Ramka joined (Tuszowa — do łączenia) pozwala składać karty tego samego formatu bez odstępów: góra/dół i lewy/prawy mają wspólne przebiegi. Atramentowe boki pochodzą z oryginalnej ramki, z przejściami przy narożnikach. Kreskę renderujemy inline poza nominalną granicą komórki, aby sąsiednie ramki nakładały się bez podwajania grubości; tło dopasowane do obrysu. Poprzednie warianty zachowane. Próba 2×2: ../exports/ramka-laczona-2x2.svg.
- Paleta: Atrament zastąpiony Czarnym, Fiolet opowieści zastąpiony Błękitem Zmroku. Stare kolory wycofane z wyboru; dawne ID/HEX kierują do zastępników. Historia dokumentów zachowana bez przepisywania. Nowe style korzystają z czerni i Błękitu Zmroku.

- Warianty graficzne: jeden wybór całego kompletu grafik, z ramką i symbolem kosztu. Jedno pole graphicVariant; stare osobne ustawienia tylko do odczytu zgodności. Każdy wariant w osobnym katalogu z tymi samymi 13 nazwami SVG. Aktualny wybór: Tuszowy (ink). Szczegóły: [Warianty graficzne](Warianty%20graficzne.md).

## Zapis talentów — wdrożony lokalnie 2026-11-09

Jawna migracja `wp ke talents-init --user=1 --allow-root`, po wcześniejszej inicjalizacji katalogu i biblioteki. Oddzielna opcja ke_talents_schema_version=2 (od migracji kodów); wersji katalogu i biblioteki nie zmieniono. Migracja jest powtarzalna, bez seedowania talentów i bez automatycznego wykonania na stronie.

Cztery nowe tabele z prefiksem WordPressa, InnoDB:

| Tabela | Bieżąca zawartość |
| --- | --- |
| ke_talents | Unikalny stały code CHAR(9) w formacie XXXX-XXXX (zastępuje UUID), podgrupa, wskaźnik aktualnej wersji, lock_version, daty i autorzy utworzenia/zmiany, archived_at |
| ke_talent_versions | Talent, wewnętrzny numer rewizji, version_day DATE i day_serial, FK szablonu template_id; dawne template_version_id wyłącznie do audytu, schema_version=1, dokument ustawień, data i autor; unikalne talent_id/version_no i talent_id/version_day/day_serial |
| ke_talent_texts | Wersja, język PL/EN, tytuł, fabuła, mechanika ze znacznikami, ograniczenie dostępności; unikalne version/language |
| ke_talent_events | Talent, autor/czas, create/save/import_pdf, wersja przed/po, lista zmienionych pól i podgrupa |

Dokument ustawień przechowuje templateId (bez przypięcia rewizji), flags (hexMark/cost/play/gift/specialRules/nonRenewable), action, usage (none/mission-one/mission-three/once), cost 0–9, letterSpacing (tytuł/fabuła/mechanika, null lub -2…10), lineHeight (fabuła/mechanika, null lub .75…3). To dokument w bazie, bez osobnych plików JSON. W tym pierwszym zapisie parametry mechaniczne również są w dokumencie; ewentualne wydzielenie do kolumn na potrzeby filtrowania pozostaje dalszym etapem projektu danych.

Wersje i zdarzenia są dopisywane atomowo w jednej transakcji. Treści pozostałych języków kopiowane do nowej wersji bez zmian. Autor/czas wyłącznie z serwera i sesji WP. Blokada i oczekiwana rewizja zabezpieczają przed utratą równoczesnych zmian (409). Siedem nowych kluczy obcych chroni odwołania kategorii, talentów, szablonów i historii. Wskaźnik aktualnej wersji utrzymuje kod transakcyjny.

API pod klanarchia-editor/v1, wyłącznie manage_options i nonce:

- GET talents?category=UUID&language=pl&page=1 — podgrupa lub grupa z potomkami, stronicowanie po 100.
- GET talents/{code}?language=pl — dane i aktualny przypisany szablon. Brak tłumaczenia zwraca puste treści, bez kopiowania fallbacku.
- PUT talents/UUID?language=pl — oczekiwana revision, categoryId, content, settings.
- GET talents/UUID/history?page=1 — wersje, autorzy, czasy i zmienione pola, po 100.

Kategorie zwracają rzeczywiste talentCount, z sumą podgrup dla rodzica. Walidowane są długości, typy, zakresy, istnienie podgrupy/wersji szablonu oraz znane znaczniki mechaniki. Brak edycji historii i publikacji w tym etapie. Preferencje płótna nie są danymi talentu.

Kopia bazy przed zmianą: wtf_www/backups/klanarchia-editor/20261109/before-talent-save/database.sql. Testy zapisu/otwierania, konfliktów, błędów sieci, historii, języków i uprawnień przeszły. Usunięto wyłącznie rekord QA; brak zaimportowanych talentów. Produkcja i stary projekt bez zmian.

## Raporty błędów talentów — 2026-11-09

Dodano ke_talent_checks i ke_talent_issues z dwoma FK, bez zmiany istniejących wersji treści. Jawna inicjalizacja `wp ke talent-checks-init --user=1 --allow-root`, osobna wersja schematu 1. Raport wersja/język ma stan kontroli, rewizję katalogu/silnika i indeksowane kody błędów. Opis tabel, API i unieważniania wyników: [Błędy talentów](Błędy%20talentów.md). Kopia bazy przed zmianą: wtf_www/backups/klanarchia-editor/20261109/before-talent-errors/database.sql.

Korekta wcześniejszej walidacji: brak tytułu i nieznany znacznik są błędami redakcyjnymi zapisywanego szkicu. Nie blokują zapisu. Typy, zakresy, powiązania i kontrola rewizji nadal walidowane rygorystycznie.

## Stałe kody i datowane wersje — 2026-11-09

Talent ma jeden publiczny identyfikator, np. A7K2-M9B4. Osiem losowych znaków z ABCDEFGHJKLMNPQRSTUVWXYZ23456789, rozdzielonych po czterech; bez I/O/0/1. Kod nadawany na serwerze raz i niezmieniany po edycji, zmianie nazwy ani podgrupy. Unikalny indeks obejmuje także archiwalne talenty; archiwizacja zachowuje rezerwację kodu. Nie ma już kolumny UUID talentu. Numeryczne klucze techniczne i FK pozostają, a UUID innych typów danych są niezależne od tej zmiany.

Oznaczenie wersji: A7K2-M9B4-091126-01. Data ddmmyy i kolejny zapis tego talentu danego dnia; minimum dwie cyfry licznika (po 99: 100), reset na 01 nowego dnia. Wspólne dla zapisów PL/EN talentu. Datę wyznacza serwer ze znacznika UTC w strefie Europe/Warsaw, niezależnie od przeglądarki i języka. W bazie osobno version_day YYYY-MM-DD i day_serial; versionCode składa API. Zachowany version_no/revision służy kolejności historii i ochronie przed nadpisaniem, nie jest drugim publicznym kodem. Kontrola błędów bez zmiany treści nie przydziela nowego oznaczenia.

Kod i licznik przydzielane w transakcji pod istniejącą blokadą katalogu; unikalne indeksy chronią przed kolizjami. Odczyt, zapis, historia i kontrola błędów adresują kod bazowy. Do przyszłej integracji Roll20 przekazujemy sam kod XXXX-XXXX; integracji jeszcze nie wdrożono. Lista, edytor, historia i nazwa eksportowanego PDF pokazują pełne oznaczenie wersji.

Jawna migracja: wp ke talent-codes-init --user=1 --allow-root (także wykonywana przez ke talents-init). Schemat talentów 1 → 2; pozostałe numery schematów bez zmian. Backfill zachowuje kody już nadane w przerwanym przebiegu; daty/liczniki starszych wersji wyznacza kolejność created_at/id. DDL etapowe i powtarzalne; bez automatycznej migracji po wejściu na stronę. Istniejącym 81 talentom przypisano nowe kody i oznaczenia oryginalnego zapisu z PDF; nie utworzono nowych wersji treści.

Kopia w wtf_www/backups/klanarchia-editor/20261109/before-talent-codes/: database.sql, records.json i code-map.json (stary UUID → nowy kod i wewnętrzny ID). Nie przechowujemy aliasów UUID w aktywnej bazie ani API. Mapa służy kontroli migracji i ewentualnemu wycofaniu, poza Gitem. Narzędzia i testy w local-scripts/one-off/talent-codes-20261109/. Stary projekt i jego kody wysyłkowe pozostają nienaruszone; przyszły import takich talentów powinien zachować istniejące kody i sprawdzić konflikty.

## Pole numeru wersji w szablonie

Dokument szablonu 2 obsługuje elements.version (geometria/widoczność/blokada/proporcje) i styles.version (niezależny styl, minimum 5 pt, wyłącznie kolor palety). Zapis i walidacja klient/serwer; kolor pola objęty ochroną przed archiwizacją, również w historycznych szablonach. Brak migracji tabel: starszy dokument otrzymuje ukryty element i styl 5 pt podczas odczytu, bez przepisywania wersji. TemplateVersion renderuje lokalnymi fontami SVG rzeczywisty kod talentu, a w kreatorze przykład.

W szablonie Talent podstawowy zapisano wersję 45 z włączonym polem. Historia 44 starszych dokumentów zachowana do audytu; talenty korzystają z aktualnego układu. Kopia sprzed zapisu w wtf_www/backups/klanarchia-editor/20261109/before-template-version-label/: database.sql oraz template.json.

## Podglądy kafelków biblioteki

GET talents zwraca obok items/hasMore tablicę templates: unikalne aktualne dokumenty szablonów używanych na danej stronie listy. Klient wiąże je po settings.templateId, bez odczytu każdego talentu osobno. Rewizja służy kontroli zmian i unieważnianiu pamięci podglądu, nie przypięciu wyglądu. Brak nowych tabel, migracji i zapisywania podglądów do bazy.

## Status talentu — schemat 3 (2026-11-10)

Jawna migracja `wp ke talent-status-init --user=1 --allow-root` (również w talents-init) dodaje do ke_talent_versions kolumnę status VARCHAR(16), domyślnie dev. Dotychczasowe talenty i ich starsze wersje otrzymały dev jako wartość początkową, bez tworzenia nowych wersji treści. ke_talents_schema_version=3. Powtórzenie migracji niczego nie przepisuje; migracja kodów rozpoznaje również schemat 3. Kopia przed migracją: wtf_www/backups/klanarchia-editor/20261110/before-talent-status/database.sql.

API GET listy/talentu zwraca status; POST/PUT przyjmuje dev, toCheck, approved, delete. Status jest wspólny dla języków, niezależny od validation.status. Pominięcie pola zachowuje aktualny status istniejącego talentu; nowy otrzymuje dev. Błędny kod jest odrzucany. Zmiana wymaga Zapisz i tworzy wersję z dotychczasową kontrolą revision. talent_events.changes zawiera pole status oraz from/to; historia zwraca statusChange. delete jest obecnie odwracalnym oznaczeniem Wycofany, bez kasowania danych ani użycia archived_at; oddzielny widok archiwum pozostaje do wykonania.

### Usuwanie pustej podgrupy

DELETE talent-categories/{uuid}, wyłącznie administrator z nonce. Transakcja z tą samą blokadą katalogu co tworzenie kategorii i zapis talentu; serwer odrzuca grupę główną (400), brakującą podgrupę (404), dowolny talent w podgrupie lub potomne kategorie (409). Kontrola obejmuje także wycofane i zarchiwizowane talenty. Dopiero po kontroli usuwa nazwy PL/EN i pusty rekord kategorii; FK pozostają aktywne. Bez migracji schematu.

## Aktualny szablon talentu — schemat 4

Obowiązująca zasada: talent wskazuje szablon i zawsze używa jego aktualnego dokumentu. Oddzielny wygląd to osobny szablon. Rewizje szablonów są wyłącznie historią audytową i kontrolą równoległych zapisów, nie wyborem układu na talencie.

Jawna migracja `wp ke live-templates-init --user=1 --allow-root` (także talents-init): talent_versions.template_id NOT NULL z FK do templates, wypełnione na podstawie dotychczasowych odwołań. Dawne template_version_id i surowe dokumenty pozostają nietknięte jako ślad audytowy. Przy nowym zapisie template_version_id zapamiętuje jedynie techniczny stan szablonu w chwili zapisu; renderer nie używa go do ustalania wyglądu. W nowych ustawieniach wyłącznie templateId; dawne templateRevision usuwane z odpowiedzi API bez przepisywania historii JSON.

GET rekordu i listy wiąże template_id z templates.current_version_id. API przy zapisie ustala bieżący szablon po templateId, nigdy po wskazanej przez klienta starej rewizji. Zapis szablonu nie tworzy nowych wersji talentów.

Schemat raportów 2: talent_checks.template_version_id wskazuje układ, który rzeczywiście sprawdzono. Dawne raporty dostają historyczny znacznik, bez zmiany poprzednich kolumn. Raport jest stale po zmianie szablonu, a otwarcie talentu przelicza go bez zapisu treści. validation.templateId/templateRevision służą wyłącznie kontroli świeżości diagnostyki; nie są przypięciem wyglądu. Raport ze starego układu odrzucany 409; starszy klient bez znacznika nie może oznaczyć układu jako kompletnie sprawdzonego.

Edytor aktualizuje szablony po zapisie kreatora i powrocie do okna; przed zapisem/PDF ponownie sprawdza bieżący dokument i czeka na gotowy podgląd. Kafelki korzystają z aktualnej rewizji w kluczu pamięci. Kopia: wtf_www/backups/klanarchia-editor/20261110/before-live-templates/ (database.sql, records.json). Audyt potwierdził 118 talentów, w tym 82 wcześniej zamrożone na starym wyglądzie, bez zmian ich treści, kodów, rewizji i historii.
