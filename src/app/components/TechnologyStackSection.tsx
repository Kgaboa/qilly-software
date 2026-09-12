import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2, Code, Database, Cloud, TestTube, Target, CreditCard, ArrowUp } from 'lucide-react';

export function TechnologyStackSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <Card id="tech-stack" className="border-[#00b4d8] border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Code className="h-6 w-6 text-[#00b4d8]" />
          1. RECOMMENDED TECHNOLOGY STACK
        </CardTitle>
        <CardDescription>Modern, scalable, and future-proof technologies for enterprise construction billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* 1.1 Frontend Technologies */}
          <div>
            <h3 className="text-xl font-semibold text-[#00b4d8] mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              1.1 Frontend Technologies
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#00b4d8]">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  React 18 (JavaScript Library)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 ml-7">
                  <li>• Modern, component-based UI framework with massive community support</li>
                  <li>• Lightning-fast rendering with virtual DOM optimization</li>
                  <li>• Extensive ecosystem: 2M+ npm packages, 200K+ StackOverflow questions</li>
                  <li>• Easy to find React developers in South Africa (largest talent pool)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#00b4d8]">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  TypeScript (Type-Safe JavaScript)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 ml-7">
                  <li>• Catch bugs at compile-time (before code runs) = fewer production errors</li>
                  <li>• Improved code readability and maintainability for long-term project</li>
                  <li>• Industry standard for enterprise applications (Microsoft, Google, Airbnb)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#00b4d8]">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Tailwind CSS v4 (Utility-First CSS)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 ml-7">
                  <li>• Rapid UI development with pre-built utility classes</li>
                  <li>• Consistent design system (blue #00b4d8 branding maintained across app)</li>
                  <li>• Mobile-responsive by default (critical for construction site access)</li>
                  <li>• Smaller CSS bundle size = faster page loads</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 1.2 Backend & Database */}
          <div>
            <h3 className="text-xl font-semibold text-[#00b4d8] mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              1.2 Backend & Database
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#00b4d8]">
              <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Supabase (PostgreSQL Database + Backend-as-a-Service)
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 ml-7">
                <li>• Open-source Firebase alternative (no vendor lock-in)</li>
                <li>• Built-in authentication: Email/password, social logins, magic links</li>
                <li>• Row-level security (RLS) for data protection (POPI Act compliance)</li>
                <li>• Automatic API generation from database schema (saves development time)</li>
                <li>• Realtime subscriptions for live updates (future feature: collaborative pricing)</li>
                <li>• PostgreSQL = industry-standard relational database with 30+ years of maturity</li>
              </ul>
            </div>
          </div>

          {/* 1.3 Hosting & Infrastructure */}
          <div>
            <h3 className="text-xl font-semibold text-[#00b4d8] mb-4 flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              1.3 Hosting & Infrastructure
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#00b4d8]">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Vercel (Frontend Hosting)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 ml-7">
                  <li>• Automatic deployments from GitHub (every push = instant preview)</li>
                  <li>• Global CDN: 300+ edge locations worldwide = &lt;50ms load times</li>
                  <li>• Built-in SSL certificates, DDoS protection, automatic scaling</li>
                  <li>• Zero-downtime deployments with instant rollback capability</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#00b4d8]">
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  AWS S3 (File Storage for BOQ uploads)
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 ml-7">
                  <li>• 99.999999999% durability (11 nines) - uploaded BOQs never lost</li>
                  <li>• Cost-effective storage: R0.023 per GB/month</li>
                  <li>• Versioning enabled: recover previous versions of uploaded files</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 1.4 Development & Testing Tools */}
          <div>
            <h3 className="text-xl font-semibold text-[#00b4d8] mb-4 flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              1.4 Development & Testing Tools Ecosystem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                <h4 className="font-semibold mb-2">Testing Framework</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <span className="font-medium">Jest</span> - Unit & integration testing</li>
                  <li>• <span className="font-medium">Playwright</span> - E2E browser testing</li>
                  <li>• <span className="font-medium">k6</span> - Performance & load testing</li>
                  <li>• <span className="font-medium">Lighthouse</span> - Performance audits</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                <h4 className="font-semibold mb-2">Security Testing</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <span className="font-medium">Snyk</span> - Vulnerability scanning</li>
                  <li>• <span className="font-medium">OWASP ZAP</span> - Penetration testing</li>
                  <li>• <span className="font-medium">SonarQube</span> - Code quality & security</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                <h4 className="font-semibold mb-2">Code Quality</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <span className="font-medium">ESLint</span> - JavaScript/TypeScript linter</li>
                  <li>• <span className="font-medium">Prettier</span> - Code formatter</li>
                  <li>• <span className="font-medium">Husky</span> - Git hooks automation</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
                <h4 className="font-semibold mb-2">Monitoring & Debugging</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <span className="font-medium">Sentry</span> - Real-time error tracking</li>
                  <li>• <span className="font-medium">LogRocket</span> - Session replay (optional)</li>
                  <li>• <span className="font-medium">React DevTools</span> - Component debugging</li>
                </ul>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-600">
                <h4 className="font-semibold mb-2">Project Management</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <span className="font-medium">Jira</span> - Agile project management</li>
                  <li>• <span className="font-medium">Confluence</span> - Documentation wiki</li>
                  <li>• <span className="font-medium">Slack</span> - Team communication</li>
                </ul>
              </div>

              <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-600">
                <h4 className="font-semibold mb-2">CI/CD & DevOps</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <span className="font-medium">GitHub Actions</span> - Automated workflows</li>
                  <li>• <span className="font-medium">Docker</span> - Containerization</li>
                  <li>• <span className="font-medium">Figma</span> - UI/UX design</li>
                </ul>
              </div>
            </div>

            {/* Tool Costs Summary */}
            <div className="bg-gradient-to-r from-[#00b4d8]/10 to-[#0077b6]/10 rounded-lg p-6 mt-4">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#00b4d8]" />
                5-Year Tool Costs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Free/Open-Source</p>
                  <p className="text-2xl font-bold text-green-600">R 0</p>
                  <p className="text-xs text-gray-500 mt-1">60% of tools</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Required Paid Tools</p>
                  <p className="text-2xl font-bold text-[#00b4d8]">R 151K</p>
                  <p className="text-xs text-gray-500 mt-1">GitHub, Sentry, Figma</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Optional Tools</p>
                  <p className="text-2xl font-bold text-orange-600">R 354K</p>
                  <p className="text-xs text-gray-500 mt-1">LogRocket, Snyk, Slack</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3">
                <span className="font-semibold">Total: R 151K - R 505K</span> (included in infrastructure budget)
              </p>
            </div>
          </div>

          {/* 1.5 Why These Technologies? */}
          <div>
            <h3 className="text-xl font-semibold text-[#00b4d8] mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              1.5 Why These Technologies?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Future-Proof</p>
                  <p className="text-xs text-gray-600">All technologies backed by major companies (Meta, Microsoft)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Developer Availability</p>
                  <p className="text-xs text-gray-600">Largest talent pool in South Africa - easy to hire replacements</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Cost-Effective</p>
                  <p className="text-xs text-gray-600">Open-source stack = no licensing fees (R151K-R505K tools vs R2M+ enterprise)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Proven at Scale</p>
                  <p className="text-xs text-gray-600">Used by Netflix, Airbnb, Uber - battle-tested for millions of users</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Security</p>
                  <p className="text-xs text-gray-600">Enterprise-grade security (SSL/TLS, row-level security, POPI Act compliance)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Automation First</p>
                  <p className="text-xs text-gray-600">80% of testing automated (faster releases, 95%+ bug detection)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={scrollToTop} 
            variant="outline" 
            className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Back to Top
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}