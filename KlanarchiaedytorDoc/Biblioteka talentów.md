# Biblioteka talentów

## Struktura

Grupa **Talenty archetypów**, podgrupy: Egzorcysta, Inkwizytor, Kronikarz, Rzecznik, Siepacz, Szabrownik, Wiedźmiarz, Żarmistrz, Żerca. To podział administracyjny, bez automatycznego nadawania mechaniki lub praw dostępu.

## Działa lokalnie

- Menu Talenty otwiera bibliotekę. Po lewej grupy/podgrupy, osobne zaznaczanie i rozwijanie. Liczniki pokazują talenty; grupa nadrzędna sumuje również podgrupy. Start w pierwszej grupie, bez osobnego widoku Cała biblioteka, wyszukiwarki i eksportu struktury.
- Tworzenie grup i podgrup zapisuje je w bazie. Dwa poziomy, bez powtórzonych nazw wśród rodzeństwa. Zaznaczanie przygotowane pod przyszłe działania zbiorcze.
- W podgrupie Utwórz talent otwiera edytor z przypisaną podgrupą. Zwarta lista ma dwie kolumny: tytuł/metadane/oznaczenia/błędy po lewej, treści po prawej; na telefonie układ pionowy. Użycia mają same symbole z podpowiedzią. Lista pokazuje pełną fabułę i mechanikę z formatowaniem, aktywne oznaczenia (także koszt i użycia), dostępność, podgrupę, oznaczenie wersji oraz zapisane błędy. Edycję otwiera tytuł lub przycisk Otwórz. Usunięto dodatkowy rząd przycisków podgrup; nawigacja pozostaje po lewej. Powrót zachowuje kontekst; odświeżenie strony zachowuje dane bazy, ale resetuje wybór grupy.
- Lewa kolumna: tytuł, fabuła, mechanika. Podgląd pośrodku, ustawienia po prawej. Początkowy przykład PL: Prymat potępieńca. Znaczniki B/I/Cecha/Aspekt/Stan tylko w mechanice, zgodne z prototypem i wspólnymi stylami.
- Użycia: brak, raz na misję (prawy kwadrat), trzy razy na misję, raz na scenę. Oznaczenia, akcja, koszt, ograniczenie dostępności oraz niezależne odstępy liter i interlinia. Ostrzeżenie przepełnienia pod podglądem.
- Zapisz zapisuje talent i nową wersję historii w bazie WordPressa. Kręciołek podczas zapisu. Błąd sieci lub konflikt zachowuje szkic; starsza rewizja nie nadpisuje nowszej. Niezapisane zmiany wymagają potwierdzenia przy wyjściu.
- Zapis obejmuje wszystkie treści, oznaczenia i nadpisania typografii. Talent wskazuje szablon i zawsze używa jego aktualnego układu. Oddzielny wygląd wymaga utworzenia osobnego szablonu. Tło podglądu i chwilowe ukrycie tła ramki pozostają wyłącznie preferencjami podglądu.
- Stały kod talentu ma format XXXX-XXXX; wersja XXXX-XXXX-ddmmyy-nn, np. A7K2-M9B4-091126-01. Widoczna na liście, w edytorze, historii i nazwie PDF. Historia zmian w edytorze: oznaczenie wersji, data, autor WordPressa i zmienione pola. Bez przywracania dawnych wersji na tym etapie.

## Baza i uruchomienie

Dwie tabele kategorii, cztery tabele talentów opisane w [Bazie danych](Baza%20danych.md). Inicjalizacja jawna, bez zmian podczas odwiedzin:

```sh
wp ke library-init --user=1 --allow-root
wp ke talents-init --user=1 --allow-root
```

Dostęp wyłącznie dla administratora. Interfejs PL/EN; brak tłumaczenia nie powoduje automatycznego kopiowania treści do drugiego języka. Lista może pokazać pełną treść PL z oznaczeniem braku tłumaczenia, ale edytor otwiera wyłącznie treść wybranego języka. Zmiana jednej wersji językowej zachowuje pozostałe tłumaczenia w nowej wersji talentu.

## Kolejne etapy

