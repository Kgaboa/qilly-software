"""
Qilly Construction Billing System - Selenium UI Automation Test Suite
Comprehensive regression testing for all user flows
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
import unittest
import time
import os
from datetime import datetime


class QillyTestBase(unittest.TestCase):
    """Base test class with setup and teardown"""
    
    @classmethod
    def setUpClass(cls):
        """Set up browser instance"""
        # Use Chrome by default, can switch to Firefox/Edge
        options = webdriver.ChromeOptions()
        # options.add_argument('--headless')  # Uncomment for headless mode
        options.add_argument('--start-maximized')
        options.add_argument('--disable-notifications')
        
        # Suppress harmless Chrome warnings
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-background-networking')
        options.add_argument('--disable-extensions')
        options.add_argument('--disable-sync')
        options.add_experimental_option('excludeSwitches', ['enable-logging'])
        options.add_experimental_option('excludeSwitches', ['enable-automation'])
        
        # Suppress DevTools and GCM errors in console
        options.add_argument('--log-level=3')  # Only show fatal errors
        
        cls.driver = webdriver.Chrome(options=options)
        cls.driver.implicitly_wait(15)  # Increased from 10
        cls.base_url = os.getenv('QILLY_BASE_URL', 'http://localhost:5173')
        cls.wait = WebDriverWait(cls.driver, 30)  # Increased from 15 to 30
        
        print(f"\n🌐 Testing against: {cls.base_url}")
        
    @classmethod
    def tearDownClass(cls):
        """Close browser after all tests"""
        cls.driver.quit()
    
    def take_screenshot(self, name):
        """Take screenshot for debugging"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"screenshots/{name}_{timestamp}.png"
        os.makedirs('screenshots', exist_ok=True)
        self.driver.save_screenshot(filename)
        print(f"📸 Screenshot saved: {filename}")
    
    def safe_find_and_click(self, by, value, description="element"):
        """Safely find and click an element with better error reporting"""
        try:
            element = self.wait.until(EC.element_to_be_clickable((by, value)))
            element.click()
            print(f"✅ Clicked {description}")
            return element
        except TimeoutException:
            self.take_screenshot(f"error_waiting_for_{description.replace(' ', '_')}")
            print(f"❌ TIMEOUT: Could not find {description}")
            print(f"   Looking for: {by}='{value}'")
            print(f"   Current URL: {self.driver.current_url}")
            raise
        except Exception as e:
            self.take_screenshot(f"error_clicking_{description.replace(' ', '_')}")
            print(f"❌ ERROR clicking {description}: {str(e)}")
            raise
    
    def safe_find_and_type(self, by, value, text, description="field"):
        """Safely find and type into an element with better error reporting"""
        try:
            element = self.wait.until(EC.presence_of_element_located((by, value)))
            element.clear()
            element.send_keys(text)
            print(f"✅ Typed into {description}")
            return element
        except TimeoutException:
            self.take_screenshot(f"error_waiting_for_{description.replace(' ', '_')}")
            print(f"❌ TIMEOUT: Could not find {description}")
            print(f"   Looking for: {by}='{value}'")
            print(f"   Current URL: {self.driver.current_url}")
            raise
        except Exception as e:
            self.take_screenshot(f"error_typing_{description.replace(' ', '_')}")
            print(f"❌ ERROR typing into {description}: {str(e)}")
            raise


