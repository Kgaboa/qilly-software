# Qilly Performance & Stress Testing Guide

## Overview
Comprehensive performance testing tool built for validating Qilly's production readiness before Tuesday's eTender investor presentation.

## 🚀 Quick Start

### Accessing the Tool

**Option 1: Direct URL Access**
```
http://localhost:3000/  (then navigate to performance testing)
```

**Option 2: Via Admin Dashboard**
Add to App.tsx routing:
```typescript
// Add navigation button in your admin area
<Button onClick={() => setCurrentView('performance-test')}>
  Performance Tests
</Button>
```

**Option 3: Standalone Access**
The tool can run independently - just update your routing to include the PerformanceStressTest component.

---

## 📊 What It Tests

### 1. **Database Performance Tests**
- ✅ Supplier query performance (100 records)
- ✅ Product query performance (100 records)
- ✅ Provincial pricing factor queries
- ✅ Bills and BOQ data queries
- ✅ Complex JOIN operations (Bills + Items)

**Target Metrics:**
- Average response time: < 500ms
- Max response time: < 1000ms

### 2. **Authentication Performance Tests**
- ✅ Session validation speed
- ✅ User metadata fetch performance
- ✅ Supabase auth latency

**Target Metrics:**
- Session validation: < 200ms
- User fetch: < 300ms

### 3. **Concurrent User Simulation**
- ✅ 5 concurrent users
- ✅ 10 concurrent users
- ✅ 20+ concurrent users

**Target Metrics:**
- Successful handling of 20+ concurrent users
- No timeout errors
- Response time degradation < 30%

### 4. **Pricing Engine Performance**
- ✅ BOQ calculation with 50 items
- ✅ Supplier matching algorithm
- ✅ Provincial pricing application

**Target Metrics:**
- 50 item BOQ pricing: < 2000ms
- Supplier matching: < 500ms per item

### 5. **Load Testing (Sustained Traffic)**
- ✅ Light Load: 5 users for 30 seconds
- ✅ Medium Load: 20 users for 60 seconds
- ✅ Heavy Load: 50 users for 120 seconds

**Target Metrics:**
- Throughput: > 10 requests/second
- Error rate: < 5%
- Success rate: > 95%

---

## 🎯 Pre-configured Test Scenarios

### **Scenario 1: Demo Preparation** ⭐ (RECOMMENDED FOR TUESDAY)
- **Duration:** 30 seconds
- **Users:** 5 concurrent
- **Purpose:** Quick validation before presentation
- **Use When:** 30 minutes before eTender demo

### **Scenario 2: Investor Showcase**
- **Duration:** 60 seconds
- **Users:** 20 concurrent
- **Purpose:** Demonstrate scalability to investors
- **Use When:** During Q&A if asked about performance

### **Scenario 3: Production Readiness**
- **Duration:** 120 seconds
- **Users:** 50 concurrent
- **Purpose:** Validate production deployment readiness
- **Use When:** Before public beta launch

### **Scenario 4: Quick Validation**
- **Duration:** N/A (no load test)
- **Users:** N/A
- **Purpose:** Database & auth tests only
- **Use When:** Quick health check

---

## 🔧 Configuration Options

### Load Test Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Concurrent Users | 1-100 | 10 | Number of simultaneous users |
| Test Duration | 10-300s | 60s | How long to sustain load |
| Ramp-up Time | 0-60s | 10s | Gradual user increase period |
| Scenario | Light/Medium/Heavy/Custom | Light | Pre-configured test profile |

### Custom Configuration
Select "Custom Configuration" in the scenario dropdown to manually adjust:
- Exact number of concurrent users
- Precise test duration
- Custom ramp-up period

---

## 📈 Understanding the Results

### Metrics Dashboard

**Average Response Time**
- ✅ **Good:** < 500ms
- ⚠️ **Acceptable:** 500-1000ms
- ❌ **Poor:** > 1000ms

**Success Rate**
- ✅ **Good:** > 95%
- ⚠️ **Acceptable:** 90-95%
- ❌ **Poor:** < 90%

**Error Rate**
- ✅ **Good:** < 5%
- ⚠️ **Acceptable:** 5-10%
- ❌ **Poor:** > 10%

**Throughput**
- ✅ **Good:** > 10 requests/second
- ⚠️ **Acceptable:** 5-10 requests/second
- ❌ **Poor:** < 5 requests/second

### Test Results Table
Each test shows:
- ✅ **Status:** Success/Error icon
- ⏱️ **Duration:** Execution time in milliseconds
- 📊 **Metric:** Number of records processed
- 🔍 **Details:** What was tested
- ⚠️ **Errors:** Error messages if failed

### Performance Charts

