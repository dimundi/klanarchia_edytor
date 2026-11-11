# Pierwsze wdrożenie — 11.11.2026

Edytor uruchomiony na https://whatthefrog.pl/klanarchia/edytor/. Wejście przez cały boks Edytor postaci; administrator lub klanarchia_editor_creator. Produkcja jest od teraz głównym miejscem edycji danych.

Przed wdrożeniem odtworzono strukturę i dane w osobnej lokalnej bazie. Import produkcyjny zachował 466 talentów, historię, kolejność, szablony, notatki, walidację i SET-y; zgodność 17 tabel i sześciu opcji potwierdzona. Historyczny autor przypisany do wskazanego konta produkcyjnego. Kont WordPressa nie importowano.

Skrypty do tego wdrożenia i krótka procedura: [dokumentacja WTF](../../wtf_www/wtfDoc/wtyczki/klanarchia-edytor-produkcja.md). Prywatne archiwum: wtf_www/backups/klanarchia-editor/20261111/first-release/; skrypty także w wtf_www/local-scripts/one-off/editor-release-20261111/. Nie są ogólnym systemem synchronizacji.

Nie nadpisywać produkcyjnych danych lokalną bazą. Po dłuższej przerwie przygotować pobranie danych edytora z produkcji do localhost. Wycofanie aplikacji: dezaktywacja wtyczki, bez kasowania danych. Szczegóły i kopie opisane w dokumentacji WTF.
