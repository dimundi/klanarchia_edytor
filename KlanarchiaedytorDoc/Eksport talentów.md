# Eksport talentów i SET-y

Ustalenia: 2026-11-11. Specyfikacja do wdrożenia; bez zmian kodu i bazy. Istniejący eksport pojedynczego talentu pozostaje osobną funkcją.

## Zaznaczanie

- Eksport zbiorczy wymaga zaznaczenia co najmniej jednego talentu.
- Checkboxem można zaznaczyć całą grupę, podgrupę lub pojedynczy talent. Grupa i podgrupa służą do zbiorczego zaznaczania ich talentów.

## SET — zapisany wybór i kolejność

- Zaznaczone talenty można zapisać jako SET i otworzyć go później.
- SET zapisuje nie tylko wybrane talenty, lecz także ich kolejność.
- **Kolejność jest kluczowym wymaganiem.** Otwarcie SET-u i eksport muszą zachować zapisany porządek, również pomiędzy stronami arkusza. Nie wolno samoczynnie zastępować go sortowaniem biblioteki, nazwami, datami czy kolejnością odpowiedzi bazy.
- Sposób ustalania początkowej kolejności i jej ręcznej zmiany pozostaje do doprecyzowania.

## Szablony eksportu

- Przy eksporcie wybieramy szablon eksportu, czyli układ arkusza. To osobne pojęcie od szablonu wyglądu talentu.
- Szablony eksportu będą definiowane w kodzie; na tym etapie nie powstaje ich kreator.
- Pierwsze dwa warianty: zwykły arkusz A4 oraz arkusz A4 z fabrycznie wyciętymi naklejkami.
- Inne formaty w późniejszym etapie.
- Dokładne wymiary naklejek, liczba pól, marginesy, odstępy i kierunek wypełniania arkusza wymagają ustalenia przed implementacją danego układu.

## Parametry eksportu

Użytkownik wybiera:

- szablon eksportu;
- czy drukować ramkę talentu;
- czy drukować identyfikator talentu;
- przestrzeń kolorów: RGB albo CMYK.

Są to ustawienia wyniku eksportu, nie polecenie zmiany zapisanych talentów lub ich szablonów. Obsługa CMYK jest wymaganiem przyszłego eksportu; nie oznacza, że obecny generator PDF już ją realizuje. Sposób wykorzystania palety CMYK i profil druku pozostają do uzgodnienia.

## Kwestie otwarte

- Możliwość zapisywania powyższych parametrów w SET-ach konfiguracyjnych, aby łatwo ponawiać eksport. To propozycja, jeszcze nie zatwierdzona decyzja o modelu zapisu.
- Czy konfiguracja eksportu będzie częścią SET-u talentów, czy osobnym, wielokrotnie używanym presetem.
- Zasady powtórnego zaznaczania tego samego talentu, zachowanie SET-u po usunięciu talentu i po dodaniu nowych talentów do wcześniej zaznaczonej grupy.
- Czy drukowany identyfikator oznacza kod stały, czy pełny kod z oznaczeniem wersji.

Model bazy dla SET-ów pozostaje do zaprojektowania. Lista wdrożenia jest utrzymywana wyłącznie w [TODO](TODO.md).

## Stan lokalny — 2026-11-11

Działa tryb zaznaczania: grupy, podgrupy, talenty, wspólne checkboxy drzewa/listy/kafelków/wyszukiwania, stany częściowe oraz licznik unikalnych talentów. Podgrupy można rozwijać do talentów. Wyłączenie trybu zachowuje wybór podczas pracy w module; odświeżenie strony nie zastępuje przyszłego zapisu SET-u. Eksportuj pozostaje dostępnym przyciskiem zapowiadającym panel. Zapis SET-ów, ustawianie ich kolejności i eksport zbiorczy nie są jeszcze wdrożone.