Bieżące zadania biblioteki i dalsza kolejność: [TODO i ramowy plan](TODO.md). Eksport pojedynczego talentu już działa; otwarty zakres dotyczy m.in. pracy na wielu talentach i arkuszach. [Zaimportowano 81 talentów archetypów z PDF](Import%20talentów%20z%20PDF.md); stary projekt pozostaje bez zmian. Nie wdrażano na produkcję.

## Kafelki według podgrup

Biblioteka ma przełącznik Lista / Kafelki, domyślnie Lista. Wybór pozostaje przy zmianie podgrupy i powrocie z edytora, bez trwałego zapisu preferencji. Lista pokazuje tytuł otwierający talent, kod, status, oznaczenia, raporty błędów oraz fabułę/mechanikę. Talenty są podzielone na sekcje z nazwą podgrupy i liczbą talentów; po wybraniu podgrupy pozostaje jej sekcja. Puste sekcje nie są wyświetlane. Kafelek pokazuje wyłącznie wizualizację karty, bez podpisu, kodu, podgrupy i raportu pod spodem. Diagnostyka pozostaje zapisana i dostępna po otwarciu edytora. Kliknięcie kafelka otwiera edytor; bez osobnego przycisku Otwórz w tym widoku. Minimalna docelowa szerokość kafelka 480 px, na mniejszym ekranie dopasowanie do dostępnego miejsca.

Karty używają aktualnego dokumentu wybranego szablonu, treści i nadpisań talentu oraz wspólnych fontów/stylów, jak podgląd edytora. Aktualne szablony pobierane zbiorczo, bez powtarzania dokumentu dla każdego talentu.

IntersectionObserver uruchamia skład w pobliżu ekranu (margines 300 px). Po gotowym składzie utrwalany jest obraz SVG z krzywymi liter i osadzonymi grafikami. Poza ekranem zwalniane są węzły podglądu oraz jego URL; gotowe obrazy pozostają w pamięci LRU do 96 kart. Klucz uwzględnia talent/rewizję, szablon/aktualną rewizję, rewizję wspólnych stylów i język. Dzięki temu przewijanie i powrót do biblioteki korzysta z gotowego obrazu, a zmiana danych unieważnia podgląd. Pamięć działa w bieżącej sesji strony, bez zapisu do bazy i localStorage.

Historia przeglądarki obsługuje otwieranie talentu i nowego szkicu: Wstecz wraca do wybranej podgrupy, Dalej przywraca edytor. Powrót do biblioteki przez Talenty w menu. Przy niezapisanych zmianach cofnięcie wymaga potwierdzenia odrzucenia.

## Nawigacja podczas edycji

Edytor ma po lewej przewijaną nawigację katalogową, pośrodku podgląd i ustawienia pod nim, po prawej treść talentu. Nawigacja pokazuje wyłącznie bezpośrednie podgrupy i talenty bieżącej grupy. Przycisk Wyżej przechodzi do rodzica, na najwyższym poziomie widoczne są grupy główne. Start w podgrupie otwartego talentu; aktualny talent wyróżniony, przy błędach licznik.

Kliknięcie innego talentu otwiera go obok. Niezapisane zmiany wymagają potwierdzenia odrzucenia, podczas zapisu przełączanie zablokowane. Każde otwarcie jest wpisem historii: Wstecz/Dalej przechodzi między talentami, Talenty w menu otwiera bibliotekę jako osobny wpis historii. Na wąskim ekranie nawigacja i panele układają się pionowo.

Układ zwarty: strzałka przed nazwą grupy, oznaczenia/użycia pod podglądem w jednym lub dwóch wierszach, szablon na końcu. Mechanika ma 5 widocznych wierszy (maks. 190 px), dłuższa treść przewijana. Historia zmian pod Mechaniką w prawej kolumnie.

Dodaj talent na końcu lewej listy jest dostępne wewnątrz podgrupy bez dalszych podgrup. Otwiera pusty szkic w tej podgrupie, z szablonem ostatnio edytowanego talentu (używany aktualny układ tego szablonu). Bez dotychczasowych danych przykładowych i bez kopiowania treści/oznaczeń. Dopiero Zapisz tworzy rekord i kod talentu; odrzucenie szkicu nie zmienia bazy. Także ponowne Dodaj talent wymaga potwierdzenia odrzucenia niezapisanej treści.

