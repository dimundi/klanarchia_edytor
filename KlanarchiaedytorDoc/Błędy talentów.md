# Błędy talentów

## Zachowanie

Błąd redakcyjny nie blokuje zapisu szkicu. Raport jest zapamiętywany dla konkretnej wersji talentu i języka. Lista pokazuje Błędy: N; rozwinięcie pokazuje komunikaty. Po poprawieniu i zapisaniu aktualna wersja nie ma starego oznaczenia, a wcześniejsze raporty pozostają w bazie.

Pierwsze kontrole:

| Kod | Znaczenie |
| --- | --- |
| missing_title | Brak tytułu, także tytuł zawierający wyłącznie białe znaki. |
| body_overflow | Wspólny blok tytułu/fabuły/mechaniki nie mieści się w ramce. |
| restriction_overflow | Ograniczenie dostępności nie mieści się w swoim polu. |
| version_overflow | Numer wersji nie mieści się w swoim polu. |
| nonrenewable_overflow | Napis nieodnawialny nie mieści się w swoim polu. |
| text_layout_error | Niedostępny/nieobsługiwany font lub brak glifu uniemożliwia skład. |
| unknown_annotation | Treść zawiera nieznany zamknięty znacznik formatowania. |

Nie zakładamy obowiązkowości fabuły ani innych pól bez ustalenia zasad. Brak podgrupy/szablonu, nieprawidłowy typ lub zakres parametrów nadal blokuje żądanie zapisu — nie zapisujemy uszkodzonej struktury.

## Stan kontroli

- checked — aktualny, zakończony raport; może zawierać błędy.
- unchecked — brak raportu lub nieukończone sprawdzenie. To nie znaczy, że talent jest poprawny.
- stale — zmienił się szablon, wspólne style/kolory albo wersja silnika; wymagane ponowne sprawdzenie.

Niezmieniony zapisany talent jest sprawdzany po otwarciu, jeżeli raport jest nieaktualny, niepełny lub aktualny wynik różni się od zapisanego (np. font już się załadował). Raport można odnowić bez tworzenia nowej wersji treści. Niezapisane zmiany nie zastępują raportu zapisanej wersji; otrzymają własny raport przy zapisie.

Raporty układu oblicza wspólny silnik w przeglądarce; serwer sprawdza format raportu oraz sam wykrywa brak tytułu i nieznane oznaczenia. To diagnostyka redakcyjna, nie zabezpieczenie ani zatwierdzenie publikacji.

## Baza i API

Jawna migracja: `wp ke talent-checks-init --user=1 --allow-root`. Osobna opcja ke_talent_checks_schema_version=2, dwie nowe tabele:

- ke_talent_checks: wersja talentu, znacznik sprawdzonego układu szablonu, język, kompletność, wersja silnika, rewizja wspólnych stylów, data i konto sprawdzające. Indeks (talent_version_id, language, id).
- ke_talent_issues: check_id, stabilny code, szczegóły; klucz (check_id, code), indeks (code, check_id). Komunikaty tłumaczone w interfejsie, nie są kluczem filtrowania.

Raporty dopisywane, bez nadpisywania poprzednich. Trzy klucze obce z ON DELETE RESTRICT. Zapis talentu i raportu w jednej transakcji. Inny język nowej wersji pozostaje niesprawdzony do jego kontroli, mimo zachowania treści.

Lista i GET rekordu zwracają validation (status, issues, errorCount, checkedAt i wersje). PUT przyjmuje validation i łączy błędy układu z kontrolami serwera. Brak raportu w starszym wywołaniu oznacza unchecked. POST talents/{code}/check z revision i validation odświeża raport; 409 chroni przed sprawdzeniem nieaktualnej wersji. Uprawnienia jak edytor: administrator i nonce. Dla niezmienionej treści nie tworzy nowej wersji ani nie zmienia daty edycji talentu.

Przy zmianie fontów, wzorców lub algorytmu zwiększać wspólnie CARD_TEXT_ENGINE_VERSION i KE_CARD_TEXT_ENGINE_VERSION. Rewizja katalogu unieważnia stare raporty automatycznie. Liczenie zbiorcze i filtry po kodach są zaplanowane w TODO; nie dodano ich teraz do interfejsu.

## Import PDF

page_reference_missing: zachowane odniesienie (s. xxx) wymaga numeru; ponownie wykrywane w mechanice zarówno w podglądzie, jak i na serwerze. source_review_required: uwaga o niekompletnym źródle pochodzi z historii importu i pozostaje, dopóki mechanika jest identyczna z oznaczoną treścią (SHA-256). Nie znika po samym odświeżeniu kontroli. unknown_annotation obejmuje również jawne, jeszcze nieobsługiwane symbole z importu. [Raport pierwszego importu](Import%20talentów%20z%20PDF.md).

Po pierwszym zapisie nowego talentu kod powstaje dopiero na serwerze. Diagnostyka kontroluje wyrenderowane pole także po tej odpowiedzi i może dopisać raport bez tworzenia kolejnej wersji treści.

Zmiana aktualnego szablonu unieważnia poprzedni raport także bez zmiany treści talentu. Żądanie kontroli przekazuje templateId/templateRevision jako znacznik sprawdzonego podglądu; serwer odrzuca nieaktualny układ 409. To metadane diagnostyki, nie przypięcie talentu do wersji szablonu.