**Response Time Over Time (Area Chart)**
- Shows real-time response latency during load test
- Look for: Stable lines = consistent performance
- Watch for: Spikes indicate bottlenecks

**Success Rate (Bar Chart)**
- Green bars = successful requests
- Height = number of successes per interval
- Gaps = errors or timeouts

---

## 🎬 Tuesday Presentation Workflow

### Pre-Demo (Monday Evening or Tuesday Morning)

1. **Run Demo Preparation Scenario**
   ```
   Scenario: Demo Preparation (Light Load)
   Duration: 30 seconds
   Users: 5
   ```

2. **Verify Key Metrics**
   - [ ] Avg Response Time < 500ms
   - [ ] Success Rate > 95%
   - [ ] All database tests pass
   - [ ] Auth tests complete < 300ms
   - [ ] Concurrent users handled successfully

3. **Export Results**
   - Click "Export Results" button
   - Save as: `qilly-baseline-performance-[date].json`
   - Keep as backup reference

4. **Take Screenshots**
   - Metrics summary dashboard
   - Performance charts
   - Test results table

### During Demo (If Asked About Performance)

**Investor Question:** "How does the system handle load?"

**Your Response:**
1. Navigate to testing tool
2. Select "Investor Showcase" scenario
3. Click "Run All Tests"
4. Show live metrics updating
5. Point out:
   - Real-time database queries
   - Concurrent user handling
   - Provincial pricing performance
   - Success rate > 95%

**Talking Points:**
- "We've tested with 20+ concurrent users"
- "Average response time under 500ms"
- "Database queries optimized for South African provinces"
- "Handles realistic BOQ calculations in under 2 seconds"
- "Ready to scale for eTender's user base"

---

## 🐛 Troubleshooting

### Issue: "Lock timeout" or "this.lock is not a function"
**Solution:** These auth errors are already fixed in your codebase (auth-helpers.ts cleanup)

### Issue: High error rates
**Possible Causes:**
1. Supabase rate limiting (429 errors)
2. RLS policy issues
3. Network latency

**Fix:**
- Check Supabase project dashboard
- Verify RLS policies are correct
- Test with lower user count first

### Issue: Slow response times
**Possible Causes:**
1. Missing database indexes
2. Provincial pricing not populated
3. Large dataset queries

**Fix:**
- Run the provincial pricing SQL script (POPULATE_PROVINCIAL_PRICING.sql)
- Check database indexes on suppliers, products tables
- Limit query results appropriately

### Issue: Tests timeout
**Solution:**
- Reduce concurrent users
- Shorten test duration
- Check Supabase connection

---

## 📤 Exporting Results

### JSON Export Format
```json
{
  "timestamp": "2026-03-14T10:30:00Z",
  "configuration": {
    "concurrentUsers": 10,
    "testDuration": 60,
    "rampUpTime": 10,
    "scenario": "medium"
  },
  "metrics": {
    "avgResponseTime": 342,
    "minResponseTime": 89,
    "maxResponseTime": 678,
    "throughput": 12,
    "errorRate": 2.3,
    "successRate": 97.7
  },
  "results": [...],
  "chartData": [...]
}
```

### Using Exported Data
1. **For Presentation:** Include metrics in slides
2. **For Investors:** Show trend analysis
3. **For Development:** Identify bottlenecks
4. **For Compliance:** Document system performance

---

## 🎯 Performance Targets for Tuesday

### Minimum Acceptable Performance
- ✅ All database tests complete
- ✅ Auth tests < 300ms
- ✅ Handle 10+ concurrent users
- ✅ Success rate > 90%
- ✅ No critical errors

### Optimal Performance (Stretch Goal)
- ✅ Avg response time < 300ms
- ✅ Handle 20+ concurrent users
- ✅ Success rate > 98%
- ✅ Throughput > 15 req/sec
- ✅ Load test completes without errors

---

## 🔒 Security Note

**Important:** This tool makes real requests to your Supabase database. 
- ✅ Safe to use in DEV/SIT environments
- ⚠️ Use caution in UAT environment
- ❌ Never run heavy load tests in PRODUCTION

The tool respects your RLS policies and authentication requirements.

---

## 📞 Quick Reference

### Critical Commands
```bash
# Run in development mode
npm run dev

# Navigate to performance testing
# Add button or update routing to access PerformanceStressTest component
```

### Key Files
- `/src/app/components/PerformanceStressTest.tsx` - Main testing component
- `/src/app/components/PerformanceTestLauncher.tsx` - Quick access launcher
- `/src/utils/supabase.ts` - Supabase client (used for tests)

