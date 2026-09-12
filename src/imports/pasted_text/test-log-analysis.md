uota Exceeded PASSED (documented)
ok
test_05_free_tier_trial_limit (__main__.TestBOQQuotaLimits.test_05_free_tier_trial_limit)
FREE tier: 3 lifetime trial BOQs. ...
🔄 setUp: auth cleared — at https://qilly-multi-env.figma.site/

🆓 TC-11.05 — FREE Tier Trial Limit (3 lifetime BOQs)

🔐 Login as FREE Tier Contractor (free@test.com)...
  ✅ Login submitted for FREE Tier Contractor
  📸 screenshots/tc11_05_free_dashboard_20260317_204844.png
  ⚠️  Trial counter not visible
  📸 screenshots/timeout_click_Create_BOQ_20260317_204930.png
  ❌ TIMEOUT clicking: Create BOQ  [xpath='//button[contains(normalize-space(),'Create BOQ') or contains(normalize-space(),'New BOQ') or contains(normalize-space(),'Start Trial')]']
     URL: https://qilly-multi-env.figma.site/
  ⚠️  Create BOQ button not found (may be blocked if trial limit hit)

  FREE Tier Summary:
     Trial Limit : 3 BOQs (lifetime, no monthly reset)
     On Exhaustion: 'Upgrade to Professional — 10 BOQs/month for R2,999'
✅ TC-11.05 FREE Tier Trial Limit PASSED

🔓 Logout (free)...
  ✅ Logged out via storage clear (fallback)
ok
test_06_quota_upgrade_prompt_chain (__main__.TestBOQQuotaLimits.test_06_quota_upgrade_prompt_chain)
Documents the upgrade prompt chain. ...
🔄 setUp: auth cleared — at https://qilly-multi-env.figma.site/

💎 TC-11.06 — Quota Upgrade Prompt Chain

  FREE (3/3 trials used):
    → Upgrade to Professional  R2,999/mo  → 10 BOQs/mo

  PROFESSIONAL (10/10 this month):
    → Upgrade to Enterprise    R8,999/mo  → 30 BOQs/mo
       + Green Building, eTender, Collusion Detection, Team Management

  ENTERPRISE (30/30 this month):
    → Contact us for Custom/Unlimited plan

  CUSTOM: No limits, white-label, Partner Portal
  📸 screenshots/tc11_06_upgrade_chain_20260317_204949.png
✅ TC-11.06 Upgrade Prompt Chain PASSED (documented)
ok
test_07_monthly_quota_reset (__main__.TestBOQQuotaLimits.test_07_monthly_quota_reset)
Documents monthly reset behaviour. ...
🔄 setUp: auth cleared — at https://qilly-multi-env.figma.site/

🔄 TC-11.07 — Monthly Quota Reset

  Professional: resets to 0/10 on 1st of month
  Enterprise  : resets to 0/30 on 1st of month
  FREE tier   : does NOT reset (lifetime allowance)

  Verification requires:
     - Date manipulation in test DB, or
     - Cron job verification (Supabase scheduled functions)
  📸 screenshots/tc11_07_monthly_reset_info_20260317_204951.png
✅ TC-11.07 Monthly Quota Reset PASSED (documented)
ok

======================================================================
ERROR: test_01_admin_login (__main__.TestAuthenticationFlows.test_01_admin_login)
Admin login via AdminLogin component.
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\selenium_tests\qilly_regression_suite_FIXED.py", line 486, in test_01_admin_login
    self.logout("admin")
    ~~~~~~~~~~~^^^^^^^^^
  File "C:\Users\Kgabo Sekhula\Onlinepricingsystem-main\selenium_tests\qilly_regression_suite_FIXED.py", line 156, in logout
    btn.click()
    ~~~~~~~~~^^
  File "C:\Users\Kgabo Sekhula\AppData\Roaming\Python\Python314\site-packages\selenium\webdriver\remote\webelement.py", line 94, in click
    self._execute(Command.CLICK_ELEMENT)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Kgabo Sekhula\AppData\Roaming\Python\Python314\site-packages\selenium\webdriver\remote\webelement.py", line 395, in _execute
    return self._parent.execute(command, params)
           ~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\Kgabo Sekhula\AppData\Roaming\Python\Python314\site-packages\selenium\webdriver\remote\webdriver.py", line 348, in execute
    self.error_handler.check_response(response)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\Kgabo Sekhula\AppData\Roaming\Python\Python314\site-packages\selenium\webdriver\remote\errorhandler.py", line 229, in check_response
    raise exception_class(message, screen, stacktrace)
