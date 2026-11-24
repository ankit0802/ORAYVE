@REM ----------------------------------------------------------------------------
@REM ORAYVE Spring Boot Maven Wrapper
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "MAVEN_HOME=C:\Users\ankit\.m2\apache-maven-3.9.6"
if exist "%MAVEN_HOME%\bin\mvn.cmd" (
    "%MAVEN_HOME%\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Apache Maven or verify %MAVEN_HOME%
exit /b 1
