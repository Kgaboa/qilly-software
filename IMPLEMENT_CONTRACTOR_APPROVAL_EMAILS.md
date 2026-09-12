# 📧 Implement Contractor Approval Emails - Complete Guide

## 🎯 Current Gap Identified

Your Qilly system currently:
- ✅ Creates contractor accounts
- ✅ Requires admin approval
- ✅ Shows "Pending admin approval" message
- ❌ **Does NOT send emails to contractors about approval status**

This guide shows how to implement email notifications.

---

## 📊 Recommended Email Flow

### Complete Email Journey

```
Step 1: Contractor Signs Up
    ↓
    📧 EMAIL 1: "Registration Received"
    ├─ Subject: "Welcome to Qilly - Registration Received"
    ├─ Content: "Thanks for registering! We're reviewing..."
    └─ Action: "What happens next"

Step 2: Admin Reviews
    ↓
    [Admin approves or rejects]
    ↓
    
Path A: Approved                    Path B: Rejected
    ↓                                   ↓
📧 EMAIL 2A: "Account Approved"    📧 EMAIL 2B: "Application Update"
├─ Subject: "Your Qilly account"   ├─ Subject: "Qilly registration"
├─ Content: "Approved! Login..."   ├─ Content: "After review..."
└─ Button: "Login Now"             └─ Info: Reason (optional)
```

---

## 🛠️ Implementation Options

### Option 1: Supabase Edge Functions (Recommended)

**Pros:**
- ✅ Built-in to Supabase
- ✅ Serverless (no server needed)
- ✅ Integrated with Supabase Auth
- ✅ Can use Supabase SMTP
- ✅ Secure (no exposed credentials)

**Cons:**
- ⚠️ Requires Supabase configuration
- ⚠️ Learning curve

**Best For:** Production Qilly system

---

### Option 2: Third-Party Email Service

**Options:**
- **SendGrid** (12,000 free emails/month)
- **Mailgun** (5,000 free emails/month)
- **Resend** (3,000 free emails/month)
- **AWS SES** (62,000 free emails/month)

**Pros:**
- ✅ Easy to setup
- ✅ Good deliverability
- ✅ Analytics included
- ✅ Professional templates

**Cons:**
- ⚠️ External dependency
- ⚠️ API keys to manage
- ⚠️ Monthly limits

**Best For:** Quick implementation

---

### Option 3: Manual Email (Temporary)

**Process:**
- Admin manually emails contractor after approval
- Simple email template provided
- Copy-paste contractor email from dashboard

**Pros:**
- ✅ No coding required
- ✅ Personal touch
- ✅ Quick to start

**Cons:**
- ❌ Manual work
- ❌ Easy to forget
- ❌ Not scalable

**Best For:** MVP/Early testing with few contractors

---

## 📧 Email Templates

### Email 1: Registration Received

```
Subject: Welcome to Qilly - Registration Received

Hi [Contractor Name],

Thank you for registering with Qilly!

We've received your contractor registration for:
• Company: [Company Name]
• CIDB: [CIDB Number]
• Subscription: [Tier] ([Billing Cycle])

What happens next:
1. Our team will review your application
2. We'll verify your CIDB registration
3. You'll receive approval within 1-2 business days
4. Once approved, you can login and start pricing BOQs

Your Registration Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: [Email]
Contact Person: [Contact Person]
Phone: [Phone]
Operating Provinces: [Provinces]
Project Types: [Project Types]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email or contact support.

Best regards,
The Qilly Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Qilly - Core Ground Civils Billing System
Powered by Live Supplier Data from All 9 SA Provinces
```

---

### Email 2A: Account Approved ✅