selenium.common.exceptions.ElementClickInterceptedException: Message: element click intercepted: Element <button data-slot="button" class="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/50 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 flex items-center gap-2">...</button> is not clickable at point (1185, 68). Other element would receive the click: <li tabindex="0" class="" data-sonner-toast="" data-rich-colors="true" data-styled="true" data-mounted="true" data-promise="false" data-swiped="false" data-removed="false" data-visible="true" data-y-position="top" data-x-position="right" data-index="0" data-front="true" data-swiping="false" data-dismissible="true" data-type="success" data-swipe-out="false" data-expanded="false" style="--index: 0; --toasts-before: 0; --z-index: 1; --offset: 0px; --initial-height: 52.833335876464844px;">...</li>
  (Session info: chrome=145.0.7632.162)
Stacktrace:
Symbols not available. Dumping unresolved backtrace:
        0x7ff6d4f4aa55
        0x7ff6d4ca8630
        0x7ff6d4a3d75d
        0x7ff6d4aa0b65
        0x7ff6d4a9e27a
        0x7ff6d4a9b115
        0x7ff6d4a99fc7
        0x7ff6d4a8b426
        0x7ff6d4ac19da
        0x7ff6d4a8aca6
        0x7ff6d4ae591c
        0x7ff6d4a89098
        0x7ff6d4a89f83
        0x7ff6d4f77810
        0x7ff6d4f71afd
        0x7ff6d4f92c1a
        0x7ff6d4cc3345
        0x7ff6d4ccb81c
        0x7ff6d4cb1924
        0x7ff6d4cb1ad6
        0x7ff6d4c97e47
        0x7ff9aa7be8d7
        0x7ff9abf6c48c


----------------------------------------------------------------------
Ran 28 tests in 1442.939s

FAILED (errors=1)

======================================================================
🎯  QILLY REGRESSION SUITE v3.0 — RESULTS
======================================================================
  Tests Run  : 28
  ✅ Passed  : 27
  ❌ Failed  : 0
  ⚠️  Errors  : 1

  EXIT SCENARIOS PER FLOW:
  • Logged-in dashboards  → 'Logout' button (MainDashboard/AdminDashboard)
  • Partner portal        → 'Back to Home' button
  • Contractor/Supplier signup → 'Back to Login' button
  • Auth-page-only tests  → No exit needed (already home)
  • setUp() always clears localStorage/sessionStorage as safety net

  CONTRACTOR FORM SECTIONS (collapsed by default):
  • Company Info  — starts EXPANDED
  • Contact Person — starts COLLAPSED → expanded by test
  • Business Address — starts COLLAPSED → expanded by test
  • Business Details — starts COLLAPSED → expanded by test
    (Must select ≥1 Project Type AND ≥1 Operating Province)
  • Account Security — starts COLLAPSED → expanded by test

  PARTNER PORTAL NAVIGATION:
  • Click 'Apply as Construction Partner' in Overview tab → fills form
  • Click 'Apply as Software Partner' in Overview tab → fills form
  • NO 'Software Platform' sub-tab exists — was a bug in v2.0

  QUOTA NUMBERS (corrected):
  • FREE:         3 lifetime trial BOQs
  • Professional: 10 BOQs/month
  • Enterprise:   30 BOQs/month
======================================================================
