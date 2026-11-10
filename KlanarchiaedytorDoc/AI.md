# Dziennik AI

Plik dla asystenta: zapis wykonanych zmian, wyników weryfikacji i kontekstu potrzebnego przy dalszej pracy. Nie zapisujemy tu haseł, sekretów ani danych osobowych.

## 2026-11-05 — Utworzenie dokumentacji

- Utworzono `PROJEKT.md`, `AI.md` i `AGENTS.md`.
- Obowiązująca nazwa i katalog: `Klanarchia_edytor` (wcześniej w rozmowie pojawiła się pisownia `Klanarchoa_edytor`).
- Przeczytano `AGENTS.md` oraz dokumentację `klanarchiaDoc` w projekcie `Klanarchia_karty_postaci`. Nie przeprowadzono audytu implementacji.
- Użytkownik potwierdził: stary projekt ma zostać 1:1, ponieważ nadal używa części jego funkcji. Będziemy z niego częściowo kopiować dane i bazę do nowego projektu.
- Nie zmieniono starego projektu. Nie wykonano migracji ani wdrożenia.
- Weryfikacja: sprawdzenie obecności i treści trzech nowych plików; zmiana dotyczy wyłącznie dokumentacji.
- Kolejny temat: zebrać od użytkownika konkretne poprawki wynikające z doświadczeń ze starym edytorem. Nie przyjmować wcześniejszej technologii i zakresu funkcji jako zatwierdzonych dla nowego projektu.

## 2026-11-05 — Przeniesienie dokumentacji

- Utworzono katalog `KlanarchiaedytorDoc` i przeniesiono do niego `PROJEKT.md` oraz `AI.md`.
- `AGENTS.md` pozostawiono w katalogu głównym. Zapisano w nim zasadę przechowywania pozostałych plików Markdown w katalogu dokumentacji.
- Poprawiono odwołania do przeniesionych dokumentów, instrukcji AI i dokumentacji projektu źródłowego.

## 2026-11-05 — Środowisko i pierwsza aplikacja

- Dodano React, TypeScript, Vite, plik blokady zależności, wtyczkę WordPressa, nakładkę Compose oraz skrypty startu i kompilacji.
- Uruchomiono lokalny WordPress i usługę `editor`. Wtyczkę zamontowano z tego projektu i aktywowano lokalnie; plików repozytorium `wtf_www` ani treści zajawki w bazie nie zmieniono.
- Przycisk w module postaci i aplikacja wymagają `manage_options`. API sprawdza sesję i uprawnienia. Konfiguracja aplikacji zawiera język i nonce REST.
- Usunięto reinstalację zależności ze skryptu kompilacji, ponieważ zakłócała pracę Vite korzystającego z tego samego wolumenu. Serwer ma kontrolę gotowości.
- Weryfikacja: Compose, PHP, TypeScript/build, przeglądarka (administrator/klient/gość, interakcja, nagłówek/stopka, szerokość 320 px, słownik EN) i ładowanie manifestu buildu przez PHP.
- Test EN podmienia wyłącznie konfigurację aplikacji w przeglądarce. Przechwytywanie całej odpowiedzi HTTP powodowało blokadę dostępu do loopback w Chrome; zastąpiono je zmianą konfiguracji w DOM. Stron EN nie publikowano.
- Instrukcja pracy: `Srodowisko-deweloperskie.md`. Nowe tabele, migracje i funkcje edytowania pozostają na dalsze etapy. Stary projekt pozostaje bez zmian; produkcji nie wdrażano.

## 2026-11-05 — Szerokość obszaru roboczego

- W `src/style.css` usunięto limit 1100 px dla aplikacji. Obszar roboczy zajmuje dostępną szerokość z marginesami po 16 px.
- Weryfikacja: kompilacja TypeScript i Vite przeszła poprawnie; zaktualizowano build wtyczki.

## 2026-11-05 — Oznaczenie aktualnego widoku

- Na polecenie użytkownika zmieniono polski nagłówek aplikacji na „Edytor postaci 2”, aby rozpoznać aktualną wersję w przeglądarce.
- Weryfikacja: kompilacja TypeScript/Vite zakończona poprawnie.

## 2026-11-05 — Naprawa odświeżania zmian w Dockerze

- Zdiagnozowano stary nagłówek i szerokość: Vite zwracał z cache stare transformacje, ponieważ nie odbierał zdarzeń zmian plików z Windowsa.
- Włączono `server.watch.usePolling` z interwałem 300 ms i zrestartowano usługę `editor`.
- Sprawdzono aktualne odpowiedzi HTTP oraz wykrycie tymczasowej zmiany CSS bez restartu; plik przywrócono po teście.
- Przeglądarka potwierdziła nagłówek „Edytor postaci 2” i szerokość aplikacji 1248 px przy oknie 1280 px, czyli marginesy po 16 px.

## 2026-11-05 — Pierwszy widok z menu

- Zastąpiono ekran Hello world pustym obszarem roboczym z bocznym menu. Domyślny widok: „Projektowanie → Talenty”.
- Dodano sześć pozycji zgodnych z ustalonym menu, słowniki PL/EN, aktywną pozycję, przejścia przez hash adresu i obsługę Wstecz. Na telefonie menu jest zwijane i zamyka się po wyborze widoku.
- Sekcja projektowania pojawia się po potwierdzeniu uprawnień przez API. Dotychczasowa serwerowa blokada całego edytora dla osób bez praw administratora pozostaje aktywna.
- Obszary poszczególnych widoków są puste. Nie dodano funkcji edycji ani tabel bazy.
- Weryfikacja: build TypeScript/Vite; przeglądarka — sześć przejść, Wstecz, nagłówek/stopka, brak przewijania poziomego na desktopie i przy 320 px, menu mobilne, EN i brak błędów JavaScript. Obejrzano zrzut desktopu. Jednorazowa kontrola: `../wtf_www/local-scripts/one-off/editor-dev/check-menu.cjs`.

## 2026-11-05 — Górne menu

- Na polecenie użytkownika przeniesiono menu z boku na górę. Usunięto boczną kolumnę, a obszar roboczy zajmuje pełną szerokość pod menu.
- Zachowano podział pozycji i mobilne zwijanie; uproszczono nagłówek aplikacji. Zaktualizowano ustalenie układu w dokumentacji.
- Weryfikacja: kompilacja TypeScript/Vite przeszła poprawnie.

## 2026-11-05 — Zwięzły pasek z logo

- Zastąpiono tekstowy nagłówek istniejącym logo Klanarchii z podpisem EDYTOR (EDITOR w EN). Logo skopiowano do zasobów projektu bez zmiany obrazu.
- Logo jest pierwszym elementem od lewej w wierszu menu. Usunięto oznaczenie Administrator oraz PL/EN. Na mniejszych ekranach menu pozostaje zwijane.
- Weryfikacja: build TypeScript/Vite poprawny. Przy szerokości 1280 px pasek ma ok. 85 px wysokości; logo wczytuje się, oznaczenie konta jest usunięte, brak poziomego przepełnienia.

## 2026-11-05 — Edytor na całe okno

- Dodano przycisk rozwijania edytora na całe okno przeglądarki. Tryb zasłania witrynę i pasek administratora WordPressa; menu edytora pozostaje dostępne.
- Powrót przyciskiem lub Escape, bez utraty wybranego widoku. Na czas rozwinięcia blokujemy przewijanie i interakcję z tłem; po wyjściu przywracamy wcześniejszy stan oraz fokus przycisku.
- Dodano etykiety PL/EN. Nie jest używane przeglądarkowe API Fullscreen — tryb zachowuje pasek adresu i karty przeglądarki.
- Weryfikacja: build TypeScript/Vite poprawny.

## 2026-11-05 — Strona Witaj

- Dodano domyślną stronę „Witaj” (Welcome w EN) z dużymi ikonami, opisami i skrótami do części użytkownika oraz projektowania. Skróty projektowania pojawiają się dopiero po potwierdzeniu praw przez API.
- Kliknięcie logo Klanarchii prowadzi do strony Witaj, zachowując tryb na całe okno. Bez wskazanej poprawnej sekcji w adresie otwieramy Witaj; bezpośrednie linki do sekcji pozostają obsługiwane.
- Przygotowano układ kafelków na komputer, tablet i telefon oraz teksty PL/EN. Pozostałe ekrany nadal są puste; nie dodano zapisu danych.
- Weryfikacja: kompilacja TypeScript/Vite; przeglądarka — domyślne wejście, skrót do talentów, powrót przez logo, pozostałe przejścia i tryb rozszerzony.

## 2026-11-05 — Informacja o prototypie na stronie Witaj

- Usunięto widoczne nagłówki Klanarchia/Witaj oraz wcześniejszy tekst powitalny ze strony startowej.
- Wstawiono informację o odblokowaniu edytora podczas zbiórki, możliwości korzystania w trakcie rozwoju, niepełnej funkcjonalności i prototypowym charakterze materiałów. Zaktualizowano PL/EN.
- Zachowano kafelki i dostępną nazwę sekcji Witaj. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Mały nagłówek powitalny

- Nad informacją o prototypie dodano niewielki nagłówek „Witaj w edytorze materiałów do RPG Klanarchia”, z odpowiednikiem EN.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Usunięcie Historii z interfejsu

- Usunięto pozycję Historia z menu, kafelków Witaj i routingu PL/EN. Nie zmieniono wymagania wewnętrznej historii zmian talentów ani projektu zapisu wersji.
- Usunięto pionową kreskę przy informacji o prototypie.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Rozjaśnienie palety

- Na prośbę użytkownika rozjaśniono niemal czarne tło do grafitu #343b3d, menu do ciepłego szarozielonego #444a47, a kafelki do jaśniejszych grafitów z oliwkowo-złotymi akcentami.
- Zwiększono czytelność opisów i obramowań. Zachowano stałą ciemną oprawę oraz tę samą paletę w trybie na całe okno.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Próba palety z pergaminem

- Po odrzuceniu szarozielonej palety przygotowano wariant: ciepły grafit #292827, brązowografitowe menu #35312d i jasne pergaminowe kafelki z ciemnym tekstem oraz mosiężnymi ikonami.
- Zmieniono również kolory najechania i tło informacji o prototypie. Stała ciemna oprawa strony pozostaje zachowana.
- Weryfikacja: build TypeScript/Vite oraz obejrzany zrzut działającej strony Witaj. Wariant pozostaje do oceny użytkownika.

## 2026-11-05 — Tło strony pod edytorem

- Usunięto jednolite tło i obramowanie głównego kontenera edytora, odsłaniając tło strony Klanarchii pod kafelkami. Menu zachowuje własne tło.
- W trybie na całe okno zastosowano tło odpowiadające stronie Klanarchii, aby nadal zasłaniać witrynę WordPressa.
- Weryfikacja: sprawdzenie reguł CSS i poprawna kompilacja TypeScript/Vite.

## 2026-11-05 — Skróty na stronie Witaj

- Usunięto wszystkie kafelki sekcji Projektowanie ze strony Witaj. Menu projektowania pozostaje dostępne w pasku górnym.
- Nagłówek nad kafelkami użytkownika zmieniono na „Na skróty” (Shortcuts w EN); nazwa grupy w menu nie została zmieniona.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Przygaszenie kafelków

- Na prośbę użytkownika zmniejszono jasność pergaminowych kafelków do beżu #b6aa91–#a79b84; przygaszono również najechanie i ikony. Przyciemniono opisy dla czytelności.
- Tło strony pozostaje bez zmian. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Tło menu dopasowane do strony

- Zastąpiono brązowe tło menu półprzezroczystym przyciemnieniem #181c1670, przepuszczającym tło Klanarchii. Zachowano zaakceptowaną paletę kafelków.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Komunikat bez brązowego tła

- Usunięto brązowe tło informacji o odblokowaniu i prototypowym charakterze edytora. Tekst jest na tle strony Klanarchii.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Podpowiedź powiększenia

- Dodano początkową podpowiedź ze strzałką wskazującą przycisk: „Więcej miejsca? Powiększ edytor na całe okno.” oraz wersję EN.
- Kliknięcie powiększenia ukrywa podpowiedź i zapisuje cookie `ke_expand_hint_seen=1` na rok (Path=/, SameSite=Lax, Secure dla HTTPS). Odczyt cookie blokuje kolejne wyświetlenia; brak możliwości zapisu nie blokuje samego powiększenia.
- Podpowiedź nie przechwytuje kliknięć i jest powiązana z przyciskiem przez aria-describedby. Strzałka dodana na wyraźne polecenie użytkownika.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Animowana, czasowa podpowiedź

- Podpowiedź pojawia się sekundę po gotowości aplikacji, płynnie wsuwa i rozjaśnia, strzałka kilkukrotnie wskazuje przycisk, a obramowanie przycisku delikatnie pulsuje.
- Po około sześciu sekundach widoczności podpowiedź wygasa i jest usuwana. Nie powtarza się w tej samej odsłonie. Cookie nadal zapisujemy wyłącznie po użyciu przycisku; samo wygaśnięcie go nie zapisuje.
- Preferencja ograniczenia ruchu wyłącza animacje, zachowując automatyczne znikanie. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Krótka podpowiedź

- Skrócono podpowiedź do „Powiększ” (Expand w EN), dopasowano szerokość do tekstu. Animacja, czas wyświetlania i cookie pozostają bez zmian.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-05 — Pierwszy kreator szablonu talentu

- Dodano `TalentTemplateCreator.tsx` i `talent-template.css`: ustawienia układu, podgląd SVG/HTML, fonty, kolory, dane testowe, powiększenie, wykrywanie przepełnienia i PL/EN.
- Zapis i odczyt własnego formatu JSON (schemaVersion 1, kind talent-template), walidacja pliku, limit 1 MB, obsługa Ctrl+S i ochrona niezapisanych zmian.
- Stan kreatora zachowujemy podczas nawigacji; usunięto klucz widoku wymuszający odmontowanie całej zawartości. Pola liczbowe pozwalają na przejściowy pusty lub niekompletny zapis podczas pisania, a limity egzekwują po zakończeniu edycji.
- Skopiowano ramkę, ikonę Daru Ciemności i trzy fonty Linux Libertine z licencją. Stary projekt pozostał bez zmian. Nie importowano biblioteki talentów, nie utworzono tabel i nie wdrażano produkcji.
- Test przeglądarkowy potwierdził JSON roundtrip, walidację, zachowanie stanu, anulowanie resetu, przepełnienie, mobile i EN. Obejrzano zrzuty. Szczegóły i ograniczenia: `Kreator szablonu talentu.md`.

## 2026-11-05 — Układ kreatora z podglądem pośrodku

- Zmieniono wyłącznie układ: ustawienia po lewej, podgląd pośrodku, dane testowe po prawej. Na mniejszych ekranach panele układają się pionowo.
- Usunięto wysoki nagłówek sekcji nad kreatorem, pozostawiając nazwę szablonu i działania w pasku roboczym. Zmniejszono odstępy w ustawieniach; podgląd jest przyklejony podczas przewijania na desktopie.
- Nie dodano pozycjonowania elementów ani nowych parametrów tekstu. Format JSON i obsługa danych pozostają bez zmian.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Pozycjonowanie i niezależne style szablonu talentu

- Dodano geometrię każdego elementu, wybór na liście i podglądzie, drag/resize z przeliczaniem ekran → punkty, liczbową edycję, strzałki, blokadę, widoczność i undo/redo (100 operacji).
- Trzy niezależne style tytułu, fabuły i mechaniki: font, rozmiar, kolor, bold/italic, interlinia i odstęp liter. Parametr textMode przełącza wspólny blok lub osobno pozycjonowane teksty.
- Nowy model i parser JSON 2, z konwersją formatu 1. Nie dodano bazy. Kontrakt TalentTextOverrides/resolveTextStyle pozwala przyszłemu edytorowi talentu nadpisywać interlinię bez zmiany szablonu; brak formularza talentów na tym etapie.
- Wykorzystano oryginalne ikony i czwartą odmianę Linux Libertine. Dopasowano viewBox nowych kopii SVG, źródła pozostały bez zmian. Kopia poprzedniego kodu w local-scripts/one-off/editor-layout-20261106/before w wtf_www.
- Test przeglądarkowy potwierdził drag/resize, klawiaturę, undo/redo, blokadę, zoom 100/300%, niezależne style, oba tryby tekstu, pełny roundtrip JSON 2, odczyt JSON 1, odrzucanie błędnych danych, kontrakt nadpisania, mobile, overflow i EN. Obejrzano zrzuty. Szczegóły w Kreator szablonu talentu.md.

## 2026-11-06 — Wybór obiektu i kontrolki pod podglądem

- Po lewej jest tylko wybór obiektu (tło/grafika/tekst); po prawej wyłącznie jego właściwości. Usunięto niezależny wybór stylu po prawej. Wspólny blok zachowuje osobne style wybierane przez tytuł/fabułę/mechanikę na liście.
- Pod kartą: przełącznik wszystkich obrysów, miniatury i włączniki grafik oraz jedna grupa Użycia z opcjami brak/na misję 1–3/raz na scenę. Dane testowe przeniesiono pod podgląd.
- Użycia i Raz na scenę nie mogą wyświetlać się jednocześnie. Geometrię obu wariantów zachowano w formacie JSON 2; importer normalizuje ich widoczność do wspólnego przełącznika.
- Weryfikacja: build TypeScript/Vite; test przeglądarkowy wyboru i kontekstowych właściwości, tła, grafik, niezależnych stylów, miniaturek, włączników, grupy Użycia, trybów tekstu, przepełnienia i szerokości 320 px. Obejrzano zrzut desktopu. Test: local-scripts/one-off/editor-layout-20261106/check-properties.cjs w wtf_www.

## 2026-11-06 — Rozdzielenie wyboru i widoczności w kafelkach

- Kliknięcie kafelka grafiki pod podglądem zaznacza obiekt i pokazuje jego właściwości. Aktywny kafelek jest wyróżniony.
- Checkbox jest osobnym elementem: przełącza widoczność bez zmiany zaznaczenia. To samo działa przy obsłudze klawiaturą.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Ikony i widoczność na lewej liście

- Przeniesiono miniatury i checkboxy widoczności do lewej listy obiektów. Kliknięcie wiersza zaznacza obiekt, a checkbox tylko przełącza widoczność.
- Usunięto zdublowane kafelki grafik spod podglądu. Pozostały tam obrysy i wybór wariantu użyć. Teksty mają własne symbole T i włączniki widoczności, także we wspólnym bloku.
- Tło ma próbkę koloru; jego kolor i wymiary edytujemy po wybraniu wiersza. Właściwości pozostają wyłącznie po prawej.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Rozdzielenie obiektów użyć

- Na polecenie użytkownika rozdzielono Pola użyć i Raz na scenę na dwa wiersze z własnymi ikonami, checkboxami oraz niezależną geometrią. Zaznaczenie nie zależy od aktywnego wariantu podglądu.
- Zachowano wykluczanie w podglądzie: włączenie jednego wariantu przełącza podgląd na niego, bez zmiany zaznaczenia. Wczytywanie JSON nie scala już widoczności obu elementów.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Proporcje i liczba pól po lewej

- Dodano opcję „Zachowaj proporcje” dla wybranego elementu. Zmiana szerokości, wysokości i uchwyt narożny zachowują proporcje oraz granice karty. Opcja jest zapisywana w elements.<id>.proportional; starszy JSON bez tego pola odczytujemy jako false.
- Liczba pól użyć (0–3, zgodnie ze źródłem) jest edytowana pod elementem Pola użyć w lewej kolumnie. Usunięto selektor spod podglądu. Wybór liczby aktywuje pola, a Raz na scenę nadal jest wykluczającym się wariantem.
- Doprecyzowano synchronizację pól liczbowych po ograniczeniu wartości przez proporcje, aby pokazywały rzeczywisty wymiar.
- Weryfikacja: build TypeScript/Vite i test przeglądarkowy proporcjonalnego wpisywania szerokości/wysokości, granic, uchwytu, zapisu flagi, odczytu starszego JSON, liczby 0–3, wykluczania wariantów i mobile. Test check-proportions.cjs w local-scripts/one-off/editor-layout-20261106 w wtf_www.

## 2026-11-06 — Łańcuch między wymiarami

- Zastąpiono checkbox proporcji przyciskiem między szerokością i wysokością: połączony łańcuch włącza proporcje, przekreślony je wyłącza. Stan ma aria-pressed i opis PL/EN.
- Zachowano mechanizm skalowania i zapis flagi w JSON. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Kłódki, Akcja i liczba użyć w jednym wierszu

- Blokadę pozycji zastąpiono ikonami kłódki w lewej liście obiektów. Kliknięcie kłódki nie zmienia zaznaczenia; powiązane pola po prawej są blokowane. We wspólnym bloku teksty korzystają z blokady wspólnej geometrii.
- Przełącznik Akcja przeniesiono do lewej listy. Usunięto go z danych podglądu.
- Liczba pól użyć znajduje się w jednym wierszu obok nazwy, bez dodatkowej etykiety i linii; dostępna nazwa formularza pozostaje zachowana.
- Weryfikacja: build TypeScript/Vite; przeglądarka — kłódka i blokada wymiarów, Akcja po lewej i dopisek w podglądzie, położenie pola liczby w wierszu, dotychczasowe proporcje, JSON, warianty i mobile.

## 2026-11-06 — Szerokość lewej listy

- Poszerzono lewy panel z 224 do 260 px (wariant pośredni: 250 px) i pole liczby użyć z 38 do 50 px, aby cyfra była widoczna obok przycisków.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Tylko wspólny blok tekstu

- Na polecenie użytkownika usunięto wybór osobnych bloków z interfejsu. Tytuł, fabuła i mechanika płyną wspólnie, zachowując własne style.
- Przy wczytaniu wcześniejszego pliku z trybem separate kreator przełącza go na flow. Pozostałe dane i starsza geometria pozostają w dokumencie; źródłowego pliku nie modyfikujemy.

## 2026-11-06 — Biblioteka i ekran wyboru szablonów

- Dodano ekran startowy kreatora: Nowy szablon, miniatury, nazwy, daty, Otwórz, Duplikuj i powrót z edycji.
- Bibliotekę zapisujemy jawnie w localStorage, kluczem według identyfikatora konta WordPressa. Identyfikator dodano do konfiguracji chronionej strony. Nie dodano bazy ani API zapisu.
- Zapisz/Ctrl+S aktualizują lokalny wpis; Zapisz JSON nadal pobiera kopię, a import rozpoczyna nowy projekt. Potwierdzenie chroni niezapisane zmiany przy powrocie do listy.
- Duplikat ma nowy UUID; zapisy chronią przed nadpisaniem nowszej edycji w innej karcie. Błędy magazynu nie są zastępowane pustą biblioteką ani oznaczane jako sukces. Dane z uszkodzonego localStorage pozostają bez zmian.
- Test check-library.cjs w wtf_www/local-scripts/one-off/editor-layout-20261106 potwierdził bibliotekę, zapis, kopię, reload, potwierdzenie odrzucenia, pliki, konflikt, mobile i uszkodzony magazyn. Obejrzano zrzut desktopu; PHP lint i build poprawne.
- Stan przejściowy: szablony są tylko w tej przeglądarce, a nie na serwerze. Informacja jest wyświetlana w interfejsie; eksport JSON służy zachowaniu kopii poza przeglądarką.

## 2026-11-06 — Zwięzły pasek nazwy szablonu

- Usunięto Nowy szablon z paska edytora; tworzenie pozostaje na ekranie biblioteki.
- Powrót do listy jest strzałką w lewo. Obok jest nazwa dokumentu i ołówek uruchamiający jej edycję. Enter lub opuszczenie pola zatwierdza, Escape anuluje; pusta nazwa nie zastępuje poprzedniej.
- Zapis i eksport uwzględniają bieżącą edycję nazwy; rozpoczęta zmiana nazwy bierze udział w ostrzeganiu przed utratą pracy.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Przyciski powiększenia

- Dodano minus i plus obok listy powiększenia podglądu. Przechodzą po tych samych wartościach 100/150/200/300/400% i są wyłączone na granicach.
- Dodano etykiety PL/EN i zwarty układ na telefonie. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 ? Niezale?ne t?o i?ramka

- Dodano checkbox t?a, zachowanie jego koloru po ukryciu oraz zapis widoczno?ci w?JSON i?bibliotece. Starszy JSON domy?lnie w??cza t?o.
- Wsp?lny komponent podgl?du i?miniatur przycina t?o do rzeczywistego zewn?trznego konturu SVG ramki; bez ramki wype?nia stron?. Usuni?to prostok?tne t?o CSS podgl?du.
- Weryfikacja: build TypeScript/Vite i?test przegl?darkowy przesz?y (?rodek/naro?nik konturu, przezroczysto?? SVG, niezale?ne prze??czniki, kolor, zapis i?ponowne otwarcie). Bez wdro?enia produkcyjnego. Grafika t?a pozostaje na p??niej.

## 2026-11-06 — Tło obszaru podglądu

- Dodano wybór tła podglądu: szachownica (domyślna), białe, szare, ciemne lub własny kolor. Ustawienie dotyczy wyłącznie obszaru roboczego, bez zmiany szablonu i eksportowanego JSON.
- Etykiety PL/EN, zwarty wybór pod podglądem. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Zwarte ustawienia podglądu

- Wybór tła przeniesiono do rozwijanego panelu pod małą ikoną ustawień obok nagłówka „Podgląd”. Escape zamyka panel.
- Dodano „Przygaszony beż” #b6aa91, zaczerpnięty z kafelków strony startowej. Nadal jest to ustawienie widoku, niezależne od szablonu.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Ustawienia podglądu i powiększenie

- Zastąpiono rysowaną ikonę standardowym kształtem zębatki SVG. Kliknięcie poza panelem zamyka ustawienia; kliknięcia wewnątrz pozwalają dalej wybierać kolor.
- Przygaszony beż jest domyślnym tłem obszaru podglądu, z delikatnym gradientem. Lista powiększenia poprzedza sąsiadujące przyciski minus/plus.
- Weryfikacja: kompilacja TypeScript/Vite poprawna przed końcową podmianą samego kształtu SVG.

## 2026-11-06 — Ciemniejszy gradient beżu i wspólny styl ikon

- Beż podglądu przechodzi teraz w ciemny grafit przy krawędziach. Konfiguracja używa tych samych reguł wymiarów, koloru i podświetlenia co ołówek przy nazwie szablonu.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Łagodny beż i stan przycisku konfiguracji

- Zmniejszono kontrast gradientu beżu; brzeg #968a75 zamiast grafitu. Ikona ustawień ma przezroczyste obramowanie w stanie zwykłym i identyczny hover jak ołówek (#c4a66a16, obrys #bda76b45).
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Usunięcie ramki kontenera konfiguracji