```
Subject: 🎉 Your Qilly Account Has Been Approved!

Hi [Contractor Name],

Great news! Your Qilly contractor account has been approved.

You can now access Qilly's powerful BOQ pricing system:

┌────────────────────────────────┐
│   LOGIN TO YOUR ACCOUNT        │
│   [Login Now Button]           │
└────────────────────────────────┘

Your Account Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: [Email]
Subscription: [Tier] Plan ([Billing Cycle])
Status: Active - Trial Period
Next Billing: [Next Billing Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What You Can Do Now:
✅ Upload or create BOQs
✅ Get instant pricing from 96+ SA suppliers
✅ Compare prices across 9 provinces
✅ Generate compliant quotations
✅ Track BBBEE, SANS 1200, NBR compliance

Getting Started:
1. Login at: [Login URL]
2. Complete payment setup
3. Upload your first BOQ
4. Get instant pricing!

Need Help?
📖 View our Getting Started Guide: [Link]
💬 Contact Support: [Support Email]
📞 Call Us: [Support Phone]

Welcome to Qilly!

Best regards,
The Qilly Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Qilly - Core Ground Civils Billing System
100% Accurate Pricing in Under 5 Minutes
```

---

### Email 2B: Application Update ❌

```
Subject: Update on Your Qilly Registration

Hi [Contractor Name],

Thank you for your interest in Qilly.

After reviewing your registration, we're unable to approve your
account at this time.

Reason:
[Reason for rejection - if provided]

Common reasons include:
• CIDB registration could not be verified
• Incomplete information provided
• Business details do not match our requirements

What You Can Do:
If you believe this was an error or would like to provide
additional information, please reply to this email with:

• Updated CIDB registration documents
• Company registration proof
• Additional business information

We'll be happy to review your application again.

Questions?
Reply to this email or contact us at [Support Email]

Best regards,
The Qilly Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Qilly - Core Ground Civils Billing System
```

---

## 🔧 Implementation Steps

### Step 1: Choose Email Service

**Recommended: Resend (Easiest)**

1. Go to: https://resend.com
2. Sign up (free tier: 3,000 emails/month)
3. Get API key
4. Add verified domain (or use resend.dev for testing)

---

### Step 2: Add Resend to Your Project

```bash
# Install Resend SDK
npm install resend
```

---

### Step 3: Create Email Service File

**File:** `/src/utils/emailService.ts`

```typescript
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContractorData {
  email: string;
  contactPerson: string;
  companyName: string;
  cidbRegistrationNumber: string;
  subscriptionTier: string;
  billingCycle: string;
  operatingProvinces: string[];
  projectTypes: string[];
  phone: string;
}

export const emailService = {
  // Email 1: Registration Received
  async sendRegistrationConfirmation(contractor: ContractorData) {
    try {
      await resend.emails.send({
        from: 'Qilly <noreply@qilly.co.za>', // Use your domain
        to: contractor.email,
        subject: 'Welcome to Qilly - Registration Received',
        html: `
          <h2>Hi ${contractor.contactPerson},</h2>
          <p>Thank you for registering with Qilly!</p>
          
          <h3>Your Registration Details:</h3>
          <ul>
            <li><strong>Company:</strong> ${contractor.companyName}</li>
            <li><strong>CIDB:</strong> ${contractor.cidbRegistrationNumber}</li>
            <li><strong>Subscription:</strong> ${contractor.subscriptionTier} (${contractor.billingCycle})</li>
          </ul>
          
          <h3>What happens next:</h3>
          <ol>
            <li>Our team will review your application</li>
            <li>We'll verify your CIDB registration</li>
            <li>You'll receive approval within 1-2 business days</li>
            <li>Once approved, you can login and start pricing BOQs</li>
          </ol>
          
          <p>Best regards,<br>The Qilly Team</p>
        `
      });
      
      console.log('✅ Registration email sent to:', contractor.email);
    } catch (error) {
      console.error('❌ Failed to send registration email:', error);
      // Don't throw - email failure shouldn't break signup
    }
  },

  // Email 2A: Account Approved
  async sendApprovalEmail(contractor: ContractorData) {
    try {
      await resend.emails.send({
        from: 'Qilly <noreply@qilly.co.za>',
        to: contractor.email,
        subject: '🎉 Your Qilly Account Has Been Approved!',
        html: `
          <h2>Hi ${contractor.contactPerson},</h2>
          <p><strong>Great news!</strong> Your Qilly contractor account has been approved.</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://your-qilly-url.com/login" 
               style="background: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Login Now
            </a>
          </p>
          
          <h3>Your Account Details:</h3>
          <ul>
            <li><strong>Email:</strong> ${contractor.email}</li>
            <li><strong>Subscription:</strong> ${contractor.subscriptionTier} Plan (${contractor.billingCycle})</li>
            <li><strong>Status:</strong> Active - Trial Period</li>
          </ul>
          
          <h3>What You Can Do Now:</h3>
          <ul>
            <li>✅ Upload or create BOQs</li>
            <li>✅ Get instant pricing from 96+ SA suppliers</li>
            <li>✅ Compare prices across 9 provinces</li>
            <li>✅ Generate compliant quotations</li>
          </ul>
          
          <p>Welcome to Qilly!</p>
          <p>Best regards,<br>The Qilly Team</p>
        `
      });
      
      console.log('✅ Approval email sent to:', contractor.email);
    } catch (error) {
      console.error('❌ Failed to send approval email:', error);
    }
  },

  // Email 2B: Account Rejected
  async sendRejectionEmail(contractor: ContractorData, reason?: string) {
    try {
      await resend.emails.send({
        from: 'Qilly <noreply@qilly.co.za>',
        to: contractor.email,
        subject: 'Update on Your Qilly Registration',
        html: `
          <h2>Hi ${contractor.contactPerson},</h2>
          <p>Thank you for your interest in Qilly.</p>
          
          <p>After reviewing your registration, we're unable to approve your 
          account at this time.</p>
          
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          
          <h3>Common reasons include:</h3>
          <ul>
            <li>CIDB registration could not be verified</li>
            <li>Incomplete information provided</li>
            <li>Business details do not match our requirements</li>
          </ul>
          
          <h3>What You Can Do:</h3>
          <p>If you believe this was an error or would like to provide 
          additional information, please reply to this email.</p>
          
          <p>Best regards,<br>The Qilly Team</p>
        `
      });
      
      console.log('✅ Rejection email sent to:', contractor.email);
    } catch (error) {
      console.error('❌ Failed to send rejection email:', error);
    }
  }
};
```

