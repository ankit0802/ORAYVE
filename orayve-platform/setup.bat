@echo off
echo ============================================
echo   ORAYVE Platform - Gradle Bootstrap Setup
echo ============================================
echo.

set WRAPPER_JAR=%~dp0gradle\wrapper\gradle-wrapper.jar

if exist "%WRAPPER_JAR%" (
    echo [OK] Gradle wrapper jar already exists. Skipping download.
    goto :verify
)

echo [1/2] Downloading gradle-wrapper.jar ...
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar' -OutFile '%WRAPPER_JAR%' }"

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to download gradle-wrapper.jar
    echo         Please check your internet connection and try again.
    echo         Alternatively, download it manually from:
    echo         https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar
    echo         and place it in: gradle\wrapper\gradle-wrapper.jar
    exit /b 1
)

echo [OK] gradle-wrapper.jar downloaded successfully.

:verify
echo.
echo [2/2] Verifying Gradle wrapper ...
call "%~dp0gradlew.bat" --version

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Gradle wrapper verification failed.
    exit /b 1
)

echo.
echo ============================================
echo   Setup complete! You can now run:
echo     gradlew.bat build
echo     gradlew.bat bootRun -p auth-service
echo ============================================