- Przyczyną widocznej ramki był kontener details, dziedziczący wygląd paneli elementów. Wyłączono jego border i tło; podświetlenie samej ikony pozostaje jak przy ołówku.
- Weryfikacja: build poprawny; test przeglądarkowy potwierdził border kontenera 0 px, przezroczysty obrys ikony w spoczynku i zamykanie kliknięciem poza panelem (check-config.cjs).

## 2026-11-06 — Konturowa zębatka

- Zmieniono ikonę konfiguracji na konturowe SVG (fill none, stroke currentColor), zgodne ze stylem ołówka. Zachowano brak ramki kontenera i działanie panelu.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Pozycja Style i kolory

- W menu Projektowanie dodano „Style i kolory” obok kreatora szablonów talentów, z ikoną i etykietami PL/EN. Pozycja otwiera pusty ekran i podlega tym samym uprawnieniom projektowania co pozostałe narzędzia.
- Bez implementacji konfiguracji stylów i palety. Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-06 — Edytor stylów i kolorów

- Dodano StylesColours.tsx i styles-colors.css: dwie zakładki, tworzenie/edycja/usuwanie nazwanych kolorów i oznaczeń, przypisanie koloru przez ID, pogrubienie/kursywa/podkreślenie i podgląd. Zmiana rozmiaru dotyczy wyłącznie podglądu.
- Lista startuje pusta. Domyślne parametry nowego elementu są robocze, bez narzuconego katalogu zasad gry. Zapis jawny do ke:styles-colors:<userId>, dane zachowane podczas przechodzenia między modułami.
- Walidacja danych i nazw, blokada usunięcia używanego koloru, wykrycie konfliktu zapisu z inną kartą, ochrona uszkodzonego zapisu i ostrzeżenie przy zamykaniu niezapisanej strony. Bez tabel i produkcji; integracja oznaczeń z tekstami talentów później.
- Weryfikacja: build TypeScript/Vite i test check-styles.cjs przeszły (tworzenie, style, odwołania do palety na żywo, zapis/odświeżenie, blokada usuwania używanego koloru, szerokość mobilna).

## 2026-11-07 — Znaczniki, dawne style oraz RGB/CMYK

- Wydzielono styles-colors-model.ts, format zapisu 2. Migracja wersji 1 zachowuje ID, kolory i style użytkownika; generuje unikalne znaczniki i uzupełnia brakujące formatowania. Nie zastępuje istniejącego oznaczenia o tym samym znaczniku. Nowa biblioteka zawiera Cecha/Aspekt/Stan oraz pogrubienie i kursywę.
- Znacznik jest odrębny od nazwy, unikalny i po zapisaniu tylko do odczytu. Podgląd składni. Dodano tło tekstu z palety, kapitaliki, grubość 600 oraz font LinLibertine_RZ skopiowany ze źródła bez jego zmian. Blokada usuwania koloru obejmuje tła oznaczeń.
- RGB HEX/kanały i opcjonalne CMYK zapisują się niezależnie. Ręczne orientacyjne przeliczenie bez ICC, możliwość wyczyszczenia CMYK. Podgląd używa RGB. Nie wdrożono eksportu druku ani podłączenia znaczników do treści talentów.
- Weryfikacja: build poprawny; check-styles-v2.cjs potwierdził 5 formatowań, znaczniki, dawne style, niezależność RGB/CMYK i zapis/odświeżenie, blokadę zapisanych znaczników, migrację wersji 1 i szerokość mobilną.

## 2026-11-07 — Korekta projektu bazy: style i kolory

- Projekt bazy uzupełniono o cztery proponowane tabele wspólnej palety, oznaczeń i ich nazw PL/EN. Uwzględniono stałe unikalne znaczniki, odwołania do koloru tekstu/tła, niezależne RGB/CMYK, dawne formatowania, indeksy i ochronę odwołań.
- Usunięto nieaktualne ograniczenie do jednego szablonu. Wyjaśniono brak stylów oznaczeń w szablonie i brak gwarancji historycznego wyglądu przy globalnej zmianie stylów.
- Aktualizacja wyłącznie dokumentacji, bez SQL, nowych tabel, migracji ani projektowania zestawów. Weryfikacja: odczyt zmienionego dokumentu i sprawdzenie spójności z ustaleniami panelu.

## 2026-11-07 — Lokalna baza palety, oznaczeń i szablonów

- Wtyczka 0.2.0: includes/database.php (jawna migracja 1, 7 tabel InnoDB, 5 FK, idempotentne ke migrate/ke seed), validation.php (walidacja i normalizacja), api.php (chronione trasy, transakcje, rewizje, archiwizacja, wersjonowane dokumenty szablonów). Konta, autorstwo i nonce pochodzą z WordPressa. Wspólna paleta ma dodatkową tabelę catalogue_state; dokument szablonu LONGTEXT/JSON walidowany po stronie serwera.
- Kopia całej lokalnej bazy w wtf_www/backups/klanarchia-editor/20261107/before-schema.sql poza Gitem. Migracja i inicjalizacja wykonane lokalnie; nie ma automatycznej migracji przy aktywacji ani zmian PROD/starego projektu.
- Oba panele podłączone do API, dane wspólne między kontami uprawnionymi i komputerami. Zapis szablonu dopisuje wersję, konflikt zachowuje szkic. editor-api.ts przekazuje nonce, nie poświadczenia bazy. Jawny migrate-db.bat.
- ImportPreview.tsx pokazuje i zatwierdza stare dane localStorage bez ich kasowania. Paleta scala po UUID/nazwie koloru i tagu oznaczenia z zachowaniem serwerowych ID; lista szablonów importuje wybraną partię transakcyjnie, bez zastępowania istniejących UUID. JSON nadal obsługiwany.
- Testy w wtf_www/local-scripts/one-off/editor-database-20261107/: check-database.cjs, check-palette-import.cjs, check-auth.cjs i verify-cleanup.php. Przeszły build, PHP lint, ponowna migracja/seed, zapis między kontekstami, RGB/CMYK, blokada tagu, konflikty, walidacja, autorstwo i numery wersji, podgląd/import, rollback partii, mobile, brak JS errors, realny klient z nonce 403, admin bez nonce 401, admin z nonce 200, no-store i EN. Potwierdzono 7 tabel/5 FK. Usunięto wyłącznie dwa szablony QA i ich wersje po weryfikacji (2 i 1 wersja); paletę przywrócono.
- Aktualna procedura i zakres w Baza danych.md; zaktualizowano projekt bazy, PROJEKT, środowisko i opis kreatora. Wersje zapisują się bez interfejsu historii; talenty, postacie i zestawy nie otrzymały tabel.

## 2026-11-07 — Stan zapisu szablonu i usunięcie plików JSON

- Przycisk zapisu pokazuje kręciołek, „Zapisywanie…” i aria-busy; jest wyłączony do zakończenia żądania, również przy błędzie. Nadal zapisuje nową wersję przez serwerowe API do bazy.
- Usunięto przyciski i obsługę wczytywania/pobierania plików JSON z biblioteki i edytora. Zachowano podgląd importu dawnych danych localStorage. Poprawiono teksty pomocy/błędów i dokumentację, aby nie proponowały eksportu JSON.
- Weryfikacja: build poprawny; check-save-feedback.cjs potwierdził brak kontrolek JSON, spinner/blokadę podczas opóźnionej odpowiedzi oraz przywrócenie przycisku po sukcesie i błędzie (odpowiedzi API przechwycone w teście, bez nowych danych w bazie).

## 2026-11-07 — Kolor ramki ze wspólnej palety

- Odczytano oryginalne SVG: #3e5074. Dodano do bazy PL/EN „Błękit Zmroku” / „Dusk Blue”, czarny i biały, ze stałymi UUID i idempotentnym poleceniem ke base-colours; ke seed również uzupełnia kolory. Błękit bez narzuconego CMYK; czarny 0/0/0/100, biały 0/0/0/0. Źródło bez zmian.
- Szablon i walidator serwerowy obsługują frameColourId (dawne dokumenty domyślnie UUID błękitu). Lista kolorów ramki wyłącznie z API palety. TemplateFrame.tsx renderuje oryginalne SVG maską alfa, identycznie w podglądzie i miniaturze. palette.ts odświeża kolory po zapisie panelu i powrocie do okna.
- Serwer odrzuca nieistniejący/archiwalny kolor i chroni kolory użyte we wszystkich wersjach szablonów. Blokada katalogu podczas zapisu szablonu zapobiega równoległej archiwizacji wskazanego koloru. Bez zmian schematu tabel.
- Weryfikacja: build i PHP lint poprawne; check-frame-palette.cjs potwierdził kolor źródła, bazową paletę, wybór tylko z listy, render, zapis/ponowne otwarcie, miniaturę, odświeżenie po zmianie RGB, odrzucenie obcego UUID i ochronę koloru użytego w poprzedniej wersji. Obejrzano screenshot czarnej ramki — kontur i przezroczystość zachowane. Przywrócono kolor testowo zmieniony, usunięto wyłącznie szablon QA z dwiema wersjami, pozostałe szablony zachowano. Powtórzenie base-colours bez duplikatów.

## 2026-11-07 — Wspólny komponent palety i kolory ikon

- Dodano PaletteSelect.tsx / PaletteSelect.css: rozwijana lista z próbkami, nazwami, HEX, zaznaczeniem, obsługą myszy, klawiatury (strzałki/Home/End/Enter/Escape), fokusowaniem i zamknięciem poza listą. Wykorzystano we właściwościach pięciu elementów graficznych.
- Dodano graphicColourIds dla hex/gift/uses/once w modelu, parserze i walidacji serwerowej. Dar Ciemności domyślnie wskazuje czarny UUID, pozostałe ikony podstawowy błękit. Starsze dokumenty są obsługiwane bez modyfikacji wcześniejszych wersji.
- TintedGraphic.tsx współdzieli maskę alfa SVG dla ikon i TemplateFrame.tsx; aktualizacja pełnego podglądu i miniatur. API sprawdza dostępność wszystkich kolorów i blokuje archiwizację kolorów użytych w dowolnej wersji (także domyślnych w dawnym dokumencie). Bez DDL i migracji źródła.
- Weryfikacja: build TypeScript/Vite i PHP lint poprawne. check-graphic-colours.cjs potwierdził próbki, kliknięcia, klawiaturę, zamykanie poza listą/Escape, domyślny czarny Dar Ciemności, kolorowanie każdego elementu, zapis i ponowne odczytanie z DB, odrzucenie nieznanego UUID, brak przewijania mobilnego i błędów JS. Obejrzano zrzut podglądu (czarna ramka/heks, błękitny Dar, czarne raz na scenę). Usunięto wyłącznie szablon QA z jedną wersją; szablony użytkownika zachowano.

## 2026-11-07 — Krótsze nazwy modułów szablonów

- Zmieniono etykiety menu na „Szablony talentów” i „Szablony kart postaci”, odpowiednio również EN. Zachowano dotychczasowe adresy widoków i funkcje.
- Weryfikacja: kompilacja TypeScript/Vite poprawna.

## 2026-11-07 — Wielokrotne zaznaczanie i wyrównanie

- TalentTemplateCreator: osobne zaznaczenie wielu pozycji, checkboxy po lewej, ikony oka/przekreślonego oka po prawej (widoczność niezależna od zaznaczenia), Shift + klik na liście i SVG. Obsłużono tło jako wybór bez geometrii i współdzieloną geometrię części tekstu.
- AlignmentToolbar.tsx i template-alignment.ts: sześć ikon między Podgląd i zoom, wyrównanie pojedynczego obiektu do karty lub kilku do granic zaznaczenia. Jedna operacja undo, poszanowanie blokad. Wspólny ruch przeciąganiem/strzałkami zachowuje odstępy i granice karty; Escape na podglądzie czyści zaznaczenie.
- Dodano obrysy wszystkich zaznaczonych geometrii i ramkę grupy; prawy panel dla wielokrotnego wyboru opisuje operacje grupowe. Poszerzono lewą kolumnę do 280 px, pasek narzędzi zawija się na małych ekranach. Bez zmian DB i bez skalowania całych grup.
- Weryfikacja: build poprawny; check-selection.cjs sprawdził checkboxy, Shift na liście i SVG, oczy bez utraty zaznaczenia, sześć wyrównań z jednorazowym Cofnij, ruch grupy i cofanie, blokady, wyrównanie do karty, Escape, odznaczanie tła, wybór stylu tytułu kliknięciem, mobile i brak błędów JS. Obejrzano screenshot listy i paska wyrównania. Testy bez zapisu do DB.

## 2026-11-07 — Oryginalny znacznik V na heksie

- Sprawdzono stary UserClanEditor/exportCharacterPdf: dla talentu domyślnie używano checked_v.svg jako osobnej nakładki. Plik skopiowano bajt w bajt do src/assets/talent-template/checked-v.svg, potwierdzono zgodność SHA-256 i brak aktywnej zawartości SVG. Stary projekt bez zapisów.
- Dodano HexMark.tsx i hexMark {colourId,size} w modelu oraz walidacji PHP. Znak wyśrodkowany w heksie, podąża za jego rozmiarem/pozycją; domyślnie czarny, 90% krótszego boku. Kolor przez PaletteSelect, rozmiar 10–150%. Ochrona archiwizacji palety obejmuje marker również w dawnych wersjach z wartością domyślną.
- Podgląd włącza „Heks zaznaczony” pod kartą lub „Pokaż zaznaczenie w podglądzie” we właściwościach heksa. Stan domyślnie wyłączony, nie zapisywany w szablonie. Miniatury nadal bez oznaczenia konkretnego talentu.
- Weryfikacja: build i PHP lint poprawne; check-hex-mark.cjs potwierdził przełączanie, podążanie za heksowym XY, paletę i rozmiar, ukrycie wraz z heksem, zapis/ponowny odczyt konfiguracji, brak zapisu stanu podglądu i odrzucenie nieznanego UUID. Obejrzano screenshot podglądu. Usunięto wyłącznie szablon QA z jedną wersją, materiały użytkownika zachowano.

## 2026-11-07 — Korekta: znak jako osobny obiekt

- Na polecenie użytkownika usunięto parametry znaku z okolicy podglądu i właściwości heksa. „Zaznaczenie heksa” to elements.hexMark na liście z checkboxem, okiem, blokadą, własną geometrią i kolorem graphicColourIds.hexMark. Właściwości wyłącznie po prawej po wybraniu obiektu.
- Niezależna widoczność i pozycja, udział w Shift/checkboxach, wyrównaniu, przeciąganiu i skalowaniu. Domyślnie znak wyśrodkowany na heksie, ale bez wiązania położenia ani widoczności z heksem. Miniatura pokazuje widoczny znak.
- Parser TS i walidator PHP konwertują starszy zapis hexMark {colourId,size} do osobnego obiektu. Dawne wersje w DB bez zmian; nowy zapis usuwa nieaktualne pole. Ochrona koloru uwzględnia obydwa formaty. Bez DDL.
- Weryfikacja: build i PHP lint poprawne; check-independent-marker.cjs potwierdził listę, brak dawnych przełączników, niezależne XY i oko, paletę, wielokrotny wybór/wyrównanie/Cofnij, zapis do DB i ponowny odczyt, konwersję dawnego formatu. Usunięto tylko dwie wersje szablonu QA; materiały użytkownika zachowano.

## 2026-11-07 — Kręciołek otwierania szablonu

- Kliknięcie Otwórz lub miniatury pokazuje spinner i „Otwieranie…” na przycisku wybranego szablonu (aria-busy). opening ref/state zapobiega równoległym otwarciom; na czas żądania blokowane są miniatury, otwarcia, duplikowanie i tworzenie nowego szablonu.
- Po błędzie spinner i blokady znikają; udane ponowienie czyści stan błędu biblioteki, odblokowując zapis.
- Weryfikacja: build poprawny; check-open-feedback.cjs potwierdził oba wejścia, blokady podczas opóźnionego żądania, powrót po błędzie i udaną ponowną próbę z aktywnym zapisem. Bez zapisów testowych do bazy.

## 2026-11-07 — Obiekt Nieodnawialny

- Dodano nonRenewable do listy za gift oraz geometrię i styl w modelu szablonu/walidacji PHP. Domyślnie widoczny tekst „nieodnawialny” (EN non-renewable), Linux Libertine 9 pt bold italic, po prawej od Daru Ciemności.
- TemplateLabel.tsx współdzieli render pełnego podglądu i miniatury. Obiekt ma standardowe XY/rozmiary/proporcje/oko/blokadę i niezależne właściwości typografii po prawej. Nie należy do przepływu tytuł/fabuła/mechanika, nie przesuwa ich podczas edycji.
- Parser i serwer uzupełniają nowe pola w starszych dokumentach; zapis przez istniejące API w wersji szablonu, bez DDL i zmiany dawnych wersji.
- Weryfikacja: build i PHP lint poprawne; check-label.cjs potwierdził kolejność listy, bold italic, niezależne XY/font, oko, zapis/ponowny odczyt, miniaturę i domyślne pola dla dawnego dokumentu. Obejrzano screenshot. Usunięto wyłącznie dwie wersje szablonu QA; szablon użytkownika zachowano.

## 2026-11-07 — Mniejszy napis Nieodnawialny

- Zmieniono domyślny font etykiety z 9 na 7 pt; min. 5 pt tylko dla tego obiektu w UI/parserze/serwerze. TemplateLabel centruje linię tekstu w pionie we własnym obszarze.
- Na polecenie użytkownika dopisano wersję 9 istniejącego szablonu e8cf7dd1-0a5d-47aa-9898-fca1dce5b89d: 7 pt i środek obszaru napisu na środku Daru Ciemności (y=7.55). Zapisano kopię poprzedniej wersji do wtf_www/backups/klanarchia-editor/20261107/before-smaller-label.json. Kontrola rewizji 8 przed zmianą, wcześniejsze wersje zachowane.
- Weryfikacja: build poprawny; check-smaller-label.cjs potwierdził zapisany rozmiar 7 pt, wyrównanie środków i dostępność edycji mniejszego rozmiaru, bez błędów JS. Test wyłącznie odczytujący; zmiana szablonu jest zmianą użytkową, nie rekordem QA.

## 2026-11-07 — Automatyczny rząd obecnych elementów

- Dodano headerRow {x,centerY,gap} i layoutHeader dla gift/nonRenewable. Ukryte elementy nie rezerwują miejsca; heks i hexMark zachowują własne XY. Docelowa kolejność obejmuje także Koszt/Zagrywkę/Zasady specjalne, ale tych obiektów jeszcze nie dodano.
- Podgląd i miniatury stosują automatyczny układ. Prawy panel elementu pokazuje ustawienia całego rzędu, indywidualne X/Y są wyłączone. Rozmiary, kolory i typografia pozostają indywidualne. Wspólne przesuwanie, strzałki i wyrównywanie traktują rząd jako jeden cel; blokada widocznego członu blokuje ruch rzędu.
- Parsery TS (formaty 1/2) i walidacja PHP normalizują XY; brak configu w starej wersji bierze start/środek z gift, gap=4. Za szeroki rząd odrzucany bez nakładania elementów na heks. Nowo dodany tekst w małej dawnej karcie otrzymuje dostępną szerokość lub ukrycie przy braku miejsca. Bez DDL i przepisywania historycznych wersji.
- Weryfikacja: build i PHP lint poprawne; check-header-flow.cjs potwierdził brak luk, przesuwanie napisu po ukryciu Daru, niezmienny heks/znak, odstęp i zmiany szerokości, ruch całego rzędu/Cofnij, blokadę indywidualnych XY, zapis/reload, miniaturę i normalizację dawnego układu. Usunięto wyłącznie dwie wersje szablonu QA; szablon użytkownika zachowano.

## 2026-11-07 — Niezależne Y i oba symbole użyć

- Odblokowano Y dla gift/nonRenewable; X nadal kontrolowany przez rząd. layoutHeader i serwer zachowują własne Y obiektów. Przeciąganie/strzałki/wyrównanie działa pionowo na zaznaczonych elementach, poziome operacje dla samych członów rzędu wyłączone. Wspólne centerY przesuwa elementy z zachowaniem ich różnic Y.
- Usunięto sample.usage jako wzajemnie wykluczający tryb. Oka uses/once niezależne, oba obiekty mogą być widoczne. Liczba pól 0 ukrywa tylko uses; włączenie oka przy zerze przywraca 3. Miniatura pokazuje oba symbole, jeśli są widoczne.
- Weryfikacja: build poprawny; check-independent-y.cjs potwierdził regulację Y, automatyczne X, zachowanie Y przy zmianie widoczności, strzałki/Cofnij, niezależne oka i zero pól, zapis/reload i obecność obu symboli w miniaturze. Usunięto wyłącznie rekordy QA po teście; szablon użytkownika zachowano. Bez nowych tabel i DDL.

## 2026-11-07 — Symbol Zagrywki z pliku użytkownika

- Skopiowano wskazany zagrywka.svg z Google Drive do src/assets/talent-template/zagrywka.svg. Brak aktywnej zawartości SVG. W kopii zmieniono tylko viewBox: oryginał miał marginesy strony 595,28 × 841,89; krzywa zajmuje ok. 318,79 × 316,91. Potwierdzono identyczność d ścieżki, źródło bez zmian.
- Dodano play do listy obiektów, kolorów palety i rzędu przed gift/nonRenewable. Domyślnie czarny, 22,1 pt, zachowanie proporcji; własne Y, automatyczne X, oko, blokada, miniatura i podgląd. Ustawienia rzędu uwzględniają nowy element. Koszt/Zasady specjalne nie są jeszcze dodane.
- Parser i serwer obsługują starsze dokumenty bez play; ikona startuje widoczna, a przy braku miejsca w dawnym układzie ukryta. API zapisuje element i kolor, chroni historyczne odwołania; bez DDL.
- Weryfikacja: build i PHP lint poprawne; check-play.cjs potwierdził symbol/kolejność, X/Y, paletę, przesuwanie przy ukrywaniu, nieruchomy heks/znak, zapis/reload, miniaturę i dawny format. Obejrzano screenshot. Usunięto wyłącznie dwie wersje szablonu QA, materiały użytkownika zachowano.

## 2026-11-08 — Ikona Zasad specjalnych

- Utworzono autorski special-rules.svg: wąski owal i wykrzyknik, nieregularny wypełniony kontur, bez fontów/rastra. Domyślny czarny, rozmiar 12,6 × 22,1 pt, proporcje połączone.
- specialRules dodano do listy, palety, renderowania i miniatury po gift, przed nonRenewable. Własne Y, X automatyczne; oko/rozmiar/blokada jak pozostałe ikony. Aktualny rząd play/gift/specialRules/nonRenewable. Koszt nadal brak.
- Serwer i parser normalizują dokumenty z nowym polem, chronią używany kolor i uzupełniają brakujące ikony w starszym formacie. Przy braku miejsca dodawane domyślnie specialRules/play są kolejno ukrywane, bez usuwania istniejącego układu. Bez DDL.
- Weryfikacja: build i PHP lint poprawne; check-special.cjs sprawdził wąskie proporcje, kolejność, paletę/XY, reflow, zapis/reload, miniaturę i dawny format. Obejrzano screenshot ikony na karcie. Usunięto wyłącznie dwie wersje szablonu QA; szablon użytkownika zachowano. Bez wdrożenia produkcyjnego.

## 2026-11-08 — Kolory tekstu wyłącznie ze wspólnej palety

- Tytuł/fabuła/mechanika/nonRenewable używają PaletteSelect z próbkami zamiast input color. TextStyle zawiera colourId; renderery podglądu, etykiety i miniatur pobierają RGB przez ID. color pozostaje wyłącznie kompatybilnym cache, nie niezależnym ustawieniem przy ID.
- Dodano i uruchomiono ke text-colours: Atrament #181818, Fiolet opowieści #403466 oraz brakujące historyczne odcienie, z nazwami PL/EN. ke_legacy_text_colour_map wiąże dawne HEX z ID mimo późniejszych zmian RGB. ke seed obejmuje tę inicjalizację. Dawne wersje bez przepisywania, odwołania normalizowane podczas odczytu API.
- Serwer odrzuca nieznane ID i niezdefiniowany HEX; dla poprawnego ID ignoruje dowolne przesłane cache RGB i zwraca kolor z palety. Ochrona usuwania obejmuje teksty w wersjach historycznych i stare HEX. Bez DDL i zmian źródła/PROD.
- Weryfikacja: build i PHP lint poprawne; check-text-palette.cjs sprawdził wszystkie cztery teksty, próbki, preview/miniaturę, zapis i reload, ID, odrzucenie nieznanego koloru/UUID, autorytatywną paletę i ochronę używanego Atramentu. Usunięto tylko dwie wersje szablonu QA; materiały użytkownika zachowano.

## 2026-11-08 — Ikona kosztu i cyfra 0–9

- Utworzono autorski cost.svg (nieregularna plama i trzy stosy monet z przezroczystymi nacięciami) oraz TemplateCost.tsx z nakładaną cyfrą. Inspiracja obrazem użytkownika, uproszczony SVG bez rastra. Domyślnie Błękit Zmroku i biała cyfra, oba kolory z palety. Domyślny rozmiar 28 × 16,55 pt, proporcje połączone.
- cost dodano przed play do listy i rzędu. Inline NumberInput przy nazwie, 0–9 całkowite, zero nie ukrywa symbolu. costValue i costTextColourId zapisują domyślny/podglądowy numer i kolor cyfry; elements.cost i graphicColourIds.cost zapisują geometrię/widoczność/kolor. Po prawej standardowe parametry, X automatyczne i Y własne. Miniatura używa tej samej cyfry.
- Domyślną szerokość napisu Nieodnawialny zmniejszono do 50 pt, bez zmiany fontu 7 pt. Przy dodawaniu kosztu do dawnego formatu zwężany jest wyłącznie poprzedni standardowy obszar 80 pt z Libertine 7 bold italic; niestandardowe ustawienia nie są zastępowane. Gdy nadal nie ma miejsca, nowy domyślny koszt startuje ukryty.
- Serwer/parsers obsługują starszy format i walidują koszt całkowity 0–9 oraz oba kolory; ochrona historycznych odwołań obejmuje cyfrę i tło kosztu. Bez DDL, zmian źródła i PROD.
- Weryfikacja: build i PHP lint poprawne. check-cost.cjs sprawdził wszystkie cyfry 0–9, widoczne zero, kontrolkę na liście, kolor/XY, przepływ po ukryciu, zapis/reload/miniaturę, odrzucenie -1/10/1.5 i stary format. Obejrzano screenshot kosztu 0 (plama, monety i jasna cyfra). Usunięto wyłącznie dwie wersje szablonu QA; szablon użytkownika zachowano.

## 2026-11-08 — Ograniczenie dostępności talentu

