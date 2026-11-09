# Import talentów archetypów — 2026-11-09

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
