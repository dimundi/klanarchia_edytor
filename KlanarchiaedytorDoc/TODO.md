# TODO i ramowy plan

Stan: 2026-11-09. Jedna lista zadań projektu; szczegóły wymagań pozostają w dokumentach modułów. Kolejność poniżej jest propozycją do dopracowania, bez ustalonych terminów. Uzgodniony kierunek: najpierw narzędzia wewnętrzne do talentów i kart, potem część dla użytkowników.

## Już działa lokalnie

- Edytor React we wtyczce WordPressa, menu, Witaj i pełny ekran; dostęp administratora.
- Szablony talentów z zapisem wersji w bazie, dwa warianty graficzne, wspólne style i kolory.
- Grupy/podgrupy, biblioteka, tworzenie i edycja talentu, zapis/otwieranie, historia kto/kiedy/co oraz liczniki talentów.
- Oznaczenia tekstu mechaniki, symbole, koszt, użycia, ograniczenie dostępności i indywidualne odstępy liter/interlinia.
- Własne fonty Linux Libertine, wspólne dzielenie PL/EN-US i gotowy skład SVG; ostrzeganie o przepełnieniu.
- Bezpośredni eksport pojedynczej karty do PDF z edytora talentu i kreatora szablonu. Obecny PDF zawiera tekst jako krzywe; na razie tak zostaje.

Działające fundamenty nie oznaczają ukończenia całych modułów. Dane starego edytora nie zostały zaimportowane; brak wdrożenia na produkcję.

## Proponowana kolejność

| Etap | Cel | Kiedy uznajemy za gotowy |
| --- | --- | --- |
| 1. Redakcja talentów | Wygodnie przeglądać, poprawiać i porównywać wiele talentów. | Sprawdzony przebieg biblioteka → edycja → zapis → powrót oraz uzgodnione przeglądanie i działania zbiorcze. |
| 2. Dane i import | Dokończyć decyzje bazy i bezpiecznie przenieść wybrane materiały. | Zatwierdzone mapowanie, próbny import z raportem i kontrolą powtórzeń; źródło bez zmian. |
| 3. Zestawy i arkusze | Układać wybrane talenty w arkusze do eksportu. | Uzgodnione cechy arkusza i model danych, poprawny podgląd i eksport wielu kart. |
| 4. Szablony kart postaci | Przygotować wewnętrzne narzędzie projektowania kart. | Uzgodnione pola, wersjonowane szablony, zapis i podgląd/eksport. |
| 5. Część użytkownika | Udostępnić tworzenie postaci i korzystanie z talentów. | Przetestowane konta, własne zapisy, dostęp publiczny i specjalne prawa; gotowość do osobnego wdrożenia. |

### 1. Redakcja talentów — najbliższy etap

- [ ] T-01 Doprecyzować ekran biblioteki i miejsce Utwórz talent; obecne umiejscowienie pozostaje do poprawy.
- [ ] T-02 Zaprojektować przeglądanie dużej liczby talentów: lista/karty, szukanie, filtry i sortowanie. Dopiero potem wdrożyć; nie przywracać usuniętej wyszukiwarki ani Całej biblioteki bez ustalenia ich roli.
- [ ] T-03 Zaprojektować zaznaczanie talentów i działania na zaznaczeniu, także w kontekście grup/podgrup.
- [ ] T-04 Zaprojektować porównywanie i weryfikację talentów oraz wygodne przechodzenie między edycjami z zachowaniem kontekstu biblioteki.
- [ ] T-05 Wstawić symbol kosztu do treści mechaniki przez edytor; obecnie istnieje osobna grafika/komponent, ale brak obsługi wstawiania.
- [ ] T-06 Wrócić do zgłoszonych poprawek ramki i ikony kosztu. Zachować wariant Oryginalny i Tuszowy oraz możliwość powrotu do wcześniejszych grafik.

Wynik etapu: zatwierdzony podstawowy sposób pracy redakcyjnej na wielu talentach, nie tylko edycja pojedynczej karty. Rozbudowę eksportu zaznaczenia połączyć z etapem arkuszy.

### 2. Dane i import

- [ ] D-01 Dokończyć projekt bazy pod uzgodnione filtry, publikację, talenty prywatne/ograniczone i prawa do edycji. Ocenić, które parametry obecnego dokumentu ustawień wymagają osobnych kolumn oraz indeksów.
- [ ] D-02 Ustalić obieg treści PL/EN: brak tłumaczenia, gotowość do publikacji i odpowiedzialność za zatwierdzanie. Nie utożsamiać angielskiego interfejsu z gotowymi tłumaczeniami materiałów.
- [ ] D-03 Ustalić zakres kopiowania ze starego projektu: talenty, grupy, szablony i powiązania. Bez automatycznego przenoszenia wszystkich dawnych funkcji/danych.
- [ ] D-04 Przygotować mapowanie identyfikatorów, podgląd importu i raport różnic/błędów; próbnie zaimportować uzgodnioną małą partię.
- [ ] D-05 Po ocenie próby przenieść uzgodniony zakres z kontrolą duplikatów, zachowaniem lokalnych poprawek i możliwością wycofania importu. Stary projekt pozostaje 1:1.

