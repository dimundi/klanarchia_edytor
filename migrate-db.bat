@echo off
setlocal
cd /d "%~dp0"
set "WTF_DEV=%~dp0..\wtf_www\deploy\dev"
docker compose --env-file "%WTF_DEV%\.env" -f "%WTF_DEV%\docker-compose.dev.yml" -f "%~dp0compose.editor.yml" exec -T wordpress wp ke migrate --allow-root
if errorlevel 1 exit /b 1
echo Migracja zakonczona. Dane poczatkowe tworzy osobne polecenie wp ke seed --user=ID_ADMINA.