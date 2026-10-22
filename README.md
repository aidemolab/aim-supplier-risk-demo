# Supplier Risk Scoring Dashboard

> **Supplier Risk Scoring Dashboard — interactive AI demo by AIM Smart Solutions. Demonstration data only.**

An enterprise-grade procurement intelligence and supplier risk evaluation platform. This interactive demo visualizes multi-factor supplier vulnerability matrices, automates risk tiering, and suggests actionable mitigation strategies.

---

## 🌟 Key Features

- **Multi-Factor Risk Scoring Engine**: Evaluates suppliers across 5 critical dimensions:
  - **Financial Stability**: Liquidity ratios, debt-to-equity, credit trajectory.
  - **Operational Reliability**: On-time in-full (OTIF) rates, lead-time variance, defect margins.
  - **Geopolitical & Location Exposure**: Regional unrest, trade corridor bottlenecks, tariff instability.
  - **ESG & Compliance**: Regulatory penalties, labor audit compliance, environmental scores.
  - **Cyber & IT Resilience**: Security audit frequency, incident history.
- **Executive KPI Metrics**: Real-time rollups for Total At-Risk Spend, Critical Risk Supplier count, Average Risk Index, and Tier Distribution.
- **Interactive Matrix & Filtering**: Filter suppliers seamlessly by risk classification (Low, Medium, High, Critical), product category, geographic origin, and search keywords.
- **Supplier Deep-Dive Inspection**: Expandable records and detailed inspection view breaking down metric scores, historical score trends, key vulnerability drivers, and audit histories.
- **Automated AI Mitigation Playbooks**: Tailored mitigation action plans (dual-sourcing strategies, buffer inventory targets, contract renegotiation prompts).
- **Export & Reporting**: Instant export of filtered risk matrices to CSV for procurement audits and leadership presentations.
- **Dark & Light Mode Support**: Precision UI designed for high-density analytical procurement workflows.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or later
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aidemolab/aim-supplier-risk-demo.git
   cd aim-supplier-risk-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   > *Note:* The application runs out of the box with built-in demonstration data. API keys in `.env` are optional placeholders for extended Gemini AI integration.

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the port indicated in your terminal).

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Privacy

- **No Secrets**: This codebase contains no API keys, credentials, or proprietary tokens.
- **Demonstration Data Only**: All supplier profiles, risk scores, names, and procurement metrics are synthesized for demo and simulation purposes.
- **Environment Exclusions**: `.env` files are strictly excluded via `.gitignore`.

---

## 📄 License

Demonstration prototype created by **AIM Smart Solutions**. Demonstration data only.
