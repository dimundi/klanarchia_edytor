# Import promocyjnych Darów Ciemności — 2026-11-10

Przeniesiono 228 talentów PL ze starego cardTemplates/talenty/talenty.json: grupa Dary Ciemności, podgrupa Ekskluzywne, flaga isDarkGift=true. Docelowo promki → Zbiórka - Dary Ciemności, wszystkie z szablonem Dary Ciemności (12441ea0-1a32-4258-816d-b181c5c8ba6d), używają jego aktualnych ustawień i czarnych ikon.

- Wszystkie dotychczasowe kody XXXX-XXXX zachowane dokładnie, bez generowania zastępników. Sprawdzono unikalność i brak konfliktów z całą nową bazą, także rekordami archiwalnymi.
- Zachowano tytuły, fabułę, mechanikę i znaczniki, akcję, użycia/raz na scenę oraz Dar Ciemności. Nie wymyślano kosztów ani dodatkowych oznaczeń. Źródłowe ID, kod, dev_type i kompletny rekord zachowane w metadanych zdarzenia importu.
- Nowe rekordy mają status dev i pierwszą wersję treści; historia Import ze starego edytora zawiera autora, datę, ścieżkę pliku, SHA-256 i stare ID. Nie kopiowano adresów odbiorców ani nie uruchamiano wysyłki. Dotychczasowe powiązania w starym projekcie nadal wskazują te same kody.
- Pominięto TESTOWY (K5Q7-562K), jedyny wpis Ekskluzywnych bez flagi Daru Ciemności. 19 ogólnych Darów nie należało do zleconej partii promocyjnej.

Import w transakcji po pełnej kopii bazy i migawce 15 tabel, najpierw próba z wycofaniem. Poprzednie 118 talentów i wszystkie wcześniejsze wiersze porównano z kopią bez różnic. Po imporcie 346 talentów łącznie. Nie zmieniono starego projektu; SHA-256 źródła przed/po identyczny: be1c74f3852a2e23d9e7e995fe264c354b8673d0f45812fb1fb127eb6ee5ad79.

Sprawdzono wszystkie 228 rekordów z API, zgodność kodów/treści/ustawień/pochodzenia, kompletne raporty bez błędów, stronowanie listy (100 + 100 + 28) i kolejność źródła. UI: sześć przykładów, akcja, raz na scenę, kod, czarne ikony, docelowy szablon i historia; kafelki renderowane leniwie, bez błędów JS.

Kopia: wtf_www/backups/klanarchia-editor/20261110/before-supporter-talents-import/ (database.sql i records.json). Narzędzia, kopia źródła, manifest, wynik i mapa kod/stare ID: wtf_www/local-scripts/one-off/supporter-talents-import-20261110/. Jednorazowego skryptu nie uruchamiać ponownie; kolizje kodów lub zmiana stanu bazy zatrzymują całą operację. Bez wdrożenia produkcyjnego.