## Statusy

W nagłówku edytora wybieramy W opracowaniu (dev, żółty), Do weryfikacji (toCheck, niebieski), Zatwierdzony (approved, zielony) lub Wycofany (delete, czerwony). Zmiana utrwala się po Zapisz i pojawia się w historii z autorem, datą i przejściem statusów. Przy błędach zatwierdzenie wymaga potwierdzenia; wycofanie również wymaga potwierdzenia. Status nie zastępuje raportu błędów.

Kropki widoczne przy talentach w nawigacji i na kafelkach; nazwa statusu w podpowiedzi oraz dla czytnika ekranu. Nie drukujemy kropek na karcie/PDF. Wycofane talenty są na razie nadal widoczne, żeby można było zmienić status z powrotem; osobny widok archiwum jest kolejnym zadaniem.

Gdy lewa nawigacja pokazuje podgrupy grupy głównej, pod listą jest Dodaj podgrupę z krótkim formularzem nazwy. Przy pustych podgrupach jest kosz i potwierdzenie zawierające nazwę. Podgrupa z jakimkolwiek talentem (również wycofanym/zarchiwizowanym) lub podgrupami nie może być usunięta. Otwarta podgrupa edytowanego szkicu jest chroniona przed skasowaniem z nawigacji. Tworzenie/usuwanie podgrup nie odrzuca treści edytowanego talentu.

## Przenoszenie talentu

Obok tytułu klikalna ścieżka Grupa / Podgrupa. Otwiera okno z wyborem grupy, a następnie jednej z jej podgrup. Wybierz ustawia roboczy cel; dopiero Zapisz przenosi talent, zachowując kod, treść i historię. Anuluj lub Escape zamyka okno bez zmiany celu. Po zapisie lewa nawigacja przechodzi do nowej podgrupy, listy/liczniki odświeżają się, historia odnotowuje zmianę podgrupy. Dotyczy również wyboru podgrupy nowego szkicu przed pierwszym zapisem.

Grupy w lewej kolumnie biblioteki są domyślnie zwinięte przy pierwszym wczytaniu. Ręczne rozwinięcie pozostaje po odświeżeniu danych i powrocie z edycji. W widoku Kafelki przełącznik Pokaż/Ukryj statusy odsłania pod kartą zwarty pasek: bazowy kod talentu (pełne oznaczenie wersji w podpowiedzi), kolor i nazwę statusu oraz symbol błędu z liczbą. Przy zerze symbol jest przygaszony, przy błędach wyróżniony i ma podpowiedź z komunikatami. Domyślnie paski ukryte; przełącznik nie występuje w Liście. Wybór pozostaje w bieżącej sesji podczas powrotu z edytora.

Identyfikator na samej grafice talentu jest zawsze ukryty w bibliotece i podglądzie edytora. Przy PDF opcja ID w PDF jest domyślnie wyłączona; zaznaczenie dodaje zapisane oznaczenie talentu do pliku w miejscu określonym przez szablon. Nie zmienia podglądu, treści ani ustawień szablonu. Dla niezapisanego szkicu/zmian opcja niedostępna, aby nie oznaczyć roboczej treści dawnym kodem. ID w pasku statusów oraz metadanych listy pozostaje.

W pasku formatowania Mechaniki przycisk monet wstawia [ikona-kosztu: koszt] w miejscu kursora (lub zastępuje zaznaczenie). W tekście pola pozostaje znacznik, w liście/podglądzie/kafelku/PDF renderowany jest sam symbol. W Tytule i Fabule nie ma tego narzędzia.

Docelowe miejsce promocyjnych talentów dla wspierających: promki → Zbiórka - Dary Ciemności. Grupa i podgrupa utworzone lokalnie; import osobnym krokiem, z zachowaniem dotychczasowych kodów.

- Nazwę grupy lub podgrupy zmieniamy ołówkiem przy jej nazwie w bibliotece albo nawigacji edytora. Zapis dotyczy bieżącego języka i zachowuje przypisania talentów. Nazwy rodzeństwa muszą być unikalne.
