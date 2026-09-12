@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM  Qilly Regression Suite v6.0 — Windows Run Script
REM
REM  CHANGES v6.0:
REM    - TC-4  rewritten: correct BOQ flow (Upload BOQ tab → Import Excel / Template
REM            → Project Settings → Generate Priced BOQ → validate per tier)
REM    - TC-10 added: Subscription Upgrade tests (FREE→PRO, PRO→ENT)
REM    - Fallback credentials: if ENT/PRO dynamic account fails, use pre-created
REM    - payment_method: 'manual' → 'bank_transfer' (fixes DB check constraint)
REM    - 3-tier tearDown: PASS / SKIP(manual verify) / FAIL
REM    - logout() StaleElementReferenceException fixed (fresh find before click)
REM
REM  TOTAL TESTS: 35  (was 32: +3 BOQ, +2 Upgrade, -2 old BOQ stubs)
REM
REM  USAGE:
REM    run_tests.bat                  <- HTML report (default)
REM    run_tests.bat pytest           <- pytest runner + HTML
REM    run_tests.bat console          <- console only
REM    run_tests.bat class TestName   <- single class
REM
REM  PRE-REQUISITES — create fallback accounts once in DEV Supabase:
REM    fallback_free@qilly-test.com  / TestFree2026!  (FREE tier)
REM    fallback_pro@qilly-test.com   / TestPro2026!   (PROFESSIONAL, Stitch)
REM    fallback_ent@qilly-test.com   / TestEnt2026!   (ENTERPRISE, PayFast)
REM ═══════════════════════════════════════════════════════════════════════════

SETLOCAL ENABLEDELAYEDEXPANSION

REM ── Always run from the directory where this .bat lives ───────────────────
cd /d "%~dp0"
ECHO [CWD] %CD%

REM ── Test against URL (override with SET QILLY_BASE_URL=... before calling) ─
IF "%QILLY_BASE_URL%"=="" SET QILLY_BASE_URL=https://qilly-multi-env.figma.site/
ECHO [URL] %QILLY_BASE_URL%

REM ── Create output folders ─────────────────────────────────────────────────
IF NOT EXIST "reports"     MKDIR reports
IF NOT EXIST "screenshots" MKDIR screenshots

REM ── Check Python ──────────────────────────────────────────────────────────
WHERE python >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO.
    ECHO [ERROR] 'python' not found in PATH.
    ECHO         Install Python 3.9+ and add it to PATH.
    ECHO         https://www.python.org/downloads/
    PAUSE & EXIT /B 1
)

REM ── Auto-install html-testRunner if missing ───────────────────────────────
python -c "import HtmlTestRunner" >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO [INFO] html-testRunner not installed. Installing requirements...
    pip install -r requirements.txt
    IF ERRORLEVEL 1 (
        ECHO [ERROR] pip install failed. Run manually: pip install -r requirements.txt
        PAUSE & EXIT /B 1
    )
    ECHO [OK] Dependencies installed.
)

REM ── Detect Python version ─────────────────────────────────────────────────
FOR /F "tokens=2 delims= " %%V IN ('python --version 2^>^&1') DO SET PYVER=%%V
ECHO [PYTHON VERSION] %PYVER%

REM ── Route to selected mode ────────────────────────────────────────────────
IF /I "%1"=="console" GOTO RUN_CONSOLE
IF /I "%1"=="pytest"  GOTO RUN_PYTEST
IF /I "%1"=="class"   GOTO RUN_CLASS

REM ── DEFAULT: HTML report ──────────────────────────────────────────────────
:RUN_HTML
ECHO.
ECHO [MODE] HTML Report (auto-named, opens in browser)
ECHO.
python -X utf8 qilly_regression_suite_FIXED.py --html --open
SET EXIT_CODE=!ERRORLEVEL!
GOTO SHOW_RESULT

:RUN_CONSOLE
ECHO.
ECHO [MODE] Console output only (no HTML report)
ECHO.
python -X utf8 qilly_regression_suite_FIXED.py
SET EXIT_CODE=!ERRORLEVEL!
GOTO SHOW_RESULT

:RUN_PYTEST
ECHO.
ECHO [MODE] pytest runner with HTML report
ECHO.
python -c "import pytest_html" >nul 2>&1
IF ERRORLEVEL 1 ( pip install pytest-html pytest --quiet )
FOR /F "tokens=1-3 delims=/ " %%A IN ('DATE /T') DO SET TODAY=%%A%%B%%C
FOR /F "tokens=1-2 delims=: " %%A IN ('TIME /T') DO SET NOW=%%A%%B
SET REPORT_PATH=reports\pytest_report_%TODAY%_%NOW%.html
IF NOT "%2"=="" SET REPORT_PATH=%2
pytest qilly_regression_suite_FIXED.py -v --tb=short ^
    --html=!REPORT_PATH! --self-contained-html
SET EXIT_CODE=!ERRORLEVEL!
ECHO.
ECHO [REPORT] !CD!\!REPORT_PATH!
IF EXIST "!REPORT_PATH!" ( START "" "!REPORT_PATH!" )
GOTO SHOW_RESULT

:RUN_CLASS
ECHO.
IF "%2"=="" (
    ECHO [ERROR] No class name. Example: run_tests.bat class TestAuthenticationFlows
    PAUSE & EXIT /B 1
)
ECHO [MODE] Single class: %2
ECHO.
python -X utf8 qilly_regression_suite_FIXED.py --html --open --class=%2
SET EXIT_CODE=!ERRORLEVEL!
GOTO SHOW_RESULT

:SHOW_RESULT
ECHO.
ECHO ═══════════════════════════════════════════════════════════════════════════
IF !EXIT_CODE! EQU 0 (
    ECHO   STATUS  : ALL TESTS PASSED
) ELSE (
    ECHO   STATUS  : FAILURES DETECTED  ^(exit code !EXIT_CODE!^)
    ECHO.
    ECHO   Result key:
    ECHO     PASS = test logic verified correctly
    ECHO     SKIP = TO BE MANUALLY VERIFIED  ^(soft warning — could be app or Selenium^)
    ECHO     FAIL = definite failure confirmed by hard assertion
)
ECHO.
ECHO   Tests Run  : 35 ^(32 original + 1 BOQ + 2 Upgrade^)
ECHO   Reports    : %CD%\reports\
ECHO   Screenshots: %CD%\screenshots\
ECHO.
ECHO   Modes: run_tests.bat html ^| pytest ^| console ^| class TestName
ECHO ═══════════════════════════════════════════════════════════════════════════
PAUSE
EXIT /B !EXIT_CODE!