- Dodano osobny obiekt restriction do listy, zaznaczania, blokowania, widoczności, geometrii i typografii. Domyślnie prawy dolny róg, wyrównanie do prawej, Libertine 7 pt bold italic, kolor wyłącznie z palety. Przykład PL „Tylko Mechaniści”, EN „Mechanists only”; tekst próbny edytowany po prawej, bez zapisu w szablonie. Właściwa treść talentu pozostaje etapem edytora talentów.
- Widoczny obiekt rezerwuje dolny pas: wspólny tekst kończy się 4 pt nad jego obszarem. Ukrycie przywraca pierwotną wysokość. Obliczenie dotyczy renderowania, bez skracania zapisanej geometrii. Nadmiar tekstu uruchamia istniejące ostrzeżenie, nie zmniejsza automatycznie fontu. Podgląd i miniatury stosują tę samą regułę.
- Parser TS i walidacja PHP uzupełniają brakujący obiekt/styl starszych dokumentów; zapis wersjonowany obejmuje nowe parametry i ochronę koloru. Bez DDL i zmian starego projektu lub PROD.
- Weryfikacja: build i lint obu plików PHP poprawne. Playwright check-restriction.cjs potwierdził odstęp, odzyskanie miejsca po ukryciu, ostrzeżenie dla długiej mechaniki, zapis/reload i miniaturę. Obejrzano screenshot z długim tekstem. Usunięto wyłącznie jedną wersję testowego szablonu QA, pozostawiono jeden szablon użytkownika.
## 2026-11-08 — Czysty podgląd

- Pod kartą dodano przełącznik „Czysty podgląd” (PL/EN). Ukrywa obrysy, pojedyncze i grupowe zaznaczenie oraz uchwyty. Blokuje przesuwanie elementów myszą i klawiaturą w podglądzie. Zachowuje zaznaczenie i poprzednie ustawienie obrysów po wyłączeniu; nie zmienia szablonu ani bazy.
- Weryfikacja: build poprawny; Playwright check-clean-preview.cjs potwierdził brak nakładek i uchwytów, zachowanie treści karty oraz przywrócenie zaznaczenia. Bez zapisu danych i bez błędów JS.
## 2026-11-08 — Opcje nad podglądem

- Przeniesiono pasek z opcjami Czysty podgląd i Pokaż obrysy nad okno podglądu. Bez zmiany działania przełączników. Weryfikacja: build poprawny.
## 2026-11-08 — Dwa przełączniki w pasku narzędzi

- Doprecyzowanie układu: tylko Czysty podgląd i Pokaż obrysy przeniesiono do wspólnego górnego paska, obok narzędzi wyrównywania i powiększenia. Wymiary i wskazówka sterowania ponownie pod podglądem. Build poprawny.
## 2026-11-08 — Przykładowy talent Prymat potępieńca

- Podany przez użytkownika tytuł, opis fabularny i mechanikę ustawiono jako początkowe dane polskiego podglądu kreatora i treść miniatur. Wspólne źródło src/example-talent.ts; twarde spacje po jednoliterowych słowach. Bez tłumaczenia EN, zmiany zasad lub zapisu talentu do bazy. Build poprawny.
## 2026-11-08 — Tuszowa ramka, wariant eksperymentalny

- Utworzono frame-ink.svg: zamknięty nierówny kontur o zmiennej grubości, bez filtrów rastrowych. Oryginalnego SVG nie zmieniono. Wspólny zewnętrzny kontur ink-frame-contour.ts przycina tło, zachowując przezroczystość poza ramką.
- Obiekt Ramka ma wybór Oryginalna / Tuszowa — eksperyment. frameVariant zapisuje się w wersji szablonu i działa w miniaturach. Nowe szablony startują z ink; starsze bez pola zachowują original, bez przepisywania historycznych wersji. Paleta i geometria ramki pozostają wspólne.
- Weryfikacja: build i PHP lint poprawne; check-ink-frame.cjs potwierdził przełączanie, zapis ink, miniaturę i powrót starszego dokumentu bez pola do original. Obejrzano screenshot. Usunięto tylko dwie wersje szablonu QA; szablon użytkownika pozostał. Bez DDL, wdrożenia i zmian projektu źródłowego.
## 2026-11-08 — Uproszczony wariant kosztu

- Dodano cost-simple.svg: jedna plama, większa cyfra i jeden stos trzech monet z większymi prześwitami. Oryginalnego cost.svg nie zmieniono. Parametry Kosztu mają wybór Uproszczony / Poprzedni. costVariant (simple/original) zapisuje się w wersji, brak pola domyślnie simple, aby można było ocenić poprawkę w istniejącym szablonie. Wartość 0–9, paleta i geometria pozostają wspólne.
- Weryfikacja: build i PHP lint poprawne; check-cost-simple.cjs potwierdził przełączanie obu wariantów, cyfry 0–9, paletę i XY, reflow, zapis/reload/miniaturę, odrzucenie błędnych liczb i zgodność dawnego formatu. Obejrzano screenshot. Usunięto dwie wersje wyłącznie szablonu QA; jeden szablon użytkownika zachowany. Bez DDL i PROD.
## 2026-11-08 — Tuszowy zestaw ikon

- Dodano niezależny zestaw ink w assets/talent-template/ink: przerysowane heks, zaznaczenie, pola użyć, zasady specjalne i raz na scenę (cyfra 1 zamieniona na krzywe, bez zależności od fontu). Zagrywka i Dar Ciemności zachowują źródłowe kształty z lekkim pogrubieniem kreski. Koszt pozostawiono zgodnie z poprzednim odłożeniem jego wyglądu. Ramka ma nadal osobny wariant.
- Pole Zestaw ikon nad listą elementów wybiera Tuszowy — eksperyment / Oryginalny. iconVariant zapisywany w wersji szablonu, domyślnie ink również przy braku pola w dawnym dokumencie. Wspólny iconSource stosowany w podglądzie, miniaturach, heksowym zaznaczeniu i ikonografii listy. Geometria, kolory i widoczność bez zmian; oryginalne pliki zachowane.
- Weryfikacja: build i PHP lint poprawne; check-icon-set.cjs sprawdził siedem źródeł, przełączenie i powrót, zapis/reload oraz brak błędów JS. Obejrzano screenshot. Usunięto jedną wersję wyłącznie szablonu QA; szablon użytkownika zachowano. Bez DDL, zmian starego projektu i wdrożenia.
## 2026-11-08 — Ramka dopasowana do tuszowych ikon

- Poprawiono wariant ink: usunięto regularne sinusoidalne falowanie, zastępując je rzadszymi, nieregularnymi załamaniami i miejscowymi zgrubieniami. Zachowano wspólny kontur przycięcia tła i przezroczystość poza ramką. Oryginalna ramka bez zmian; kopia poprzedniej próby w wtf_www/local-scripts/one-off/frame-ink-before-refine.svg.
- Weryfikacja: build poprawny; check-refined-frame.cjs i screenshot podglądu z tuszowymi ikonami bez błędów JS. Bez zapisu do bazy, zmian geometrii elementów i wdrożenia.
## 2026-11-08 — Lżejszy symbol Raz na scenę

- Odchudzono łuk, grot i cyfrę 1 w tuszowym ink/once.svg. Wymiary obiektu i oryginalny wariant bez zmian. Weryfikacja: build poprawny.
## 2026-11-08 — Dynamiczna jedynka i zaznaczenie

- Jedynka w tuszowym Raz na scenę ma odręczny, pochylony kształt z wyciągniętym wejściem i zakrzywioną podstawą. Łuk i grot bez zmian. Checked w tym zestawie przerysowano na lżejszy, płynny gest ze zwężającym się długim ramieniem. Bez zmiany geometrii obiektów lub oryginalnych ikon.
- Weryfikacja: build poprawny, kontrola przeglądarkowa i obejrzany screenshot podglądu bez błędów JS. Bez zapisu do bazy i wdrożenia.
## 2026-11-08 — Różne pola użyć i poprawka Zagrywki

- Tuszowe pola użyć mają trzy odrębne kontury SVG; indeks przypisany do fizycznego miejsca w trójce, bez losowania przy renderowaniu. Podgląd i miniatury korzystają ze wspólnego useFieldSource. Oryginalny zestaw nadal powtarza dawny kwadrat.
- Zagrywka zachowuje źródłową spiralę; zastąpiono jednolite pogrubienie subtelnym, deterministycznym zróżnicowaniem krawędzi i grubości. Czyste krzywe/wektor bez filtrów. Oryginał bez zmian; kopia poprzedniej tuszowej próby w wtf_www/local-scripts/one-off/play-before-refine.svg.
- Weryfikacja: build poprawny; check-distinct-uses.cjs potwierdził trzy różne źródła pól, podgląd bez błędów JS; obejrzano screenshot z odsłoniętymi polami. Bez zapisu do bazy i wdrożenia.
## 2026-11-08 — Zasady specjalne bez owalu

- W tuszowym zestawie special.svg zastąpiono samym odręcznym, lekko pochylonym wykrzyknikiem o zmiennej grubości. Zachowano viewBox i geometrię obiektu, kolory palety oraz oryginalny wariant z owalem. Build poprawny.
## 2026-11-08 — Obrys Daru Ciemności

- W tuszowym gift.svg uproszczono wyłącznie pierwszy zewnętrzny kontur do nieregularnego, 40-węzłowego obrysu z mniej drobnymi wyszczerbieniami. Przywrócono środek bez dodatkowego stroke: wszystkie wewnętrzne podścieżki oraz oddzielne ścieżki są identyczne ze źródłowym dark-gift.svg. Oryginał bez zmian; kopia poprzedniej tuszowej próby w wtf_www/local-scripts/one-off/gift-before-outline.svg.
- Weryfikacja: porównanie wewnętrznych krzywych dokładne, build poprawny, podgląd i obejrzany screenshot bez błędów JS. Bez zapisu do bazy, zmian geometrii i wdrożenia.
## 2026-11-08 — Wyraźniejszy obrys Daru Ciemności

- Poprzednia korekta okazała się wizualnie zbyt subtelna. Tuszowy gift.svg otrzymał ręcznie zbudowaną sylwetkę z szerszymi nieregularnymi załamaniami zamiast drobnych ubytków. Wewnętrzne podścieżki nadal skopiowane bez zmian z oryginału.
- Build i podgląd przeglądarkowy poprawne; obejrzano screenshot. Bez zmiany oryginalnego wariantu, danych szablonu i wdrożenia.
## 2026-11-08 — Nowa płomienna otoczka Daru

- Na polecenie użytkownika zastąpiono owalną sylwetkę nową otoczką: nieregularne boki i płomienne zakończenia nad głową. Środkowy kształt i oczy nadal ze źródłowych krzywych. Zmiana tylko tuszowego gift.svg; oryginalny symbol zachowany.
- Build i kontrola podglądu poprawne; obejrzano screenshot. Bez zmiany danych, geometrii obiektu i wdrożenia.
## 2026-11-08 — Ciaśniejsze tło Daru bez dodatkowych płomieni

- Po akceptacji kierunku usunięto koronę z zewnętrznych płomieni. Nowy nieregularny kontur bliżej otacza kształt głowy. Zachowano centralną podścieżkę i osobne oczy; usunięto dawne drobne ubytki należące do poprzedniej otoczki. Oryginalny wariant bez zmian.
- Build i kontrola podglądu poprawne; obejrzano screenshot. Bez zapisu danych i wdrożenia.
## 2026-11-08 — Ostrzejszy obrys Daru Ciemności

- Zaostrzono zewnętrzną otoczkę tuszowego Daru: asymetryczne cięcia, zwężenia i ostre zakończenia zamiast łagodnych zaokrągleń. Centralna podścieżka i oczy bez zmian. Build i kontrola podglądu poprawne; obejrzano screenshot. Bez zmiany oryginalnego wariantu i danych.
## 2026-11-08 — Obrys Daru bez efektu znaczka

- Usunięto powtarzalne drobne ząbkowanie. Nowa otoczka ma kilka większych, asymetrycznych rozdarć połączonych dłuższymi odcinkami krzywych. Środkowy kształt i oczy bez zmian. Build poprawny; kontrola podglądu i screenshot. Bez zmiany danych i oryginalnego wariantu.
## 2026-11-08 — Koszt rozdzielony na symbol i wartość

- Dodano samodzielny cost-coins.svg: dwa stosy monet o różnej wysokości, bez plamy i cyfry. CostIcon renderuje sam znak w SVG; InlineCostIcon przygotowany do tekstu HTML (em, currentColor), bez wdrażania nowego znacznika tekstowego.
- Lista ma dwa niezależne obiekty: costAmount (Koszt — wartość) i cost (Koszt — symbol). Osobne oczy, blokady, rozmiary, Y i kolory palety. Wartość 0–9 regulowana przy costAmount. Automatyczny rząd: costAmount → cost → play → gift → specialRules → nonRenewable; X nadal automatyczne. Cyfra nie jest częścią SVG monet ani renderera symbolu. Podgląd i miniatura używają obu obiektów osobno.
- Domyślny costVariant coins, geometrię dawnego kosztu przy odczycie dzielimy na dwa obszary z uwzględnieniem odstępu, bez zwiększania całkowitej szerokości standardowego rzędu. Dawna biała cyfra na plamie otrzymuje domyślny kolor palety Błękit Zmroku, aby była widoczna na karcie. Wersje historyczne nie są przepisywane. Serwer waliduje nowy obiekt i wariant, brak DDL. Poprzednie assety kosztu zachowane. Ręcznie zmieniany przez użytkownika Dar Ciemności nietknięty.
- Weryfikacja: build i PHP lint poprawne; check-split-cost.cjs potwierdził cyfry 0–9, niezależne oczy symbolu i cyfry, zapis/reload/miniaturę i konwersję dawnego kosztu. Obejrzano screenshot. Usunięto wyłącznie dwie wersje szablonu QA; jeden szablon użytkownika zachowany. Bez wdrożenia.
## 2026-11-08 — Monety zamiast rurek

- Poprawiono samodzielny cost-coins.svg: dwa stosy z osobnych pełnych krążków (2 i 4 monety), z odstępami i przesunięciami. Usunięto otwarte elipsy oraz ciągłe pionowe ścianki powodujące efekt tubki. Wartość pozostaje osobnym obiektem. Build poprawny; bez zmiany danych lub Daru użytkownika.
## 2026-11-08 — Powrót do stosów z węższym wierzchem

- Zgodnie z korektą użytkownika przywrócono wcześniejszy projekt dwóch stosów. Zwężono tylko górne elipsy do szerokości dolnych elementów: lewy stos x=5–41, prawy x=53–94. Usunięto wariant osobnych krążków przypominających kamyki. Symbol i wartość pozostają rozdzielone. Build poprawny.
## 2026-11-08 — Wyrównanie stosów monet po ręcznej edycji

- Zachowano obie górne elipsy zmienione przez użytkownika. Wyrównano boczne krawędzie dolnych elementów do elips (lewy x=15.63–51.63, prawy x=53–94), spłaszczono łuki i ujednolicono odstępy. Usunięto pustą ścieżkę Illustratora.
- Build poprawny; obejrzano powiększony render SVG. Bez zmian wartości kosztu, bazy i pozostałych ikon.
## 2026-11-08 — Tuszowe monety i głębia ustawienia

- Zastąpiono idealnie równe krawędzie monet subtelnymi nieregularnościami krzywych, grubości i brzegów; bez ząbkowania. Mniejszy stos przesunięto o 5 jednostek w lewo i 7 w dół, aby stał wizualnie przed większym. Zachowano dwa stosy i oddzielną wartość.
- Build poprawny; obejrzano powiększony render SVG. Bez zmian bazy i pozostałych ikon.
## 2026-11-08 — Wartość w lewym górnym rogu monet

- costAmount i cost pozostają niezależnymi obiektami, ale przy wspólnej widoczności zajmują jedno miejsce w rzędzie: X wartości wyrównany do lewej symbolu. Domyślna wartość ma obszar 7 × 10 pt nad niższym stosem, Y=4.7 przy symbolu Y=6.2; własne Y/rozmiar/kolor/oko nadal edytowalne. Po ukryciu jednego drugi jest normalnym członem rzędu. Szerokość grupy jest maksimum obu szerokości, bez dodatkowej luki między cyfrą a monetami.
- TS i PHP stosują tę samą normalizację; poprzedni standardowy obszar wartości 8 × 16.55 jest dopasowany do nowego domyślnego układu przy odczycie, bez przepisywania historii. Same monety bez zmian rozmiaru.
- Build i PHP lint poprawne; check-cost-corner.cjs sprawdził pozycję XY, cyfry, niezależne oczy, zapis/reload/miniaturę i konwersję. Obejrzano screenshot. Usunięto wyłącznie dwie wersje szablonu QA; jeden szablon użytkownika zachowany.
## 2026-11-08 — Tuszowe cyfry kosztu zamiast fontu

- TemplateCostValue korzysta z krzywych 0–9 w hand-drawn-digits.ts zamiast tekstu Linux Libertine. Pochylenie i zmienna grubość kreski nawiązują do Raz na scenę; ścieżka jedynki identyczna z tą w ink/once.svg. Rozmiar, kolor, pozycja i niezależne oko wartości zachowane; zero ma własną ścieżkę, bez ukrywania.
- Build poprawny; sprawdzono komplet dziesięciu krzywych i identyczność jedynki, obejrzano planszę cyfr. check-vector-cost.cjs potwierdził zmianę wszystkich wartości 0–9 i niezależną widoczność w przeglądarce, bez błędów JS. Bez zmiany bazy, monet i innych ikon.
## 2026-11-08 — Duża wartość kosztu po lewej

- Zamiast cyfry nad niższym stosem ustawiono duży obszar wartości 12 × 18 pt po lewej monet, wyśrodkowany względem ich domyślnego Y. Między costAmount i cost nie doliczamy odstępu rzędu. Pozostałe odstępy i niezależność obiektów zachowane. Cyfry SVG mają ciasne viewBox wyliczone z krzywych i wyrównanie do prawej, bez marginesu fontu.
- Dawne standardowe rozmiary wartości dopasowywane przy odczycie; dane historyczne bez przepisywania. Build i PHP lint poprawne; check-cost-left.cjs sprawdził cyfry 0–9, niezależne oczy, zapis/reload/miniaturę, zerową lukę geometrii i konwersję. Usunięto tylko dwie wersje szablonu QA; jeden szablon użytkownika pozostał.
## 2026-11-08 — Zamiana stosów monet miejscami

- Przeniesiono wysoki stos na lewo, a niski na prawo. Zachowano kształty monet i pionowe przesunięcie niższego stosu. Build poprawny; bez zmiany cyfry i danych.
## 2026-11-08 — Podniesienie małego stosu

- Podniesiono mały prawy stos monet o 11 jednostek SVG, tak aby dolna krawędź była lekko powyżej dołu dużego stosu. Położenie poziome i kształty bez zmian. Build poprawny.
## 2026-11-08 — Spokojniejsza kreska Zagrywki

- Zmniejszono drobne poszarpania tuszowej Zagrywki. Zmienność krawędzi jest łagodniejsza i rozłożona na dłuższe odcinki; spiralny kształt zachowany. Kopia wcześniejszej kreski w wtf_www/local-scripts/one-off/play-before-smoother-line.svg. Monety i ręcznie poprawiony Dar bez zmian.
- Build i podgląd poprawne, obejrzano screenshot. Bez zapisu danych i wdrożenia.
## 2026-11-08 — Falowanie Zagrywki podobne do heksa

- Na potwierdzone polecenie użytkownika dodano szersze, nieregularne odchylenia krawędzi tuszowej Zagrywki, zachowując spiralę. Operacja na aktualnym SVG, kopia w wtf_www/local-scripts/one-off/play-before-hex-wave.svg. Bez drobnego losowego ząbkowania. Build i kontrola podglądu poprawne; obejrzano screenshot. Monety i Dar bez zmian.
## 2026-11-08 — Usunięcie marginesów ikon SVG

- Dopasowano viewBox 19 plików ikon z assets/talent-template oraz ink do kształtów. Zmieniono wyłącznie atrybut viewBox; automatyczne porównanie potwierdziło identyczność reszty każdego pliku, w tym ręcznych poprawek użytkownika. Granice wektorowe z getBBox, dla oryginalnego once.svg widoczny kanał alfa uwzględniający clipPath i cyfrę (próbkowanie 4096 px). Cyfry kosztu już miały własne ciasne viewBox.
- Ramki nie są ikonami i pozostawiono ich skoordynowane kontury tła bez zmian. Nie zmieniano zapisanej geometrii obiektów, zatem symbole z dawniej dużym marginesem zajmują teraz więcej swojego obszaru. Zachowane proporcje mogą nadal powodować wolne miejsce w prostokącie obiektu — to nie margines pliku SVG.
- Kopie wszystkich ikon przed zmianą i raport pomiarów: wtf_www/local-scripts/one-off/icon-margins-before-20261108/. Build poprawny; kontrola przeglądarkowa i obejrzany screenshot bez błędów JS. Bez zmiany bazy lub wdrożenia.
## 2026-11-08 — Minimalny odstęp kosztu i przycięcie Daru

- Między costAmount a cost dodano stały minimalny odstęp 1 pt, zgodnie w układzie TS i PHP. Pozostałe odstępy bez zmian.
- Tuszowy Dar Ciemności lekko przycięto pionowo przez viewBox: 1% dotychczasowej wysokości z góry i 1% z dołu. Krzywe ręcznie poprawione przez użytkownika bez zmian. To lekkie przycięcie obrysu, nie ponowne usuwanie marginesu, który był już zerowy.
- Build i PHP lint poprawne; check-cost-small-gap.cjs potwierdził 1 pt przerwy, cyfry i niezależną widoczność, bez zapisu danych i błędów JS.
## 2026-11-08 — Mocniej powykrzywiana Zagrywka

- Przerobiono aktualną tuszową spiralę: szersze nieregularne załamania, miejscowe zwężenie ciężkiej kreski i mniej drobnych węzłów. Zachowano charakter spirali i ciasny viewBox bez pustych marginesów. Kopia poprzedniej wersji w wtf_www/local-scripts/one-off/play-before-crooked.svg.
- Build poprawny; kontrola podglądu i obejrzany screenshot. Pozostałe ikony, dane i produkcja bez zmian.
## 2026-11-08 — Ograniczenie jako warstwa nad treścią

- Usunięto rezerwację całego dolnego pasa i odstęp 4 pt nad restriction. Mechanika otrzymuje pełną zapisaną wysokość niezależnie od widoczności ograniczenia. Człowiek odpowiada za brak kolizji tekstu z napisem.
- Restriction rysowane na końcu zarówno w podglądzie, jak i miniaturze. Pod samym tekstem (nie całym obszarem obiektu) dodano nieprzezroczyste tło w kolorze tła karty z małym poziomym odstępem. Parametry i krzywe ikon bez zmian, bez nowych pól bazy.
- Build poprawny; check-restriction-overlay.cjs potwierdził pełne 71.66 pt wysokości, niezmienność po ukryciu/pokazaniu, końcową warstwę, tło ograniczone do napisu i brak błędów JS. Obejrzano screenshot. Bez zapisu danych i wdrożenia.
## 2026-11-08 — Górne symbole wyżej, ograniczenie niżej

- Podniesiono o 1 pt heks, zaznaczenie, wartość i symbol kosztu, Zagrywkę, Dar, zasady specjalne, Nieodnawialny oraz oba symbole użyć. Ograniczenie dostępności obniżono o 1 pt. Odpowiada to ok. 3 px w domyślnym podglądzie 200%. Ramka i główny blok tekstu bez zmian.
- Dostosowano domyślny układ nowych szablonów i zapisano wersję 35 istniejącego szablonu e8cf7dd1-0a5d-47aa-9898-fca1dce5b89d, po sprawdzeniu rewizji 34. Kopia poprzedniego dokumentu: wtf_www/backups/klanarchia-editor/20261108/before-decoration-shift.json. Historia zachowana.
- Build poprawny; API potwierdziło zapis i niezmienność ramki oraz wszystkich pól głównego tekstu. Bez zmiany ikon SVG i wdrożenia.
## 2026-11-08 — Ograniczenie przy dolnej krawędzi, ramka L

- Domyślnie obszar restriction kończy się 3.5 pt nad dolną krawędzią karty; tekst wyrównany do dołu obszaru. Pod napisem zachowano tło, dodano tylko górną i lewą linię 0.45 pt w kolorze ramki z palety, z niewielkim odstępem od liter. Nadal jest warstwą bez rezerwacji miejsca na mechanikę.
- W istniejącym szablonie zapisano wersję 36 (wcześniej 35), kopia przed zmianą w wtf_www/backups/klanarchia-editor/20261108/before-restriction-bottom.json. Zmieniono wyłącznie Y ograniczenia, poprzednia historia zachowana.
- Build poprawny; kontrola API i przeglądarki potwierdziła zapis oraz obecność wyłącznie górnej i lewej linii. Obejrzano screenshot, brak błędów JS. Bez wdrożenia.
## 2026-11-08 — Połączenie obramowania ograniczenia i naprawa łamania tekstu

- Zastąpiono proste obramowanie CSS tuszową krzywą L. Po zmierzeniu napisu górna linia dochodzi do prawej ramki, lewa do dolnej; tło obejmuje dolny prawy narożnik i jest przycinane wspólnym konturem karty. Ponowne nałożenie głównej ramki zachowuje jej kreskę na połączeniach. Nadal brak rezerwacji miejsca w mechanice. Wspólne działanie w podglądzie i miniaturach, bez zmiany geometrii zapisanej w bazie.
- Przyczyna dziwnego łamania: regex z ASCII-owym \b uznawał końcowe w w słowie przodków za osobne słowo i wstawiał po nim NBSP, wiążąc przodków z i inkwizycją. Wspólny polish-typography.ts rozpoznaje granice Unicode i naprawia takie wcześniejsze błędne NBSP; nadal wiąże rzeczywiste jednoliterowe słowa z następnym wyrazem. Używany przez dane przykładowe i edytor.
- Build poprawny; regresje Unicode i naprawy NBSP przeszły. check-connected-restriction.cjs potwierdził połączenie obu końców ramki z obrysem oraz poprawne spacje w renderowanej mechanice. Obejrzano screenshot; brak błędów JS. Bez zapisu bazy i wdrożenia.
## 2026-11-08 — Delikatna plama pod ograniczeniem

- Zrezygnowano z obramowania L łączącego ograniczenie z ramką. Pod samym napisem jest jasna, nieprzezroczysta plama z nieregularnymi brzegami, bez konturu. Odcień to 11% koloru ramki zmieszanego z tłem karty; dopasowuje się do aktualnych kolorów bez nowego pola bazy. Zachowano warstwę nad mechaniką, brak rezerwowania miejsca i pozycję napisu.
- Build poprawny; check-soft-patch.cjs potwierdził plamę wewnątrz karty, brak poprzedniej ramki i brak błędów JS. Obejrzano screenshot. Bez zmiany danych i wdrożenia.
## 2026-11-08 — Jasne tło do prawej i dolnej ramki