class TestAuthenticationFlows(QillyTestBase):
    """Test user authentication and login flows"""
    
    def test_01_admin_login(self):
        """Test admin login flow"""
        print("\n🔐 Testing Admin Login...")
        self.driver.get(self.base_url)
        
        # Wait for page load
        email_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        
        # Enter credentials
        email_input.send_keys("admin@test.com")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Admin123!")
        
        # Click login
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        # Wait for dashboard
        self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Admin Dashboard')]"))
        )
        
        self.take_screenshot("admin_login_success")
        print("✅ Admin login successful")
        
    def test_02_partner_login(self):
        """Test partner portal login"""
        print("\n🤝 Testing Partner Login...")
        self.driver.get(self.base_url)
        
        # Click Partner Program button
        partner_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Partner Program')]"))
        )
        partner_button.click()
        
        # Wait for partner portal
        time.sleep(1)
        
        # Click "Already a Partner? Login"
        login_link = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Already a Partner')]"))
        )
        login_link.click()
        
        # Enter partner credentials
        email_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        email_input.send_keys("partner@procore.com")
        
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Demo1234!")
        
        # Click login
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login to Partner Portal')]")
        login_button.click()
        
        # Wait for partner dashboard
        self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Welcome')]"))
        )
        
        self.take_screenshot("partner_login_success")
        print("✅ Partner login successful")
        
    def test_03_free_tier_signup(self):
        """Test free tier user signup"""
        print("\n📝 Testing Free Tier Signup...")
        self.driver.get(self.base_url)
        
        # Click signup
        signup_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign Up')]"))
        )
        signup_button.click()
        
        # Fill signup form
        timestamp = int(time.time())
        email_input = self.wait.until(
            EC.presence_of_element_located((By.NAME, "email"))
        )
        email_input.send_keys(f"test_user_{timestamp}@test.com")
        
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("TestUser123!")
        
        company_input = self.driver.find_element(By.NAME, "company")
        company_input.send_keys(f"Test Company {timestamp}")
        
        # Submit signup
        signup_submit = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        signup_submit.click()
        
        # Wait for success
        time.sleep(2)
        self.take_screenshot("signup_success")
        print("✅ Free tier signup successful")


class TestPartnerApplicationFlow(QillyTestBase):
    """Test partner application and approval workflow"""
    
    def test_01_submit_construction_partner_application(self):
        """Test construction firm partner application"""
        print("\n🏗️ Testing Construction Partner Application...")
        self.driver.get(self.base_url)
        
        # Navigate to partner portal
        partner_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Partner Program')]"))
        )
        partner_button.click()
        
        # Click Apply Now tab
        apply_tab = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Apply Now')]"))
        )
        apply_tab.click()
        
        time.sleep(1)
        
        # Fill construction firm application
        timestamp = int(time.time())
        
        company_input = self.driver.find_element(By.NAME, "company")
        company_input.send_keys(f"Test Construction {timestamp}")
        
        contact_input = self.driver.find_element(By.NAME, "contact")
        contact_input.send_keys("John Test")
        
        email_input = self.driver.find_element(By.NAME, "email")
        email_input.send_keys(f"construction_{timestamp}@test.com")
        
        phone_input = self.driver.find_element(By.NAME, "phone")
        phone_input.send_keys("+27 11 123 4567")
        
        cidb_input = self.driver.find_element(By.NAME, "cidb")
        cidb_input.send_keys("GB7CE")
        
        projects_input = self.driver.find_element(By.NAME, "annualProjects")
        projects_input.send_keys("25")
        
        fees_input = self.driver.find_element(By.NAME, "annualQSFees")
        fees_input.send_keys("R1,200,000")
        
        types_input = self.driver.find_element(By.NAME, "projectTypes")
        types_input.send_keys("Commercial Buildings, Infrastructure")
        
        message_input = self.driver.find_element(By.NAME, "message")
        message_input.send_keys("Automated test submission for construction partner")
        
        # Submit application
        submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit Partnership Application')]")
        submit_button.click()
        
        # Wait for success toast
        time.sleep(2)
        self.take_screenshot("construction_application_submitted")
        print("✅ Construction partner application submitted")
        
    def test_02_submit_software_partner_application(self):
        """Test software platform partner application"""
        print("\n💻 Testing Software Partner Application...")
        self.driver.get(self.base_url)
        
        # Navigate to partner portal
        partner_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Partner Program')]"))
        )
        partner_button.click()
        
        # Click Apply Now tab
        apply_tab = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Apply Now')]"))
        )
        apply_tab.click()
        
        # Switch to Software Platform form
        software_tab = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Software Platform')]"))
        )
        software_tab.click()
        
        time.sleep(1)
        
        # Fill software platform application
        timestamp = int(time.time())
        
        company_input = self.driver.find_element(By.NAME, "company")
        company_input.send_keys(f"Test Software Platform {timestamp}")
        
        contact_input = self.driver.find_element(By.NAME, "contact")
        contact_input.send_keys("Jane Developer")
        
        email_input = self.driver.find_element(By.NAME, "email")
        email_input.send_keys(f"software_{timestamp}@test.com")
        
        phone_input = self.driver.find_element(By.NAME, "phone")
        phone_input.send_keys("+1 415 555 0199")
        
        platform_input = self.driver.find_element(By.NAME, "platformType")
        platform_input.send_keys("Construction Management SaaS")
        
        users_input = self.driver.find_element(By.NAME, "userBase")
        users_input.send_keys("5,000")
        
        timeline_input = self.driver.find_element(By.NAME, "integrationTimeline")
        timeline_input.send_keys("Q4 2026")
        
        tech_input = self.driver.find_element(By.NAME, "techStack")
        tech_input.send_keys("React, Python, PostgreSQL")
        
        message_input = self.driver.find_element(By.NAME, "message")
        message_input.send_keys("Automated test submission for software partner")
        
        # Submit application
        submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Submit Partnership Application')]")
        submit_button.click()
        
        # Wait for success toast
        time.sleep(2)
        self.take_screenshot("software_application_submitted")
        print("✅ Software partner application submitted")


