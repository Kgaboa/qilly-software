import * as XLSX from 'xlsx';

export function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToHTML(data: any, filename: string, title: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(to bottom right, #f9fafb, #e5e7eb);
      padding: 2rem;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
    .header {
      background: linear-gradient(to right, #ea580c, #dc2626);
      color: white;
      padding: 2rem;
      border-bottom: 4px solid #b91c1c;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.9; font-size: 0.9rem; }
    .section { padding: 2rem; border-bottom: 1px solid #e5e7eb; }
    .section:last-child { border-bottom: none; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .metric-card {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      transition: transform 0.2s;
    }
    .metric-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .metric-label { font-size: 0.875rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .metric-value { font-size: 2rem; font-weight: 700; color: #1f2937; }
    .metric-sub { font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f3f4f6; }
    th { text-align: left; padding: 0.75rem 1rem; font-weight: 600; color: #374151; border-bottom: 2px solid #d1d5db; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
    tr:hover { background: #f9fafb; }
    .status-success { color: #16a34a; font-weight: 600; }
    .status-error { color: #dc2626; font-weight: 600; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-error { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .config-table { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1.5rem; }
    .config-label { font-weight: 600; color: #4b5563; }
    .config-value { color: #1f2937; }
    .footer { padding: 1.5rem 2rem; background: #f9fafb; text-align: center; color: #6b7280; font-size: 0.875rem; }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
      .metric-card:hover { transform: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ ${title}</h1>
      <p>Generated on ${new Date(data.timestamp).toLocaleString()}</p>
    </div>
    
    ${data.metrics ? `
    <div class="section">
      <h2 class="section-title">📊 Performance Metrics</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Avg Response Time</div>
          <div class="metric-value">${data.metrics.avgResponseTime}ms</div>
          <div class="metric-sub">Min: ${data.metrics.minResponseTime}ms | Max: ${data.metrics.maxResponseTime}ms</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Success Rate</div>
          <div class="metric-value" style="color: #16a34a">${data.metrics.successRate}%</div>
          <div class="metric-sub">Error Rate: ${data.metrics.errorRate}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Throughput</div>
          <div class="metric-value" style="color: #7c3aed">${data.metrics.throughput}</div>
          <div class="metric-sub">Requests per second</div>
        </div>
      </div>
    </div>
    ` : ''}
    
    ${data.configuration ? `
    <div class="section">
      <h2 class="section-title">⚙️ Test Configuration</h2>
      <div class="config-table">
        <span class="config-label">Scenario:</span>
        <span class="config-value">${data.configuration.scenario || 'N/A'}</span>
        <span class="config-label">Concurrent Users:</span>
        <span class="config-value">${data.configuration.concurrentUsers || 'N/A'}</span>
        <span class="config-label">Test Duration:</span>
        <span class="config-value">${data.configuration.testDuration || 'N/A'}s</span>
        <span class="config-label">Ramp-up Time:</span>
        <span class="config-value">${data.configuration.rampUpTime || 'N/A'}s</span>
      </div>
    </div>
    ` : ''}
    
    ${data.summary ? `
    <div class="section">
      <h2 class="section-title">📈 Test Summary</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Total Tests</div>
          <div class="metric-value">${data.summary.total}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Passed</div>
          <div class="metric-value" style="color: #16a34a">${data.summary.passed}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Failed</div>
          <div class="metric-value" style="color: #dc2626">${data.summary.failed}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total Duration</div>
          <div class="metric-value">${data.summary.duration}ms</div>
        </div>
      </div>
    </div>
    ` : ''}
    
    ${data.results && data.results.length > 0 ? `
    <div class="section">
      <h2 class="section-title">🧪 Test Results</h2>
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${data.results.map((result: any) => `
            <tr>
              <td><strong>${result.testName || result.testCaseName}</strong></td>
              <td>
                <span class="badge badge-${result.status === 'success' || result.status === 'passed' ? 'success' : 'error'}">
                  ${(result.status || '').toUpperCase()}
                </span>
              </td>
              <td>${result.duration}ms</td>
              <td>${result.details || (result.error ? `<span style="color:#dc2626">${result.error}</span>` : 'N/A')}</td>
              <td>${new Date(result.timestamp).toLocaleTimeString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
    
    <div class="footer">
      <p>Qilly Performance Test Report • Generated for eTender Presentation</p>
      <p style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.8;">© ${new Date().getFullYear()} Qilly Construction Billing System</p>
    </div>
  </div>
</body>
</html>
  `;
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToExcel(data: any, filename: string) {
  const workbook = XLSX.utils.book_new();
  
  // Summary Sheet
  const summaryData: any[] = [];
  
  // Add timestamp
  summaryData.push(['Report Generated', new Date(data.timestamp).toLocaleString()]);
  summaryData.push([]);
  
  // Add metrics if available
  if (data.metrics) {
    summaryData.push(['PERFORMANCE METRICS']);
    summaryData.push(['Metric', 'Value']);
    summaryData.push(['Avg Response Time', `${data.metrics.avgResponseTime}ms`]);
    summaryData.push(['Min Response Time', `${data.metrics.minResponseTime}ms`]);
    summaryData.push(['Max Response Time', `${data.metrics.maxResponseTime}ms`]);
    summaryData.push(['Throughput', `${data.metrics.throughput} req/s`]);
    summaryData.push(['Success Rate', `${data.metrics.successRate}%`]);
    summaryData.push(['Error Rate', `${data.metrics.errorRate}%`]);
    summaryData.push([]);
  }
  
  // Add summary if available
  if (data.summary) {
    summaryData.push(['TEST SUMMARY']);
    summaryData.push(['Metric', 'Value']);
    summaryData.push(['Total Tests', data.summary.total]);
    summaryData.push(['Passed', data.summary.passed]);
    summaryData.push(['Failed', data.summary.failed]);
    summaryData.push(['Total Duration', `${data.summary.duration}ms`]);
    summaryData.push([]);
  }
  
  // Add configuration if available
  if (data.configuration) {
    summaryData.push(['TEST CONFIGURATION']);
    summaryData.push(['Parameter', 'Value']);
    summaryData.push(['Scenario', data.configuration.scenario || 'N/A']);
    summaryData.push(['Concurrent Users', data.configuration.concurrentUsers || 'N/A']);
    summaryData.push(['Test Duration', `${data.configuration.testDuration || 'N/A'}s`]);
    summaryData.push(['Ramp-up Time', `${data.configuration.rampUpTime || 'N/A'}s`]);
  }
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Test Results Sheet
  if (data.results && data.results.length > 0) {
    const resultsData = data.results.map((result: any) => ({
      'Test Name': result.testName || result.testCaseName || 'N/A',
      'Status': result.status || 'N/A',
      'Duration (ms)': result.duration || 0,
      'Details': result.details || result.error || 'N/A',
      'Error Message': result.errorMessage || '',
      'Metric': result.metric || '',
      'Timestamp': new Date(result.timestamp).toLocaleString(),
    }));
    
    const resultsSheet = XLSX.utils.json_to_sheet(resultsData);
    
    // Set column widths
    resultsSheet['!cols'] = [
      { wch: 30 },  // Test Name
      { wch: 10 },  // Status
      { wch: 15 },  // Duration
      { wch: 50 },  // Details
      { wch: 30 },  // Error Message
      { wch: 10 },  // Metric
      { wch: 20 },  // Timestamp
    ];
    
    XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Test Results');
  }
  
  // Chart Data Sheet (if available)
  if (data.chartData && data.chartData.length > 0) {
    const chartSheet = XLSX.utils.json_to_sheet(data.chartData);
    XLSX.utils.book_append_sheet(workbook, chartSheet, 'Chart Data');
  }
  
  // Write the file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
