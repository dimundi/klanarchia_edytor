# Biblioteka talentów

## Struktura

Grupa **Talenty archetypów**, podgrupy: Egzorcysta, Inkwizytor, Kronikarz, Rzecznik, Siepacz, Szabrownik, Wiedźmiarz, Żarmistrz, Żerca. To podział administracyjny, bez automatycznego nadawania mechaniki lub praw dostępu.

## Działa lokalnie

- Menu Talenty otwiera bibliotekę. Po lewej grupy/podgrupy, osobne zaznaczanie i rozwijanie. Liczniki pokazują talenty; grupa nadrzędna sumuje również podgrupy. Start w pierwszej grupie, bez osobnego widoku Cała biblioteka, wyszukiwarki i eksportu struktury.
- Tworzenie grup i podgrup zapisuje je w bazie. Dwa poziomy, bez powtórzonych nazw wśród rodzeństwa. Zaznaczanie przygotowane pod przyszłe działania zbiorcze.
- W podgrupie Utwórz talent otwiera edytor z przypisaną podgrupą. Lista zapisanych talentów ma przycisk Otwórz. Powrót zachowuje kontekst; odświeżenie strony zachowuje dane bazy, ale resetuje wybór grupy.
- Lewa kolumna: tytuł, fabuła, mechanika. Podgląd pośrodku, ustawienia po prawej. Początkowy przykład PL: Prymat potępieńca. Znaczniki B/I/Cecha/Aspekt/Stan tylko w mechanice, zgodne z prototypem i wspólnymi stylami.
- Użycia: brak, raz na misję (prawy kwadrat), trzy razy na misję, raz na scenę. Oznaczenia, akcja, koszt, ograniczenie dostępności oraz niezależne odstępy liter i interlinia. Ostrzeżenie przepełnienia pod podglądem.
- Zapisz zapisuje talent i nową wersję historii w bazie WordPressa. Kręciołek podczas zapisu. Błąd sieci lub konflikt zachowuje szkic; starsza rewizja nie nadpisuje nowszej. Niezapisane zmiany wymagają potwierdzenia przy wyjściu.
- Zapis obejmuje wszystkie treści, oznaczenia i nadpisania typografii. Talent przypięty do konkretnej wersji szablonu; otwieranie odtwarza tę wersję. Wybranie innej wersji jest świadomą zmianą. Tło podglądu i chwilowe ukrycie tła ramki pozostają wyłącznie preferencjami podglądu.
- Historia zmian w edytorze: wersja, data, autor WordPressa i zmienione pola. Bez przywracania dawnych wersji na tym etapie.

## Baza i uruchomienie

Dwie tabele kategorii, cztery tabele talentów opisane w [Bazie danych](Baza%20danych.md). Inicjalizacja jawna, bez zmian podczas odwiedzin:

```sh
wp ke library-init --user=1 --allow-root
wp ke talents-init --user=1 --allow-root
```

Dostęp wyłącznie dla administratora. Interfejs PL/EN; brak tłumaczenia nie powoduje automatycznego kopiowania treści do drugiego języka. Lista może pokazać nazwę PL, ale edytor otwiera wyłącznie treść wybranego języka. Zmiana jednej wersji językowej zachowuje pozostałe tłumaczenia w nowej wersji talentu.

## Kolejne etapy

Docelowe widoki kart/listy, porównywanie, eksport talentów, działania zbiorcze i publikacja pozostają do opracowania. Nie importowano talentów i nie zmieniano starego projektu. Nie wdrażano na produkcję.