- Rozciągnięto nieregularną jasną plamę do prawego i dolnego obrysu karty. Maska oparta o wspólny kontur tła zachowuje przezroczystość poza ramką, a ponowne nałożenie głównej ramki zachowuje jej krawędź. Bez przywracania obramowania L.
- Domyślny prawy margines obszaru napisu zmniejszono z 7 do 3 pt, dodatkowy prawy odstęp liter do 0.5 pt. W istniejącym szablonie zmieniono tylko X restriction i zapisano wersję 37; kopia w wtf_www/backups/klanarchia-editor/20261108/before-restriction-right.json. Y i reszta obiektów bez zmian.
- Build poprawny; zapis i podgląd sprawdzone. check-corner-patch.cjs potwierdził zasięg do brzegów i brak błędów JS; obejrzano screenshot bez okna cookies. Bez wdrożenia.
## 2026-11-08 — Prawy margines ograniczenia 4 pt

- Zwiększono prawy margines obszaru napisu z 3 do 4 pt, bez zmiany zasięgu jasnego tła do ramki. Dostosowano domyślny układ i zapisano wersję 38 bieżącego szablonu; kopia przed zmianą w before-restriction-right-4pt.json w lokalnym katalogu kopii 20261108. Build i zapis API poprawne.
## 2026-11-08 — Próbne uporządkowanie górnego pasa

- Zgodnie z poleceniem użytkownika zapisano eksperymentalny układ w istniejącym szablonie: rewizja 38 → 39. Wszystkie górne elementy mają wspólny środek Y=12.2 pt, wielkości dobrane optycznie; Dar i wykrzyknik mniejsze, heks pozostaje kotwicą. Rząd od X=27.25 z odstępem 3.2 pt (koszt zachowuje własny 1 pt). Pola użyć i Raz na scenę ustawione obok siebie po prawej. Nie wprowadzono reguły wykluczającej ich widoczność.
- Tytuł/fabuła/mechanika nadal w jednym ciągu. Ich geometria i style, ramka, ograniczenie dostępności oraz SVG ikon pozostają identyczne. Domyślnego układu nowych szablonów nie zmieniano — to próba do oceny na konkretnym szablonie.
- Pełna kopia przed próbą: wtf_www/backups/klanarchia-editor/20261108/before-header-arrangement.json; po próbie: after-header-arrangement.json. Gotowe przywracanie wyłącznie górnego pasa: local-scripts/one-off/editor-database-20261107/restore-header-arrangement.cjs (uruchomić z wtf_www tylko na polecenie użytkownika; zapisuje nową wersję, zachowuje późniejsze zmiany reszty szablonu).
- Weryfikacja: kontrola rewizji przed zapisem, porównanie niezmienności wszystkich pól treści i stylów, sprawdzenie dopasowania napisu Nieodnawialny, obejrzany screenshot bez okna cookies i brak błędów JS. To zmiana ustawień przez API; kod aplikacji i baza strukturalnie bez zmian. Bez wdrożenia.
## 2026-11-08 — Korekta wspólnego miejsca symboli użyć

- Użytkownik doprecyzował: na talencie Pola użyć i Raz na scenę wykluczają się, więc zajmują to samo miejsce. Edytor świadomie pozwala pokazać oba jednocześnie do projektowania; nie blokować ich oczu.
- Poprawiono próbę górnego pasa: wspólna prawa krawędź i środek Y obu obiektów, z zachowaniem ich różnych wymiarów. Zapisano rewizję 40 bieżącego szablonu. Kopia poprzedniej wersji w wtf_www/backups/klanarchia-editor/20261108/before-usage-overlap.json; pełne ustawienia przed całym eksperymentem nadal w before-header-arrangement.json.
- Kontrola API potwierdziła wspólne wyrównanie, niezależne stany widoczności i niezmienność reszty obiektów. Kod aplikacji bez zmian, bez wdrożenia.
## 2026-11-09 — Wyrównanie tekstu miniatury

- Dodano jawne text-align:left do kt-card-copy, aby tekst miniatury nie dziedziczył centrowania przycisku otwierającego szablon. Własne wyrównanie podpisu ograniczenia do prawej zachowane.
- Build poprawny; check-thumbnail-alignment.cjs potwierdził tekst do lewej, brak centrowania i podpis do prawej. Bez zmiany danych i wdrożenia.
## 2026-11-09 — Szybki eksport jednej karty do PDF

- Wygenerowano exports/Prymat-potepienca-proba.pdf: jedna strona A4, pojedyncza karta w rzeczywistym rozmiarze ok. 65.50 × 35.90 mm (185.67 × 101.76 pt), 10 mm marginesu arkusza, bez obrysów i uchwytów edytora. To plik próbny, bez dodawania interfejsu eksportu. Fonty Libertine i wszystkie SVG osadzone, bez zależności sieciowych przy druku.
- Eksport wiernie odtwarza zapisany szablon i podgląd przykładowego Prymatu potępieńca. Obecna pełna mechanika przekracza wysokość obszaru tekstowego; końcówka w PDF jest ucięta tak jak w podglądzie. Nie zmieniano wielkości fontu, treści ani geometrii w celu ukrycia przepełnienia.
- Weryfikacja: poprawny plik PDF (72 511 B), jedna strona, cztery osadzone strumienie fontów, pomiar rozmiaru wydruku w pt oraz obejrzany render karty. Skrypt jednorazowy: wtf_www/local-scripts/one-off/editor-database-20261107/export-single-talent-pdf.cjs. Bez zmiany bazy lub wdrożenia.
## 2026-11-09 — Przycisk Drukuj / PDF w kreatorze

- Po doprecyzowaniu użytkownika dodano przycisk Drukuj / PDF przy podglądzie. Otwiera okno z bieżącą kartą (także z niezapisanymi danymi do podglądu) i dialog drukowania przeglądarki z możliwością Zapisz jako PDF. A4, margines 10 mm, skala fizyczna 1:1 według wymiarów szablonu; bez obrysów, zaznaczeń i uchwytów. Nie dodano biblioteki PDF.
- print-talent.ts przygotowuje kopię SVG z osadzonymi grafikami i fontami Libertine, czeka na ich gotowość. Stan przygotowywania i blokada ponownego kliknięcia, komunikat błędu przy blokadzie okna, ponowna próba możliwa. Osobny widok ma ponowny przycisk druku i wskazówkę 100%, ukrywane na wydruku. PL/EN.
- Build poprawny; check-print-button.cjs potwierdził obsługę zablokowanego popupu i retry, bieżące niezapisane dane, czysty SVG, osadzone zasoby, fizyczny rozmiar oraz wygenerowany A4 PDF. Bez zapisu danych lub wdrożenia. Eksport nie zmienia układu ani nie usuwa przepełnienia tekstu widocznego w podglądzie.
## 2026-11-09 — Przycisk PDF obok Zapisz

- Przeniesiono przycisk wydruku z paska podglądu bezpośrednio za Zapisz w górnym pasku akcji. Etykieta spoczynkowa PDF w obu językach; stan przygotowywania i działanie bez zmian. Build poprawny.
## 2026-11-09 — Przywrócenie widoczności edytora lokalnego

- Przyczyna braku edytora: kontener WordPress uruchomiony wyłącznie z bazowego Compose wtf_www, bez bind mount wtyczki klanarchia-edytor. W logu Vite odnotowano również wcześniejszy błąd EIO obserwacji /workspace. Pliki projektu były zachowane; biblioteka nie została usunięta.
- Uruchomiono Klanarchia_edytor/start-dev.bat, który odtworzył kontener WordPress z compose.editor.yml i potwierdził aktywność wtyczki. Bazy i wolumenów nie usuwano. Konfiguracja Vite ma już polling; nie zmieniano jej.
- Przeglądarka administratora: strona HTTP 200, aplikacja renderuje się, brak błędów JS i nieudanych żądań. Sprawdzono odczyt zachowanych szablonów, otwarcie kreatora i dostępność przycisku PDF. Pliki testowe sesji odtworzono wyłącznie w /tmp kontenera, bez ujawniania tokenów. Bez zmian produkcji.
## 2026-11-09 — Ramka do łączenia, oparta na oryginalnym tuszu

- Wymaganie: pary góra/dół oraz lewy/prawy mają pasować przy układaniu kart bez odstępów. Użytkownik wymaga wyraźnie atramentowych zniekształceń jak w wariancie oryginalnym; pierwsza zbyt prosta próba została zastąpiona.
- Dodano frameVariant joined (Tuszowa — do łączenia), obok zachowanych original/ink. Środkowe 90% przebiegów poziomego i pionowego wyprowadzono z rzeczywistych zewnętrznych i wewnętrznych konturów oryginalnego frame.svg. Zachowano i lekko uwydatniono jego odchylenia i zmienną grubość; po 5% przy końcach służy przejściu do dopasowanych, łagodniejszych narożników. Przeciwległe przebiegi są dokładnymi translacjami, bez lustrzanego odbicia.
- frame-joined.svg zawiera dwa powtarzane boki i wspólną ścieżkę narożników. TemplateFrame renderuje te ścieżki inline, z overflow=visible w podglądzie/miniaturach/PDF, aby kreska przechodziła przez granicę nominalnej komórki i wspólne boki nakładały się zamiast sumować szerokość. joined-frame-contour.ts odpowiada rzeczywistemu zewnętrznemu obrysowi, więc tło nie wystaje prostokątem i zachowuje przezroczystość poza kreską.
- Wybrano joined w istniejącym szablonie: rewizja 41, zmieniono wyłącznie wariant ramki. Kopia poprzedniego dokumentu: wtf_www/backups/klanarchia-editor/20261109/before-joined-frame.json. Nowe szablony domyślnie joined, stare bez pola nadal original. TS i PHP walidują trzeci wariant; brak DDL. Oryginalne SVG niezmienione.
- Próba bez odstępów: exports/ramka-laczona-2x2.svg. Porównanie d potwierdziło identyczne pary oraz translacje o 185.67 i 101.76 pt; narożniki bez szczelin. Obejrzano oryginał, siatkę 2×2 i poprawiony podgląd karty. Build i PHP lint poprawne, test API/przełączania wariantów i niezmienności reszty szablonu przeszedł. Test przycisku PDF potwierdził fizyczne wymiary, osadzone zasoby i czysty wydruk. Bez wdrożenia.
## 2026-11-09 — Uproszczenie palety tekstów

