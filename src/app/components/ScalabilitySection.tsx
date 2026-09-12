import { Cpu, Zap, Cloud, CreditCard } from 'lucide-react';

export function ScalabilityNearTerm() {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-xl text-[#00b4d8] flex items-center gap-2">
        <Zap className="h-5 w-5" />
        Near-term Roadmap (Years 2-3) - Growth Phase Infrastructure
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h5 className="font-semibold mb-3 text-blue-900">Performance Metrics (Years 2-3)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">⚡</span>
              <div>
                <p className="font-medium">Processing Speed: &lt;3 minutes per bill</p>
                <p className="text-xs text-gray-600">1,000 line items in under 2 minutes (40% faster)</p>
                <p className="text-xs text-gray-600">Elasticsearch integration for sub-100ms searches</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">👥</span>
              <div>
                <p className="font-medium">Concurrent Users: 5,000+ simultaneous</p>
                <p className="text-xs text-gray-600">Peak load tested: 7,500 concurrent sessions</p>
                <p className="text-xs text-gray-600">Load balancer with 15 auto-scaling instances</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">📊</span>
              <div>
                <p className="font-medium">Bill Capacity: 25,000+ items per bill</p>
                <p className="text-xs text-gray-600">Large-scale projects with 30,000+ line items</p>
                <p className="text-xs text-gray-600">Parallel processing engine for complex BOQs</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✅</span>
              <div>
                <p className="font-medium">Uptime: 99.95% SLA guarantee</p>
                <p className="text-xs text-gray-600">21 minutes downtime per month maximum</p>
                <p className="text-xs text-gray-600">Multi-region failover and redundancy</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Database Infrastructure */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h5 className="font-semibold mb-3 text-purple-900">Database Infrastructure (Years 2-3)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">💾</span>
              <div>
                <p className="font-medium">Database Size: 150GB allocated</p>
                <p className="text-xs text-gray-600">Projected usage: ~75GB (50%), room for 2M+ bills</p>
                <p className="text-xs text-gray-600">Horizontal partitioning by project/province</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">📈</span>
              <div>
                <p className="font-medium">Supplier Catalog Storage: 25GB</p>
                <p className="text-xs text-gray-600">10 suppliers × ~2.5GB each (5M+ items indexed)</p>
                <p className="text-xs text-gray-600">Elasticsearch cluster: +20GB for search indexes</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">🔍</span>
              <div>
                <p className="font-medium">Query Performance: &lt;20ms average</p>
                <p className="text-xs text-gray-600">Advanced indexing with materialized views</p>
                <p className="text-xs text-gray-600">Redis caching layer (3-node cluster, 48GB total)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">🔄</span>
              <div>
                <p className="font-medium">Backup Strategy: 15-min incremental</p>
                <p className="text-xs text-gray-600">Hourly snapshots, 90-day retention policy</p>
                <p className="text-xs text-gray-600">Point-in-time recovery (PITR) enabled</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Server & Compute Resources */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h5 className="font-semibold mb-3 text-green-900">Server & Compute Resources (Years 2-3)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🖥️</span>
              <div>
                <p className="font-medium">Application Servers: 4 × 8vCPU, 16GB RAM</p>
                <p className="text-xs text-gray-600">Auto-scaling up to 15 instances during peak load</p>
                <p className="text-xs text-gray-600">Container orchestration (Kubernetes cluster)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🗄️</span>
              <div>
                <p className="font-medium">Database Server: 16vCPU, 64GB RAM</p>
                <p className="text-xs text-gray-600">PostgreSQL 16 with 3 read replicas</p>
                <p className="text-xs text-gray-600">Dedicated analytics DB (8vCPU, 32GB RAM)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">⚙️</span>
              <div>
                <p className="font-medium">Worker Processes: 12 background workers</p>
                <p className="text-xs text-gray-600">Distributed queue system (RabbitMQ + Redis)</p>
                <p className="text-xs text-gray-600">Dedicated API gateway (Kong, 4 instances)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🌐</span>
              <div>
                <p className="font-medium">CDN: Premium tier (500+ edge locations)</p>
                <p className="text-xs text-gray-600">Smart caching with cache invalidation</p>
                <p className="text-xs text-gray-600">DDoS protection and WAF (Web Application Firewall)</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Storage & Bandwidth */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h5 className="font-semibold mb-3 text-orange-900">Storage & Bandwidth (Years 2-3)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">📁</span>
              <div>
                <p className="font-medium">File Storage (S3): 500GB allocated</p>
                <p className="text-xs text-gray-600">Projected usage: ~250GB, supports 500K+ uploads</p>
                <p className="text-xs text-gray-600">Lifecycle policies: Archive to Glacier after 1 year</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">📤</span>
              <div>
                <p className="font-medium">Bandwidth: 5TB/month included</p>
                <p className="text-xs text-gray-600">Projected usage: ~2TB/month (mobile app + API)</p>
                <p className="text-xs text-gray-600">CDN offloading reduces origin server load by 80%</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">💰</span>
              <div>
                <p className="font-medium">Infrastructure Cost: R20,000/month</p>
                <p className="text-xs text-gray-600">Compute: R10K, Database: R6K, Storage: R4K = R240K/year</p>
                <p className="text-xs text-gray-600">+150% increase from Year 1-2 for 5x capacity</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">📊</span>
              <div>
                <p className="font-medium">Monitoring: Enhanced observability suite</p>
                <p className="text-xs text-gray-600">Grafana + Prometheus + ELK stack for log aggregation</p>
                <p className="text-xs text-gray-600">APM tools (New Relic/Datadog) for performance tracking</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Near-term Summary */}
      <div className="mt-4 bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-300 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-3">📊 Near-term Infrastructure Summary (Years 2-3)</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-blue-800">
          <div>
            <p className="font-medium">Database Growth:</p>
            <p>50GB → 150GB (+200%)</p>
            <p className="text-xs text-gray-600 mt-1">10 supplier catalogs, 5M+ items</p>
          </div>
          <div>
            <p className="font-medium">User Capacity:</p>
            <p>1,000 → 5,000 concurrent (+400%)</p>
            <p className="text-xs text-gray-600 mt-1">15 auto-scaling app instances</p>
          </div>
          <div>
            <p className="font-medium">Processing Speed:</p>
            <p>5 min → 3 min per bill (-40%)</p>
            <p className="text-xs text-gray-600 mt-1">Elasticsearch + parallel processing</p>
          </div>
          <div>
            <p className="font-medium">Monthly Cost:</p>
            <p>R8K → R20K (+150%)</p>
            <p className="text-xs text-gray-600 mt-1">R240K/year total infrastructure</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScalabilityLongTerm() {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-xl text-[#00b4d8] flex items-center gap-2">
        <Cloud className="h-5 w-5" />
        Long-term Vision (Years 4-5) - Enterprise Scale Infrastructure
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h5 className="font-semibold mb-3 text-blue-900">Performance Metrics (Years 4-5)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">⚡</span>
              <div>
                <p className="font-medium">Processing Speed: &lt;90 seconds per bill</p>
                <p className="text-xs text-gray-600">2,000 line items in under 60 seconds (70% faster)</p>
                <p className="text-xs text-gray-600">AI-powered matching (99%+ accuracy, instant results)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">👥</span>
              <div>
                <p className="font-medium">Concurrent Users: 100,000+ simultaneous</p>
                <p className="text-xs text-gray-600">Global scale: Multi-region deployment (5 regions)</p>
                <p className="text-xs text-gray-600">Auto-scaling: 50+ instances across regions</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">📊</span>
              <div>
                <p className="font-medium">Bill Capacity: 100,000+ items per bill</p>
                <p className="text-xs text-gray-600">Mega-projects with unlimited line items</p>
                <p className="text-xs text-gray-600">Distributed processing across 20+ worker nodes</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✅</span>
              <div>
                <p className="font-medium">Uptime: 99.99% SLA guarantee</p>
                <p className="text-xs text-gray-600">4 minutes downtime per month maximum</p>
                <p className="text-xs text-gray-600">Active-active multi-region with automatic failover</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Database Infrastructure */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h5 className="font-semibold mb-3 text-purple-900">Database Infrastructure (Years 4-5)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">💾</span>
              <div>
                <p className="font-medium">Database Size: 1TB allocated (multi-region)</p>
                <p className="text-xs text-gray-600">Projected usage: ~600GB (60%), room for 10M+ bills</p>
                <p className="text-xs text-gray-600">Global distribution: 5 regional databases with sync</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">📈</span>
              <div>
                <p className="font-medium">Supplier Catalog Storage: 120GB</p>
                <p className="text-xs text-gray-600">50+ suppliers × ~2.4GB each (20M+ items indexed)</p>
                <p className="text-xs text-gray-600">ML training data: +200GB for AI models</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">🔍</span>
              <div>
                <p className="font-medium">Query Performance: &lt;10ms average</p>
                <p className="text-xs text-gray-600">AI-optimized queries with predictive caching</p>
                <p className="text-xs text-gray-600">Distributed cache: 10-node Redis cluster (200GB total)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">🔄</span>
              <div>
                <p className="font-medium">Backup Strategy: Real-time replication</p>
                <p className="text-xs text-gray-600">Continuous backup with 1-year retention</p>
                <p className="text-xs text-gray-600">Cross-region disaster recovery (RPO: 0s, RTO: 60s)</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Server & Compute Resources */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h5 className="font-semibold mb-3 text-green-900">Server & Compute Resources (Years 4-5)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🖥️</span>
              <div>
                <p className="font-medium">Application Servers: 20 × 16vCPU, 32GB RAM</p>
                <p className="text-xs text-gray-600">Auto-scaling up to 100 instances globally</p>
                <p className="text-xs text-gray-600">Microservices architecture (30+ services)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🗄️</span>
              <div>
                <p className="font-medium">Database Cluster: 5 regions × 32vCPU, 128GB RAM</p>
                <p className="text-xs text-gray-600">PostgreSQL 17 with global read replicas (15 total)</p>
                <p className="text-xs text-gray-600">Separate data warehouses in each region</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🤖</span>
              <div>
                <p className="font-medium">ML Infrastructure: GPU-enabled compute</p>
                <p className="text-xs text-gray-600">4 × NVIDIA T4 GPUs for AI model training/inference</p>
                <p className="text-xs text-gray-600">Weekly model retraining with 3-year historical data</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">🌐</span>
              <div>
                <p className="font-medium">CDN: Enterprise tier (1000+ locations)</p>
                <p className="text-xs text-gray-600">Smart routing with AI-powered optimization</p>
                <p className="text-xs text-gray-600">Advanced DDoS (100Gbps+) and zero-trust security</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Storage & Bandwidth */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h5 className="font-semibold mb-3 text-orange-900">Storage & Bandwidth (Years 4-5)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">📁</span>
              <div>
                <p className="font-medium">File Storage: 5TB allocated (multi-region)</p>
                <p className="text-xs text-gray-600">Projected usage: ~3TB, supports 5M+ document uploads</p>
                <p className="text-xs text-gray-600">Blockchain storage: +5GB for immutable records</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">📤</span>
              <div>
                <p className="font-medium">Bandwidth: 50TB/month included</p>
                <p className="text-xs text-gray-600">Projected usage: ~30TB/month (global API + streaming)</p>
                <p className="text-xs text-gray-600">99% CDN cache hit rate reduces origin load by 95%</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">💰</span>
              <div>
                <p className="font-medium">Infrastructure Cost: R150,000/month</p>
                <p className="text-xs text-gray-600">Compute: R80K, DB: R40K, Storage: R15K, ML: R15K = R1.8M/year</p>
                <p className="text-xs text-gray-600">+650% increase from Year 2-3 for 20x global capacity</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">📊</span>
              <div>
                <p className="font-medium">Monitoring: Enterprise observability platform</p>
                <p className="text-xs text-gray-600">Full-stack monitoring with AI anomaly detection</p>
                <p className="text-xs text-gray-600">Distributed tracing across all microservices</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Advanced Features */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <h5 className="font-semibold mb-3 text-indigo-900">Advanced Features (Years 4-5)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">🤖</span>
              <div>
                <p className="font-medium">AI/ML Capabilities</p>
                <p className="text-xs text-gray-600">BERT-based NLP for 99%+ item matching accuracy</p>
                <p className="text-xs text-gray-600">LSTM price forecasting (6-month predictions, 85%+ accuracy)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">⛓️</span>
              <div>
                <p className="font-medium">Blockchain Infrastructure</p>
                <p className="text-xs text-gray-600">Hyperledger Fabric private network (3 validator nodes)</p>
                <p className="text-xs text-gray-600">Smart contracts for tender awards & supplier verification</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">🔌</span>
              <div>
                <p className="font-medium">Integration Platform (iPaaS)</p>
                <p className="text-xs text-gray-600">Kafka message queue (10-node cluster, 1M msg/sec)</p>
                <p className="text-xs text-gray-600">200+ pre-built connectors (SAP, Oracle, Procore, etc.)</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">🌍</span>
              <div>
                <p className="font-medium">Global Compliance</p>
                <p className="text-xs text-gray-600">Multi-currency (6 currencies), multi-language (4 languages)</p>
                <p className="text-xs text-gray-600">POPIA, GDPR, SOC 2 Type II compliant</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Scalability Metrics */}
        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
          <h5 className="font-semibold mb-3 text-cyan-900">Scalability Metrics (Years 4-5)</h5>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">🌍</span>
              <div>
                <p className="font-medium">Geographic Coverage</p>
                <p className="text-xs text-gray-600">5 regions: South Africa, Nigeria, Kenya, Ghana, Botswana</p>
                <p className="text-xs text-gray-600">Data residency compliance in each country</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">🏪</span>
              <div>
                <p className="font-medium">Supplier Network</p>
                <p className="text-xs text-gray-600">50+ suppliers across Africa (10 per major country)</p>
                <p className="text-xs text-gray-600">Real-time catalog sync for 20M+ construction items</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">📈</span>
              <div>
                <p className="font-medium">Transaction Volume</p>
                <p className="text-xs text-gray-600">1M+ bills processed per year (2,700+ per day)</p>
                <p className="text-xs text-gray-600">100K+ active users, 5M+ API calls per day</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">💼</span>
              <div>
                <p className="font-medium">Market Position</p>
                <p className="text-xs text-gray-600">Pan-African market leader in construction billing</p>
                <p className="text-xs text-gray-600">Enterprise clients: Top 100 African construction firms</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Long-term Summary */}
      <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-4">
        <p className="text-sm font-semibold text-purple-900 mb-3">🚀 Long-term Infrastructure Summary (Years 4-5)</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs text-purple-800">
          <div>
            <p className="font-medium">Database Scale:</p>
            <p>150GB → 1TB (+567%)</p>
            <p className="text-xs text-gray-600 mt-1">50+ suppliers, 20M+ items</p>
          </div>
          <div>
            <p className="font-medium">User Capacity:</p>
            <p>5K → 100K concurrent (+1,900%)</p>
            <p className="text-xs text-gray-600 mt-1">Multi-region, 100+ instances</p>
          </div>
          <div>
            <p className="font-medium">Processing Speed:</p>
            <p>3 min → 90 sec per bill (-50%)</p>
            <p className="text-xs text-gray-600 mt-1">AI-powered, GPU acceleration</p>
          </div>
          <div>
            <p className="font-medium">Geographic Reach:</p>
            <p>1 country → 5 countries</p>
            <p className="text-xs text-gray-600 mt-1">Pan-African deployment</p>
          </div>
          <div>
            <p className="font-medium">Monthly Cost:</p>
            <p>R20K → R150K (+650%)</p>
            <p className="text-xs text-gray-600 mt-1">R1.8M/year enterprise infra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