### 3. Zestawy talentów i arkusze

- [ ] A-01 Ustalić cechy arkusza poza samą listą talentów oraz przebieg wyboru i układania kart.
- [ ] A-02 Dopiero na tym etapie zaprojektować i utworzyć tabele zestawów/arkuszy.
- [ ] A-03 Wdrożyć podgląd i eksport wielu kart, łączenie ramek bez odstępów oraz kontrolę formatu i przepełnień.

### 4. Szablony kart postaci

- [ ] K-01 Ustalić strukturę kart i potrzebne pola na podstawie materiałów Klanarchii.
- [ ] K-02 Dopracować model szablonu i wartości pól postaci. Definicje pól należą do konkretnego szablonu i są wersjonowane razem z nim.
- [ ] K-03 Wdrożyć kreator, bibliotekę, zapis wersji oraz wspólny podgląd i eksport kart postaci.

### 5. Część użytkownika i przygotowanie udostępnienia

- [ ] U-01 Zaprojektować pracę bez logowania oraz Moje postacie/Moje talenty dla zalogowanych, z zakresem własnych zapisów i historii.
- [ ] U-02 Wdrożyć specjalne uprawnienia WordPressa bez wymagania pełnej roli administratora. Każda chroniona operacja sprawdza prawa na serwerze.
- [ ] U-03 Wdrożyć zapis danych postaci i powiązania z konkretnymi wersjami talentów/szablonów; zmiana szablonu nie zmienia samoczynnie zapisanej postaci.
- [ ] U-04 Sprawdzić brak dostępu do cudzych danych, działanie PL/EN, interfejs mobilny i współpracę ze stroną WordPressa.
- [ ] U-05 Przygotować migracje, kopię i procedurę wdrożenia. Produkcja dopiero na wyraźne polecenie użytkownika.

## Na później — bez przypisanego terminu

- [ ] L-01 Słownik terminów Klanarchii: ręczne dodawanie hasła podczas pracy nad talentem, definicja, poprawna pisownia, odmiany/wielkie litery, kategoria i opcjonalny odpowiednik EN. Wspólny dla talentów, podręcznika i przyszłego asystenta.
- [ ] L-02 Własne wyjątki dzielenia wyrazów PL/EN i sposób ich edycji; osobne od słownika znaczeń terminów.
- [ ] L-03 Asystent Klanarchii dla wybranych użytkowników: pomoc przy talentach oraz korekta podręcznika (ortografia, gramatyka, interpunkcja, styl, spójność terminologii i zapisów zasad). Zatwierdzone materiały, słownik, zasady redakcyjne i wzorce wersjonowane jako wspólna wiedza. Sugestie do porównania i zatwierdzenia, oryginał zachowany; bez samodzielnej zmiany mechaniki. Integracja API z kluczem na serwerze, kontrolą uprawnień i limitami. Model, koszty i praca nad rozdziałami do ustalenia. Zatwierdzanie odpowiedzi nie uczy automatycznie modelu; historia tej rozmowy nie jest automatycznie dostępna asystentowi.
- [ ] L-04 PDF z tekstem do zaznaczania/wyszukiwania i osadzonymi fontami, z zachowaniem gotowych pozycji liter. Pomysł odłożony decyzją użytkownika; nie zastępuje obecnego eksportu w krzywych na tym etapie.
- [ ] L-05 Grafika jako tło karty zamiast samego koloru — doprecyzować przy rozwoju wyglądu szablonów.

## Jak utrzymujemy listę

- Tu zapisujemy stan i kolejność zadań. Dokumenty modułów zawierają szczegóły, PROJEKT.md decyzje/stan, AI.md wyłącznie wykonane zmiany i weryfikację.
- Nowy pomysł trafia najpierw do Na później. Nie staje się automatycznie wymaganiem bieżącego etapu.
- Po wykonaniu oznaczamy zadanie i odsyłamy do opisu rozwiązania; nie przepisujemy tej samej listy do innych dokumentów.
- Kolejny konkretny krok proponowany do wspólnego omówienia: T-01/T-02, czyli sposób pracy w bibliotece talentów. Ten plan nie zleca jeszcze implementacji kolejnych funkcji.