### Support Files
- `PRODUCTION_READINESS_AUDIT.md` - Overall system readiness (56% ready)
- `TUESDAY_PRESENTATION_READY.md` - Demo preparation guide
- `POPULATE_PROVINCIAL_PRICING.sql` - Database setup for pricing tests

---

## ✅ Pre-Presentation Checklist

**48 Hours Before (Sunday)**
- [ ] Run "Production Readiness" scenario
- [ ] Document any performance issues
- [ ] Fix critical bottlenecks
- [ ] Populate provincial pricing table if needed

**24 Hours Before (Monday)**
- [ ] Run "Demo Preparation" scenario
- [ ] Verify all tests pass
- [ ] Export baseline results
- [ ] Take screenshots of metrics

**2 Hours Before (Tuesday Morning)**
- [ ] Quick validation test
- [ ] Verify Supabase connection
- [ ] Check database is populated
- [ ] Confirm results are presentable

**30 Minutes Before Demo**
- [ ] Final "Demo Preparation" run
- [ ] Verify success rate > 95%
- [ ] Close all unnecessary browser tabs
- [ ] Have performance tool ready to demo if needed

---

## 🎓 Advanced Usage

### Custom Test Scenarios
Edit the test configuration to create custom scenarios:
```typescript
const customScenario = {
  concurrentUsers: 15,
  testDuration: 45,
  rampUpTime: 5,
  scenario: 'custom'
};
```

### Adding New Tests
Extend the test suite by adding to the test arrays:
```typescript
const tests = [
  {
    name: 'Your Custom Test',
    test: async () => {
      // Your test logic
      const start = performance.now();
      // ... test code ...
      const duration = performance.now() - start;
      return { duration, details: 'Test completed', metric: 100 };
    }
  }
];
```

### Integration with CI/CD
Export results can be used in automated testing pipelines:
- Parse JSON for pass/fail criteria
- Set thresholds for deployment gates
- Track performance trends over time

---

## 📊 Interpreting Results for Investors

### What Investors Care About

1. **Scalability:** "Can it handle growth?"
   - Show: Concurrent user tests (10-20+ users)
   - Metric: Success rate stays > 95%

2. **Reliability:** "Will it work consistently?"
   - Show: Success rate and error rate
   - Metric: < 5% errors under load

3. **Speed:** "Is it fast enough for users?"
   - Show: Average response time
   - Metric: < 500ms for typical operations

4. **Production-Ready:** "Can we deploy this now?"
   - Show: Load test results
   - Metric: Sustained performance over 60+ seconds

### Key Talking Points
- "Tested with realistic South African construction data"
- "Handles province-specific pricing calculations efficiently"
- "Optimized for multi-supplier BOQ pricing"
- "Database queries return within user expectations"
- "Ready to onboard eTender's contractor base"

---

## 🚨 Known Limitations

1. **Browser-based load testing** - Limited by browser tab constraints
   - For 100+ concurrent users, use dedicated load testing tools (k6, JMeter)

2. **Network dependency** - Results vary based on internet connection
   - Run tests on stable connection
   - Results reflect client-to-Supabase latency

3. **Supabase rate limits** - Free tier has request limits
   - Paid tier recommended for production
   - Tests may hit rate limits on heavy scenarios

4. **Client-side only** - Doesn't test backend edge functions
   - Removed edge function dependency (as per your architecture)
   - Tests focus on Supabase direct queries

---

## 📅 Post-Presentation

### After Tuesday's Demo
1. Document any performance questions asked
2. Note investor concerns about scalability
3. Re-run tests to validate consistency
4. Create performance baseline report

### For Production Launch
1. Run heavy load tests (50+ users)
2. Set up automated performance monitoring
3. Establish alerting thresholds
4. Document performance SLAs

---

## 🎉 Success Criteria

**You're ready for Tuesday if:**
- ✅ All tests pass in "Demo Preparation" scenario
- ✅ Database queries < 500ms average
- ✅ Auth tests < 300ms
- ✅ 10+ concurrent users handled successfully
- ✅ Success rate > 95%
- ✅ Can export results for backup
- ✅ Understand how to interpret metrics to investors

**Red flags (fix before demo):**
- ❌ Error rate > 10%
- ❌ Average response > 1000ms
- ❌ Tests timing out
- ❌ Database connection errors
- ❌ Provincial pricing warnings

---

## 📞 Emergency Contacts

**If tests fail before demo:**
1. Check: Is Supabase project running?
2. Check: Is provincial pricing populated?
3. Check: Are RLS policies correct?
4. Fallback: Run "Quick Validation" (skip load test)
5. Last resort: Demo with mock data mode

---

**Built for Qilly - Construction Billing Innovation**
**Ready for eTender Investor Presentation - Tuesday, March 2026**
