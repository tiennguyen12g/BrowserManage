@echo off
setlocal

:: Set the profile name, storage location, width, height, and window position
set "port=%1"
set "profileName=%2"
set "profilePath=%3"
set "width=%4"
set "height=%5"
set "posX=%6"
set "posY=%7"
set "openUrl=%8"

:: Create the profile directory if it doesn't exist
if not exist "%profilePath%" (
    mkdir "%profilePath%"
)

start chrome.exe --remote-debugging-port="%port%" --user-data-dir="%profilePath%" --profile-directory="%profileName%" --no-first-run --no-default-browser-check --window-size=%width%,%height% --window-position=%posX%,%posY%
::start "" "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9090 --no-first-run --no-default-browser-check --user-data-dir="C:\Users\tienn\OneDrive\Desktop\ChromeProfiles" --profile-directory="Profile_1"
endlocal
:: set user agent
:: start chrome.exe --user-data-dir="C:\Users\tienn\OneDrive\Desktop\ChromeProfiles" --profile-directory="Profile_1" --no-first-run --no-default-browser-check --window-size=400,800 --window-position=0,0 --user-agent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36"