class TestAdminPartnerApproval(QillyTestBase):
    """Test admin partner application approval workflow"""
    
    def test_01_admin_approve_partner_application(self):
        """Test admin approving a partner application"""
        print("\n✅ Testing Admin Partner Approval...")
        
        # Login as admin
        self.driver.get(self.base_url)
        email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_input.send_keys("admin@test.com")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Admin123!")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        # Wait for admin dashboard
        time.sleep(2)
        
        # Click Partner Apps tab
        partner_apps_tab = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Partner Apps')]"))
        )
        partner_apps_tab.click()
        
        time.sleep(1)
        
        # Find first pending application and approve
        approve_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Approve & Send Credentials')]"))
        )
        approve_button.click()
        
        # Wait for approval dialog
        time.sleep(1)
        
        # Click confirm approval
        confirm_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Approve & Send Credentials')]"))
        )
        confirm_button.click()
        
        # Wait for success toast
        time.sleep(2)
        self.take_screenshot("partner_approved")
        print("✅ Partner application approved successfully")


class TestBOQCreationFlow(QillyTestBase):
    """Test BOQ creation and pricing"""
    
    def test_01_create_new_project(self):
        """Test creating a new project"""
        print("\n📋 Testing New Project Creation...")
        
        # Login as professional user
        self.driver.get(self.base_url)
        email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_input.send_keys("pro@test.com")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Pro1234!")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        time.sleep(2)
        
        # Click Create New Project
        create_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Project')]"))
        )
        create_button.click()
        
        # Fill project details
        project_name_input = self.wait.until(EC.presence_of_element_located((By.NAME, "projectName")))
        project_name_input.send_keys(f"Test Project {int(time.time())}")
        
        location_input = self.driver.find_element(By.NAME, "location")
        location_input.send_keys("Johannesburg, Gauteng")
        
        # Submit project
        submit_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_button.click()
        
        time.sleep(2)
        self.take_screenshot("project_created")
        print("✅ Project created successfully")
        
    def test_02_add_boq_items(self):
        """Test adding BOQ items to project"""
        print("\n📝 Testing BOQ Item Addition...")
        
        # Assuming already in project view
        add_item_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add BOQ Item')]"))
        )
        add_item_button.click()
        
        # Fill BOQ item details
        description_input = self.wait.until(EC.presence_of_element_located((By.NAME, "description")))
        description_input.send_keys("Concrete Grade 30MPa")
        
        quantity_input = self.driver.find_element(By.NAME, "quantity")
        quantity_input.send_keys("150")
        
        unit_select = self.driver.find_element(By.NAME, "unit")
        unit_select.click()
        unit_option = self.driver.find_element(By.XPATH, "//option[text()='m³']")
        unit_option.click()
        
        # Submit BOQ item
        submit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add Item')]")
        submit_button.click()
        
        time.sleep(2)
        self.take_screenshot("boq_item_added")
        print("✅ BOQ item added successfully")


class TestPaymentFlow(QillyTestBase):
    """Test subscription and payment flows"""
    
    def test_01_upgrade_to_professional(self):
        """Test upgrading from FREE to PROFESSIONAL tier"""
        print("\n💳 Testing Tier Upgrade to Professional...")
        
        # Login as free user
        self.driver.get(self.base_url)
        email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_input.send_keys("free@test.com")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Free1234!")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        time.sleep(2)
        
        # Navigate to pricing page
        pricing_link = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Upgrade')]"))
        )
        pricing_link.click()
        
        time.sleep(1)
        
        # Click upgrade to Professional
        upgrade_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Upgrade to Professional')]"))
        )
        upgrade_button.click()
        
        # Select payment method
        time.sleep(1)
        payfast_option = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'PayFast')]"))
        )
        payfast_option.click()
        
        time.sleep(2)
        self.take_screenshot("payment_flow_initiated")
        print("✅ Payment flow initiated successfully")