---

### Step 4: Update ContractorSignup.tsx

**Add email sending to signup process:**

```typescript
// In ContractorSignup.tsx, after successful contractor creation

import { emailService } from '@/utils/emailService';

// ... existing code ...

const { data: contractorRecord, error: contractorError } = await supabase
  .from('contractors')
  .insert([contractorData])
  .select()
  .single();

if (contractorError) {
  console.error('Contractor insert error:', contractorError);
  throw contractorError;
}

console.log('✅ Contractor record created:', contractorRecord);

// 🆕 Send registration confirmation email
await emailService.sendRegistrationConfirmation({
  email: signupData.email,
  contactPerson: signupData.contactPerson,
  companyName: signupData.companyName,
  cidbRegistrationNumber: signupData.cidbRegistrationNumber,
  subscriptionTier: selectedTier,
  billingCycle: billingCycle,
  operatingProvinces: signupData.operatingProvinces,
  projectTypes: signupData.projectTypes,
  phone: signupData.phone,
});

const tierName = selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);
toast.success(`Contractor account created successfully! Check your email.`);
```

---

### Step 5: Update Admin Dashboard

**Add email sending to approval/rejection:**

```typescript
// In AdminDashboard.tsx (or contractor approval component)

import { emailService } from '@/utils/emailService';

const handleApproveContractor = async (contractorId: string) => {
  try {
    // Update status to 'approved'
    const { data, error } = await supabase
      .from('contractors')
      .update({ status: 'approved' })
      .eq('id', contractorId)
      .select()
      .single();
    
    if (error) throw error;
    
    // 🆕 Send approval email
    await emailService.sendApprovalEmail({
      email: data.email,
      contactPerson: data.contact_person,
      companyName: data.company_name,
      cidbRegistrationNumber: data.cidb_registration_number,
      subscriptionTier: data.subscription_tier,
      billingCycle: data.billing_cycle,
      operatingProvinces: data.operating_provinces,
      projectTypes: data.project_types,
      phone: data.phone,
    });
    
    toast.success('Contractor approved! Email sent.');
  } catch (error) {
    console.error('Error approving contractor:', error);
    toast.error('Failed to approve contractor');
  }
};

const handleRejectContractor = async (contractorId: string, reason?: string) => {
  try {
    // Update status to 'rejected'
    const { data, error } = await supabase
      .from('contractors')
      .update({ status: 'rejected' })
      .eq('id', contractorId)
      .select()
      .single();
    
    if (error) throw error;
    
    // 🆕 Send rejection email
    await emailService.sendRejectionEmail({
      email: data.email,
      contactPerson: data.contact_person,
      companyName: data.company_name,
      cidbRegistrationNumber: data.cidb_registration_number,
      subscriptionTier: data.subscription_tier,
      billingCycle: data.billing_cycle,
      operatingProvinces: data.operating_provinces,
      projectTypes: data.project_types,
      phone: data.phone,
    }, reason);
    
    toast.success('Contractor rejected. Email sent.');
  } catch (error) {
    console.error('Error rejecting contractor:', error);
    toast.error('Failed to reject contractor');
  }
};
```

