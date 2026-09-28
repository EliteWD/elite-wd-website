@echo off
rem ------------------------------------------------------------------
rem  Elite W&D Installers - vista local del sitio
rem  Doble clic para abrirlo. Cierra esta ventana para detenerlo.
rem ------------------------------------------------------------------
title Elite W^&D Installers - sitio local
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a intentar.
  pause
  exit /b 1
)

rem Si ya esta corriendo, solo abre el navegador.
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if not errorlevel 1 (
  echo El sitio ya esta corriendo. Abriendo el navegador...
  start "" http://localhost:3000/es
  exit /b 0
)

if not exist node_modules (
  echo Instalando dependencias por primera vez...
  call npm install || goto :error
)

echo Preparando la version de produccion (tarda unos segundos)...
call npm run build || goto :error

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set "LANIP=%%a"
set "LANIP=%LANIP: =%"

echo.
echo  ================================================================
echo   Sitio listo
echo     En esta computadora:  http://localhost:3000/es
echo     En tu celular (misma red Wi-Fi):  http://%LANIP%:3000/es
echo.
echo   Cierra esta ventana para detener el sitio.
echo  ================================================================
echo.

start "" http://localhost:3000/es
rem Sin -H: escucha en IPv4 e IPv6 (localhost y la red Wi-Fi).
call npx next start -p 3000
exit /b 0

:error
echo.
echo Algo fallo. Copia el mensaje de arriba y compartelo.
pause
exit /b 1