- Na polecenie użytkownika Atrament zastąpiono kolorem Czarny (#000000), Fiolet opowieści kolorem Błękit Zmroku (#3e5074). Wycofano dwa stare rekordy z aktywnej palety, bez fizycznego usuwania historycznych odwołań. Aktualny szablon zapisany jako rewizja 42 z nowymi ID i RGB; geometria i treść bez zmian. W oznaczeniach nie znaleziono użyć wymagających podmiany.
- Dodano rozpoznawanie dawnych ID jako aliasów docelowych kolorów w odczycie/walidacji. Mapa historycznych HEX wskazuje nowe ID. Domyślne style nowych szablonów używają czerni i Błękitu Zmroku, a ke text-colours nie odtwarza wycofanych kolorów. Stary stan panelu nie może ponownie zapisać ich ID do palety.
- Kopia 7 tabel edytora i mapy HEX przed zmianą: wtf_www/backups/klanarchia-editor/20261109/before-retire-colours.json. Jednorazowa transakcyjna zamiana: local-scripts/one-off/editor-retire-colours.php, poza kodem wtyczki.
- Build i PHP lint poprawne. Test API/podglądu potwierdził brak obu nazw w palecie oraz czarne teksty i błękitną fabułę. Ponownie uruchomiono ke text-colours i potwierdzono brak odtworzenia kolorów. Porównanie 41 wcześniejszych wersji dokumentów i metadanych z kopią potwierdziło pełną niezmienność historii. Bez DDL i wdrożenia.
## 2026-11-09 — Wspólne warianty graficzne i katalogi zasobów

- Zastąpiono Zestaw ikon wspólnym wyborem Warianty graficzne. Usunięto niezależne selektory ramki i kosztu. Zmiana dotyczy wszystkich grafik, także konturu ramki i tła ograniczenia; teksty, pozycje, rozmiary, widoczność i kolory bez zmian.
- Cztery kompletne katalogi: original, ink, ink-experimental, ink-original-frame. Każdy ma identyczny zestaw 13 nazw SVG, bez używania plików zapasowych innego katalogu. Dwa wcześniejsze tuszowe zestawienia ramek zachowane dla zgodności historii. Ręcznie poprawiony przez użytkownika Dar Ciemności skopiowany bajt w bajt. Fonty i wspólne cyfry kosztu pozostają ustawieniem tekstu.
- Wspólny rejestr graphic-variants.ts obsługuje listę, podgląd, miniaturę, samodzielną ikonę kosztu w tekście i PDF. Kontury tła i źródłowe ramki przeniesiono do katalogów wariantów; usunięto nieużywany icon-set.ts i osobne moduły konturów. Wszystkie stare luźne SVG przeniesione poza aktywne źródło po sprawdzeniu kopii, bez zmiany starego projektu Klanarchia_karty_postaci.
- Zapis używa tylko graphicVariant. Stare trzy pola przyjmowane przez parser/API i mapowane na kompletny wariant; API nie zwraca osobnych ustawień. Bez nowych tabel. Aktualny szablon zapisano w rewizji 43 z graphicVariant=ink; geometria i style identyczne. Potwierdzono niezmienność 42 wcześniejszych wersji.
- Kopia kodu, źródłowych grafik i bazy: wtf_www/backups/klanarchia-editor/20261109/before-graphic-variants/. Szczegóły nazw i struktury: Warianty graficzne.md.
- Build i lint PHP poprawne. Test sprawdził równe zestawy plików, zgodność ręcznej grafiki, przełączenie wszystkich wariantów, brak osobnych selektorów, niezmienność geometrii/stylów, zapis/odczyt, konwersję starszych pól i odrzucenie nieznanego wariantu. Usunięto wyłącznie trzy wersje rekordu QA. Test PDF potwierdził działanie po reorganizacji. Bez wdrożenia.
## 2026-11-09 — Tylko Oryginalny i Tuszowy

- Pozostawiono wyłącznie original i ink w interfejsie, rejestrze i aktywnych katalogach. Dawne ink-experimental i ink-original-frame mapowane przy odczycie na ink; historyczne dokumenty bez zmian. Usunięte katalogi przeniesiono do wtf_www/backups/klanarchia-editor/20261109/retired-graphic-variants/ po sprawdzeniu ścieżek. Aktualny szablon już używa ink, bez zmiany wersji.
- Build i PHP lint poprawne; test menu potwierdził dokładnie dwie opcje oraz przełączanie. Bez zapisu danych lub wdrożenia.
## 2026-11-09 — Inicjalizacja lokalnego repozytorium Git

- Utworzono osobne repozytorium Klanarchia_edytor z gałęzią main. Nie tworzono commitu ani połączenia ze zdalnym serwerem; indeks pozostał pusty, pliki gotowe do pierwszego dodania.
- Uzupełniono .gitignore: zależności, dist, cache, próbne exports, kopie, sekrety, lokalne .env i pliki robocze. Wzorce .env.example/.sample/.template pozostają do wersjonowania. Rootowe dumpy SQL ignorowane, przyszłe schematy SQL w kodzie nie są blokowane. Źródłowe SVG, fonty, licencja, package-lock.json i dokumentacja pozostają w repozytorium.
- Dodano .gitattributes: LF dla tekstów/kodu/SVG, CRLF w katalogu roboczym dla bat/cmd/ps1, grafiki rastrowe/fonty/PDF/archiwa jako binarne bez konwersji. Nie zmieniano globalnej konfiguracji Gita ani kodowania istniejących plików.
- Weryfikacja: 21 sprawdzeń reguł ignore, kontrola atrybutów tekstowych i binarnych, 89 kandydatów do wersjonowania, git add --dry-run poprawny. Potwierdzono brak eksportów, dist i node_modules na liście oraz pusty indeks. Bez zmian aplikacji, bazy i wdrożenia.
## 2026-11-09 — Podłączenie GitHub i pierwszy push

- Na wskazany przez użytkownika adres ustawiono origin: https://github.com/dimundi/klanarchia_edytor.git. Repozytorium zdalne było puste. Utworzono i wysłano pierwszy commit fcb3efe (Initial Klanarchia editor project), gałąź main śledzi origin/main. Hash zdalnej gałęzi zgodny z lokalnym.
- Potwierdzono brak node_modules, dist, exports, secrets i .env w śledzonych plikach. Usunięto kilka końcowych spacji i dodatkową pustą linię wykrytych przez git show --check; bez zmiany działania aplikacji. Zaktualizowano opis środowiska. GitHub nie jest wdrożeniem strony — produkcji nie zmieniano.

## 2026-11-09 — Pierwsza grupa biblioteki talentów

- Zatwierdzono grupę Talenty archetypów z dziewięcioma podgrupami archetypów. Zapisano drzewo w Biblioteka talentów.md oraz odwołania w projekcie i propozycji bazy.
- Zachowano wcześniejsze polecenie niekodowania: istniejący projekt tabel kategorii pozostaje projektem, nie tworzono kodu, tabel ani rekordów w bazie. Dokument uwzględnia uzgodnione przeglądanie grup/podgrup, zaznaczanie, eksport/porównanie i wejście do kreatora z podgrupy. Widoki listy/kart nadal do dopracowania.
- Weryfikacja: jedna grupa i dziewięć nazw zgodnych ze zweryfikowaną listą archetypów; wyłącznie dokumentacja.
## 2026-11-09 — Uruchomiona biblioteka grup

- Moduł Talenty otwiera bibliotekę: drzewo grup/podgrup, rozwijanie, niezależne zaznaczanie i eksport struktury grup do JSON. Kliknięcie nazwy wybiera zakres. Przejście do innego modułu zachowuje kontekst podczas tej samej sesji aplikacji.
- Można tworzyć grupy i podgrupy. API zapisuje je w bazie; odrzuca puste/powtórzone nazwy i trzeci poziom. Dostęp nadal tylko dla administratora. PL/EN interfejs, nazwy kategorii mają fallback PL; nie wymyślano tłumaczeń archetypów.
- Dwie nowe tabele: ke_talent_categories oraz ke_talent_category_texts, klucze obce, UUID, autor/data utworzenia. Oddzielna wersja ke_library_schema_version=1; istniejący schemat palety/szablonów pozostaje w wersji 1. Jawna, powtarzalna inicjalizacja: `wp ke library-init --user=1 --allow-root`. Bez migracji przy odwiedzinach.
- Utworzono Talenty archetypów i dziewięć podgrup. Nie importowano treści talentów. Kreator talentu, jego zapis/historia, porównywanie, eksport kart i lista/karty pozostają kolejnym etapem. Obecny eksport dotyczy wyłącznie struktury grup.
- Kopia bazy: wtf_www/backups/klanarchia-editor/20261109/before-library/database.sql. Stary projekt bez zmian.
- Weryfikacja: PHP lint i build TS/Vite poprawne. Test przeglądarkowy: 10 kategorii, zaznaczanie, pobranie eksportu, zachowanie kontekstu, tworzenie grup/podgrup i odczyt po odświeżeniu, błędy nazw/głębokości, odmowa dostępu anonimowi/klientowi, szerokość mobilna, brak błędów JS. Usunięto wyłącznie dwie grupy QA; pozostało 10 kategorii, 1 szablon i 43 wersje. Ponowna inicjalizacja bez duplikatów. Bez wdrożenia produkcyjnego.

## 2026-11-09 — Uproszczenie biblioteki

- Usunięto nad biblioteką nagłówek Projektowanie / Talenty i eksport struktury grup (wraz z obsługą pobierania JSON). Pozostawiono zaznaczanie grup do przyszłych działań na talentach.
- Liczniki dotyczą talentów, nie podgrup. Aktualnie wszystkie wynoszą 0, ponieważ nie istnieją jeszcze rekordy talentów; po wdrożeniu ich zapisu należy podłączyć rzeczywiste zliczanie z bazy, z sumą potomków dla grupy nadrzędnej.
- Weryfikacja: kompilacja TypeScript/Vite i git diff --check poprawne. Bez zmian danych ani wdrożenia.

## 2026-11-09 — Bez widoku całej biblioteki

- Usunięto przycisk Cała biblioteka. Po wczytaniu wybierana jest pierwsza grupa nadrzędna (obecnie Talenty archetypów); dalsze przeglądanie przez grupy i podgrupy.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Bez zmian bazy.

## 2026-11-09 — Usunięcie wyszukiwania z biblioteki

- Na polecenie użytkownika usunięto pole Szukaj talentu, jego stan i nieużywane style. Umiejscowienie i zasady wyszukiwania wymagają osobnego ustalenia.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Bez zmian danych.

## 2026-11-09 — Miejsce przycisku tworzenia talentu

- Dodano + Utwórz talent po prawej stronie nagłówka wybranej podgrupy (PL/EN). W grupie nadrzędnej pozostaje + Podgrupa. To podgląd umiejscowienia: przycisk nieaktywny, z opisem o przygotowywanym edytorze talentu; bez pozornego zapisu i nowych danych.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Bez zmian bazy.

## 2026-11-09 — Roboczy edytor talentu

- Przycisk Utwórz talent otwiera edytor w kontekście podgrupy. Trzy kolumny: treść, podgląd pośrodku, ustawienia. Wybór szablonu z istniejącej bazy, tytuł/fabuła/mechanika/ograniczenie, oznaczenia, koszt 0–9, wykluczające się pola użyć/raz na scenę, indywidualne nadpisanie interlinii fabuły/mechaniki.
- Podgląd korzysta ze współdzielonego renderera miniatur, rozszerzonego o opcjonalną treść; dotychczasowe miniatury szablonów zachowują przykład. Nie zmienia szablonów w bazie. Powrót wymaga potwierdzenia odrzucenia zmienionego szkicu; odświeżenie ostrzega przed utratą. Przejście do innego modułu zachowuje otwarty szkic w pamięci.
- Jawnie oznaczony szkic bez zapisu do bazy. Nie utworzono tabel/wersji talentów ani historii. Formatowania oznaczeń i zmienna liczba pól użyć pozostają do podłączenia; obecne pola użyć odtwarzają szablon. Brak importu talentów. Zapis i historia wymagają osobnego etapu.
- Weryfikacja: build TypeScript/Vite poprawny.
- Test przeglądarkowy przeszedł: wejście z podgrupy, podgląd szablonu z bazy, aktualizacja tekstu i kosztu SVG, tryby użyć, ograniczenie, potwierdzenie odrzucenia i powrót do tej samej podgrupy; brak błędów JS i zapisów do bazy. Dodano jednoznaczne etykiety dostępności pól wyboru.

## 2026-11-09 — Konfiguracja podglądu talentu

- Obok Podgląd dodano obrysową zębatkę zgodną z kreatorem szablonu. Panel: szachownica, biały, szary, ciemny, przygaszony beż z gradientem i własny kolor. Domyślnie beż; klik poza panelem i Escape zamykają ustawienia.
- Przełącznik Pokaż tło ramki dotyczy wyłącznie kopii do renderowania podglądu. Nie zmienia szablonu ani treści i nie oznacza talentu jako zmienionego. Domyślnie respektuje widoczność tła szablonu, ale pozwala ją nadpisać w obu kierunkach.
- Weryfikacja: kompilacja TypeScript/Vite poprawna; bez zmian bazy.

## 2026-11-09 — Koszt i użycia pod ręką

- Wartość kosztu przeniesiono do wiersza Koszt; pole 0–9 stale widoczne, aktywne po włączeniu kosztu. Zachowuje wartość po wyłączeniu symbolu.
- Listę rozwijaną użyć zastąpiono trzema widocznymi opcjami radiowymi z klikalnym całym wierszem: Brak, Pola użyć, Raz na scenę. Wybór nadal wzajemnie wykluczający.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Bez zmian bazy.

## 2026-11-09 — Cztery tryby użyć talentu

- Użycia: Brak, Raz na misję (1 kwadrat), Trzy razy na misję (3 kwadraty), Raz na scenę. Jeden wybór radiowy, bez możliwości łączenia trybów.
- Renderer podglądu przyjmuje liczbę pól 1 lub 3; pojedynczy kwadrat zachowuje rozmiar i pozycję pierwszego pola szablonu. Miniatury szablonów nadal domyślnie pokazują trzy pola.
- Weryfikacja: TypeScript/Vite poprawne. Test przeglądarkowy potwierdził przełączanie czterech opcji i odpowiednią liczbę grafik (0/1/3/1), podgląd tekstu/kosztu, powrót z potwierdzeniem i brak błędów JS. Bez zmian bazy.

## 2026-11-09 — Ikony użyć w jednym rzędzie

- Zastąpiono kolumnę radio czterema przyciskami ikon: brak, 1 kwadrat, 3 kwadraty, raz na scenę. Symbole z bieżącego wariantu graficznego; nazwy w tooltipach i etykietach dostępności, aktywny tryb wyróżniony oraz aria-pressed.
- Raz na misję renderuje trzeci (prawy) kwadrat w jego pozycji szablonu, bez zmiany rozmiaru. Trzy razy na misję pozostawia wszystkie trzy pola.
- Weryfikacja: kompilacja TS/Vite i test przeglądarkowy czterech przycisków oraz liczby symboli poprawne, bez błędów JS i bez zapisów do bazy.

## 2026-11-09 — Pozostałe oznaczenia jako ikony

- Checkboxy oznaczeń zastąpiono przyciskami ikon z aktywnym stanem, tooltipem i etykietą dostępności. Grafiki pochodzą z wybranego wariantu szablonu. Koszt ma pole wartości bezpośrednio przy monetach. Nieodnawialny zachowuje tekst jako swoje właściwe oznaczenie.
- Spójna siatka przycisków o wysokości 48 px, zgodna z użyciami. Usunięto nieużywane style dawnych wierszy checkboxów.
- Weryfikacja: kompilacja TypeScript/Vite i test przeglądarkowy edytora (koszt, tekst, cztery tryby użyć, powrót) poprawne. Bez błędów JS i zmian bazy.

## 2026-11-09 — Podpis i prawa kolumna

- Podpis przycisku nieodnawialny zaczyna się małą literą. Pole Ograniczenie dostępności przeniesiono z kolumny treści do prawej kolumny ustawień, przed interlinią.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Bez zmian danych.

## 2026-11-09 — Akcja i początkowa treść przykładowa

- Dodano przełącznik akcja w ustawieniach oznaczeń, dopisujący (akcja) przy tytule w podglądzie tak jak w kreatorze szablonów. Domyślnie wyłączony, bez przypisywania przykładowemu talentowi niezatwierdzonej cechy.
- Nowy szkic PL rozpoczyna się zatwierdzonym tytułem, fabułą i mechaniką Prymatu potępieńca ze współdzielonego example-talent.ts. Bez wymyślania tłumaczenia EN i bez tworzenia rekordu w bazie. Treść można od razu zmieniać.
- Dodano jawne etykiety dostępności pól fabuły/mechaniki, niezależne od ich wypełnionej treści.
- Weryfikacja: build TS/Vite poprawny; test przeglądarkowy potwierdził przykład oraz włączenie/wyłączenie (akcja), edycję treści, koszt/użycia i powrót; brak błędów JS i zapisów bazy.

## 2026-11-09 — Formatowanie treści talentu

- Sprawdzono odczytem stary TalentLibrary.tsx: prototyp używa **tekst**, *tekst*, [cecha: tekst], [aspekt: tekst], [stan: tekst]. Zachowano tę notację, bez zmian starego projektu.
- Wprowadzono wspólny komponent pola z paskiem B/I/Cecha/Aspekt/Stan przy tytule, fabule i mechanice. Przyciski formatują zaznaczenie, bez zaznaczenia wstawiają parę znaczników; ponowne kliknięcie po objęciu zaznaczenia zdejmuje oznaczenie. Zachowanie fokusu/karetki, limity długości; Ctrl/Cmd+B/I w polach wielowierszowych.
- Podgląd renderuje znaczniki z paletą i definicjami oznaczeń pobranymi przez usePalette ze wspólnego katalogu. Obsługuje kolory, tła, wagę, kursywę, podkreślenie, kapitaliki; rozmiar dziedziczy z szablonu. Odświeża po zapisaniu wspólnych stylów i po powrocie fokusu. Obsługiwane też własne znaczniki katalogu.
- Parser bez HTML, z limitem zagnieżdżenia; nieznane/niedomknięte oznaczenia pozostają widoczne. Łączenie oznaczeń i pogrubienia z kursywą działa. Miniatury szablonów bez treści talentu zachowują poprzedni sposób wyświetlania.
- Weryfikacja: TS/Vite i git diff --check poprawne. Test przeglądarkowy sprawdził 5 znaczników, otaczanie/zdejmowanie zaznaczeń, skrót B, style z bazy, zagnieżdżenia, jednoczesne bold/italic, błędne znaczniki i dosłowne HTML bez wykonania; brak błędów JS. Bez zmian bazy.

## 2026-11-09 — Białe znaki i style na pasku

- Formatowanie zawęża zaznaczenie do tekstu bez skrajnych białych znaków (także NBSP/tab/nowa linia). Zachowuje separatory poza znacznikami, aby nie sklejać wyrazów; samo zaznaczenie białych znaków nic nie wstawia.
- Nazwy Cecha/Aspekt/Stan na pasku pokazują faktyczny wspólny styl, łącznie z kolorem/tłem i kapitalikami. Współdzielona funkcja annotationStyle dla paska i podglądu, bez niezależnych ustawień.
- Weryfikacja: TS/Vite poprawne. Test przeglądarkowy potwierdził spacje poza [cecha: Wola], bold italic Cechy, tło Aspektu, small-caps Stanu; wcześniejsze testy parsera/formatowania nadal poprawne. Bez zmian bazy.

## 2026-11-09 — Formatowanie wyłącznie mechaniki

- Usunięto paski formatowania tytułu i fabuły. Znaczniki są interpretowane tylko w mechanice; pozostałe pola wyświetlają zwykły tekst ze stylem szablonu. Skróty formatowania w tych polach nieaktywne.
- Napis Aspekt na pasku ma ciemny kolor #202420 dla czytelności na tle oznaczenia. To lokalny wygląd przycisku; wspólnego stylu i podglądu talentu nie zmieniano.
- Weryfikacja: TS/Vite oraz test przeglądarkowy formatowania poprawne; potwierdzono jeden pasek przy mechanice i ciemny tekst Aspektu. Bez zmian danych.

## 2026-11-09 — Większa kolumna treści

- Poszerzono lewą kolumnę z 1fr/min.230 px do 1.5fr/min.340 px, przy podglądzie 1.6fr i ustawieniach .8fr. Zachowano progi responsywne 1000/600 px.
- Pola tytułu, fabuły i mechaniki: 18 px, interlinia 1.5, większy padding; etykiety 16 px, pasek formatowania 14 px. Bez zmiany typografii samej karty.
- Weryfikacja: kompilacja TS/Vite poprawna. Zmiana wyłącznie CSS, bez zmian danych.

## 2026-11-09 — Dzielenie wyrazów w ramce

- Włączono hyphens:auto dla tekstu karty, z jawnym lang PL/EN w podglądzie i kreatorze. Długie ciągi bez możliwości podziału mogą awaryjnie łamać się dzięki overflow-wrap:anywhere. Reguły zgodne również w oknie wydruku/PDF.
- Dzielenie słownikowe zależy od obsługi języka przez przeglądarkę/system; nie dodano własnego słownika ani zmian treści talentu.
- Weryfikacja: kompilacja TS/Vite poprawna. Bez zmian bazy.

## 2026-11-09 — Ostrzeżenie przepełnienia pod podglądem

- Dodano komunikat Tekst nie mieści się w ramce pod podglądem talentu, tylko po wykryciu przepełnienia pola treści. Pomiar scrollHeight/clientHeight i scrollWidth/clientWidth z tolerancją 1 px; bez automatycznego zmniejszania pisma.
- Pomiar odświeżany po zmianach DOM treści/stylów, zmianie rozmiaru i załadowaniu fontów. Kontrola obejmuje wspólny blok tytuł/fabuła/mechanika; celowe nakładanie ograniczenia dostępności nadal wymaga oceny człowieka. Niewidoczny blok nie zgłasza przepełnienia.
- Weryfikacja: TS/Vite poprawne. Test przeglądarkowy potwierdził komunikat dla długiej treści, jego usunięcie po skróceniu/wyczyszczeniu, pozycję pod podglądem oraz działanie przy szerokości mobilnej; bez błędów JS i zmian bazy.

## 2026-11-09 — Niezależne odstępy liter talentu

- Prawa kolumna: trzy pola Odstępy między literami (pt) — Tytuł, Fabuła, Mechanika. Niezależne lokalne nadpisania stylów kopii podglądu, bez zmiany szablonu; puste pole dziedziczy jego wartość. Zakres -2 do 10, krok .05 jak w kreatorze.
- Zmiana aktualizuje podgląd i pomiar przepełnienia; traktowana jako edycja szkicu. Zapis talentów do bazy pozostaje niewdrożony.
- Weryfikacja: kompilacja TS/Vite oraz test przeglądarkowy poprawne: niezależność trzech ról, wartości dodatnie/ujemne/0, powrót do szablonu po wyczyszczeniu. Bez błędów JS i zapisów bazy.

## 2026-11-09 — Trwały zapis talentów i historia

- Na polecenie użytkownika dodano zapis/otwieranie talentów w bazie WP zamiast szkicu wyłącznie w pamięci. Kopia bazy przed DDL: wtf_www/backups/klanarchia-editor/20261109/before-talent-save/database.sql. Jawna migracja CLI ke talents-init, cztery tabele, niezależna wersja modułu 1, siedem FK. Ponowna inicjalizacja bez zmian danych. Stary projekt nietknięty.
- API GET lista/rekord/historia i PUT UUID, admin+nonce/no-store, walidacja treści/oznaczeń/zakresów/podgrupy/szablonu. Wersje, teksty i zdarzenia w jednej transakcji; autor/czas z serwera; oczekiwana rewizja i 409 przy konflikcie. Oddzielne teksty PL/EN z zachowaniem innych języków przy każdej nowej wersji. Pola mechaniki i typografii obecnie w dokumencie ustawień; opisano różnicę wobec koncepcji kolumn w projekcie bazy.
- Przypięcie do template_version_id i odczyt dokładnie tej wersji, nie bieżącej wersji szablonu. Zapis wszystkich dotychczasowych pól/oznaczeń/odstępów; tło podglądu i przełącznik tła ramki nadal wyłącznie podglądowe. Nie zapisuje się wyrenderowanego HTML ani automatycznie wstawionych łączników.
- Przycisk Zapisz z kręciołkiem i blokadą wielokrotnego kliknięcia, status rewizji/niedopisanych zmian, błędy zachowujące szkic. Biblioteka listuje/otwiera talenty i sumuje rzeczywiste liczniki w grupach. Historia w edytorze: data, autor, wersja, czytelne nazwy zmienionych pól; bez przywracania.
- Weryfikacja: TS/Vite, PHP lint i diff --check poprawne. Przeglądarka: zapis i spinner, wszystkie pola/flag/odstępy, powrót/odświeżenie/otwarcie, liczniki, historia, odrzucenie starej rewizji i błędnych danych, PL/EN, brak dostępu anonimowi/klientowi, brak błędów JS. Osobny test błędu sieci i konfliktu potwierdził zachowanie szkicu i możliwość ponowienia.
- Kontrola SQL potwierdziła niezmienione treści wcześniejszych wersji, autorów, komplet języków, atomową historię i wspólną przypiętą wersję szablonu. Usunięto wyłącznie talent QA z 3 wersjami/zdarzeniami; po sprzątaniu 0 talentów. Nie zmieniano szablonów ani ich historii. Nie importowano talentów, nie publikowano produkcji.

## 2026-11-09 — Naprawa przedwczesnego łamania tytułu w Firefoksie

- Odczytano jedyny zapisany talent 80974984-aaa4-4692-85df-77785c3ee387, przypięty do szablonu rewizji 44. Tytuł Prymat potępieńca bez nowych linii i ukrytych łączników. Ujemne odstępy title=-.25, flavor=-.4, mechanics=null. Kopia odczytanego rekordu w wtf_www/backups/klanarchia-editor/20261109/saved-wrapping-record.json.
- Chrome/Edge nie odtwarzały objawu. Osobny tymczasowy profil Firefox i dokładny SVG zapisanego talentu odtworzyły identyczne złamanie po potępień przy pustej reszcie wiersza. Problem występuje przy hyphens:auto i ujemnym letter-spacing w drobnych jednostkach układu SVG; zerowe odstępy lub wyłączone dzielenie usuwały objaw, ale zmieniałyby zamierzony wygląd. Samo white-space/overflow-wrap nie naprawiało problemu.
- Dodano wspólny textRenderScale=8: HTML treści układany w 8-krotnie większych jednostkach i jednolicie skalowany z powrotem. Wymiary pola, font i odstępy skalowane razem; wielkość na karcie i parametry zapisane w bazie pozostają te same. Poprawka obejmuje podgląd talentu, miniatury i kreator szablonu, a przez klonowanie SVG także PDF. Dzielenie słownikowe nadal aktywne. Nie zmieniano danych talentu/szablonu ani historii.
- Weryfikacja: build TS/Vite poprawny. Firefox na rzeczywistym zapisie: pierwszy wiersz zawiera pełny tytuł oraz początek fabuły, bez przedwczesnego urwania; zachowane dalsze dzielenie wyrazów. Testy formatowania i ostrzeżenia przepełnienia desktop/mobile przeszły. Test PDF potwierdził tekst, osadzone fonty/assety, oczyszczony SVG i fizyczny rozmiar 185.67×101.76 pt. Bez zapisów bazy i wdrożenia.

## 2026-11-09 — TODO Asystent Klanarchii

- W PROJEKT.md dodano TODO budowy asystenta dla wybranych użytkowników: pomoc przy talentach oraz korekta tekstu podręcznika, oparta na zatwierdzonych wzorcach i terminologii. Zmiany do zatwierdzenia, bez samowolnej modyfikacji mechaniki.
- Zapisano plan integracji API i kwestie do ustalenia; bez implementacji, zmian aplikacji lub bazy.
- Weryfikacja: odczyt dodanej sekcji i git diff --check; zmiana wyłącznie dokumentacji.

## 2026-11-09 — Wspólny skład, dzielenie PL/EN i własne fonty

- Zastąpiono tekst HTML w SVG deterministycznym silnikiem: metryki/kerning i kontury dołączonych TTF przez opentype.js 2.0.0, gotowe wiersze i glify jako ścieżki. Fonty regular/bold/italic/boldItalic z repozytorium; bez zamiany na systemowy. Brak glifu/pliku lub dawne Arial/Georgia daje jawny błąd. Nowy wybór systemowych fontów wyłączony. Usunięto niepotrzebne obejście textRenderScale=8.
- Dodano niezmienione wzorce TeX hyph-pl 3.0a i hyph-en-us 2005-05-30, oryginalne licencje w źródłach oraz public/licenses. Własny algorytm Liang/TeX, minima i wyjątki wzorców, NBSP i nowe linie. Podział wyznaczany w renderowaniu, bez automatycznych łączników w bazie. EN oznacza EN-US. Panel wyjątków Klanarchii pozostaje późniejszym etapem.
- Wspólny komponent dla talentu, miniatur, kreatora i napisów dodatkowych. Obsługuje znane oznaczenia mechaniki, kolory/tła, wagę, kursywę, kapitaliki, podkreślenie i nadpisania typografii. Kapitaliki: małe litery jako duże w .8 rozmiaru; automatyczne ligatury wyłączone. Ostrzeganie o przepełnieniu oparte o wynik silnika, bez pomiarów przeglądarki.
- Dodano PDF obok Zapisz w edytorze talentu. Klonuje gotowy SVG z bieżącego szkicu; blokada dla braku fontu/niegotowego tekstu. PDF zawiera krzywe liter, nie tekst do zaznaczania; źródło w edytorze pozostaje zwykłym tekstem. Powtarzalność dotyczy geometrii, nie antyaliasingu pikseli.
- Weryfikacja: TS/Vite poprawne (ostrzeżenie rozmiaru głównego chunka ok.537 kB; parser fontów ładowany oddzielnie). npm test: 6/6. Test Chrome/Edge/Firefox potwierdził identyczne wyniki PL/EN: linie, metryki i ścieżki, SHA256 617dc9fd5c1d180c6e9a554b7293f1360100c82255b62fa8fea2eb81e2de491e. Test realnego podglądu: pełny tytuł, ścieżki zamiast browser text, poprawne formatowania/napisy i przepełnienie. Test PDF: dokładnie te same linie/ścieżki co w podglądzie, fizyczne wymiary i A4; brak fontu wywołuje błąd, bez zamiennika.
- Testy przeglądarkowe i próbny PDF w ignorowanym wtf_www/local-scripts/one-off/editor-database-20261107/. Licencje i zachowanie opisano w Skład tekstu i fonty.md. Nie zmieniano bazy ani starego projektu, bez wdrożenia produkcyjnego.

## 2026-11-09 — PDF jako plik do pobrania

- Zgodnie z doprecyzowaniem użytkownika zastąpiono drukowanie bezpośrednim eksportem PDF w edytorze talentu i kreatorze szablonu. Usunięto print-talent.ts i wywołania okien/drukowania; wspólny export-talent-pdf.ts, dynamicznie ładowane jsPDF/svg2pdf.js z przypiętymi wersjami. Licencje w public/licenses. Komunikaty błędów nie odwołują się już do zgody na popup.
- Plik A4, 10 mm marginesu, bez zmiany rozmiaru karty i ponownego łamania tekstu. Litery i niezamaskowane ścieżki wektorowe. Maski alfa ikon i tła ograniczenia spłaszczane do PNG 600 dpi tylko w kopii eksportowej; wygląd zachowany. Źródło i dane bez zmian.
- Weryfikacja: TS/Vite poprawne. Test pobrał talent-direct.pdf i template-direct.pdf z obu przycisków, sprawdził nagłówek PDF oraz 0 wywołań window.print/window.open, brak popupów i błędów JS. Niezależne narzędzie pdfjs-dist w ignorowanym one-off potwierdziło prawidłową stronę A4 i wektorowe ścieżki; wyrenderowano i wizualnie sprawdzono oba PDF-y (także wszystkie ikony i ograniczenie). Bez zapisów talentów/szablonów i wdrożenia.

## 2026-11-09 — Nazwa fontu pod podglądem szablonu

- Dodano samą nazwę Linux Libertine w pasku pod podglądem kreatora szablonu talentu, obok wymiarów karty. Bez listy plików i odmian fontu.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Zmiana wyłącznie podpisu w interfejsie.

## 2026-11-09 — Zbiorcze TODO i ramowy plan

- Utworzono TODO.md jako jedną kolejkę: stan już działający, proponowane pięć etapów (redakcja talentów → dane/import → zestawy/arkusze → szablony kart postaci → część użytkownika), zadania ze stałymi ID i odłożone pomysły. Bez ustalania terminów ani automatycznego zlecania implementacji.
- Przeniesiono szczegóły Asystenta Klanarchii z PROJEKT.md do TODO. Dodano wcześniej odłożony słownik terminów, osobne wyjątki dzielenia i opcjonalny PDF z tekstem; obecny eksport w krzywych pozostaje zaakceptowany. Baza zestawów dopiero przy etapie arkuszy, import dopiero po ustaleniu zakresu, stary projekt 1:1, produkcja na osobne polecenie.
- PROJEKT.md wskazuje aktualne fundamenty i wspólne TODO; poprawiono mylącą wzmiankę o braku tabel. Biblioteka odsyła do kolejki i rozróżnia działający eksport pojedynczego talentu od przyszłych arkuszy. Starszy dokument kreatora oznaczono jako zawierający wcześniejsze etapy. AGENTS.md nakazuje utrzymywanie jednej kolejki bez duplikowania zadań.
- Zmiana wyłącznie dokumentacji. Weryfikacja: odczyt TODO i kontrola odnośników/statusów oraz git diff --check; nie uruchamiano testów aplikacji.

## 2026-11-09 — Odstępy liter w paskach pól treści

- Przeniesiono trzy niezależne odstępy liter z prawego panelu na prawy koniec pasków nad Tytułem, Fabułą i Mechaniką w lewej kolumnie. Przy tytule/fabule utworzono paski bez przycisków formatowania. Formatowanie nadal wyłącznie w mechanice.
- Kompaktowe pola A↔A z jednostką pt, zachowane etykiety dostępności, zakres -2…10, krok .05, dziedziczenie szablonu po wyczyszczeniu i dotychczasowy zapis parametrów. Usunięto starą sekcję i jej style z prawego panelu; interlinia pozostaje po prawej.
- Weryfikacja: TS/Vite poprawne. Test przeglądarkowy potwierdził 3 paski, wyrównanie kontrolek do prawej, formatowanie tylko w mechanice, brak duplikatów, edycję wartości i szerokość mobilną. Bez zapisów talentów i wdrożenia.

## 2026-11-09 — Ukryta edycja interlinii talentu

- Usunięto sekcję Odstępy między liniami i jej pomoc z edytora talentu. Zachowano odczyt/stosowanie/zapis dotychczasowych nadpisań, aby kolejny zapis nie kasował wcześniejszych ustawień. Brak nowych kontrolek interlinii.
- Weryfikacja: kompilacja TS/Vite poprawna. Bez zmian danych.

## 2026-11-09 — Zapamiętywane błędy talentów

- Dodano raporty dla wersji/języka: ke_talent_checks i ke_talent_issues, 2 FK i indeksy do przyszłego filtrowania/liczenia. Jawna migracja ke talent-checks-init, kopia bazy w wtf_www/backups/klanarchia-editor/20261109/before-talent-errors/database.sql. Raporty dopisywane, kompletne/niepełne i nieaktualne rozróżnione; rewizja wspólnych stylów i wersja silnika zapisane.
- Błędy: brak tytułu, przepełnienie treści/ograniczenia/nieodnawialnego, brak fontu/glifu i nieznany znacznik. Brak tytułu (także białe znaki Unicode) i nieznane oznaczenia nie blokują już szkicu. Typy/zakresy/relacje nadal blokują uszkodzone dane. Raport układu z przeglądarki walidowany strukturalnie, kontrole tytułu/znaczników po stronie serwera; diagnostyka nie jest uprawnieniem/publikacją.
- Przy zapisie raport atomowo powiązany z nową wersją. POST talents/UUID/check z oczekiwaną rewizją odświeża diagnostykę bez nowej wersji treści. Niezmieniony zapis ponownie sprawdzany przy otwarciu po unieważnieniu raportu lub zmianie aktualnych błędów (np. ustąpienie błędu fontu). Niezapisany szkic nie nadpisuje raportu wcześniejszej wersji.
- Lista pokazuje Błędy: N z rozwijanymi komunikatami, Jeszcze niesprawdzony lub Wymaga ponownego sprawdzenia. Błędy pod podglądem pochodzą ze wspólnej walidacji. Usunięto stary samotny hook przepełnienia. Liczniki zbiorcze/filtry dopisane do T-02, bez ich wdrażania teraz.
- Weryfikacja: PHP lint i TS/Vite poprawne. Test przeglądarkowy: przepełnienie zapisane/widoczne po odświeżeniu, poprawka usuwa bieżący badge, brak tytułu zapisuje szkic, nieznane oznaczenie zapamiętane, unchecked/checked/stale, ponowna kontrola bez zmiany wersji, 409/400 i odmowa anonimowi, brak błędów JS. SQL potwierdził dawne raporty po kolejnych poprawkach. Osobne testy sprawdziły Unicode blank title i font error (wycofana transakcja) oraz ustąpienie błędu fontu przy otwarciu.
- Usunięto wyłącznie 2 talenty QA wraz z ich wersjami i raportami; pozostał 1 rzeczywisty talent. Sprawdzono go i zapisano raport checked/0 błędów bez zmiany treści, ustawień ani rewizji. Ponowna inicjalizacja bez duplikatów. Stary projekt i produkcja bez zmian. Dokumentacja: Błędy talentów.md; aktualizowano TODO.

## 2026-11-09 — Import 81 talentów archetypów z PDF

- Zgodnie z poleceniem zastąpiono 1 dotychczasowy talent 81 talentami PL: po 9 na podgrupę, w kolejności bloków PDF Egzorcysta, Szabrownik, Wiedźmiarz, Siepacz, Rzecznik, Kronikarz, Żerca, Żarmistrz, Inkwizytor. Puste strony co 10 pominięto. Szablon Talent podstawowy / 44; grupy, paleta, style i szablony bez zmian. Źródłowy PDF i stary projekt bez zmian.
- Ekstrakcja PDFJS z oryginalnymi nazwami fontów, kolorami i geometrią podświetleń; przegląd arkuszy wszystkich 81 kart. Przeniesiono treść, pogrubienia/cechy/aspekty/stany, akcje i użycia; usunięto łamanie wyrazów ze składu PDF. Jedno pole użycia wyświetlane po prawej, raz na scenę rozpoznane jako ikona.
- Każdy talent ma wersję 1 i historię Import z PDF, z nazwą pliku, SHA-256 i stroną w metadanych zdarzenia. Etykieta importu widoczna w historii. Dodano trwały page_reference_missing w serwerowej i klienckiej kontroli treści. source_review_required odtwarzany z uwagi importu, dopóki nie zmieni się mechanika oznaczona hashem.
- Zapisano 8 błędów na 8 talentach: 5 brakujących numerów stron (także czarne odniesienie), 1 przepełnienie Tezy omni-maszyny, 1 urwany fragment Skryby nekrorytów i 1 nieobsługiwany symbol kosztu w tekście Zatuszowania sprawy. Pozostawiono jawny znacznik ikona-kosztu z błędem unknown_annotation; właściwa grafika w tekście nadal T-05. Bez zgadywania treści i pomniejszania fontu.
- Świeża kopia pełnej bazy i rekordów: wtf_www/backups/klanarchia-editor/20261109/before-pdf-import/. WP-CLI db export nie miał mysqldump w kontenerze PHP; poprawna pełna kopia wykonana w kontenerze Percony (28 085 573 B). Narzędzia/manifest/arkusze/QA w ignorowanym local-scripts/one-off/talent-pdf-import-20261109/. Potwierdzono ignorowanie danych i kopii przez Git.
- Import transakcyjny z kontrolą stanu przed usunięciem. Próba z rollbackiem, potem commit; 81 pełnych odczytów porównanych w transakcji, 9 na każdą podgrupę, 81 zdarzeń/wersji/tekstów/raportów, brak zmian 9 tabel niezwiązanych z talentami. Pierwsza próba QA odrzucona na kolejności kluczy ustawień w PHP; transakcja wycofana, porównanie map poprawiono, ponowna próba przeszła.
- Weryfikacja: PHP lint i TS/Vite poprawne, 6 testów silnika składu poprawnych. API: wszystkie 81 raportów, liczniki 9/81, kolejność, 17 reprezentatywnych pełnych treści/ustawień/historii. UI: otwarcie stron źródłowych 2/23/49/54/75, formatowanie, błędy, powrót do listy, historia importu; zrzut 23 sprawdzony wizualnie, brak błędów JS. Poprawiono wyłącznie selektor testu obejmujący ukryty podgląd kreatora. SQL QA na 6 talentach potwierdził zachowanie błędów po ponownej kontroli i ich usunięcie po korekcie; wszystkie te testowe raporty wycofano. Ponowna kontrola rzeczywistego talentu nie zmieniła treści ani wersji.
- Dokumentacja: Import talentów z PDF.md, PROJEKT, Błędy talentów i statusy D-04/D-05 w TODO; D-03 nadal dotyczy osobnej migracji starego projektu. Bez wdrożenia na produkcję.

## 2026-11-09 — Pełna treść na liście talentów

- Usunięto dodatkowy rząd przycisków podgrup w treści biblioteki; drzewo po lewej zachowane. Tytuł jest dostępnym klawiaturą przyciskiem otwierającym ten sam edytor co Otwórz; wspólna blokada/kręciołek i obsługa błędów. Powrót z talentu grupy nadrzędnej zachowuje jej kontekst, bez przełączania na podgrupę.
- Lista pokazuje pełną fabułę, mechanikę ze wspólnymi stylami, aktywne oznaczenia, koszt, akcję, użycia, ograniczenie dostępności, podgrupę, datę, wersję i raport błędów. Osobny TalentListContent, ikony wariantu tuszowego jako standard oznaczeń listy. Treść bez przycinania, responsywne wiersze.
- API listy pobiera treść i ustawienia wspólnym zapytaniem z wersji bieżącej, zachowując limit/paginację i sprawdzanie uprawnień. Bez dodatkowego odczytu każdego talentu. Brak tłumaczenia: fallback PL wszystkich pól z widoczną informacją; edytor nadal nie kopiuje tłumaczeń. Bez migracji i zmian treści w bazie.
- Weryfikacja: PHP lint, TS/Vite i git diff --check poprawne. Test przeglądarkowy porównał pełne treści/ustawienia 81 odpowiedzi listy, potwierdził formatowanie, brak przycisków folderów, otwarcie przez tytuł i Otwórz, zachowanie kontekstu nadrzędnego i 9 elementów podgrupy, fallback EN oraz 390 px bez poziomego przepełnienia. Brak błędów JS; desktop sprawdzony wizualnie. Bez zapisów talentów i wdrożenia. Zaktualizowano opis Biblioteki i bieżący stan T-02.

## 2026-11-09 — Zwarta lista talentów w dwóch kolumnach

- Po lewej wiersza tytuł, metadane, symbole i błędy; po prawej pełna fabuła, mechanika i ograniczenie. Przycisk Otwórz nadal na końcu. Zmniejszono odstępy, na wąskim ekranie kolumny układają się pionowo.
- Użycia pokazują wyłącznie symbole: bez napisów Raz/Trzy razy na misję i Raz na scenę. Opis pozostaje w title i aria-label.
- Weryfikacja: TS/Vite poprawne; przeglądarka potwierdziła dwie kolumny, brak widocznych podpisów użyć, 121 px wysokości pierwszego wiersza przy 1600 px, 390 px bez poziomego przepełnienia i brak błędów JS. Bez zmian danych i wdrożenia.

## 2026-11-09 — Aspekty na liście jak w pasku formatowania

- Lista i przycisk Aspekt korzystają ze wspólnego annotationUiStyle: ciemny tekst #202420 na skonfigurowanym tle aspektu. Ujednolicono czytelność w ciemnym interfejsie. Styl składu kart/PDF nadal pochodzi z annotationStyle i palety.
- Weryfikacja: kompilacja TS/Vite poprawna. Zmiana prezentacji, bez zapisów danych i wdrożenia.

## 2026-11-09 — Kody talentów i wersji z datą/licznikiem

- Na polecenie użytkownika zastąpiono UUID talentów kodem XXXX-XXXX (osiem losowych znaków bez I/O/0/1, jak w dawnej wysyłce). Publiczne id API to kod; usunięto kolumnę UUID talentu. Numeryczne PK/FK i UUID innych modułów zachowane. Nowe talenty tworzy POST /talents z kodem generowanym przez serwer; istniejące GET/PUT/history/check po kodzie. PUT nie tworzy brakującego kodu.
- Wersje mają version_day DATE i day_serial, unikalne per talent/dzień/licznik. API versionCode np. QH2M-YDUS-091126-01. Strefa Europe/Warsaw, licznik minimum dwie cyfry bez limitu 99; każdy kolejny zapis PL/EN zwiększa go, kolejny dzień zaczyna od 01. Wewnętrzny numer rewizji zachowany do blokad i kolejności, niewidoczny jako osobny identyfikator.
- Nowy talent-codes.php, jawne ke talent-codes-init i rozszerzone talents-init, schemat talentów 2. Etapowe DDL wznawialne; backfill pod blokadą, usunięcie UUID dopiero po przypisaniu/indeksach. Migracja 81 rekordów bez nowych wersji treści. Kody istniejących zapisów wyliczone z ich pierwotnych dat i kolejności; dotychczasowe daty, autorzy, treści, raporty i powiązania bez zmian.
- Kody widoczne w liście, edytorze, historii i nazwie eksportu PDF. Stały kod bazowy przeznaczony do Roll20; samej integracji nie wdrażano.
- Kopia przed zmianą: wtf_www/backups/klanarchia-editor/20261109/before-talent-codes/database.sql i records.json. code-map.json przechowuje stary UUID → nowy kod/PK poza Gitem. Narzędzia QA w local-scripts/one-off/talent-codes-20261109/. Stary projekt bez zmian.
- Weryfikacja: PHP lint, TS/Vite i git diff --check poprawne. Porównano wszystkie rekordy 15 tabel przed/po migracji (po odjęciu wyłącznie nowych/usuniętych kolumn) oraz po usunięciu QA: dane i FK zachowane, 81 talentów. Ponowna migracja bez zmian kodów. SQL sprawdził odrzucenie duplikatu kodu i duplikatu licznika, przejście daty przy północy zimą/latem, reset licznika i format powyżej 99; dane testowe wycofane.
- Test przeglądarkowy: 81 nowych id i oznaczeń listy; otwarcie/history importu po kodzie; PDF z kodem w nazwie; utworzenie QA i zapis w UI 01→02; równoległe zapisy jednej rewizji 200/409 i 03, trzy różne oznaczenia historii, kontrola błędów bez zmiany wersji; 404 brakującego kodu, odmowa anonimowi, brak błędów JS. Wyłącznie 1 utworzony talent QA usunięty z jego zależnościami; pozostało 81 rzeczywistych. Dokumentacja bazy/biblioteki/projektu/błędów i TODO zaktualizowana. Bez wdrożenia produkcji.

## 2026-11-09 — Bez osobnej daty na liście talentów

- Usunięto datę aktualizacji z metadanych wiersza listy; pozostają podgrupa i pełne oznaczenie wersji zawierające datę. Daty w historii i bazie zachowane.
- Weryfikacja: kontrola zmienionego JSX i git diff --check. Zmiana wyłącznie prezentacji.

## 2026-11-10 — Pole numeru wersji w szablonie talentu

- Dodano elements.version i styles.version, osobną pozycję Numer wersji po lewej, pełną geometrię/skalowanie/tekst/kolor palety po prawej, zaznaczanie, wyrównanie, blokadę i oczko. Domyślnie X7, Y=wysokość−9, szerokość do 90, wysokość 6 pt, Libertine 5 pt. Warstwa nie zmienia pola mechaniki, rysowana po ograniczeniu.
- TemplateVersion wspólny dla kreatora/miniatur i karty talentu; w kreatorze przykład, na zapisanej karcie rzeczywisty versionCode. Wersja obecna również w bezpośrednim PDF, gdy element widoczny. Niezapisany szkic/zmiany nie mają kodu na karcie ani starego kodu w nazwie PDF.
- Parser i PHP walidują/zapisują nowe pole i styl. Starsze dokumenty dostają pole ukryte bez zmiany surowej historii. W nowym szablonie element włączony. Ochrona kolorów palety obejmuje styles.version. Bez nowych tabel i migracji schematu.
- Po kopii database.sql/template.json w wtf_www/backups/klanarchia-editor/20261109/before-template-version-label zapisano Talent podstawowy / 45 z włączonym polem. 81 rzeczywistych talentów pozostało przypiętych do 44; nie przenoszono ich automatycznie.
- Dodano version_overflow do wspólnej diagnostyki i raportów serwera (do 5 kodów renderowania). Uzupełniono automatyczne sprawdzanie również po pierwszym zapisie nowego talentu: ref zapisanego rekordu zamiast wymagania initial, gdy nadany właśnie kod dopiero pojawia się w podglądzie. Recheck nie tworzy nowej wersji.
- Weryfikacja: TS/Vite, PHP lint validation/api/talent-checks i git diff --check poprawne. UI: pozycja, styl 5 pt, oczko, kłódka, undo, za wąskie pole i PDF kreatora. Poprawiono selektor QA obejmujący również ukryty panel stylów. W talencie rzeczywisty kod i PDF, brak przykładu w szkicu, ukrycie przy niezapisanych zmianach; serwer przyjmuje zapis version_overflow. Brak błędów JS. Zrzut kreatora sprawdzony wizualnie.
- Osobny test utworzył tymczasowy szablon o polu szerokości 1 pt i nowy talent przez UI: po pierwszym zapisie automatycznie utrwalił przepełnienie faktycznie nadanego kodu, zachowując revision=1. Usunięto 2 utworzone talenty QA (w osobnych przebiegach) i 1 szablon QA wraz z zależnościami. SQL porównał wszystkie 81 talentów, ich wersje/treści/zdarzenia/raporty oraz 44 starsze wersje szablonu — bez zmian. Pozostał 1 szablon z bieżącą wersją 45.
- Narzędzia/zrzuty/PDF-y w wtf_www/local-scripts/one-off/template-version-label-20261109/, poza Gitem. Dokumentacja kreatora/bazy/błędów/projektu/TODO uaktualniona. Bez zmian starego projektu i wdrożenia.

## 2026-11-10 — Przełączanie Lista / Kafelki

- Przełącznik w nagłówku biblioteki, domyślnie Lista, bez localStorage/cookie. Wybór pozostaje przy zmianie podgrupy i powrocie z edytora; przeładowanie zaczyna od Listy. Podgląd, tytuł i Otwórz prowadzą do wspólnego edytora; zachowane kody, podgrupy, symbole i raporty błędów. Responsywna siatka.
- API listy zwraca unikalne przypięte szablony w templates obok items/hasMore. Odczyt historycznych wersji zbiorczy, nie najnowszego dokumentu; bez N+1 żądań per talent. readTalents parsuje dokument raz i wiąże z elementami listy. Wspólny talentPreviewTemplate dla edytora i kafelków, z nadpisaniami odstępów/interlinii, flagami, kosztem, użyciami i ograniczeniem.
- LazyTalentCard: IntersectionObserver z 300 px marginesu; skład tylko w pobliżu ekranu. Gotowy SVG z krzywymi liter i osadzonymi obrazami przechowywany jako Blob w LRU do 96 kart. Poza ekranem bez ciężkiego drzewa SVG; URL-e obrazów zwalniane przy ukryciu/unmount. Klucz: talent/rewizja, szablon/wersja, paleta/rewizja, język. Oddzielna pamięć zasobów SVG; błędy pokazują lekki komunikat i nie blokują otwarcia talentu. Bez danych przykładowych zamiast treści talentów.
- Podczas kontroli wizualnej wykryto liczniki grup 0: warunek w library.php obsługiwał wyłącznie schemat talentów 1. Poprawiono obsługę także 2 po wcześniejszej migracji kodów; potwierdzono 81/9.
- Weryfikacja: TS/Vite, lint PHP talents/library i git diff --check poprawne. UI/API: Lista na starcie, 81 talentów i 1 wspólny historyczny szablon 44, liczniki grup 81/9; w pierwszym obszarze 9 gotowych obrazów, dalsze karty bez renderowania, 0 odczytów pojedynczego talentu podczas generowania. Lokalny pomiar pierwszego podglądu ok. 0,46–0,50 s (nie gwarancja wydajności innych środowisk).
- Zapisany SVG zawiera osadzone grafiki, bez zewnętrznych href. Porównano linie tekstu kafelka i edytora — identyczne. Test: otwarcie przez podgląd, powrót do Kafelków, zwolnienie DOM poza ekranem, powrót z tym samym podglądem, przełączenie Listy/Kafelków, filtr podgrupy 9 elementów, 390 px bez poziomego przepełnienia i ponowny start w Liście po odświeżeniu. Brak błędów JS; zrzut desktop sprawdzony wizualnie. Bez zapisów talentów, migracji ani wdrożenia.
- Narzędzia i zrzuty: wtf_www/local-scripts/one-off/talent-tile-view-20261110/. Dokumentacja biblioteki/bazy/projektu i bieżący stan T-02 zaktualizowane.

## 2026-11-10 — Większe kafelki otwierane całą powierzchnią

- Minimalna docelowa szerokość kafelka 300 → 480 px, z dopasowaniem do mniejszych ekranów; większy podgląd bez zmiany składu tekstu. Usunięto osobny Otwórz z kafelków. Kliknięcie podglądu, tytułu, metadanych lub wolnego miejsca otwiera edytor; rozwijanie błędów obsługiwane osobno. Status Otwieranie… i blokada kolejnych otwarć zachowane.
- Weryfikacja: TS/Vite i git diff --check poprawne. Istniejący przegląd przeglądarkowy potwierdził brak przycisku w kafelkach, szerokość co najmniej 480 px na desktopie oraz otwarcie kliknięciem kodu (metadane). Przewijanie/pamięć, powrót do widoku, podgrupy, telefon i domyślna Lista nadal działają; brak błędów JS. Zrzut większych kafelków sprawdzony wizualnie. Bez zmian danych i wdrożenia.

## 2026-11-10 — Bez powtarzania symboli w podpisie kafelka

- TalentListSymbols renderowane wyłącznie w widoku Listy; pod kafelkiem bez ponownego wyliczania ikon/użyć/akcji. Oznaczenia na wyrenderowanej karcie pozostają.
- Weryfikacja: kontrola warunku JSX i git diff --check. Zmiana prezentacji, bez zapisów danych.

## 2026-11-10 — Kafelki podzielone na podgrupy

- Usunięto przełącznik Lista/Kafelki, pozostawiono wyłącznie kafelki. Każda niepusta podgrupa ma własną sekcję z nazwą i liczbą talentów. Zachowane otwieranie kafelkiem, błędy i leniwe podglądy.
- Weryfikacja: TS/Vite oraz git diff --check poprawne. Przeglądarka: 9 sekcji po 9 talentów, brak przełącznika i powielonych symboli, gotowy podgląd, otwarcie/powrót, filtr podgrupy i telefon 390 px bez przepełnienia; brak błędów JS. Pierwszy przebieg QA zatrzymał błędny selektor powrotu; po poprawieniu skrypt przeszedł. Bez zapisów danych i wdrożenia.

## 2026-11-10 — Sama wizualizacja talentu

- Doprecyzowanie: usunięto cały podpis pod wizualizacją (tytuł, kod, podgrupę, raport) oraz zewnętrzną obudowę kafelka. Pozostają klikalna karta i sekcje podgrup; kręciołek otwierania nakładany na podgląd. Błędy w bazie i edytorze zachowane.
- Weryfikacja: TS/Vite i git diff --check poprawne. Bez zmian danych i wdrożenia.

## 2026-11-10 — Karty bez odstępów

- Siatka talentów bez odstępów poziomych i pionowych. Usunięto wewnętrzny margines 6 px podglądu i beżowe tło przycisku. Obraz/SVG wypełnia cały kafelek; podział na podgrupy zachowany. Geometria szablonów bez zmian.
- Weryfikacja: kontrola CSS i git diff --check. Bez zmian danych.

## 2026-11-10 — Historia przeglądarki przy edycji talentu

- Otwarcie talentu lub nowego szkicu tworzy wpis historii przeglądarki. Wstecz wraca do biblioteki, Dalej otwiera edytor; zachowane wybrana podgrupa i pozycja przewijania. Strzałka powrotu korzysta z tej samej historii. Zapis aktualizuje rekord we wpisie historii.
- Niezapisana treść wymaga potwierdzenia odrzucenia przy Wstecz; anulowanie przywraca wpis edytora bez utraty roboczych zmian. Dotychczasowe ostrzeżenie przy zamknięciu/odświeżeniu strony zachowane.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright: Wstecz do wybranej podgrupy (9 kart), Dalej, anulowanie odrzucenia z zachowaniem tekstu, potwierdzenie odrzucenia, powrót strzałką i ponowne Dalej; brak błędów JS. Pierwszy przebieg QA używał błędnego selektora pola liczbowego zamiast tytułu; poprawiony test przeszedł. Bez zapisu talentów ani wdrożenia. Skrypt lokalny: wtf_www/local-scripts/one-off/talent-tile-view-20261110/history.cjs.

## 2026-11-10 — Nawigacja katalogowa i nowy układ edytora

- Nowy TalentNavigator: jeden poziom kategorii/talentów, foldery, Wyżej, zaznaczenie aktualnego talentu, liczniki błędów, wczytywanie/błąd/retry. Początek w podgrupie otwartego talentu; bez pełnego rozwiniętego drzewa. Przewijana lewa kolumna.
- Podgląd w środku, ustawienia pod podglądem, tekst po prawej. Na mniejszych ekranach układ pionowy. Usunięto konflikt display:flex dziedziczony przez nav ze strony WordPress; końcowy zrzut sprawdzony wizualnie.
- Przełączanie talentu pobiera jego aktualny rekord i ponownie montuje edytor z poprawnymi danymi. Potwierdzenie odrzucenia roboczych zmian, blokada podczas zapisu i otwierania. Błąd otwierania pozostawia dotychczasowy talent.
- Historia przechowuje kolejne otwarcia, obsługuje oba kierunki i odmowę odrzucenia; strzałka biblioteki wraca przez całą serię otwarć do kafelków. Zapis odświeża rekord/aktywne oznaczenie i listę nawigacji. Bez nowych tabel i zmian struktury danych.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright: położenie trzech kolumn i ustawień pod podglądem; 9 talentów jednej podgrupy, poziom wyżej z 9 folderami bez list potomnych, przejście do Inkwizytora, poprawna treść/zaznaczenie, Wstecz/Dalej między talentami, anulowanie i potwierdzenie odrzucenia, powrót do 81 kafelków oraz 390 px bez poziomego przepełnienia. Brak błędów JS. Test powtórzony po poprawce stylu nav. Bez zapisu talentów ani wdrożenia. Narzędzia/zrzut: wtf_www/local-scripts/one-off/talent-tile-view-20261110/workspace.cjs i workspace.png.

## 2026-11-10 — Zagęszczenie kontrolek edytora

- Strzałka powrotu poziom wyżej przed nazwą grupy w jednym wierszu, bez tekstu Wyżej. Historia zmian przeniesiona na dół prawej kolumny pod Mechanikę. Szablon na końcu ustawień; usunięto nagłówek Ustawienia talentu.
- Mechanika: 5 wierszy zamiast 9, maksymalnie 190 px i przewijanie dłuższej treści, bez ograniczania zapisanych znaków. Około 300–400 widocznych znaków przy szerokiej prawej kolumnie; pojemność zależy od szerokości i tekstu.
- Oznaczenia i użycia w zwartym wspólnym pasku z zawijaniem; przyciski 34 px, ikony 22–24 px, koszt przy symbolu. Potrójne użycia mają szerszy przycisk, żeby zmieścić trzy kwadraty.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright compact.cjs: historia w prawej kolumnie, szablon ostatni, brak etykiety ustawień, strzałka bez tekstu, wysokość Mechaniki do 190 px i przyciski do 35 px; kontrole przełączania talentów, grup, historii przeglądarki, ochrony zmian i 390 px bez przepełnienia nadal poprawne. Zrzut sprawdzony wizualnie, następnie poszerzono przycisk trzech użyć. Bez zapisów talentów ani wdrożenia.

## 2026-11-10 — Widoczny status niezapisanych zmian

- Niezapisane zmiany i nowy niezapisany talent mają wyraźną złotą etykietę obok Zapisz: pełna nieprzezroczystość, pogrubienie, tło, obramowanie i kropka. Status ogłaszany aria-live; zapisany talent zachowuje spokojny status.
- Weryfikacja: kontrola JSX/CSS i git diff --check. Bez zapisów danych.

## 2026-11-10 — Napis statusu i czerwony Zapisz

- Status niezapisanych zmian jako zwykły napis, bez tła, ramki i kropki. Zapisz przy niezapisanej treści ma przygaszoną czerwień dopasowaną do ciemnej oprawy, z hover/focus. Zapisany stan bez czerwonego wyróżnienia.
- Weryfikacja: kontrola JSX/CSS i git diff --check. Bez zmian danych.

## 2026-11-10 — Dodaj talent w nawigacji edytora

- Przycisk na końcu listy w podgrupie, ukryty na poziomach zawierających podgrupy. Otwiera pusty szkic w przeglądanej podgrupie; szablon z ostatniego edytora, również historyczna przypięta wersja. Bez kopiowania danych talentu. Dotychczasowe tworzenie z biblioteki korzysta z tego samego przepływu.
- Nowy szkic jest niezapisany od początku i chroniony potwierdzeniem odrzucenia; ma roboczy klucz widoku dla poprawnego resetowania kolejnych szkiców, bez nadania kodu talentu. Tworzenie rekordu tylko istniejącym POST po Zapisz.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright add-talent.cjs potwierdził pustą treść, zachowanie wersji szablonu, brak kodu i POST przed Zapisz, ukrycie przycisku wyżej, anulowanie/potwierdzenie odrzucenia oraz zachowanie treści po symulowanym błędzie POST. Żądanie zapisu przechwycone w teście, bez utworzenia rzeczywistego talentu. Poprawiono selektory testowe natywnych option i folderu; końcowy przebieg poprawny. Bez wdrożenia i zmian starego projektu.

## 2026-11-10 — Spójna nazwa talentu bez tytułu

- Nagłówek edytora używa Bez tytułu / Untitled, tak jak lista talentów, również gdy wpisano same białe znaki. Nowy talent nie zastępuje już brakującego tytułu w nagłówku.
- Weryfikacja: kontrola JSX i git diff --check. Bez zmiany zapisanych danych.

## 2026-11-10 — Bez strzałki przy tytule talentu

- Usunięto strzałkę przy tytule i przypisany jej skok historii do biblioteki. Kliknięcie Talenty w menu otwiera bibliotekę, z ochroną niezapisanych zmian i blokadą podczas zapisu. Jest osobnym wpisem historii, bez wymuszania celu przycisku Wstecz przeglądarki. Strzałka poziomu grupy pozostaje.
- Weryfikacja: TS/Vite i git diff --check.
- Kontrola przeglądarkowa menu-return.cjs: brak strzałki przy tytule, menu Talenty otwiera kafelki, Wstecz po wejściu przez menu wraca do faktycznie poprzedniego edytora, anulowanie/potwierdzenie odrzucenia działa. Bez błędów JS i zapisu talentów.

## 2026-11-10 — Statusy talentów i kolorowe kropki

- Schemat talentów 3: osobna kolumna status w każdej wersji, domyślnie dev; jawna, powtarzalna migracja po kopii pełnej bazy. API waliduje dev/toCheck/approved/delete, odczyt listy/rekordu, zapis wersji i historia z from/to. Pominięty status nie resetuje istniejącego. Kontrola rewizji chroni równoległe zmiany. Zgodność migracji kodów i liczników kategorii ze schematem 3.
- Wybór w nagłówku obok zapisu, zmiana robocza do Zapisz. Kropki żółta/niebieska/zielona/czerwona na liście katalogowej i kafelkach; wspólny komponent z nazwą dostępną dla czytnika i podpowiedzią. Potwierdzenie wycofania oraz zatwierdzania z błędami. Kropki nie zmieniają składu karty i PDF.
- delete oznacza Wycofany, bez fizycznego kasowania; na tym etapie nadal widoczny do łatwego przywracania zmianą statusu. Osobny widok archiwum/ukrywanie w T-07.
- Weryfikacja: TS/Vite, PHP lint talents/talent-status i git diff --check poprawne, ponowna migracja poprawna. Playwright status.cjs utworzył wyłącznie tymczasowy talent QA: status początkowy dev, trzy kolejne zapisy toCheck/approved/delete, kropki odświeżane, dane przed Zapisz bez zmian, historia pełnych przejść, odrzucenie niepoprawnego kodu bez nowej wersji, konflikt 409 i zachowanie statusu przy pominięciu pola. Usunięto rekord QA i jego zależności przez skrypt z kontrolą kodu/nazwy. Brak błędów JS. Końcowy audyt osobnym eval-file, ponieważ bezpośrednie przekazanie PHP przez PowerShell miało błąd cytowania. Bez wdrożenia i zmian starego projektu.

## 2026-11-10 — Dodawanie i usuwanie pustych podgrup w nawigacji

- Dodaj podgrupę pod listą folderów grupy głównej, nazwa + Dodaj/Anuluj, obsługa zapisu/błędu i duplikatów. Lista/biblioteka odświeża się bez zamykania edytowanego talentu. Przy pustych folderach kosz z nazwą dostępną dla czytnika i potwierdzeniem. Brak kosza dla podgrup z talentami/potomkami i dla aktualnie edytowanego szkicu.
- Chroniona trasa DELETE kategorii, blokada katalogu i transakcja wspólne z tworzeniem/zapisem. Sprawdza wszystkie talenty bez względu na status/archiwizację i potomne kategorie; usuwa tylko pustą podgrupę wraz z nazwami. Grupy główne chronione. Bez zmian tabel.
- Weryfikacja: TS/Vite, PHP lint library i git diff --check poprawne. Playwright subgroups.cjs utworzył pustą podgrupę QA przez UI; duplikat 409, kosz tylko przy pustej, anulowanie/potwierdzenie usunięcia, brak rekordu po usunięciu (404). Próba usunięcia zajętej podgrupy 409, głównej 400. Porównano pełne listy kategorii przed/po — bez różnic; brak błędów JS. Podgrupa QA usunięta, bez zmian rzeczywistych talentów i wdrożenia.

## 2026-11-10 — Przywrócenie widoku listy

- Przywrócono Lista / Kafelki, domyślnie Lista. W obu widokach sekcje podgrup; wybór zostaje po powrocie z edytora. Lista: klikalny tytuł, kod, kropka statusu, oznaczenia, raport błędów i druga kolumna z treścią. Kafelki nadal bez podpisów, odstępów i dodatkowej obudowy.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright restore-views.cjs: domyślna Lista, treść i kropki, otwarcie tytułem, przełączenie na gotowe karty bez podpisów i gap=0, zachowanie widoku po powrocie przez menu, 390 px bez przepełnienia; brak błędów JS. Bez zapisów talentów i wdrożenia.

## 2026-11-10 — Kafelki bez statusu

- Usunięto kropkę statusu wyłącznie z widoku kafelków. Status i jego zmiana pozostają w edytorze, kropki na liście i w nawigacji bez zmian.
- Weryfikacja: kontrola JSX i git diff --check. Bez zmian danych.

## 2026-11-10 — Klikalna ścieżka grupy i okno przenoszenia

- Zamiast samej nazwy podgrupy przy tytule talentu pełne Grupa / Podgrupa, przycisk otwierający natywny modal dialog. Wybór grupy zawęża listę podgrup, zmiana grupy czyści poprzednią podgrupę. Anuluj/Escape bez zatwierdzenia, Wybierz aktualizuje tylko roboczy cel i oznacza niezapisane zmiany.
- Zapis przekazuje wybraną categoryId do istniejącego transakcyjnego API; bez migracji. Po sukcesie stan edytowanego talentu, wpis historii przeglądarki, nazwa i lewa nawigacja korzystają z docelowej podgrupy. Stały kod bez zmian; dotychczasowa historia zapisu obejmuje pole category.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright move-talent.cjs utworzył tymczasowy talent QA: pełna ścieżka, wstępny wybór, anulowanie/Escape, brak przeniesienia w bazie przed Zapisz; po zapisie nowa podgrupa, ten sam kod i treść, wpis historii, zniknięcie z listy źródłowej i obecność w docelowej, odświeżona lewa nawigacja. Brak błędów JS. Usunięto tylko talent QA i jego zależności, bez zmian rzeczywistych talentów i wdrożenia.

## 2026-11-10 — Import talentów frakcji z PDF

- Skopiowano wskazany Talenty_frakcje.pdf do ignorowanych narzędzi, bez zmiany źródła. Pierwszy odczyt ścieżki Google Drive zablokował sandbox; odczyt z eskalacją poprawny. 40 stron, pominięte 10/20/30/40. Ekstrakcja ujawniła tekst na 20/30; po renderowaniu rozpoznano przekreślenia, więc strony poprawnie pominięto zgodnie z poleceniem.
- Ekstrakcja fontów, kolorów i podświetleń, wizualna kontrola wszystkich stron; 36 kosztów w białych cyfrach SegoePrint, zero i checked Pisany bluzg, ręcznie zweryfikowane użycia z grafik. Zachowano tekst/formatowanie, złączono techniczne dzielenie; usunięto artefakt ekstrakcji T en → Ten. Bez własnych zmian zasad.
- Nowa grupa Talenty frakcji, podgrupy Soldaci/Mechaniści/Hanzyci/Rytualiści, po 9. Status dev, szablon 45, nowe krótkie kody i wersja 1; historia import_pdf z SHA-256/nazwą/stroną. Próba wycofana, następnie commit pod blokadą katalogu. Ochrona powtórzenia i kontrola niezmienionych wierszy wszystkich 15 tabel. Niczego nie kasowano. Kopia database.sql i records.json przed operacją.
- Cztery talenty z 7 zgłoszeniami: p8 body_overflow/page_reference_missing/unknown_annotation, p9 body_overflow, p19 page_reference_missing/unknown_annotation, p29 page_reference_missing. Dwa symbole kosztu w mechanice jako jawny znacznik do T-05. Rozszerzono wspólne wykrywanie braków stron o odnośniki bez nawiasów (s. xxx.).
- Weryfikacja: TS/Vite, PHP lint talent-checks, git diff --check poprawne; wzorce odnośników pozytywne/negatywne. API wszystkich 36 porównane z manifestem, po 9 i kolejność PDF; UI stron 1/4/8/9/14/19/29/36 z kosztami, heks/check, akcją, formatowaniem, błędami i historią; brak błędów JS, zrzut p4 sprawdzony wizualnie. Audyt potwierdził wszystkie poprzednie wiersze bez zmian: 82 wcześniejsze talenty, 118 łącznie. Test raportów numerów stron dla p8/19/29 wycofany; błędy trwają przy recheck i znikają po poprawieniu xxx. Narzędzia/manifesty/mapa/raporty: wtf_www/local-scripts/one-off/talent-factions-import-20261110/. Kopie: wtf_www/backups/klanarchia-editor/20261110/before-factions-import/. Dokumentacja i TODO zaktualizowane; bez wdrożenia i zmian starego projektu.

## 2026-11-10 — Talent używa aktualnego szablonu, bez zamrażania wyglądu

- Korekta wcześniejszego błędnego założenia: talent wskazuje szablon, zawsze bieżące ustawienia. Oddzielny/zachowany wygląd wymaga nowego szablonu. Historyczne rewizje szablonu pozostają wyłącznie do audytu i kontroli zapisu. Wcześniejsze wpisy o przypinaniu wersji opisują wycofany model, nie obowiązującą zasadę.
- Kopia pełnej bazy i 15 tabel przed migracją w wtf_www/backups/klanarchia-editor/20261110/before-live-templates/. Schemat talentów 4: nowy FK template_id w talent_versions, wypełniony z dawnej relacji. Surowe historyczne dokumenty i stare template_version_id zachowane do audytu, bez aktywnego przypięcia. Nowe ustawienia zapisują tylko templateId. API rekord/lista zawsze rozwiązuje templates.current_version_id; dawne templateRevision usuwane z odpowiedzi bez modyfikacji zapisanych JSON-ów.
- Schemat raportów 2: template_version_id w talent_checks jako znacznik sprawdzonego układu, z FK. Zmiana szablonu daje stale, a odczyt edytora uruchamia ponowną kontrolę bez zmiany wersji treści. API chroni przed raportem z nieaktualnego szablonu (409), bez znacznika nie uznaje kompletności składu. Rewizja diagnostyki nie zamraża wyglądu.
- Wybór szablonu wyłącznie po ID i nazwie, bez wersji i dodawania historycznej opcji po otwarciu starszego talentu/szkicu. Zapis kreatora emituje odświeżenie, ponowny fokus pobiera aktualne szablony bez utraty treści; zapis/PDF pobiera świeży dokument i czeka na gotowy podgląd. Kafelki grupują po templateId, pamięć unieważnia aktualna rewizja.
- Audyt porównał wszystkie wcześniejsze kolumny 15 tabel: bez zmian treści/historii/kodów/rewizji. 118 talentów używa bieżącego Talent podstawowy; 82 poprzednio związane ze starym dokumentem mają teraz widoczne pole numeru wersji. Powtórzenie migracji poprawne.
- Test check.cjs: 2 tymczasowe talenty i 2 tymczasowe szablony; aktualizacja wspólnego układu dociera do obu bez zapisu talentów, stary raport stale, błędny znacznik odrzucony, odświeżenie UI, PDF pobiera nowy układ nawet bez powiadomienia, wybór osobnego szablonu izoluje dalsze zmiany, kafelek aktualny, brak błędów JS. Pierwszy przebieg miał brak importu fs w QA przy kontroli PDF; po poprawieniu cały przebieg przeszedł. Każdy przebieg usuwał wyłącznie utworzone dane QA pod kontrolą kodu/nazwy.
- Test real-cards.cjs: rzeczywiste archetypy i frakcje pokazują prawdziwy kod na karcie, lista wyboru zawiera tylko nazwy, treść i rewizja talentu bez zmian; bez błędów JS. Zrzuty oraz PDF w wtf_www/local-scripts/one-off/live-talent-templates-20261110/. Dokumentacja projektu/bazy/kreatora/biblioteki/błędów poprawiona, dawne wpisy AI zachowane. Bez wdrożenia i zmian starego projektu.

## 2026-11-10 — Domyślnie zwinięte grupy i przełącznik statusów kafelków

- Pierwszy odczyt kategorii zwija wszystkie grupy główne; późniejsze odświeżenia nie resetują ręcznego rozwinięcia, nowa grupa domyślnie zwinięta. Nawigacja katalogowa wewnątrz edytora bez zmiany.
- Pokaż/Ukryj statusy tylko w Kafelkach, domyślnie wyłączone. Zwarty pasek pod grafiką: stały kod talentu, kropka/nazwa statusu, trójkąt ostrzegawczy i liczba zapisanych błędów (również przygaszone zero). Pełny versionCode w podpowiedzi kodu, komunikaty w podpowiedzi błędów. Kliknięcie paska otwiera talent, ukrycie przywraca same stykające się wizualizacje.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright tile-info.cjs: wszystkie grupy zwinięte, ręczne rozwijanie, przełącznik tylko dla Kafelków, brak pasków na start, poprawny kod/status/symbol i liczby, otwarcie kodem i powrót z zachowaniem ustawienia oraz zwinięcia grup, ukrycie i 390 px bez przepełnienia. Brak błędów JS, zrzut sprawdzony wizualnie. Bez zapisów talentów i zmian bazy.

## 2026-11-10 — ID na karcie tylko w opcjonalnym eksporcie

- TemplateThumbnail domyślnie ukrywa warstwę numeru dla treści talentu (biblioteka/edytor); kreator szablonu zachowuje próbkę jako pomoc pozycjonowania. Klucz pamięci kafelków z nowym znacznikiem, żeby odrzucić wcześniejsze obrazy z ID. Ukryta warstwa nie zgłasza przepełnienia w podglądzie. Pasek statusów/lista/historia bez zmian.
- Checkbox ID w PDF obok PDF, domyślnie wyłączony; dla szkicu/niezapisanych zmian i ukrytego pola szablonu niedostępny z wyjaśnieniem. Eksport klonuje gotowy podgląd i dołącza/usuwa warstwę numeru wyłącznie w kopii eksportowej. Nazwa PDF również zawiera kod tylko przy włączonej opcji. Bez zapisu danych i modyfikacji szablonu.
- Weryfikacja: TS/Vite i git diff --check poprawne. Playwright pdf-id.cjs: ukryte ID w buforowanym SVG kafelka i podglądzie, ID paska nadal widoczne, checkbox na start wyłączony, pobrane oba PDF-y, podgląd nie odsłania kodu po eksporcie, brak błędów JS. Oba pliki wyrenderowane PDF.js (render-pdf-id.mjs) i sprawdzone wizualnie — tylko wariant włączony ma numer przy dolnej krawędzi. Bez zapisów talentów i wdrożenia.

## 2026-11-10 — Wbudowana ikona kosztu w mechanice

- Parser obsługuje dokładny znacznik [ikona-kosztu: koszt] jako obiekt grafiki, także w zagnieżdżonych formatowaniach. Wbudowany znacznik niezależny od słownika stylów; nazwa zarezerwowana w walidacji katalogu klient/serwer. Niepoprawne warianty pozostają tekstem i błędem.
- Silnik tekstu 2 (klient/PHP): pojedynczy atom grafiki z jawną szerokością 1,05 em, bez kerningu do liter, rozmiar/kolor z kontekstu. SVG CostIcon z wariantu szablonu; HTML InlineCostIcon w liście i przycisku. Liczba i symbol pozostają w jednym wierszu przez spację nierozdzielającą tylko na etapie renderowania. Bufor kafelków unieważniany numerem silnika/formatu.
- Przycisk monet w Mechanice wstawia znacznik w kursorze/zaznaczeniu z respektowaniem maxLength. Brak przycisku w tytule/fabule. Nie zmieniano zapisanych tekstów, parametrów ani historii talentów.
- Odświeżono raporty trzech istniejących talentów: Zatuszowanie sprawy (bez błędów), Doraźny wierzchowiec i Prototypowy egzopancerz (zostaje brak numeru strony). Unknown_annotation zniknął ze wszystkich trzech; w Doraźnym zniknęło też przepełnienie po skróceniu znacznika do grafiki.
- Weryfikacja: TS/Vite, PHP lint talent-checks/validation, git diff --check. 10 testów npm test przeszło: dotychczasowy skład, parser/nesting/niepoprawne znaczniki, atom/szerokość/skalowanie/przepełnienie, dziedziczenie stylu i nierozdzielanie liczby od symbolu. Pierwsza próba testów zamykała serwer Vite przed późnymi importami SSR; przeniesiono inicjalizację przed rejestrowanie testów.
- Playwright dla 3 rzeczywistych talentów: lista, podgląd, raport silnika 2 bez unknown_annotation, stała treść/rewizja, wstawianie, bufor SVG i PDF, brak błędów JS. Pięć serwerowych przypadków walidacji sprawdzono w wycofanej transakcji. Wizualna kontrola wykryła brak cytowania URL maski przycisku dla osadzonego SVG i rozdzielenie 5/monet; poprawiono oba, ponowiono testy oraz kontrolę zrzutu i PDF. PDF renderowany PDF.js, symbol widoczny i liczba zachowana obok. Narzędzia/raporty/PDF/zrzuty: wtf_www/local-scripts/one-off/inline-cost-20261110/. Bez wdrożenia i zmian starego projektu. T-05 zamknięte.

## 2026-11-10 — Drugi szablon Dary Ciemności

- Na wyraźne polecenie utworzono w bazie kopię aktualnego pierwszego szablonu o nazwie Dary Ciemności (12441ea0-1a32-4258-816d-b181c5c8ba6d). Wszystkie graphicColourIds na Czarny z palety, również costTextColourId oraz tekst nieodnawialny. Reszta dokumentu identyczna: rozmiar, geometria, widoczność, ramka, teksty i typografia.
- Operacja w transakcji z blokadą katalogu; zabezpieczenie przed ponownym tworzeniem tej samej nazwy. Kopia źródła: wtf_www/backups/klanarchia-editor/20261110/before-dark-gift-template/source.json. Narzędzie/wynik: wtf_www/local-scripts/one-off/dark-gift-template-20261110/.
- Weryfikacja: porównanie znormalizowanego zapisu z oczekiwanym, wszystkich pozostałych pól dokumentu oraz źródłowego rekordu; sześć tabel talentów (treści, historia, raporty) porównane bez zmian. Nie importowano talentów. Potwierdzona zasada przyszłego importu: kody wspierających pozostają 1:1. Stary projekt i produkcja bez zmian.

## 2026-11-10 — Grupa promki

- Utworzono grupę promki (836c1087-1818-49f2-ba67-905cb183158f) i podgrupę Zbiórka - Dary Ciemności (4d805c9a-c32c-4c91-a3d4-2927cd73f5c0) standardowym zapisem kategorii. Ochrona przed ponownym dodaniem tej samej struktury.
- Weryfikacja: odczyt nazw i powiązania rodzica przez zapytania narzędzia; liczba talentów bez zmian (118). Nie importowano/przenoszono talentów. Narzędzie: wtf_www/local-scripts/one-off/promo-talent-group-20261110/create.php.

## 2026-11-10 — Import 228 Darów dla wspierających

- Odczytano starą bibliotekę 248 talentów: 19 ogólnych oraz 229 Ekskluzywnych. Do zleconej partii wybrano 228 z isDarkGift=true; jeden TESTOWY bez tej flagi pominięty. Wszystkie wybrane mają poprawne i unikalne kody, brak kolizji z nową bazą. Nie odczytywano ani nie przenoszono adresów z mailingu.
- Źródło skopiowane do ignorowanych narzędzi; plik starego projektu niezmieniony (SHA-256 przed/po be1c74f3852a2e23d9e7e995fe264c354b8673d0f45812fb1fb127eb6ee5ad79). Treści, formatowanie, akcje, użycia i raz na scenę zachowane. Brak konfliktów jednoczesnych użyć. dev_type, stare UUID i cały rekord źródła zachowano w metadanych zdarzenia import_legacy, kod zachowany jako aktualny code talentu.
- Docelowo promki / Zbiórka - Dary Ciemności, wyłącznie istniejący szablon Dary Ciemności (aktualna rewizja techniczna 2), czarne ikony. Nie edytowano szablonu ani kategorii. Status dev, pierwsza wersja talentu; wszystkie kody dokładnie oryginalne, bez generatora.
- Kopia pełnej bazy i 15 tabel w wtf_www/backups/klanarchia-editor/20261110/before-supporter-talents-import/. Najpierw dry-run/rollback, potem commit całej partii pod blokadą katalogu. Warunki kontrolują snapshot, liczbę 228, kody, szablon, kategorię, zgodność odczytu i niezmienność wszystkich wcześniejszych wierszy. Oryginalne 118 talentów zachowane, 346 łącznie.
- UI historii rozpoznaje Import ze starego edytora i nie powiela technicznego pola import.legacy. Weryfikacja: TS/Vite i git diff --check, preflight składu wszystkich 228 i raporty checked bez błędów. Końcowy audyt potwierdził 228 kodów/treści/ustawień/proweniencji, poprzednie wiersze bez zmian; pierwszy wariant audytu porównywał kolejność kluczy JSON zamiast kanonicznych ustawień API, poprawiono porównanie.
- Playwright: pełne 228 pozycji z paginacji w kolejności źródła, sześć rzeczywistych podglądów z kodem, treścią, czarnymi ikonami, właściwym szablonem i historią; leniwe kafelki, bez błędów JS. Zrzut Doczesnej zapłaty sprawdzony wizualnie. Narzędzia/manifesty/mapa/raporty: wtf_www/local-scripts/one-off/supporter-talents-import-20261110/. Bez zapisów testowych rzeczywistych talentów, wdrożenia i zmian starego projektu.

### 10.11.2026 — zmiana nazw grup
- Dodano ołówek przy nazwach grup i podgrup w bibliotece oraz nawigacji edytora. Okno pozwala zmienić nazwę w bieżącym języku, zapisać lub anulować.
- PUT talent-categories/{uuid} zachowuje identyfikator, hierarchię i przypisane talenty; blokuje puste nazwy, duplikaty wśród rodzeństwa i zapis nieaktualnej nazwy.
- Weryfikacja: build TypeScript/Vite i PHP lint poprawne. Test przeglądarkowy na tymczasowej podgrupie potwierdził zapis, trwałość po odświeżeniu, zachowanie ID/rodzica oraz odrzucenie duplikatu, pustej i nieaktualnej nazwy. Dane testowe usunięto; oryginalne kategorie bez zmian.


## 2026-11-10 — Oznaczenie talentu ekskluzywnego
- Dodano osobny tekstowy element „talent ekskluzywny” / „exclusive talent” za nieodnawialnym w automatycznym górnym pasie. Własna widoczność, geometria, styl i kolor palety; przełącznik także w edytorze talentu. Dotychczasowe talenty mają oznaczenie wyłączone.
- Rozszerzono walidację i zapis szablonu/talentu z kompatybilnymi wartościami domyślnymi. Górny pas może wykraczać poza kartę przy pokazaniu wszystkich elementów; nie zmniejszamy ich automatycznie.
- Weryfikacja: TS/Vite, PHP lint, 10 testów składu poprawne; Playwright potwierdził wyrenderowanie nowego napisu w kreatorze za nieodnawialnym. Bez zapisu rzeczywistych szablonów/talentów i bez wdrożenia.


## 2026-11-10 — Odznaka ekskluzywności
- Napis zmieniono na dwuwierszową odznakę z ikoną certyfikatu, delikatnym tłem i nieregularnym obrysem. SVG w obu katalogach wariantów; kolor dziedziczony z palety stylu elementu. Rozmiar napisu dopasowuje się do odznaki; zachowano pozycję za nieodnawialnym.
- Weryfikacja: TS/Vite oraz Playwright poprawne; sprawdzono zrzut odznaki i poprawiono dopasowanie napisu po pierwszej kontroli. Bez zapisywania rzeczywistych szablonów i talentów.


## 2026-11-10 — Czysty podgląd i ramka odznaki
- Czysty podgląd kreatora ukrywa element kodu talentu bez zmiany widoczności zapisanej w szablonie. Skrócono tło i obrys odznaki ekskluzywności do szerokości napisu i certyfikatu.
- Weryfikacja: TS/Vite oraz Playwright (ukrycie ID po zaznaczeniu czystego podglądu) poprawne, zrzut odznaki. Bez zapisu rzeczywistych danych.


## 2026-11-10 — Odznaka bez obrysu
- Usunięto zewnętrzny obrys odznaki ekskluzywności w obu wariantach SVG; pozostawiono nieregularne delikatne tło, certyfikat i napis.
- Weryfikacja: kontrola SVG potwierdziła usunięcie ścieżki zewnętrznego obrysu.


## 2026-11-10 — Ekskluzywność talentów promocyjnych
- Włączono settings.flags.exclusive dla wszystkich 228 aktywnych talentów w grupie promki, standardowym zapisem talentu z nową wersją i historią. Kody bazowe, treści, statusy, szablony i przypisania zachowane; automatycznie zmieniły się oznaczenia wersji. Innych grup nie zapisywano.
- Weryfikacja: porównano wszystkie pola każdego wyniku ze stanem sprzed zapisu (jedyna zmiana ustawień: exclusive=true), ponowny odczyt 228 flag poprawny. Raporty składu wymagają ponownego przeliczenia dla nowych wersji.
- Kopia rekordów sprzed zmiany: wtf_www/backups/klanarchia-editor/20261110/before-promo-exclusive/records.json. Próba pełnego eksportu przez wp db export nie powiodła się (brak mysqldump); zachowano kompletny snapshot odczytu talentów. Narzędzie lokalne: local-scripts/one-off/promo-exclusive-20261110/apply.php. Bez wdrożenia.


## 2026-11-10 — Import podstawowych Darów Ciemności
- Zaimportowano 19 talentów (strony 1–19) do nowej grupy Dary Ciemności / podstawowe, szablon Dary Ciemności; stronę 20 Cyrograf z placeholderami pominięto. Flaga daru włączona, ekskluzywność wyłączona. Przeniesiono formatowanie stanów, akcje, użycia i raz na scenę. Historię oznaczono import_pdf ze stroną i hashem źródła.
- PDF SHA-256: 40e2af4874beef7e2e4bf0ed91815fad8cc158b99d0c1b6893e6766376e435f7. Kopia pełnej bazy i 15 tabel przed operacją w wtf_www/backups/klanarchia-editor/20261110/before-dark-basic-import/. Transakcyjna próba z rollbackiem, potem commit; importer porównał wszystkie wcześniejsze wiersze bez zmian. Łącznie 365 talentów.
- Weryfikacja: preflight składu wszystkich 19; Prymat potępieńca ma zapisany body_overflow, pozostałe 18 bez błędów. Playwright porównał treści, ustawienia, status, kolejność, szablon, raporty i historię wszystkich 19, otworzył podglądy stron 1, 2, 12 i 16. Bez błędów JS; zrzut sprawdzony wizualnie. Nie modyfikowano źródła ani starego projektu, bez wdrożenia.


## 2026-11-10 — Import talentów ogólnych
- Źródło Talenty_ogolne_.pdf (110 stron), SHA-256 db8b74e235fd757c78cce729095c7e50cfbf092f1174b304fd61bb3e9ca27dd4. Utworzono grupę talenty ogólne i 11 podgrup z zakresów stron; 59 nazwanych talentów, 51 pustych kart pominięto. Relikwie puste, nazwane Hymn Dawnych Dni/Mantra stalowego tańca z brakami pozostawiono z błędami.
- Szablon Talent podstawowy, dev, przeniesione formatowania, koszty 0–9, akcje, heksy, użycia i ikony. Koszt 10 i dodatkowy koszt 3 obok 4 nie mieszczą się w modelu: wartości źródłowe zapisane w historii i notatkach, bez fałszywego kosztu na karcie. Dodatkowe znaki w tle, urwany tekst i brakujące opisy oznaczono source_review_required. Pełny raport w Import talentów z PDF.md; ograniczenia modelu w TODO T-08.
- Kopia SQL i 15 tabel w wtf_www/backups/klanarchia-editor/20261110/before-general-talents-import/. Pierwsza próba wykryła nowy zapis użytkownika i wycofała transakcję. Świeży snapshot records-current.json uwzględnia ten zapis; następnie dry-run/rollback i commit z kontrolą wszystkich poprzednich wierszy. Bez modyfikacji wcześniejszych 365 talentów, 424 łącznie.
- Weryfikacja: preflight wszystkich 59; 17 talentów z 19 błędami (4 body_overflow, 3 page_reference_missing, 12 source_review_required). Audyt odczytu treści/ustawień/źródłowych kosztów/notatek/historii wszystkich 59 poprawny; pierwszy audyt skorygowano do kanonicznej kolejności kluczy ustawień API. Playwright sprawdził 11 podgrup, liczby i kolejność, wszystkie rekordy i historię oraz podglądy stron 1, 11, 31, 73 i 101; bez błędów JS. Zrzuty sprawdzono wizualnie. Narzędzia, manifest, pominięcia, mapowanie: local-scripts/one-off/general-talents-import-20261110/. Źródło, stary projekt i produkcja bez zmian.


## 2026-11-10 — Import Krwi lodowej zmarzliny
- Talenty_krew_lodowej.pdf, SHA-256 2f2db69ac1cd9a0b52f8e213ab84bd22c5d4d795a3d9be72f54166bd2d674bd0, 21 stron. Zaimportowano 14 talentów z podanych zakresów do Krew lodowej zmarzliny: Lewiatan 3, Drzewiec 2, Szaman Żywicokrwistych 2, Ulepiacz 4, Sprężysta 3; 7 pustych kart poza zakresami pominięto.
- Strony 9, 11, 12, 13 mają Dar Ciemności i szablon Dary Ciemności; pozostałe Talent podstawowy. Zachowano treści, akcje, formatowanie cech/stanów/pogrubień i obsługiwane użycia. Bez kosztu/ekskluzywności. Pięć błędów source_review_required opisuje podwójną zagrywkę; strona 12 również dwa użycia. Faktyczne liczby symboli zachowane w source.symbols historii import_pdf; modelu podczas importu nie rozszerzano.
- Kopia SQL i 15 tabel w wtf_www/backups/klanarchia-editor/20261110/before-frozen-blood-import/. Najpierw próba z rollbackiem, potem transakcyjny commit i porównanie wszystkich poprzednich wierszy bez zmian. 424 poprzednie talenty zachowane, 438 łącznie.
- Weryfikacja: preflight wszystkich 14 na właściwych szablonach bez przepełnień; audyt treści, ustawień, szablonów, notatek, źródłowych symboli i historii poprawny. Playwright potwierdził wszystkie rekordy, kolejność i liczby 5 podgrup, raporty i historię, oraz podglądy stron 2, 9, 12, 21; bez błędów JS. Zrzut Daru Ciemności sprawdzony wizualnie. Narzędzia/manifest/mapa: local-scripts/one-off/frozen-blood-import-20261110/. Stary projekt, źródło i produkcja bez zmian.


## 2026-11-10 — Narzędzia biblioteki i raport nazw
- Menu Talenty otwiera Narzędzia bez domyślnej grupy i pobierania pierwszej listy. Wybranie grupy pokazuje talenty; menu resetuje wybór z zachowaniem ochrony szkicu. Naturalny Back wraca do poprzedniego widoku.
- Dodano Waliduj nazwy: chroniony GET talents/name-audit, normalizacja zapisu, identyczne nazwy, drobne różnice pisowni i puste tytuły. Wynik z kodem, ścieżką i statusem; otwieranie tytułem, czas raportu i ponowne sprawdzenie. Bez zmian w bazie i bez automatycznego przypisywania błędów.
- Weryfikacja: TS/Vite, PHP lint i diff --check poprawne. Sprawdzono normalizację, polskie znaki, literówkę/usunięcie litery i odrzucanie krótkich/niepowiązanych nazw. Audyt 438 talentów wykazał jedną grupę trzech Trybów bojowych; brak innych podobnych i brak pustych nazw. Porównanie sześciu tabel talentów przed/po potwierdziło brak zapisów.
- Playwright: start bez żądań listy talentów, raport, otwieranie z wyniku, browser Back, ręczny wybór grupy, reset menu, anulowanie/odrzucenie niezapisanego szkicu i odmowa anonimowego API; bez błędów JS, zrzut sprawdzony wizualnie. Narzędzia: wtf_www/local-scripts/one-off/talent-name-audit-20261110/. Bez wdrożenia.


## 2026-11-10 — Wyszukiwanie talentów
- Dodano Szukaj talentów jako pierwsze narzędzie, przed walidacją nazw. Rozwijany formularz: fraza po tytule/kodzie bazowym lub kodzie wersji, opcjonalnie fabuła/mechanika, filtry grupy i podgrupy. Wyniki z kodem, statusem, ścieżką i fragmentem treści, stronicowane po 20.
- GET talents/search: admin/nonce, literalna fraza do 120 znaków, normalizacja wielkości liter/diakrytyki/spacji, fallback PL, bez zapisów. Znaczniki formatowania usuwane z porównania i fragmentu. Fraza, filtry, strona i wyniki zachowane w stanie biblioteki po powrocie z edytora.
- Weryfikacja: TS/Vite, PHP lint i diff --check poprawne. Przypadki API: tytuł, kod i pełny kod wersji, zakres podgrupy, opt-in treści, polskie znaki, paginacja bez powtórzeń, pusty wynik i dosłowne wildcardy/tekst SQL. Porównanie sześciu tabel talentów przed/po potwierdziło brak zapisów.
- Playwright: formularz, wyszukanie trzech Trybów bojowych, ręczne filtry, fragment fabuły, brak wyników, strony 1/2, otwarcie i Back z zachowanymi wynikami/frazą, szerokość mobilna i odmowa anonimowego API; bez błędów JS. Ujednolicono dostępne nazwy filtrów; test dostosowano do aktualnej wielkości liter nazwy grupy po jej zmianie przez użytkownika. Zrzuty desktop/mobile sprawdzone wizualnie. Narzędzia w wtf_www/local-scripts/one-off/talent-search-20261110/. Bez wdrożenia i zmian danych talentów.


## 2026-11-10 — Wyszukiwarka od razu widoczna
- Usunięto przycisk rozwijania/zwijania wyszukiwania. Formularz z frazą i filtrami jest zawsze widoczny na ekranie Narzędzia. Bez automatycznego przejmowania fokusu.
- Weryfikacja: kompilacja TypeScript/Vite poprawna. Bez zmian API i danych.


## 2026-11-10 — Układ wyszukiwania i filtry statusu/błędów
- Wyszukiwarka na samej górze; nagłówek Narzędzia z opisem przeniesiony przed Waliduj nazwy. Checkbox fabuły/mechaniki domyślnie zaznaczony. Usunięto zbędny stan rozwijania formularza.
- Dodano status oraz Błędy: Wszystkie / Z błędami / Bez błędów / Wymagają sprawdzenia. API używa zapisanych raportów bieżącej wersji; Bez błędów wymaga aktualnego sprawdzenia. Wyniki pokazują liczbę błędów i nieaktualność raportu. Można wyszukiwać samymi filtrami bez frazy; stan filtrów zachowany po powrocie z edycji.
- Weryfikacja: TS/Vite, PHP lint, diff --check poprawne. Przypadki API potwierdziły statusy, tak/nie/nieaktualny raport, połączone filtry, puste q i odrzucenie nieznanych wartości; poprzednie przypadki tytułu/kodu/treści/paginacji i kontrola braku zapisów również poprawne. Playwright potwierdził kolejność układu, zaznaczony checkbox, filtrowanie z pustą frazą i zachowanie filtrów po Back; bez błędów JS. Zrzut sprawdzony wizualnie. Bez zmian danych i wdrożenia.


## 2026-11-10 — Wyniki wyszukiwania jak lista talentów
- Wydzielono wspólny TalentListRow używany w bibliotece i wyszukiwarce. Wyniki mają metadane, kod wersji, ikony/użycia i szczegóły błędów po lewej, pełną fabułę, sformatowaną mechanikę i ograniczenia po prawej. Dodatkowo ścieżka grupy. Wspólna paleta bez ponownego pobierania po powrocie z edytora.
- API wyszukiwania zwraca pełne dane tylko 20 trafień bieżącej strony i deduplikowane dokumenty szablonów, z zachowaniem filtrów i kompatybilnych pól dopasowania. Spójny odczyt transakcyjny, fallback treści PL, bez zapisu do bazy.
- Weryfikacja: TS/Vite, PHP lint i diff --check poprawne; dotychczasowe przypadki API i kontrola braku zapisów przeszły. Playwright porównał identyczny HTML treści i ikon/użyć w wyniku oraz bibliotece, formatowanie aspektu, otwarcie/Back i szerokość mobilną; bez błędów JS. Pierwsze porównanie wykonano przed załadowaniem palety, następnie użyto wspólnej palety i oczekiwania na oznaczenia. Zrzut sprawdzony wizualnie. Bez wdrożenia.


## 2026-11-10 — Alfabetyczne grupy talentów
- Grupy i podgrupy sortowane alfabetycznie według języka interfejsu, z uwzględnieniem polskich liter i bez rozróżniania wielkości liter. Wspólna kolejność w bibliotece, sekcjach, nawigacji edytora i filtrach. Ponowne sortowanie po dodaniu lub zmianie nazwy; bez zmiany kolejności samych talentów i zapisów w bazie.
- Weryfikacja: TypeScript/Vite poprawne.


## 2026-11-10 — Znikające litery przy ujemnym trackingu
- Odtworzono brak drugiego y w ryzyko w Cesarskim dzwonie przy letterSpacing=-0.05. Kontur fontu poprawny, lecz opentype.js toPathData generował NaN dla współrzędnych bliskich liczbie całkowitej: roundDecimal doklejał wykładnik do liczby zapisanej już wykładniczo.
- Dodano glyphPathData: zapis skończonych współrzędnych konturu przez toFixed(4), bez wadliwego zaokrąglania biblioteki. Wspólne dla całego FixedCardText, podglądu i eksportu PDF. Klucz cache kafelków uwzględnia wersję zapisu konturów; układ i raporty przepełnień bez zmiany silnika, dane talentu bez zapisu.
- Weryfikacja: TS/Vite, 11 testów składu (w tym regresja konturów przy kilku ujemnych odstępach i pozycjach bliskich liczbom całkowitym) poprawne. Poprawiono pierwsze założenie testu o obowiązkowym końcowym Z — kontur fontu może być domykany niejawnie. Playwright potwierdził skończone ścieżki obu y w rzeczywistym rekordzie i pobranie PDF; zrzut podglądu i wyrenderowany PDF sprawdzone wizualnie. Narzędzia w wtf_www/local-scripts/one-off/negative-spacing-20261110/. Bez zmian źródła fontu, treści, ustawień talentu i wdrożenia.


## 2026-11-10 — Ikona przy liczbie błędów w nawigacji
- Licznik błędów na liście talentów w lewej kolumnie poprzedza trójkąt ostrzeżenia. Tooltip i etykieta dostępności podają liczbę błędów.
- Weryfikacja: kompilacja TypeScript/Vite.


## 2026-11-10 — Koszt do 10
- Rozszerzono zakres kosztu do 0–10 w talentach i kreatorze szablonu, parserze dokumentu oraz obu walidacjach PHP. Dziesiątka składana z istniejących tuszowych cyfr 1 i 0, w granicach pola wartości; 0–9 bez zmiany rysunku.
- Weryfikacja: TS/Vite, PHP lint; 0/9/10 zaakceptowane, -1/10.5/11 odrzucone dla talentu i szablonu. Playwright potwierdził max=10, render dwóch cyfr w podglądzie i parser szablonu, zrzut sprawdzony wizualnie. Bez zapisu rzeczywistych talentów/szablonów i bez wdrożenia.


## 2026-11-10 — Notatki redakcyjne
- Rozdzielono walidację automatyczną od notatek: dodawanie, edycja, wyłączenie/włączenie, poziomy error/warning/info. Zapis przyciskiem talentu, wersjonowany JSON editorialNotes PL/EN, historia autora/czasu; max 50 na język, 2000 znaków, unikalne ID. Anulowanie pustej nowej notatki. Bez migracji tabel.
- Uwagi sourceReview PDF odczytywane zgodnie z dotychczasowym warunkiem tekstu jako ręczne notatki error ze stabilnym ID. Oryginalna historia niezmieniona; nowy zapis notatek uniezależnia ich stan od rewalidacji i treści. Starszy klient bez pola nie usuwa istniejących notatek.
- Osobne ikony/liczniki automatycznych błędów i aktywnych notatek w nawigacji, liście i kafelkach ze statusami; poziom koloru i tooltip treści. errorCount/filter/zatwierdzanie obejmują również aktywne notatki error; warning/info nie zwiększają błędów.
- Weryfikacja: TS/Vite, PHP lint, diff --check poprawne. Tymczasowy talent: Playwright dodał/edytował/wyłączył notatkę, sprawdził wszystkie poziomy, blokadę pustej treści, zapis/reload i rewalidację, zachowanie EN i osobne liczniki; bez błędów JS. PHP potwierdził ochronę notatek przed starszym klientem, odrzucenie niepoprawnych poziomów/typów/pustych treści/duplikatów oraz rozdzielenie istniejących uwag PDF. Tymczasowy rekord z wersjami/raportami/historią usunięto guarded cleanup; rzeczywistych talentów nie edytowano. Zrzut sprawdzony wizualnie; narzędzia w wtf_www/local-scripts/one-off/editorial-notes-20261110/. Bez wdrożenia.


## 2026-11-10 — Ukrywanie nieaktywnych notatek i większy koszt 10
- Nieaktywne notatki domyślnie ukryte; Pokaż/Ukryj nieaktywne z licznikiem. Po pokazaniu zawsze na końcu, bez zmiany zapisanej kolejności/ID. Pod podglądem dodano 22 px odstępu przed walidacją.
- Dziesiątka ma wysokość cyfry pojedynczego kosztu; zajmuje szersze miejsce w automatycznym pasie i odsuwa monety. Wspólny koszt szerokości po stronie TS/PHP, bez zmiany zapisanych wymiarów szablonu. Klucz cache kafelków zmieniony.
- Weryfikacja: TS/Vite i PHP lint poprawne, kontrola zakresu kosztu 0–10 oraz stabilności serwerowego układu i braku kolizji. Playwright sprawdził ukrycie, pokazanie na końcu, ponowne ukrycie, odstęp 22 px i równą wysokość 10/0 (44.288 px). Test wykonano na roboczych notatkach bez zapisu; dostosowano go do natychmiastowego znikania wyłączonego checkboxa. Zrzut podglądu sprawdzony wizualnie. Bez zmiany rzeczywistych danych i wdrożenia.


## 2026-11-10 — Pasek ustawień bezpośrednio pod podglądem
- Przeniesiono ikony, użycia i ograniczenie dostępności bezpośrednio pod kartę, przed walidację automatyczną i notatki. Wybór szablonu pozostał na końcu kolumny.
- Weryfikacja: TypeScript/Vite poprawne; zmiana wyłącznie układu, bez danych.


## 2026-11-10 — Logotypy frakcji i propozycja kosztu
- Skopiowano 1:1 logo-soldaci.svg, logo-mechanisci.svg, logo-hanza.svg i logo-rytualisci.svg ze starego app/src/assets/clans do src/assets/factions. Zweryfikowano zgodność hashy kopii i brak aktywnych elementów/zewnętrznych odwołań SVG; źródło bez zmian.
- Przygotowano wyłącznie propozycję grafiki: koszt podstawowy 4, Soldaci 3; wariant A w pasie bez tła i B z delikatnym nieregularnym tłem pod kosztem frakcyjnym. KlanarchiaedytorDoc/grafiki/koszt-frakcyjny-propozycja.svg oraz PNG. Jeszcze bez wdrażania kosztów frakcyjnych w edytorze/bazie.
- Weryfikacja: render Chrome i kontrola wizualna PNG; cyfry i monety z bieżącego wariantu tuszowego. Bez zmian danych i produkcji.


## 2026-11-10 — Wybrany wzór kosztu frakcyjnego
- Użytkownik wybrał delikatne tło. W propozycji pozostawiono ten wariant, przysunięto liczbę do logo o 8 jednostek i dopasowano szerokość tła. Aktualizacja SVG/PNG; nadal wzór, bez implementacji kosztów frakcyjnych.
- Weryfikacja: render Chrome.


## 2026-11-10 — Naprawa SVG propozycji
- Poprzednia edycja wzoru przecięła strukturę zagnieżdżonych elementów SVG i wygenerowała obraz błędu przeglądarki. Odtworzono dokument z pełnych zasobów, zachowując delikatne tło i przysunięcie logo/liczby.
- Weryfikacja: parser Chrome bez parsererror, poprawny root SVG, ponowny render PNG i kontrola wizualna. Bez zmian aplikacji i danych.


## 2026-11-10 — Koszt frakcyjny w edytorze
- Wdrożono zaakceptowany wzór: delikatne tło, logo, liczba i monety. Osobny obiekt factionCost w kreatorze, automatyczny rząd po podstawowym koszcie, własna geometria i wzorcowa frakcja/cena. Wykorzystano cztery skopiowane logotypy. Kolor wspólny z symbolem kosztu.
- Talent: + Koszt frakcyjny przy włączonym koszcie, wybór jednej z czterech frakcji i ceny 0–10, usunięcie nadpisania. Wersjonowany zapis i historia, odczyt listy, podgląd i PDF. Starsze dokumenty zgodne; starszy klient nie usuwa pola przez pominięcie. Bez nowych tabel i migracji rzeczywistych talentów.
- Weryfikacja: TS/Vite, PHP lint i 11 testów składu poprawne. Tymczasowy talent: walidacja frakcji i cen 0/10, odrzucenie nieznanej frakcji/11/ułamka; Playwright sprawdził wzór 4 + Soldaci 3, zmianę na Mechaniści 10, zapis/reload, PDF, usunięcie/dodanie oraz obiekt i właściwości kreatora, bez błędów JS. PHP potwierdził zachowanie pola przy starszym kliencie, jawne null i przykład Hanzy 10 w szablonie.
- Tymczasowy rekord, wersje, raporty i historię usunięto guarded cleanup. Zrzut podglądu i wyrenderowany PDF sprawdzone wizualnie. Narzędzia: wtf_www/local-scripts/one-off/faction-cost-20261110/. Poprzednich talentów i szablonów nie zapisywano, stary projekt i produkcja bez zmian.


## 2026-11-10 — Uproszczenie kontrolek kosztów
- Koszty przeniesione z głównego paska do osobnego zwartego bloku: ikony wyboru frakcji, poniżej przełącznik i wartość kosztu podstawowego oraz frakcyjnego. Widoczność niezależna; wyłączenie nie gubi wartości w bieżącym szkicu. Usunięto tło grafiki kosztu frakcyjnego; odświeżono cache kafelków i niezależną informację na liście.
- Weryfikacja: TS/Vite i diff --check poprawne. Playwright sprawdził wszystkie cztery kombinacje widoczności, wybór frakcji, cenę 10, brak tła oraz pozycję kontrolek pod frakcjami; bez błędów JS i bez zapisu rzeczywistych talentów. Zrzut kontrolek sprawdzony wizualnie.


## 2026-11-10 — Niezależne ikony frakcji pomiędzy kosztami
- Jeden rząd: koszt podstawowy z wartością → cztery niezależne ikony frakcji → drugi koszt z wartością, bez powtarzania logo na przycisku kosztu. Każdy element przełączany osobno, w tym wiele frakcji i same frakcje bez kosztów. Podgląd, lista i PDF korzystają z tych samych oznaczeń; układ rezerwuje tylko potrzebną szerokość.
- settings.factions zapisuje tablicę frakcji; starsze rekordy odczytują logo dawnego kosztu frakcyjnego. Pusta tablica jawnie wyłącza wszystkie logotypy; starszy klient nie kasuje jej przez pominięcie. Bez nowych tabel.
- Weryfikacja: TS/Vite, PHP lint, 11 testów składu i diff --check poprawne. Playwright na tymczasowym talencie sprawdził 64 kombinacje, kolejność kontrolek w jednym rzędzie, zapis/reload samych dwóch frakcji i PDF, bez błędów JS. Zrzut kontrolek sprawdzony; rekord QA i historię usunięto. Rzeczywistych talentów nie zapisywano.


## 2026-11-10 — Jednakowy rozmiar i pion ikon kosztu
- Druga ikona monet pobiera wymiary oraz pozycję Y pierwszej z bieżącego szablonu, z kompensacją skali bloku frakcji. Dotyczy obu szablonów, podglądu, kafelków i PDF; odświeżono cache. Bez przepisywania danych.
- Weryfikacja: TS/Vite poprawne. Playwright zmierzył szerokość, wysokość i pozycję Y obu ikon w obu szablonach (różnica poniżej 0,01 px), bez błędów JS i bez zapisu danych.


## 2026-11-10 — Jednakowy rozmiar i pion wartości kosztów
- Druga wartość kosztu dziedziczy wymiary i pozycję Y pierwszej, z kompensacją skali bloku frakcji; monety odsuwają się o rzeczywistą szerokość liczby, również 10. Odświeżono cache kafelków.
- Weryfikacja: TS/Vite poprawne; Playwright porównał szerokość, wysokość i Y liczb 3/10 oraz monet w obu szablonach (różnica poniżej 0,01 px), bez błędów JS i zapisu danych.


## 2026-11-10 — Rozdzielenie błędnej grupy frakcji i kosztu
- Poprzedni wspólny SVG łączył logo, liczbę i monety, zostawiając szerokie marginesy i wspólne zaznaczenie. Zastąpiono go trzema obiektami: factionSymbol, factionCostAmount, factionCost. Własne oczko, blokada, geometria i Y; automatyczny X bez pustej grupy, odstęp liczba–monety 1 pt. Domyślne parametry kosztów takie same jak pierwszych; dalsza edycja niezależna. Stare szablony konwertowane przy odczycie bez przepisywania historii.
- Weryfikacja: TS/Vite, PHP lint, 11 testów składu, diff --check poprawne. Playwright sprawdził osobne zaznaczenie, niezależny Y/oczko, ścisłe granice symbolu monet i zrzut kreatora. W obu szablonach porównano geometrię cyfr 3/10 i monet oraz dodatni minimalny odstęp; eksport PDF pobrany, bez błędów JS. PHP sprawdził odczyt starych szablonów i stabilny roundtrip niezależnych geometrii/widoczności. Bez zapisów rzeczywistych talentów/szablonów. Narzędzia w wtf_www/local-scripts/one-off/faction-cost-20261110/.


## 2026-11-10 — Wyjątek odstępu logo–liczba
- Między factionSymbol a widoczną factionCostAmount odstęp 1 pt zamiast wspólnego odstępu rzędu. Po ukryciu liczby wraca zwykły odstęp do następnej ikony. TS i PHP zgodne, odświeżono cache kafelków.
- Weryfikacja: TS/Vite, PHP lint oraz kontrola serwerowego układu z widoczną i ukrytą liczbą poprawne; bez zapisu danych.


## 2026-11-10 — Logo–liczba bez odstępu
- Na polecenie użytkownika zmieniono wyjątek logo frakcji → liczba z 1 pt na 0 pt w TS/PHP i odświeżono cache kafelków. Liczba → monety pozostaje 1 pt.
- Weryfikacja: TS/Vite, PHP lint i kontrola odstępu 0 pt oraz zwykłego odstępu po ukryciu liczby poprawne. Bez zapisu danych.


## 2026-11-10 — Bez bocznych marginesów frakcji
- Zmierzono rzeczywiste getBBox czterech logotypów i przycięto viewBox do grafiki. Szczególnie Hanza miała puste boki (107,697–695,723 w polu 800), Soldaci puste pasy w pionie oraz fragment poza dawnym viewBox. Nie zmieniano ścieżek ani starego projektu.
- Szerokość obiektu frakcji wynika teraz z wysokości i rzeczywistych proporcji znaku; każde logo ma własną szerokość, również przy wielu oznaczeniach. Wyłączono rozpinanie proporcji logotypu w kreatorze. TS/PHP i cache kafelków zaktualizowane; logo–liczba nadal 0 pt.
- Weryfikacja: TS/Vite, PHP lint, diff --check poprawne; Playwright sprawdził wszystkie cztery frakcje, zgodność szerokości obrazu i obiektu oraz zerowy odstęp przed liczbą. Zrzuty sprawdzone wizualnie, bez błędów JS i zapisu danych. Serwer potwierdził 0 pt oraz zwykły odstęp przy ukrytej liczbie.


## 2026-11-10 — Odstęp 1 pt i drugi koszt po lewej
- Przywrócono 1 pt logo frakcji → liczba w TS/PHP; odświeżono cache kafelków. Wartość drugiego kosztu (0–10) przeniesiona z prawego panelu do wiersza Drugi koszt — wartość w lewej kolumnie, identycznie jak pierwszy koszt.
- Weryfikacja: TS/Vite, PHP lint i diff --check poprawne. Playwright sprawdził zmianę drugiego kosztu na 10 bez zmiany pierwszego, pole na liście obiektów i odstęp 1 pt dla czterech frakcji, bez błędów JS i zapisów danych. PHP potwierdził odstęp przy widocznej i ukrytej liczbie.



## 2026-11-10 — Kolejność w podgrupie od 1
- Dodano talents.sort_order, indeks i jawną migrację schematu 4→5. Odtworzono 437 importów według source.page/index, ręczny talent na końcu; wszystkie 438 talentów w 30 niepustych podgrupach ma gęstą numerację 1..N. Snapshot i kopia SQL sprzed migracji zachowane w wtf_www/backups/klanarchia-editor/20261110/before-talent-order/.
- Lista/kafelki/nawigator sortują po sort_order,id. Pole w edytorze przed szablonem, zapis dopiero po Zapisz. Nowy/przeniesiony talent na końcu, zmiana pozycji przesuwa sąsiadów i porządkuje starą podgrupę. Zwykły zapis pomija order i zachowuje aktualną pozycję. Historia zawiera ruch i przesuniętych sąsiadów, bez sztucznych wersji sąsiadów. Aktualizacja guardów schematu (w tym liczników i ochrony usuwania podgrup) oraz ke talents-init.
- Weryfikacja: TS/Vite, PHP lint i diff --check poprawne. Audit przed/po potwierdził niezmienione treści/wersje/historię i wszystkie 437 źródłowych kolejności, gęstość 1..N i idempotencję migracji.
- Trzy tymczasowe talenty w dwóch tymczasowych podgrupach: append 1..3, ruch na początek/przesunięcia, stabilny zapis treści, ograniczenie pozycji do końca, przenoszenie z porządkowaniem obu podgrup i odrzucenie zera. Paginacja 228 rekordów poprawna.
- Playwright potwierdził minimum 1, zapis/reload pozycji 3, kolejność B/C/A w nawigatorze i zachowanie pozycji po korekcie mechaniki, bez błędów JS. Pierwszy selektor testu obejmował puste spany statusów; poprawiono test i powtórzono na tych samych rekordach QA.
- Guarded cleanup usunął testowe rekordy, wersje, raporty, historię i podgrupy. Ponowny audit 438 rzeczywistych rekordów poprawny. Narzędzia poza Git w wtf_www/local-scripts/one-off/faction-cost-20261110/order-*. Bez wdrożenia i zmian starego projektu.


## 2026-11-10 — Zwarta wyszukiwarka i podgląd notatek
- Cztery filtry w jednym rzędzie na szerokim ekranie, dwa na średnim i jeden na telefonie. Mniejsze odstępy i pola. Resetuj przywraca domyślne filtry, wyszukiwanie w treści i usuwa wyniki; token żądania zapobiega przywróceniu wyników przez opóźnioną odpowiedź.
- Notatki na liście i w wynikach wyszukiwania można rozwinąć/zwinąć bez otwierania talentu; treść i poziom aktywnych notatek. Nawigator zachowuje dotychczasową odznakę.
- Weryfikacja: TS/Vite poprawne (dotychczasowe ostrzeżenie rozmiaru paczki). Playwright: cztery filtry w rzędzie, otwarcie/zamknięcie rzeczywistych notatek, reset wyników i domyślnych ustawień, formularz mieści się przy 390 px, brak błędów JS. Bez zapisów do bazy i wdrożenia.


## 2026-11-10 — Druga zagrywka w kreatorze
- Osobny element play2 (Zagrywka 2), ta sama grafika wariantu, za pierwszą zagrywką. Niezależne oko, geometria/Y, blokada i kolor; X automatycznego rzędu. Model TS, walidacja PHP, miniatury i ochrona użytych kolorów obejmują nowy element. Starsze szablony otrzymują ukrytą kopię pierwszej zagrywki bez zmiany zapisanych danych.
- Zakres: kreator szablonów. W talentach druga zagrywka pozostaje ukryta do podłączenia osobnego ustawienia w kolejnym etapie.
- Weryfikacja: TS/Vite i PHP lint poprawne. Playwright: element dostępny, po włączeniu obok pierwszego z tym samym Y, niezależne wyłączenie, brak błędów JS; bez zapisów do bazy.


## 2026-11-10 — Zagrywka 2 w edytorze talentu
- Niezależny przełącznik drugiej zagrywki, zapis flagi play2 przez API, podgląd/PDF i symbole listy. Brak flagi w starych danych oznacza wyłączenie. Odświeżono cache kafelków.
- Przyciski frakcji i obu kosztów mają ten sam rozmiar 34 px, kolor, stan aktywny, hover i focus co pozostałe ikony; pola liczbowe dopasowane wysokością.
- Weryfikacja: TS/Vite oraz PHP lint poprawne; test przeglądarkowy opisany poniżej. Bez wdrożenia.
- Playwright: niezależne włączenie/wyłączenie Zagrywki 2, identyczny asset obu zagrywek, jednakowa wysokość przycisków kosztów/frakcji/oznaczeń, brak błędów JS. Bez zapisu danych testowych.


## 2026-11-11 — Import Talenty_wyzwan.pdf
- Lokalnie dodano 28 talentów do Splugawieni: Drzewiec 4 (strony 1–4), Wilkołaki 8 (11–18), Technoid 10 (21–30), Koroder 6 (31–36). Pominięto 12 kart wzorcowych. Kolejność w każdej podgrupie 1..N zgodna z PDF.
- Treści i formatowanie, akcje, zaznaczenie heksa, pojedyncze/podwójne zagrywki, użycia oraz trzy ograniczenia dostępności zachowane. Sześć Darów Ciemności korzysta z odpowiedniego szablonu. Historia import_pdf (Import z PDF), plik/hash/strona/symbole.
- Cuchnąca żywica: body_overflow; Zarażenie likantropią: brak numeru strony, zachowano s. xxx i notatkę. Statusy dev.
- Kopia SQL i snapshot: wtf_www/backups/klanarchia-editor/20261111/challenges/. Narzędzia i manifest: wtf_www/local-scripts/one-off/challenges-import-20261111/. Preflight oraz próbny rollback poprawne; import zatwierdzony, odczyt treści/ustawień zgodny, wcześniejsze rekordy wszystkich 15 tabel niezmienione. Bez wdrożenia i zmian starego projektu.
- Kontrola przez API/Playwright zakończona: wszystkie 28 treści i ustawień zgodne, historia importu, szablony, liczby podgrup i kolejność 1..N poprawne. Podgląd Żelaznej burzy z drugą zagrywką działa, brak błędów JS. Raport liczy trzy sygnały dotyczące dwóch talentów (brak strony ma walidację i notatkę).

## 2026-11-11 — Ikony bez podpisów na liście
- Usunięto etykiety przy graficznych oznaczeniach talentu na liście i w wynikach wyszukiwania. Pozostawiono title i aria-label, wartość kosztu oraz oznaczenia tekstowe (nieodnawialny, talent ekskluzywny).
- Weryfikacja: TS/Vite poprawne. Bez zmian danych i wdrożenia.