---

### Step 6: Add Environment Variable

**File:** `.env.local`

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important:** Add `.env.local` to `.gitignore` to keep API key secret!

---

## 🧪 Testing Email Flow

### Test Email 1: Registration

1. Signup as contractor
2. Check email inbox
3. Verify "Registration Received" email arrived
4. Check content is correct

### Test Email 2A: Approval

1. Admin approves contractor
2. Check email inbox
3. Verify "Account Approved" email arrived
4. Click login button
5. Verify can login

### Test Email 3B: Rejection

1. Admin rejects contractor
2. Check email inbox
3. Verify "Application Update" email arrived
4. Check reason is shown (if provided)

---

## 🎯 Production Checklist

**Before Launch:**

- [ ] Email service configured (Resend/SendGrid/etc)
- [ ] API key added to environment variables
- [ ] Email templates tested
- [ ] Emails don't go to spam
- [ ] Login button links work
- [ ] All contractor data shows correctly
- [ ] Error handling works (email fails don't break signup)
- [ ] Tested with multiple email providers (Gmail, Outlook, etc)

**After Launch:**

- [ ] Monitor email delivery rates
- [ ] Check spam complaints
- [ ] Review email open rates
- [ ] Adjust templates based on feedback

---

## 💡 Pro Tips

### Tip 1: Don't Block Signup on Email Failure

```typescript
// ❌ BAD: Signup fails if email fails
await emailService.sendRegistrationConfirmation(data);

// ✅ GOOD: Log error but continue
try {
  await emailService.sendRegistrationConfirmation(data);
} catch (error) {
  console.error('Email failed but signup succeeded:', error);
  // Maybe queue for retry later
}
```

### Tip 2: Use Email Queues for Reliability

```typescript
// For production: Queue emails instead of sending immediately
// Use services like Bull, Redis Queue, or Supabase Edge Functions
```

### Tip 3: A/B Test Email Templates

```typescript
// Track which email templates get better engagement
// Adjust content, subject lines, CTAs based on data
```

### Tip 4: Add Unsubscribe Links

```typescript
// Required for compliance
// Add to bottom of transactional emails
```

---

## 📊 Summary

### Current State
```
Contractor Signup:
✅ Account created
✅ Status set to 'pending'
✅ Toast notification shown
❌ No email sent
```

### After Implementation
```
Contractor Signup:
✅ Account created
✅ Status set to 'pending'
✅ Toast notification shown
✅ Email 1: "Registration Received" sent

Admin Approval:
✅ Status changed to 'approved'
✅ Email 2A: "Account Approved" sent
✅ Contractor notified

Admin Rejection:
✅ Status changed to 'rejected'
✅ Email 2B: "Application Update" sent
✅ Contractor notified
```

---

## 🎯 Next Actions

**Option A: Full Implementation (Recommended)**
1. Choose email service (Resend recommended)
2. Sign up and get API key
3. Install Resend package
4. Create emailService.ts
5. Update ContractorSignup.tsx
6. Update AdminDashboard.tsx
7. Test all three email types
8. Deploy to production

**Option B: Manual Emails (Temporary)**
1. Use templates provided above
2. Admin manually sends emails after approval
3. Copy contractor email from dashboard
4. Send using Gmail/Outlook
5. Plan to automate later

**Option C: Implement Later**
1. Note this gap in backlog
2. Continue with current flow
3. Implement before public launch
4. Contractors can check dashboard for status

---

**Recommendation:** Implement Option A before production launch for professional user experience and reduced admin workload! 📧✅