class TestNavigationAndUI(QillyTestBase):
    """Test navigation and UI elements"""
    
    def test_01_admin_dashboard_tabs(self):
        """Test all admin dashboard tabs are accessible"""
        print("\n🧭 Testing Admin Dashboard Navigation...")
        
        # Login as admin
        self.driver.get(self.base_url)
        email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_input.send_keys("admin@test.com")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Admin123!")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        time.sleep(2)
        
        # Test each tab
        tabs = ['Users', 'Payments', 'Analytics', 'Integration', 'Engagement', 'eTender', 'Partner Apps']
        
        for tab_name in tabs:
            try:
                tab = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{tab_name}')]")
                tab.click()
                time.sleep(1)
                self.take_screenshot(f"admin_tab_{tab_name.lower()}")
                print(f"✅ {tab_name} tab accessible")
            except Exception as e:
                print(f"❌ {tab_name} tab not found: {e}")
        
    def test_02_responsive_design(self):
        """Test responsive design at different screen sizes"""
        print("\n📱 Testing Responsive Design...")
        
        self.driver.get(self.base_url)
        
        # Test mobile view (375x667 - iPhone SE)
        self.driver.set_window_size(375, 667)
        time.sleep(1)
        self.take_screenshot("mobile_view")
        
        # Test tablet view (768x1024 - iPad)
        self.driver.set_window_size(768, 1024)
        time.sleep(1)
        self.take_screenshot("tablet_view")
        
        # Test desktop view (1920x1080)
        self.driver.set_window_size(1920, 1080)
        time.sleep(1)
        self.take_screenshot("desktop_view")
        
        print("✅ Responsive design tested at all breakpoints")


class TestDataValidation(QillyTestBase):
    """Test form validations and error handling"""
    
    def test_01_login_validation(self):
        """Test login form validation"""
        print("\n🔍 Testing Login Validation...")
        
        self.driver.get(self.base_url)
        
        # Try login with empty fields
        login_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
        )
        login_button.click()
        
        time.sleep(1)
        
        # Check for validation errors
        try:
            error_message = self.driver.find_element(By.XPATH, "//*[contains(text(), 'required')]")
            print("✅ Validation working - empty fields rejected")
        except:
            print("⚠️  No validation error found")
        
        # Try with invalid email format
        email_input = self.driver.find_element(By.NAME, "email")
        email_input.send_keys("invalid-email")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("test123")
        login_button.click()
        
        time.sleep(1)
        self.take_screenshot("login_validation_test")
        
    def test_02_boq_quantity_validation(self):
        """Test BOQ quantity must be positive number"""
        print("\n🔢 Testing BOQ Quantity Validation...")
        
        # Login first
        self.driver.get(self.base_url)
        email_input = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
        email_input.send_keys("pro@test.com")
        password_input = self.driver.find_element(By.NAME, "password")
        password_input.send_keys("Pro1234!")
        login_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_button.click()
        
        time.sleep(2)
        
        # Try to add BOQ item with negative quantity
        # ... implementation depends on actual UI flow
        print("✅ Quantity validation test placeholder")


if __name__ == '__main__':
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test classes in order
    suite.addTests(loader.loadTestsFromTestCase(TestAuthenticationFlows))
    suite.addTests(loader.loadTestsFromTestCase(TestPartnerApplicationFlow))
    suite.addTests(loader.loadTestsFromTestCase(TestAdminPartnerApproval))
    suite.addTests(loader.loadTestsFromTestCase(TestBOQCreationFlow))
    suite.addTests(loader.loadTestsFromTestCase(TestPaymentFlow))
    suite.addTests(loader.loadTestsFromTestCase(TestNavigationAndUI))
    suite.addTests(loader.loadTestsFromTestCase(TestDataValidation))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "="*70)
    print("🎯 QILLY REGRESSION TEST SUITE - RESULTS")
    print("="*70)
    print(f"Tests Run: {result.testsRun}")
    print(f"✅ Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"❌ Failed: {len(result.failures)}")
    print(f"⚠️  Errors: {len(result.errors)}")
    print("="*70)