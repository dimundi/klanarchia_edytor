# Zakres prac

- Edytor postaci i talentów dla użytkowników.
- Wewnętrzny edytor do projektowania kart postaci i talentów.
- Wstępnie zakładamy aplikację w React. Po uzupełnieniu zakresu prac ocenimy ten wybór; wybór innego frameworka pozostaje otwarty, jeśli będzie lepiej odpowiadał wymaganiom.
- Edytor będzie dostępny pod adresem `https://whatthefrog.pl/klanarchia/edytor/`, z nagłówkiem i stopką strony WordPress.
- Strona WordPress będzie przekazywać aplikacji konfigurację, np. język strony: PL lub EN. Pozostałe parametry i sposób ich przekazywania ustalimy podczas projektowania integracji.
- Projekt od początku przygotowujemy w dwóch wersjach językowych: polskiej i angielskiej (PL/EN).
- Funkcje edytora będą miały trzy poziomy dostępu: publiczne, dla zalogowanych użytkowników oraz wymagające dodatkowych uprawnień.
- Edytor będzie korzystać z kont, sesji logowania i uprawnień WordPressa, bez osobnego logowania do aplikacji.
- WordPress przekaże aplikacji informacje o dostępnych funkcjach. Dostęp do chronionych danych i operacji będzie dodatkowo sprawdzany na serwerze przy każdym żądaniu; samo ukrycie elementów interfejsu nie stanowi zabezpieczenia.
- Specjalne uprawnienia edytora będą mogły być przyznawane bez nadawania pełnych praw administratora WordPressa. Szczegółowy podział uprawnień ustalimy podczas uzupełniania zakresu prac.
- Edytor będzie zapisywać dane w tej samej bazie danych co WordPress, we własnych tabelach. Strukturę danych, relacje i indeksy zaprojektujemy przed implementacją, uwzględniając dużą ilość danych, wersje językowe i powiązania z kontami użytkowników WordPressa.
- Część serwerowa edytora będzie działać jako wtyczka WordPressa i korzystać z jego istniejącego połączenia z bazą. Dane dostępowe pozostaną w konfiguracji serwera; nie będą przekazywane do aplikacji React ani przeglądarki.
- React będzie odczytywać i zapisywać dane przez API WordPressa. Serwer sprawdzi uprawnienia przed wykonaniem chronionych operacji na danych edytora.

## Dostęp użytkowników w wersji produkcyjnej

- Użytkownik może korzystać z edytora bez logowania lub po zalogowaniu na konto WordPressa.
- Użytkownik niezalogowany nie ma dostępu do historii i nie może zapisywać wyników do późniejszego wykorzystania.
- Użytkownik zalogowany ma dostęp do własnej historii i może zapisywać wyniki na swoim koncie. Szczegółowy zakres historii i zapisywanych wyników ustalimy podczas projektowania funkcji i bazy danych.
- Użytkownik z uprawnieniami administratora ma dodatkowo dostęp do projektowania talentów i kart postaci.
- Powyższe zasady opisują docelową wersję produkcyjną. Obecny ekran developerski nadal jest dostępny wyłącznie dla administratora; na tym etapie aktualizujemy tylko dokumentację.

## Menu i kolejność projektowania interfejsu

- Aplikacja ma jedno wspólne menu z opcjami dostosowanymi do uprawnień użytkownika. Na komputerze menu jest poziome u góry, a na telefonie zwijane. Obszar roboczy zajmuje pełną szerokość pod menu.
- Część użytkownika obejmuje pozycje „Moje postacie” i „Moje talenty”. Osobna pozycja „Historia” została usunięta z interfejsu. Dostęp do zapisanych danych i historii wymaga zalogowania. Sposób wejścia do pracy bez logowania doprecyzujemy podczas projektowania tej części.
- Administrator ma dodatkową sekcję „Projektowanie” z pozycjami: „Talenty”, „Kreator szablonów talentów” i „Kreator szablonów kart postaci”.
- „Talenty” obejmują bibliotekę, tworzenie i edycję treści talentów. Kreator szablonów talentów służy do projektowania wyglądu ich kart, a kreator szablonów kart postaci — układu kart i pól.
- Najpierw projektujemy wewnętrzny interfejs administratora, zaczynając od sekcji „Projektowanie → Talenty”. Następnie przygotujemy część dla użytkowników. Obecny etap obejmuje dokumentację ekranów, menu i przejść oraz projektowanie bazy przed implementacją funkcji.

- Definicje pól są elementami szablonu i są zapisywane oraz wersjonowane razem z nim; nie tworzymy osobnej globalnej biblioteki definicji pól.

## Historia zmian talentów

- Nasz wewnętrzny edytor zapisuje historię zmian talentów: kto, kiedy i co zmienił. Dostęp do niej mają wyłącznie uprawnione osoby wewnętrznego edytora. Nie jest to wymagana funkcja części dla klientów. Szczegóły zapisu opisuje `Projekt bazy danych.md`.

## Zestawy talentów i arkusze

- Zestawy talentów są ważną funkcją aplikacji. Obejmują listę wybranych talentów oraz cechy arkusza; konkretne cechy ustalimy na odpowiednim etapie.
- Projektowanie i tworzenie struktury bazy dla zestawów i arkuszy odkładamy do etapu pracy nad tą funkcją.

## Strona Witaj

- Pierwszym ekranem edytora jest strona „Witaj”. Duże ikony i infografiki służą prezentacji elementów edytora, skrótów i innych informacji.
- Kliknięcie logo Klanarchii w pasku menu prowadzi do strony Witaj. Prezentowane skróty są dostosowane do uprawnień użytkownika.
