@echo off
setlocal
cd /d "%~dp0"
set "WTF_DEV=%~dp0..\wtf_www\deploy\dev"
docker compose --env-file "%WTF_DEV%\.env" -f "%WTF_DEV%\docker-compose.dev.yml" -f "%~dp0compose.editor.yml" run --rm --no-deps editor npm run build
