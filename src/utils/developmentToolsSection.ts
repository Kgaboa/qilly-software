import { Paragraph, TextRun, HeadingLevel } from 'docx';

export function getDevelopmentToolsSection() {
  return [
    new Paragraph({
      text: "1.4 Development & Testing Tools Ecosystem",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      text: "This comprehensive toolkit ensures code quality, rapid development, and 100% pricing accuracy.",
      spacing: { after: 200 },
    }),

    // ===== DEVELOPMENT TOOLS =====
    new Paragraph({
      children: [
        new TextRun({ text: "A. Development Environment & Code Editors", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Visual Studio Code (VS Code):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Industry-standard code editor (70% market share among developers)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Built-in TypeScript support, IntelliSense code completion",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Extensions: ESLint, Prettier, GitLens, React DevTools",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source, backed by Microsoft",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "WebStorm (Optional for Senior Developers):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Premium IDE with advanced refactoring tools",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Intelligent code analysis, built-in debugger",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: R1,200/dev/year (optional, not mandatory)",
      spacing: { after: 200 },
    }),

    // ===== VERSION CONTROL =====
    new Paragraph({
      children: [
        new TextRun({ text: "B. Version Control & Collaboration", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Git + GitHub:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Git: Distributed version control system (industry standard)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• GitHub: Cloud repository hosting, code reviews, pull requests",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Branch Protection: Main branch requires 2 code reviews before merge",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• GitHub Actions: Built-in CI/CD pipelines (free for public repos, R500/month for private)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Code Ownership: Client gets full access to private repository",
      spacing: { after: 200 },
    }),

    // ===== TESTING TOOLS =====
    new Paragraph({
      children: [
        new TextRun({ text: "C. Testing Framework (Multi-Layer Approach)", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "1. Unit & Integration Testing:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Jest:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• JavaScript testing framework by Meta/Facebook",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Zero-config setup, lightning-fast parallel test execution",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Snapshot testing for UI components, code coverage reports",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Target: 80%+ code coverage",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "React Testing Library:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Test React components the way users interact with them",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Focus on behavior over implementation details",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Example: Test 'Does BOQ upload button exist and is clickable?'",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Vitest (Alternative to Jest):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Modern test runner 10x faster than Jest for Vite projects",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Jest-compatible API (easy migration if needed)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Decision: Will be made in Sprint 1 based on project setup",
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "2. End-to-End (E2E) Testing:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Playwright (Primary Recommendation):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cross-browser testing: Chrome, Firefox, Safari, Edge",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated user flows: Login → Upload BOQ → Price → Export → Download",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Visual regression testing (detect UI changes)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Built-in video recording & screenshots on test failures",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source by Microsoft",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Cypress (Backup Option):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Developer-friendly E2E testing with time-travel debugging",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Real-time test execution preview",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free for local testing, R1,500/month for cloud parallelization (optional)",
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "3. Performance Testing:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Lighthouse (Google):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated audits for performance, accessibility, SEO",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Targets: 90+ performance score, <3 second page load",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, built into Chrome DevTools",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "k6 (Load Testing):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Simulate 100+ concurrent users pricing BOQs",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Validate: 500 items priced in <5 minutes (100% accuracy)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "WebPageTest:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Real-world performance testing from multiple SA locations (Cape Town, Johannesburg)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Waterfall charts showing resource load times",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free",
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "4. Security Testing:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Snyk:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated vulnerability scanning for npm dependencies",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Detects known security issues (SQL injection, XSS vulnerabilities)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Auto-generates pull requests to fix vulnerabilities",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free for open-source, R800/month for private repos",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "OWASP ZAP (Zed Attack Proxy):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Penetration testing tool for web applications",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated security scans before production deployments",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source by OWASP Foundation",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "SonarQube (Code Quality & Security):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Static code analysis: Detect bugs, code smells, security hotspots",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Enforce coding standards, track technical debt",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free Community Edition, R2,000/month for advanced features (optional)",
      spacing: { after: 200 },
    }),

    // ===== CODE QUALITY =====
    new Paragraph({
      children: [
        new TextRun({ text: "D. Code Quality & Formatting", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "ESLint:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• JavaScript/TypeScript linter, catches bugs before runtime",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Enforces code style rules (no unused variables, consistent naming)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Blocks pull requests if linting fails",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Prettier:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Opinionated code formatter (consistent indentation, spacing)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Auto-formats code on save (no manual formatting debates)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Integrated with VS Code, runs on every commit",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Husky + lint-staged:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Git hooks: Run ESLint + Prettier automatically before every commit",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Prevents bad code from entering the repository",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 200 },
    }),

    // ===== MONITORING & DEBUGGING =====
    new Paragraph({
      children: [
        new TextRun({ text: "E. Monitoring, Error Tracking & Debugging", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Sentry:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Real-time error tracking & crash reporting",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Instant Slack notifications when errors occur in production",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Detailed stack traces showing exact line of code causing error",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Performance monitoring (API latency, slow database queries)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: Free for 5K errors/month, R1,500/month for production volume",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "LogRocket (Optional):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Session replay: Watch video recordings of user sessions",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• See exactly what user did before encountering error",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Network logs, console logs, Redux state changes",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: R3,000/month (optional, recommended for complex bugs)",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "React DevTools:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Browser extension for debugging React components",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Inspect component props, state, context",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Performance profiler to identify slow renders",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, by Meta/Facebook",
      spacing: { after: 200 },
    }),

    // ===== DESIGN TOOLS =====
    new Paragraph({
      children: [
        new TextRun({ text: "F. Design & Prototyping", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Figma:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Collaborative UI/UX design tool (cloud-based)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Designers create mockups, developers inspect CSS values",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Real-time collaboration (client can comment on designs)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: Free for 3 projects, R650/designer/month for unlimited",
      spacing: { after: 200 },
    }),

    // ===== PROJECT MANAGEMENT =====
    new Paragraph({
      children: [
        new TextRun({ text: "G. Project Management & Collaboration", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Jira (Agile Project Management):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Sprint planning, user story tracking, burn-down charts",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Custom workflows (To Do → In Progress → Code Review → Done)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Integrates with GitHub (auto-close tickets on PR merge)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: Free for 10 users, R400/user/month after",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Confluence (Documentation):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Team wiki for technical docs, architecture decisions, meeting notes",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Templates: API specs, deployment guides, onboarding docs",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Searchable knowledge base",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: Free for 10 users, bundled with Jira",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Slack (Team Communication):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Real-time chat for daily standups, quick questions",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Channels: #dev-team, #qa, #client-feedback, #prod-alerts",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Integrations: GitHub notifications, Sentry alerts, Jira updates",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: Free for 90-day message history, R450/user/month for unlimited",
      spacing: { after: 200 },
    }),

    // ===== CI/CD =====
    new Paragraph({
      children: [
        new TextRun({ text: "H. CI/CD & DevOps", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "GitHub Actions:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Automated workflows: On every push → Run tests → Build → Deploy",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• YAML-based configuration, 2000 free minutes/month",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Parallelized test execution (run 10 tests simultaneously)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Cost: Free for open-source, R500/month for private repos",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Docker (Containerization):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Package application + dependencies into containers",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Ensures dev/staging/production environments are identical",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 200 },
    }),

    // ===== DOCUMENTATION =====
    new Paragraph({
      children: [
        new TextRun({ text: "I. Documentation Generation", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Storybook:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Interactive component library (living style guide)",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Developers/designers can preview all UI components in isolation",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Auto-generates documentation from React prop types",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "TypeDoc:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Auto-generates API documentation from TypeScript code comments",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Searchable HTML documentation site",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Free, open-source",
      spacing: { after: 200 },
    }),

    // ===== COST SUMMARY =====
    new Paragraph({
      children: [
        new TextRun({ text: "J. Estimated Tool Costs (5 Years)", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Free/Open-Source Tools (R0):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "VS Code, Git, Jest, Playwright, ESLint, Prettier, Lighthouse, k6, React DevTools, Docker, Storybook",
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Required Paid Tools:", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• GitHub (Private Repos): R500/month × 60 months = R30K",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Sentry (Error Tracking): R1,500/month × 60 months = R90K",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Figma (2 designers): R1,300/month × 24 months = R31K",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Jira + Confluence (10 users): R400/user/month × 10 × 60 = R240K (already in infrastructure)",
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Subtotal Required: R151K", bold: true }),
      ],
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "Optional Tools (Recommended):", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• LogRocket (Session Replay): R3,000/month × 12 months (Year 1 only) = R36K",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Snyk (Security): R800/month × 60 months = R48K",
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "• Slack (Unlimited History): R450/user × 10 × 60 = R270K",
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Subtotal Optional: R354K", bold: true }),
      ],
      spacing: { after: 150 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "TOTAL 5-YEAR TOOL COSTS: R151K - R505K", bold: true }),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      text: "(Already included in R200K-R670K infrastructure budget)",
      spacing: { after: 200 },
    }),

    // ===== WHY THESE TOOLS =====
    new Paragraph({
      children: [
        new TextRun({ text: "K. Why This Tool Stack?", bold: true }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: "✓ Industry Standard:", bold: true }),
        new TextRun(" All tools used by Fortune 500 companies (proven at scale)"),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "✓ Automation First:", bold: true }),
        new TextRun(" 80% of testing automated (faster releases, fewer bugs)"),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "✓ Cost-Effective:", bold: true }),
        new TextRun(" 60% of tools are free/open-source (R151K-R505K vs R2M+ for enterprise alternatives)"),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "✓ Quality Assurance:", bold: true }),
        new TextRun(" Multi-layer testing catches 95%+ of bugs before production"),
      ],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "✓ Developer Productivity:", bold: true }),
        new TextRun(" Integrated toolchain saves 10+ hours/week per developer"),
      ],
      spacing: { after: 50 },
    }),
  ];
}
