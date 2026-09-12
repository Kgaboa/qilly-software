"""
Qilly Selenium Setup Diagnostic Tool
Run this first to verify your environment is correctly configured
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import sys

def print_header(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def check_environment():
    """Check environment variables"""
    print_header("1. Checking Environment Variables")
    
    url = os.getenv('QILLY_BASE_URL', 'http://localhost:5173')
    print(f"✓ QILLY_BASE_URL: {url}")
    
    if url == 'http://localhost:5173':
        print("ℹ️  Using default localhost URL")
        print("   Set custom URL with: export QILLY_BASE_URL=https://your-app.vercel.app")
    
    return url

def check_browser():
    """Check Chrome and ChromeDriver"""
    print_header("2. Checking Chrome Browser & Driver")
    
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--log-level=3')
        options.add_argument('--disable-gpu')
        
        driver = webdriver.Chrome(options=options)
        print("✅ Chrome and ChromeDriver are working!")
        
        # Get Chrome version
        capabilities = driver.capabilities
        chrome_version = capabilities.get('browserVersion', 'Unknown')
        driver_version = capabilities.get('chrome', {}).get('chromedriverVersion', 'Unknown')
        
        print(f"   Chrome Version: {chrome_version}")
        print(f"   ChromeDriver Version: {driver_version.split(' ')[0] if ' ' in driver_version else driver_version}")
        
        driver.quit()
        return True
        
    except Exception as e:
        print(f"❌ Error with Chrome/ChromeDriver: {e}")
        print("\n   Fix: pip install webdriver-manager")
        print("        OR install ChromeDriver manually")
        return False

def check_connection(url):
    """Check connection to Qilly app"""
    print_header("3. Checking Connection to Qilly App")
    
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--log-level=3')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        
        print(f"Connecting to: {url}")
        
        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(10)
        
        driver.get(url)
        
        print(f"✅ Successfully connected!")
        print(f"   Page Title: {driver.title}")
        print(f"   Current URL: {driver.current_url}")
        
        # Take screenshot
        driver.save_screenshot("diagnostic_screenshot.png")
        print("   📸 Screenshot saved: diagnostic_screenshot.png")
        
        driver.quit()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n   Possible causes:")
        print("   - Qilly app is not running")
        print("   - Wrong URL in QILLY_BASE_URL")
        print("   - Network/firewall issue")
        print("\n   Fix:")
        print("   - If testing locally: npm run dev")
        print("   - If using Vercel: verify URL in browser first")
        return False

def check_login_elements(url):
    """Check if login form elements exist"""
    print_header("4. Checking Login Form Elements")
    
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--log-level=3')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        
        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(10)
        wait = WebDriverWait(driver, 15)
        
        driver.get(url)
        
        # Check for email field
        try:
            email_field = wait.until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            print("✅ Found email input field")
        except:
            print("❌ Email field not found")
            print("   Looking for: <input name='email' />")
            driver.save_screenshot("diagnostic_no_email.png")
        
        # Check for password field
        try:
            password_field = driver.find_element(By.NAME, "password")
            print("✅ Found password input field")
        except:
            print("❌ Password field not found")
            print("   Looking for: <input name='password' />")
        
        # Check for login button
        try:
            login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
            print("✅ Found login button")
        except:
            print("⚠️  Login button not found with text 'Login'")
            print("   Trying alternative selectors...")
            try:
                login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
                print("✅ Found submit button")
            except:
                print("❌ No login/submit button found")
        
        driver.save_screenshot("diagnostic_login_form.png")
        print("📸 Screenshot saved: diagnostic_login_form.png")
        
        driver.quit()
        return True
        
    except Exception as e:
        print(f"❌ Error checking elements: {e}")
        return False

def check_test_credentials(url):
    """Try test login"""
    print_header("5. Testing Admin Login Flow")
    
    try:
        options = webdriver.ChromeOptions()
        options.add_argument('--log-level=3')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        
        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(10)
        wait = WebDriverWait(driver, 15)
        
        driver.get(url)
        
        print("Attempting login with admin@test.com / Admin123!")
        
        # Fill login form
        email_field = wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_field.send_keys("admin@test.com")
        print("✓ Entered email")
        
        password_field = driver.find_element(By.NAME, "password")
        password_field.send_keys("Admin123!")
        print("✓ Entered password")
        
        driver.save_screenshot("diagnostic_before_login.png")
        
        login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        print("✓ Clicked login button")
        
        # Wait a bit for response
        import time
        time.sleep(3)
        
        driver.save_screenshot("diagnostic_after_login.png")
        
        # Check if we're logged in (looking for dashboard or error)
        current_url = driver.current_url
        page_source = driver.page_source.lower()
        
        if "dashboard" in page_source or "admin" in page_source:
            print("✅ Login appears successful!")
            print(f"   Current URL: {current_url}")
            print("📸 Screenshots saved:")
            print("   - diagnostic_before_login.png")
            print("   - diagnostic_after_login.png")
        elif "error" in page_source or "invalid" in page_source:
            print("⚠️  Login may have failed (error message detected)")
            print("   Check screenshots to see what happened")
        else:
            print("ℹ️  Login submitted, check screenshots for result")
        
        driver.quit()
        return True
        
    except Exception as e:
        print(f"❌ Error during login test: {e}")
        driver.save_screenshot("diagnostic_login_error.png")
        print("📸 Screenshot saved: diagnostic_login_error.png")
        driver.quit()
        return False

def main():
    """Run all diagnostic checks"""
    print("\n")
    print("╔══════════════════════════════════════════════════════════════════════╗")
    print("║                                                                      ║")
    print("║       🔍 QILLY SELENIUM SETUP DIAGNOSTIC TOOL                        ║")
    print("║                                                                      ║")
    print("║       This will check if your environment is ready for testing      ║")
    print("║                                                                      ║")
    print("╚══════════════════════════════════════════════════════════════════════╝")
    
    # Check 1: Environment
    url = check_environment()
    
    # Check 2: Browser
    if not check_browser():
        print("\n❌ Cannot proceed - Chrome/ChromeDriver not working")
        sys.exit(1)
    
    # Check 3: Connection
    if not check_connection(url):
        print("\n❌ Cannot proceed - Cannot connect to Qilly app")
        print("\n💡 Make sure your app is running:")
        print("   - Local: npm run dev")
        print("   - Vercel: verify URL in browser first")
        sys.exit(1)
    
    # Check 4: Form elements
    check_login_elements(url)
    
    # Check 5: Test login
    check_test_credentials(url)
    
    # Final summary
    print("\n")
    print("=" * 70)
    print("  📊 DIAGNOSTIC SUMMARY")
    print("=" * 70)
    print("\n✅ Chrome/ChromeDriver: Working")
    print(f"✅ Connection to {url}: Working")
    print("\n📸 Screenshots generated:")
    print("   - diagnostic_screenshot.png")
    print("   - diagnostic_login_form.png")
    print("   - diagnostic_before_login.png")
    print("   - diagnostic_after_login.png")
    print("\n💡 Next steps:")
    print("   1. Review screenshots to verify everything looks correct")
    print("   2. If login worked, run full test suite:")
    print("      python qilly_regression_suite.py")
    print("   3. Or run with pytest for better output:")
    print("      pytest qilly_regression_suite.py -v")
    print("\n" + "=" * 70)
    print("\n🎉 Diagnostic complete! Review the results above.\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Diagnostic interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
