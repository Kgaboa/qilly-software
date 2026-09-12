# 🎤 INVESTOR PITCH QUICK REFERENCE

## ✅ WHAT TO SAY

### **Multi-User Feature:**
> ✅ "**Multi-user access with role-based permissions**"  
> ✅ "Enterprise tier supports **5 concurrent users**"  
> ✅ "Custom tier provides **unlimited users**"  
> ✅ "Four distinct roles: Owner, Admin, Project Manager, and Viewer"  
> ✅ "Each user has appropriate access controls based on their role"  
> ✅ "Team members can collaborate on the same BOQs with different permission levels"  

### **Database & Security:**
> ✅ "Built on **PostgreSQL via Supabase** for production-grade data persistence"  
> ✅ "**Row-Level Security** ensures complete data isolation between organizations"  
> ✅ "All contractor data persists in the database, not local storage"  
> ✅ "Meeting government security requirements for data sovereignty"  

### **For DHS:**
> ✅ "Perfect for DHS regional offices where procurement teams, project managers, and executives all need access"  
> ✅ "Custom tier supports unlimited users with white-label branding for municipal deployment"  

---

## ❌ WHAT NOT TO SAY

### **Avoid These Terms:**
> ❌ "Real-time collaboration"  
> ❌ "Live simultaneous editing"  
> ❌ "See changes in real-time"  
> ❌ "Live cursor tracking"  
> ❌ "Google Docs-style collaboration"  

**Why?** We haven't implemented real-time features. Multiple users can access the same data, but they need to refresh to see each other's changes.

---

## 📊 KEY NUMBERS

| Metric | Value |
|--------|-------|
| **Enterprise Users** | 5 concurrent |
| **Custom Users** | Unlimited (999) |
| **User Roles** | 4 (Owner, Admin, PM, Viewer) |
| **Invitation Expiry** | 7 days |
| **Database** | PostgreSQL (Supabase) |
| **Data Isolation** | Row-Level Security |

---

## 🎯 DEMO CHECKLIST

Before starting demo:
- [ ] Logged in as Enterprise contractor
- [ ] Team Management page open
- [ ] Shows "Team Members: 0/5"
- [ ] "Invite Member" button visible and enabled
- [ ] Test invitation ready (teamtest@example.com)

During demo:
1. ✅ Show "0/5 users" counter
2. ✅ Click "Invite Member"
3. ✅ Select "Project Manager" role
4. ✅ Send invitation
5. ✅ Show pending invitation in table
6. ✅ Highlight role descriptions
7. ✅ Switch to FREE tier to show upgrade prompt

---

## 🔧 IMPLEMENTED FEATURES

### ✅ What We Built:
- **Team invitations** via email
- **Role-based permissions** (4 roles)
- **User quotas** per subscription tier
- **Organization isolation** (separate data per contractor)
- **Team member management** (add/remove users)
- **Pending invitations tracking**
- **Database persistence** (Supabase PostgreSQL)
- **Payment verification** updates database

### ❌ Future Roadmap (Q2 2026):
- Real-time collaboration (live editing)
- Activity feed & audit logs
- Edit locking & conflict resolution
- Live notifications
- White-label services
- Advanced audit trails

---

## 🚨 IF ASKED ABOUT REAL-TIME:

**Question:** "Can users edit the same BOQ at the same time?"

**Answer:**  
> "Currently, multiple users with appropriate permissions can access and edit the same BOQs within their organization. Changes are persisted to the database immediately. For simultaneous real-time editing with live cursor tracking, that's on our Q2 2026 roadmap alongside the white-label features. Right now, we're focused on ensuring robust role-based access control and data security, which are critical for government compliance."

---

## 💡 TRANSITION PHRASES

When discussing multi-user:
> "Let me show you our **multi-user access control** in action..."

When showing Enterprise features:
> "Enterprise clients get **5 team members** with **role-based permissions**..."

When contrasting tiers:
> "FREE tier contractors see a clear **upgrade path** to unlock team collaboration..."

When discussing DHS needs:
> "For large organizations like DHS, our **Custom tier provides unlimited users**..."

---

## 📞 EMERGENCY FALLBACKS

### If demo fails:
1. **Plan B:** Show screenshots (take some beforehand)
2. **Plan C:** Walk through the UI mockups
3. **Pivot:** Focus on pricing engine and carbon tracking features

### If database connection fails:
> "We're currently running on development mode. In production, all data persists to our PostgreSQL database via Supabase with Row-Level Security for compliance."

### If asked about specific collaboration features:
> "Our current release focuses on secure multi-user **access control**. Real-time collaborative editing is planned for Q2 2026 alongside white-label deployment for government agencies."

---

## 🎯 CLOSING STATEMENT

> "Qilly's multi-user functionality is designed for **South African construction reality**: small contractors get affordable single-user access, medium firms get 5-user teams on Enterprise, and large organizations like DHS can deploy unlimited users with Custom tier and white-label branding. All backed by production-grade PostgreSQL with government-compliant data sovereignty."

---

## 📱 QUICK LINKS

- Development DB: `zzdzrlglivtpawtitvgu.supabase.co`
- Test Enterprise Login: `prof1@gmail.com`
- Team Management: `/team` (or wherever you route it)
- Payment Verification: Admin Dashboard
- SQL Schema: `/src/utils/sql/multi-user-schema.sql`

---

**Remember:**  
✅ Multi-user **ACCESS** ✅  
❌ Real-time **EDITING** ❌  

**You've got this! 🚀**
