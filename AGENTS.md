# Instrukcje dla AI

## Projekt i komunikacja

- Pracujemy nad `Klanarchia_edytor`: nowym edytorem online talentów i kart postaci do Klanarchii.
- Pisz po polsku, prosto i konkretnie. Dokumentacja ma służyć jednoosobowemu projektowi.
- Przed pracą przeczytaj `KlanarchiaedytorDoc/PROJEKT.md` i `KlanarchiaedytorDoc/AI.md`.
- Nie wymyślaj zasad gry, talentów ani pól kart. Korzystaj z materiałów użytkownika.
- Nie traktuj planów ani technologii starego projektu jako zatwierdzonych decyzji dla nowej aplikacji.

## Ochrona projektu źródłowego

- `../Klanarchia_karty_postaci` pozostaje 1:1. Jego funkcje są nadal używane.
- Nie zmieniaj jego kodu, dokumentacji, konfiguracji, danych ani bazy. Nie uruchamiaj operacji, które zapisują do starego projektu lub jego danych.
- Możesz czytać materiały źródłowe i kopiować wybrane dane do nowego projektu w zakresie zleconego zadania. Kopiowanie musi zachować źródło bez zmian.
- Zakres i sposób migracji ustal przed jej wykonaniem. Zachowuj identyfikatory i powiązania przenoszonych danych, jeśli nie ustalono inaczej.

## Dokumentacja i dziennik AI

- Pliki dokumentacji Markdown przechowuj w katalogu `KlanarchiaedytorDoc`. Wyjątkiem jest `AGENTS.md`, który pozostaje w katalogu głównym projektu.

- `KlanarchiaedytorDoc/PROJEKT.md` zawiera potwierdzone wymagania, decyzje i aktualny stan. Aktualizuj go po ważnych ustaleniach i zmianach.
- `KlanarchiaedytorDoc/TODO.md` jest jedną listą otwartych zadań i ramowego planu. Aktualizuj status po realizacji, odróżniaj proponowaną kolejność od zatwierdzonego zakresu i nie duplikuj list w innych dokumentach.
- `KlanarchiaedytorDoc/AI.md` jest dziennikiem dla AI. Po każdej wykonanej zmianie dopisz datę, co zmieniono, wynik weryfikacji i ewentualne pozostałe zadania.
- Wpisy w `KlanarchiaedytorDoc/AI.md` dodawaj chronologicznie. Zachowuj wcześniejsze wpisy; nie zapisuj pełnego przebiegu rozmowy ani wewnętrznego rozumowania.
- Rozróżniaj stan wdrożony, plan i kwestię do ustalenia. Nie zapisuj nieuruchomionych testów jako wykonanych.
- Nie umieszczaj sekretów, danych dostępowych ani danych osobowych w dokumentacji i dzienniku.
- Prace wykonuj lokalnie. Wdrożenie online wymaga wyraźnego polecenia użytkownika.
