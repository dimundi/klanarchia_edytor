@echo off
setlocal
cd /d "%~dp0"
set "WTF_DEV=%~dp0..\wtf_www\deploy\dev"
if not exist "%WTF_DEV%\.env" (
  echo Brak konfiguracji lokalnego WordPressa: deploy/dev/.env
  exit /b 1
)
docker compose --env-file "%WTF_DEV%\.env" -f "%WTF_DEV%\docker-compose.dev.yml" -f "%~dp0compose.editor.yml" up -d --wait
if errorlevel 1 exit /b 1
docker compose --env-file "%WTF_DEV%\.env" -f "%WTF_DEV%\docker-compose.dev.yml" -f "%~dp0compose.editor.yml" exec -T wordpress wp plugin activate klanarchia-edytor --allow-root
if errorlevel 1 exit /b 1
echo Gotowe. Zaloguj sie jako administrator i wybierz Edytor postaci na stronie edytorow Klanarchii.
