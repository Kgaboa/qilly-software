#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  Qilly Regression Suite v5.0 — Linux / macOS Run Script
#
#  USAGE (all modes generate an HTML report):
#    ./run_tests.sh                   ← HTML report, auto-named  (DEFAULT)
#    ./run_tests.sh html              ← same as above
#    ./run_tests.sh pytest            ← pytest runner  + HTML report
#    ./run_tests.sh console           ← console output ONLY  (no report)
#    ./run_tests.sh class TestName    ← single class, HTML report
#
#  The report auto-opens in your default browser.
#  Report location: selenium_tests/reports/qilly_report_YYYYMMDD_HHMMSS.html
# ═══════════════════════════════════════════════════════════════════════════

# FIX 1: Always run from the directory where this script lives.
#   Without this, 'reports/' is created in whatever the caller's CWD is.
cd "$(dirname "$0")" || exit 1
echo "[CWD] $(pwd)"

export QILLY_BASE_URL="${QILLY_BASE_URL:-http://localhost:5173}"
echo "[URL] $QILLY_BASE_URL"

mkdir -p reports screenshots

# FIX 2: Check Python is available
if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
    echo ""
    echo "[ERROR] Python not found. Install Python 3.9+ first."
    exit 1
fi
PYTHON=$(command -v python3 || command -v python)
echo "[PYTHON] $PYTHON"

# FIX 3: Check html-testRunner is installed; auto-install if missing
if ! $PYTHON -c "import HtmlTestRunner" &>/dev/null; then
    echo ""
    echo "[INFO] html-testRunner not installed. Installing requirements..."
    pip install -r requirements.txt || {
        echo "[ERROR] pip install failed. Run: pip install -r requirements.txt"
        exit 1
    }
    echo "[OK] Dependencies installed."
fi

MODE="${1:-html}"   # FIX 4: default is 'html', not 'console'
REPORT_ARG="${2:-}"
EXIT_CODE=0

case "$MODE" in
  html|"")
    echo ""
    echo "[MODE] HTML Report (auto-named, opens in browser)"
    echo ""
    $PYTHON qilly_regression_suite_FIXED.py --html --open
    EXIT_CODE=$?
    ;;

  console)
    echo ""
    echo "[MODE] Console output only (no HTML report)"
    echo ""
    $PYTHON qilly_regression_suite_FIXED.py
    EXIT_CODE=$?
    ;;

  pytest)
    echo ""
    echo "[MODE] pytest runner with HTML report"
    echo ""
    if ! $PYTHON -c "import pytest_html" &>/dev/null; then
        pip install pytest-html pytest --quiet
    fi
    TS=$(date '+%Y%m%d_%H%M%S')
    REPORT="${REPORT_ARG:-reports/pytest_report_${TS}.html}"
    $PYTHON -m pytest qilly_regression_suite_FIXED.py -v --tb=short \
        --html="$REPORT" --self-contained-html
    EXIT_CODE=$?
    ABS_REPORT="$(pwd)/$REPORT"
    echo ""
    echo "[REPORT] $ABS_REPORT"
    if [ -f "$ABS_REPORT" ]; then
        # Open in browser (macOS / Linux)
        if command -v open &>/dev/null; then
            open "$ABS_REPORT"
        elif command -v xdg-open &>/dev/null; then
            xdg-open "$ABS_REPORT"
        fi
    fi
    ;;

  class)
    if [ -z "$REPORT_ARG" ]; then
        echo "[ERROR] No class name given. Example: ./run_tests.sh class TestAuthenticationFlows"
        exit 1
    fi
    echo ""
    echo "[MODE] Single class: $REPORT_ARG"
    echo ""
    $PYTHON qilly_regression_suite_FIXED.py --html --open --class="$REPORT_ARG"
    EXIT_CODE=$?
    ;;

  *)
    echo "Unknown mode: $MODE"
    echo "Usage: ./run_tests.sh [html|console|pytest|class] [report_path|ClassName]"
    exit 1
    ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
if [ $EXIT_CODE -eq 0 ]; then
    echo "  STATUS   : ALL TESTS PASSED ✅"
else
    echo "  STATUS   : FAILURES DETECTED ❌  (exit $EXIT_CODE)"
fi
echo ""
echo "  Reports    : $(pwd)/reports/"
echo "  Screenshots: $(pwd)/screenshots/"
echo ""
echo "  run_tests.sh html       ← HTML report (default)"
echo "  run_tests.sh pytest     ← pytest runner"
echo "  run_tests.sh console    ← console only"
echo "  run_tests.sh class Name ← single class"
echo "═══════════════════════════════════════════════════════════════════════════"
exit $EXIT_CODE
