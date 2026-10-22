import { useState, useMemo, Fragment } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  DollarSign, 
  AlertOctagon, 
  Info, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Building2, 
  FileText, 
  Activity, 
  Filter, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define structures for the supplier application
interface Supplier {
  id: string;
  name: string;
  category: string;
  country: string;
  spend: number;
  delivery: number; // e.g. 97
  quality: number; // e.g. 9.2
  priceCompetitiveness: 'High' | 'Medium' | 'Low';
  dependencyRisk: 'High' | 'Medium' | 'Low';
  contractExpiry: number; // months
  incidents: number;
  flags: string[];
  notes: string;
}

// Raw dataset as defined in the rules
const SUPPLIERS_DATA: Supplier[] = [
  {
    id: "S001",
    name: "Hartwell Components",
    category: "Electronics",
    country: "UK",
    spend: 320000,
    delivery: 97,
    quality: 9.2,
    priceCompetitiveness: "High",
    dependencyRisk: "High",
    contractExpiry: 8,
    incidents: 0,
    flags: ["High dependency", "Contract expiring soon"],
    notes: "Primary supplier for core electronics. Excellent delivery and quality. However single-source dependency and contract expiry in 8 months creates significant risk. Renewal negotiations should begin immediately."
  },
  {
    id: "S002",
    name: "Meridian Packaging",
    category: "Packaging",
    country: "Germany",
    spend: 185000,
    delivery: 94,
    quality: 8.7,
    priceCompetitiveness: "High",
    dependencyRisk: "Medium",
    contractExpiry: 18,
    incidents: 1,
    flags: [],
    notes: "Strong performer with one minor quality incident resolved quickly. Good price competitiveness. Contract has 18 months remaining. Low overall risk."
  },
  {
    id: "S003",
    name: "Apex Textiles",
    category: "Clothing",
    country: "Bangladesh",
    spend: 240000,
    delivery: 78,
    quality: 7.1,
    priceCompetitiveness: "Medium",
    dependencyRisk: "Medium",
    contractExpiry: 4,
    incidents: 4,
    flags: ["Poor delivery", "Multiple incidents", "Contract expiring"],
    notes: "Delivery performance has dropped significantly over the past year. Four quality incidents recorded. Contract expires in 4 months. Needs urgent performance review before renewal decision."
  },
  {
    id: "S004",
    name: "Sterling Logistics",
    category: "Logistics",
    country: "UK",
    spend: 410000,
    delivery: 91,
    quality: 8.4,
    priceCompetitiveness: "Medium",
    dependencyRisk: "High",
    contractExpiry: 12,
    incidents: 2,
    flags: ["High dependency", "Above average incidents"],
    notes: "Highest spend supplier. Single-source logistics provider. Two incidents in past year. High dependency risk. Contract has 12 months remaining. Alternative provider identification recommended."
  },
  {
    id: "S005",
    name: "Nova Print Solutions",
    category: "Print and Marketing",
    country: "UK",
    spend: 95000,
    delivery: 99,
    quality: 9.5,
    priceCompetitiveness: "High",
    dependencyRisk: "Low",
    contractExpiry: 24,
    incidents: 0,
    flags: [],
    notes: "Exceptional delivery and quality scores. Low dependency risk. Competitive pricing. Contract has 24 months remaining. Strong and stable supplier relationship."
  },
  {
    id: "S006",
    name: "Eastern Raw Materials",
    category: "Raw Materials",
    country: "China",
    spend: 175000,
    delivery: 82,
    quality: 6.8,
    priceCompetitiveness: "Low",
    dependencyRisk: "Medium",
    contractExpiry: 3,
    incidents: 5,
    flags: ["Poor delivery", "Low quality rating", "Multiple incidents", "Contract expiring", "Geopolitical risk"],
    notes: "Below acceptable delivery threshold. Quality rating is below minimum standard of 7.0. Five incidents in 12 months. Contract expires in 3 months. Geopolitical supply chain risk. Urgent replacement sourcing required."
  },
  {
    id: "S007",
    name: "Pinnacle Tech Parts",
    category: "Electronics",
    country: "Taiwan",
    spend: 155000,
    delivery: 88,
    quality: 7.9,
    priceCompetitiveness: "Medium",
    dependencyRisk: "Medium",
    contractExpiry: 14,
    incidents: 1,
    flags: ["Geopolitical risk"],
    notes: "Good overall performance with one incident. Medium dependency. However geopolitical risk from Taiwan supply chain should be monitored. Contract has 14 months remaining."
  }
];

// Deductions interface
interface Deductions {
  delivery: number;
  quality: number;
  incidents: number;
  expiry: number;
  dependency: number;
  geopolitical: number;
}

// Recommended Action helper mapping
function getAction(id: string): string {
  switch (id) {
    case "S001": return "Prioritise for contract renewal";
    case "S002": return "Maintain relationship";
    case "S003": return "Urgent performance review required";
    case "S004": return "Identify backup supplier";
    case "S005": return "Consider expanding scope";
    case "S006": return "Begin replacement sourcing immediately";
    case "S007": return "Schedule performance review";
    default: return "Maintain relationship";
  }
}

// Risk Flag detailed explanation mapping
function getFlagExplanation(flag: string): string {
  switch (flag.trim().toLowerCase()) {
    case "high dependency":
      return "Single-source provider poses serious failure point vulnerability.";
    case "contract expiring soon":
      return "Contract finishes in 8 months. Negotiations should begin immediately.";
    case "poor delivery":
      return "Average on-time shipment logs dropped below acceptable levels.";
    case "multiple incidents":
      return "Substantial quality or operational failure triggers in the past year.";
    case "contract expiring":
      return "Contract ends in <=4 months, requiring immediate exit or renewal path.";
    case "above average incidents":
      return "Elevated frequency of operational hiccups requires close supervision.";
    case "low quality rating":
      return "Product quality audit score fell below acceptable minimum of 7.0.";
    case "geopolitical risk":
      return "Sensitive regional operations pose elevated political & transport risk.";
    default:
      return "Potential disruption vector requires close supply chain monitoring.";
  }
}

// Comprehensive custom AI recommendations matching notes & rules
const AI_RECOMMENDATIONS: Record<string, string> = {
  S001: "Hartwell Components maintains highly robust operations, featuring 97% on-time delivery and an outstanding 9.2 quality index. However, the organization is highly vulnerable to this single-source electronics relationship. With the contract expiring in 8 months, we recommend initiating contract renewal negotiations immediately, while concurrently drafting a secondary sourcing strategy to diversify core components and mitigate high dependency risk.",
  S002: "Meridian Packaging represents a highly stable and low-risk partner. Scoring an overall health index of 77 and having successfully resolved its sole minor quality incident, this partnership is in a very healthy state. With 18 months remaining on the contract, we recommend maintaining the current operational scale and conducting routine quarterly checks to ensure packaging costs and delivery windows remain stable.",
  S003: "Apex Textiles is in a critical risk state, scoring only 25 on our health scale. This severe drop-off is driven by a poor on-time delivery rate of 78% and four active quality incidents, compounded by an impending contract expiry in just 4 months. We recommend initiating an urgent, mandatory performance audit with their leadership team before any renewal discussions. Identifying backup apparel suppliers should commence concurrently to prevent immediate supply line disruptions.",
  S004: "Sterling Logistics is our highest-spend supplier and single-source logistics provider. Its current health score of 65 is hampered by two shipping incidents in the past year and a 91% on-time delivery rate. Given its pivotal role, we advise scheduling a structured performance review to address delivery slippage, while actively identifying alternative logistics providers to diversify transport channels before the 12-month contract window closes.",
  S005: "Nova Print Solutions is our top-performing supplier, achieving a perfect 100 health score. Its flawless delivery record (99%) and supreme quality rating (9.5) make it an ideal candidate for strategic expansion. With 24 months remaining on their contract, we recommend consolidating print and marketing requirements from smaller, less efficient vendors into Nova's portfolio to leverage bulk pricing advantages.",
  S006: "Eastern Raw Materials presents an unacceptable threat to raw material continuity, holding our lowest health score of 17. Extreme delivery slippage (82%), substandard quality (6.8), five incidents in 12 months, and major geopolitical exposure (China) require immediate action. The contract expires in 3 months; we recommend freezing renewal plans and shifting all supply volume to alternative sources immediately.",
  S007: "Pinnacle Tech Parts is performing reasonably well with an 88% delivery rate and 7.9 quality, but faces elevated geopolitical supply chain vulnerability due to its Taiwanese assembly locations. Given that 14 months remain on their contract, we suggest scheduling a performance review to establish localized inventory safety buffers, while continuing to monitor external risk factors."
};

// Risk summary maps for urgent / stable sections
const RISK_SUMMARIES: Record<string, string> = {
  S003: "Severe delivery degradation (78%) and 4 quality incidents with contract expiring in 4 months.",
  S006: "Critical quality (6.8) and delivery (82%) failures with 5 incidents and high geopolitical risk.",
  S001: "Strong operational performer (97% delivery, 9.2 quality) but carries high single-source dependency.",
  S002: "Consistent packaging supplier with healthy metrics and a stable 18-month contract horizon.",
  S005: "Flawless partner with 99% delivery, 9.5 quality, and zero risk flags."
};

// Compute individual supplier score & deductions
function runCalculations(supplier: Supplier): { score: number; deductions: Deductions; category: 'GREEN' | 'YELLOW' | 'RED' } {
  let score = 100;
  const deductions: Deductions = {
    delivery: 0,
    quality: 0,
    incidents: 0,
    expiry: 0,
    dependency: 0,
    geopolitical: 0,
  };

  // 1. Delivery
  if (supplier.delivery >= 95) {
    deductions.delivery = 0;
  } else if (supplier.delivery >= 90) {
    deductions.delivery = 5;
  } else if (supplier.delivery >= 80) {
    deductions.delivery = 15;
  } else {
    deductions.delivery = 25;
  }
  score -= deductions.delivery;

  // 2. Quality
  if (supplier.quality >= 9.0) {
    deductions.quality = 0;
  } else if (supplier.quality >= 8.0) {
    deductions.quality = 5;
  } else if (supplier.quality >= 7.0) {
    deductions.quality = 10;
  } else {
    deductions.quality = 20;
  }
  score -= deductions.quality;

  // 3. Incidents
  if (supplier.incidents === 0) {
    deductions.incidents = 0;
  } else if (supplier.incidents === 1) {
    deductions.incidents = 3;
  } else if (supplier.incidents <= 3) {
    deductions.incidents = 10;
  } else {
    deductions.incidents = 20;
  }
  score -= deductions.incidents;

  // 4. Expiry
  if (supplier.contractExpiry > 18) {
    deductions.expiry = 0;
  } else if (supplier.contractExpiry >= 12) {
    deductions.expiry = 5;
  } else if (supplier.contractExpiry >= 6) {
    deductions.expiry = 10;
  } else {
    deductions.expiry = 15;
  }
  score -= deductions.expiry;

  // 5. Dependency
  if (supplier.dependencyRisk === "Low") {
    deductions.dependency = 0;
  } else if (supplier.dependencyRisk === "Medium") {
    deductions.dependency = 5;
  } else {
    deductions.dependency = 10;
  }
  score -= deductions.dependency;

  // 6. Geopolitical risk
  const hasGeopolitical = supplier.flags.some(f => f.toLowerCase().includes("geopolitical"));
  if (hasGeopolitical) {
    deductions.geopolitical = 8;
    score -= 8;
  }

  // Cap / Floor
  score = Math.max(10, Math.min(100, score));
  const finalScore = Math.round(score);

  // Categorize based on rules
  let category: 'GREEN' | 'YELLOW' | 'RED' = 'YELLOW';
  const isGreen = 
    supplier.delivery >= 92 &&
    supplier.quality >= 8.0 &&
    supplier.incidents <= 1 &&
    supplier.contractExpiry > 6 &&
    finalScore >= 75;

  const isRed =
    supplier.delivery < 80 ||
    supplier.quality < 7.0 ||
    supplier.incidents >= 4 ||
    supplier.contractExpiry <= 3 ||
    finalScore < 50;

  if (isRed) {
    category = 'RED';
  } else if (isGreen) {
    category = 'GREEN';
  } else {
    category = 'YELLOW';
  }

  return {
    score: finalScore,
    deductions,
    category
  };
}

export default function App() {
  const [filter, setFilter] = useState<'ALL' | 'GREEN' | 'YELLOW' | 'RED'>('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Dynamic ranking and computation
  const suppliers = useMemo(() => {
    // Calculate details first
    const computed = SUPPLIERS_DATA.map(s => {
      const calc = runCalculations(s);
      return {
        ...s,
        healthScore: calc.score,
        deductions: calc.deductions,
        category: calc.category,
        action: getAction(s.id),
        aiAdvisor: AI_RECOMMENDATIONS[s.id] || "No strategic summary available.",
        riskSummary: RISK_SUMMARIES[s.id] || ""
      };
    });

    // Rank rule: Category (Green first, Yellow second, Red last), then score (highest first), then incidents (fewest first)
    const sorted = [...computed].sort((a, b) => {
      const order = { GREEN: 1, YELLOW: 2, RED: 3 };
      if (order[a.category] !== order[b.category]) {
        return order[a.category] - order[b.category];
      }
      if (b.healthScore !== a.healthScore) {
        return b.healthScore - a.healthScore;
      }
      return a.incidents - b.incidents;
    });

    // Assign rank 1-7
    return sorted.map((s, idx) => ({
      ...s,
      rank: idx + 1
    }));
  }, []);

  // Filtered suppliers for table display
  const filteredSuppliers = useMemo(() => {
    if (filter === 'ALL') return suppliers;
    return suppliers.filter(s => s.category === filter);
  }, [suppliers, filter]);

  // Aggregate stats (Calculated dynamically)
  const stats = useMemo(() => {
    const totalCount = suppliers.length;
    const greenCount = suppliers.filter(s => s.category === 'GREEN').length;
    const yellowCount = suppliers.filter(s => s.category === 'YELLOW').length;
    const redCount = suppliers.filter(s => s.category === 'RED').length;
    const totalSpend = suppliers.reduce((acc, curr) => acc + curr.spend, 0);

    return {
      totalCount,
      greenCount,
      yellowCount,
      redCount,
      totalSpend
    };
  }, [suppliers]);

  // Format currency GBP helper
  const formatGBP = (num: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleRowClick = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1d27] font-sans antialiased selection:bg-[#3b82f6]/10 selection:text-[#3b82f6]">
      {/* Top Professional Header Bar */}
      <header className="border-b border-[#e2e8f0] py-6 px-6 md:px-8 bg-white" id="dashboard-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="h-5 w-5 text-[#3b82f6]" />
              <span className="text-xs font-semibold tracking-wider text-[#3b82f6] uppercase">Procurement Analytics Suite</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a1d27] tracking-tight">Supplier Risk Scoring Dashboard</h1>
            <p className="text-sm text-[#6b7280] mt-0.5">AI-powered supplier performance analysis and procurement risk assessment tool</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f4f6f9] text-[#1a1d27] border border-[#e2e8f0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#166534]"></span>
              Live Database Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8" id="dashboard-main">
        {/* KPI Row */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="kpi-cards">
          <div className="bg-[#f4f6f9] border border-[#e2e8f0] p-5 rounded-xl flex flex-col justify-between" id="kpi-total-suppliers">
            <div className="flex justify-between items-center text-[#6b7280] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Suppliers</span>
              <Building2 className="h-4 w-4 text-[#6b7280]" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1d27]">{stats.totalCount}</span>
              <span className="block text-[11px] text-[#6b7280] mt-1">Portfolio active vendors</span>
            </div>
          </div>

          <div className="bg-[#f4f6f9] border border-[#e2e8f0] p-5 rounded-xl flex flex-col justify-between" id="kpi-green">
            <div className="flex justify-between items-center text-[#6b7280] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Low Risk (Green)</span>
              <ShieldCheck className="h-4 w-4 text-[#166534]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#166534]">{stats.greenCount}</span>
                <span className="text-xs text-[#166534] font-medium bg-[#dcfce7] px-1.5 py-0.5 rounded">Stable</span>
              </div>
              <span className="block text-[11px] text-[#6b7280] mt-1">Healthy performance profiles</span>
            </div>
          </div>

          <div className="bg-[#f4f6f9] border border-[#e2e8f0] p-5 rounded-xl flex flex-col justify-between" id="kpi-yellow">
            <div className="flex justify-between items-center text-[#6b7280] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Monitor (Yellow)</span>
              <AlertTriangle className="h-4 w-4 text-[#854d0e]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#854d0e]">{stats.yellowCount}</span>
                <span className="text-xs text-[#854d0e] font-medium bg-[#fef9c3] px-1.5 py-0.5 rounded">Alert</span>
              </div>
              <span className="block text-[11px] text-[#6b7280] mt-1">Moderate risk / watch closely</span>
            </div>
          </div>

          <div className="bg-[#f4f6f9] border border-[#e2e8f0] p-5 rounded-xl flex flex-col justify-between" id="kpi-red">
            <div className="flex justify-between items-center text-[#6b7280] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">High Risk (Red)</span>
              <AlertOctagon className="h-4 w-4 text-[#991b1b]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#991b1b]">{stats.redCount}</span>
                <span className="text-xs text-[#991b1b] font-medium bg-[#fee2e2] px-1.5 py-0.5 rounded">Urgent</span>
              </div>
              <span className="block text-[11px] text-[#6b7280] mt-1">Immediate intervention needed</span>
            </div>
          </div>

          <div className="bg-[#f4f6f9] border border-[#e2e8f0] col-span-2 lg:col-span-1 p-5 rounded-xl flex flex-col justify-between" id="kpi-spend">
            <div className="flex justify-between items-center text-[#6b7280] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Annual Spend</span>
              <DollarSign className="h-4 w-4 text-[#3b82f6]" />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1d27]">{formatGBP(stats.totalSpend)}</span>
              <span className="block text-[11px] text-[#6b7280] mt-1">Portfolio aggregate value</span>
            </div>
          </div>
        </section>

        {/* Filters Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#f4f6f9] rounded-xl border border-[#e2e8f0]" id="filter-bar">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#6b7280]" />
            <span className="text-xs font-semibold text-[#1a1d27] tracking-wider uppercase">Filter Portfolio:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              id="btn-filter-all"
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                filter === 'ALL' 
                  ? 'bg-[#3b82f6] text-white shadow-sm' 
                  : 'bg-white hover:bg-[#f0f4ff] text-[#1a1d27] border border-[#e2e8f0]'
              }`}
            >
              All suppliers ({suppliers.length})
            </button>
            <button 
              id="btn-filter-green"
              onClick={() => setFilter('GREEN')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                filter === 'GREEN' 
                  ? 'bg-[#166534] text-white shadow-sm' 
                  : 'bg-white hover:bg-[#dcfce7]/50 text-[#166534] border border-[#e2e8f0]'
              }`}
            >
              Green ({suppliers.filter(s => s.category === 'GREEN').length})
            </button>
            <button 
              id="btn-filter-yellow"
              onClick={() => setFilter('YELLOW')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                filter === 'YELLOW' 
                  ? 'bg-[#854d0e] text-white shadow-sm' 
                  : 'bg-white hover:bg-[#fef9c3]/50 text-[#854d0e] border border-[#e2e8f0]'
              }`}
            >
              Yellow ({suppliers.filter(s => s.category === 'YELLOW').length})
            </button>
            <button 
              id="btn-filter-red"
              onClick={() => setFilter('RED')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                filter === 'RED' 
                  ? 'bg-[#991b1b] text-white shadow-sm' 
                  : 'bg-white hover:bg-[#fee2e2]/50 text-[#991b1b] border border-[#e2e8f0]'
              }`}
            >
              Red / urgent ({suppliers.filter(s => s.category === 'RED').length})
            </button>
          </div>
        </div>

        {/* Ranked Supplier Table Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden" id="suppliers-table-card">
          <div className="px-6 py-4 bg-[#f4f6f9] border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1d27]">Ranked Suppliers</h2>
              <p className="text-xs text-[#6b7280]">Ordered by risk classification hierarchy and Health Score metrics</p>
            </div>
            <span className="text-xs text-[#6b7280] font-mono">Showing {filteredSuppliers.length} of {suppliers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="supplier-risk-table">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f4f6f9]">
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-center w-12">Rank</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Supplier Name</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Category</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-center">Score</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-right">Annual Spend</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] min-w-[140px]">Health Score</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-center">OTD %</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-center">Quality</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] text-center">Expiry</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Risk Flags</th>
                  <th className="py-3.5 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">Recommended Action</th>
                  <th className="py-3.5 px-4 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => {
                  const isExpanded = expandedRow === supplier.id;
                  const isRed = supplier.category === 'RED';
                  const isYellow = supplier.category === 'YELLOW';
                  const isGreen = supplier.category === 'GREEN';

                  // Badge colors
                  const badgeClasses = isGreen
                    ? 'bg-[#dcfce7] text-[#166534] border-[#86efac]'
                    : isYellow
                    ? 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]'
                    : 'bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]';

                  return (
                    <Fragment key={supplier.id}>
                      <tr 
                        key={supplier.id}
                        id={`row-${supplier.id}`}
                        onClick={() => handleRowClick(supplier.id)}
                        className={`border-b border-[#e2e8f0] cursor-pointer transition-colors hover:bg-[#f0f4ff]/80 ${isExpanded ? 'bg-[#f0f4ff]/40' : 'bg-white'}`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 text-center font-semibold text-sm">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            supplier.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            supplier.rank === 2 ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                            supplier.rank === 3 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {supplier.rank}
                          </span>
                        </td>
                        {/* Name */}
                        <td className="py-4 px-4 font-semibold text-sm text-[#1a1d27]">
                          <div className="flex flex-col">
                            <span>{supplier.name}</span>
                            <span className="text-[10px] text-[#6b7280] font-mono uppercase mt-0.5">{supplier.id}</span>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="py-4 px-4 text-xs text-[#6b7280] font-medium">
                          {supplier.category}
                        </td>
                        {/* Score Badge */}
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClasses}`}>
                            {supplier.category}
                          </span>
                        </td>
                        {/* Spend */}
                        <td className="py-4 px-4 text-right font-semibold text-xs text-[#1a1d27]">
                          {formatGBP(supplier.spend)}
                        </td>
                        {/* Health Score + Mini Bar */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1.5 justify-center max-w-[120px]">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span>{supplier.healthScore}</span>
                              <span className="text-[10px] text-[#6b7280] font-normal">/ 100</span>
                            </div>
                            <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isGreen ? 'bg-green-600' : isYellow ? 'bg-amber-500' : 'bg-red-600'
                                }`}
                                style={{ width: `${supplier.healthScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        {/* Delivery */}
                        <td className="py-4 px-4 text-center font-medium text-xs text-[#1a1d27]">
                          <span className={`px-1.5 py-0.5 rounded ${supplier.delivery >= 92 ? 'text-green-700' : supplier.delivery >= 80 ? 'text-amber-700' : 'text-red-700'}`}>
                            {supplier.delivery}%
                          </span>
                        </td>
                        {/* Quality */}
                        <td className="py-4 px-4 text-center font-medium text-xs text-[#1a1d27]">
                          {supplier.quality.toFixed(1)} <span className="text-[10px] text-[#6b7280]">/ 10</span>
                        </td>
                        {/* Expiry */}
                        <td className="py-4 px-4 text-center text-xs font-semibold text-[#1a1d27]">
                          <span className={supplier.contractExpiry <= 3 ? 'text-red-600' : supplier.contractExpiry <= 6 ? 'text-amber-600' : 'text-[#1a1d27]'}>
                            {supplier.contractExpiry}m
                          </span>
                        </td>
                        {/* Risk Flags */}
                        <td className="py-4 px-4 max-w-[180px]">
                          {supplier.flags.length === 0 ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#dcfce7] text-[#166534] border border-[#86efac]">
                              None
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {supplier.flags.map((flag, i) => (
                                <span key={i} className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] truncate max-w-[120px]" title={flag}>
                                  {flag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        {/* Action badge */}
                        <td className="py-4 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
                            {supplier.action}
                          </span>
                        </td>
                        {/* Chevron Trigger */}
                        <td className="py-4 px-4 text-center">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-[#6b7280]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                          )}
                        </td>
                      </tr>

                      {/* Expandable Detail Panel */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <tr key={`expand-${supplier.id}`} id={`detail-row-${supplier.id}`} className="bg-[#f4f6f9]/60">
                            <td colSpan={12} className="p-0 border-b border-[#e2e8f0]">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 bg-[#f4f6f9] grid grid-cols-1 md:grid-cols-12 gap-6 text-sm text-[#1a1d27]">
                                  {/* Section 1: Demographics */}
                                  <div className="md:col-span-3 space-y-4 bg-white p-4 rounded-xl border border-[#e2e8f0]">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] border-b border-[#e2e8f0] pb-2">Supplier Profile</h3>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                                      <div className="text-[#6b7280]">Country:</div>
                                      <div className="font-semibold flex items-center gap-1 text-[#1a1d27]">
                                        <Globe className="h-3 w-3 text-[#3b82f6]" /> {supplier.country}
                                      </div>
                                      <div className="text-[#6b7280]">Dependency Risk:</div>
                                      <div className="font-semibold text-[#1a1d27]">
                                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                                          supplier.dependencyRisk === 'High' ? 'text-red-700 bg-red-50' : 
                                          supplier.dependencyRisk === 'Medium' ? 'text-amber-700 bg-amber-50' : 
                                          'text-green-700 bg-green-50'
                                        }`}>
                                          {supplier.dependencyRisk}
                                        </span>
                                      </div>
                                      <div className="text-[#6b7280]">Price Comp:</div>
                                      <div className="font-semibold text-[#1a1d27]">{supplier.priceCompetitiveness}</div>
                                      <div className="text-[#6b7280]">Incidents (12m):</div>
                                      <div className={`font-semibold ${supplier.incidents > 2 ? 'text-red-600 font-bold' : 'text-[#1a1d27]'}`}>
                                        {supplier.incidents} incidents
                                      </div>
                                      <div className="text-[#6b7280] pt-1">Spend Band:</div>
                                      <div className="font-semibold text-[#1a1d27] pt-1">{formatGBP(supplier.spend)}/yr</div>
                                    </div>
                                  </div>

                                  {/* Section 2: Health Score Calculation Breakdown */}
                                  <div className="md:col-span-4 space-y-3 bg-white p-4 rounded-xl border border-[#e2e8f0]">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] border-b border-[#e2e8f0] pb-2">Score Deduction Audit</h3>
                                    <div className="space-y-1.5 text-xs">
                                      <div className="flex justify-between font-medium">
                                        <span>Initial Base Score</span>
                                        <span>100</span>
                                      </div>
                                      <div className="flex justify-between text-slate-600">
                                        <span>Delivery ({supplier.delivery}%)</span>
                                        <span className={supplier.deductions.delivery > 0 ? 'text-red-600' : 'text-green-600'}>
                                          {supplier.deductions.delivery > 0 ? `-${supplier.deductions.delivery}` : '0'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-slate-600">
                                        <span>Quality Rating ({supplier.quality}/10)</span>
                                        <span className={supplier.deductions.quality > 0 ? 'text-red-600' : 'text-green-600'}>
                                          {supplier.deductions.quality > 0 ? `-${supplier.deductions.quality}` : '0'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-slate-600">
                                        <span>Incidents last 12m ({supplier.incidents})</span>
                                        <span className={supplier.deductions.incidents > 0 ? 'text-red-600' : 'text-green-600'}>
                                          {supplier.deductions.incidents > 0 ? `-${supplier.deductions.incidents}` : '0'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-slate-600">
                                        <span>Contract Expiry ({supplier.contractExpiry}m)</span>
                                        <span className={supplier.deductions.expiry > 0 ? 'text-red-600' : 'text-green-600'}>
                                          {supplier.deductions.expiry > 0 ? `-${supplier.deductions.expiry}` : '0'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-slate-600">
                                        <span>Dependency ({supplier.dependencyRisk})</span>
                                        <span className={supplier.deductions.dependency > 0 ? 'text-red-600' : 'text-green-600'}>
                                          {supplier.deductions.dependency > 0 ? `-${supplier.deductions.dependency}` : '0'}
                                        </span>
                                      </div>
                                      {supplier.deductions.geopolitical > 0 && (
                                        <div className="flex justify-between text-slate-600">
                                          <span>Geopolitical Penalty</span>
                                          <span className="text-red-600">-{supplier.deductions.geopolitical}</span>
                                        </div>
                                      )}
                                      <div className="border-t border-[#e2e8f0] pt-2 mt-2 flex justify-between font-bold text-sm text-[#1a1d27]">
                                        <span>Computed Health Score</span>
                                        <span className={isGreen ? 'text-green-700' : isYellow ? 'text-amber-600' : 'text-red-700'}>
                                          {supplier.healthScore} / 100
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 3: Flags and Timelines */}
                                  <div className="md:col-span-5 space-y-4 bg-white p-4 rounded-xl border border-[#e2e8f0] flex flex-col justify-between">
                                    <div>
                                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] border-b border-[#e2e8f0] pb-2 mb-3">Disruption Risk Flags</h3>
                                      {supplier.flags.length === 0 ? (
                                        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-100">
                                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                                          <span>Supplier conforms to all operating guidelines. No risk flags active.</span>
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          {supplier.flags.map((flag, idx) => (
                                            <div key={idx} className="flex gap-2 p-2 rounded-lg bg-[#fee2e2]/40 text-xs border border-[#fca5a5]/30">
                                              <AlertCircle className="h-4 w-4 text-[#991b1b] shrink-0 mt-0.5" />
                                              <div>
                                                <span className="font-bold text-[#991b1b] block">{flag}</span>
                                                <span className="text-[#6b7280] text-[11px] leading-relaxed block">{getFlagExplanation(flag)}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-center text-xs">
                                      <div className="flex items-center gap-1.5 text-[#6b7280]">
                                        <Clock className="h-3.5 w-3.5 text-[#6b7280]" />
                                        <span>Contract Timeline:</span>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded font-semibold ${
                                        supplier.contractExpiry <= 3 ? 'bg-red-100 text-red-800' :
                                        supplier.contractExpiry <= 11 ? 'bg-amber-100 text-amber-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {supplier.contractExpiry <= 3 ? 'CRITICAL URGENCY' :
                                         supplier.contractExpiry <= 11 ? 'MEDIUM URGENCY' : 'STABLE HORIZON'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Full-width Advisor Section */}
                                  <div className="md:col-span-12 bg-white p-5 rounded-xl border border-[#e2e8f0] space-y-2">
                                    <div className="flex items-center gap-2 text-[#3b82f6]">
                                      <FileText className="h-4.5 w-4.5" />
                                      <h3 className="text-xs font-bold uppercase tracking-wider">AI Strategic Advisory Recommendation</h3>
                                    </div>
                                    <p className="text-xs text-[#1a1d27] leading-relaxed font-normal bg-[#f4f6f9] p-4 rounded-lg border border-[#e2e8f0]/40">
                                      {supplier.aiAdvisor}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* URGENT ACTION PANEL (RED-SCORED) */}
        {suppliers.filter(s => s.category === 'RED').length > 0 && (
          <section className="bg-[#fff5f5] border border-[#fca5a5] p-6 rounded-2xl space-y-4 shadow-sm" id="urgent-action-panel">
            <div className="flex items-center gap-2 border-b border-[#fca5a5]/40 pb-3">
              <ShieldAlert className="h-5 w-5 text-[#991b1b]" />
              <h2 className="text-base font-bold text-[#991b1b] tracking-tight">Urgent action required</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suppliers.filter(s => s.category === 'RED').map((supplier) => (
                <div key={supplier.id} className="bg-white p-5 rounded-xl border border-[#fca5a5] flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#991b1b] bg-red-100 px-2 py-0.5 rounded border border-[#fca5a5]/30">
                          Rank {supplier.rank}
                        </span>
                        <h3 className="text-sm font-bold text-[#1a1d27] mt-1">{supplier.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-extrabold text-[#991b1b]">{supplier.healthScore}</span>
                        <span className="text-[10px] text-[#6b7280] block font-mono">Health Score</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7280] leading-relaxed">
                      <strong>Risk Indicator:</strong> {supplier.riskSummary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs text-red-700 font-semibold bg-red-50 py-1 px-2.5 rounded border border-red-100">
                      Expiry: {supplier.contractExpiry} Months
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {supplier.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STABLE SUPPLIERS PANEL (GREEN-SCORED) */}
        {suppliers.filter(s => s.category === 'GREEN').length > 0 && (
          <section className="bg-[#f0fdf4] border border-[#86efac] p-6 rounded-2xl space-y-4 shadow-sm" id="stable-suppliers-panel">
            <div className="flex items-center gap-2 border-b border-[#86efac]/40 pb-3">
              <ShieldCheck className="h-5 w-5 text-[#166534]" />
              <h2 className="text-base font-bold text-[#166534] tracking-tight">Stable and trusted suppliers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suppliers.filter(s => s.category === 'GREEN').map((supplier) => (
                <div key={supplier.id} className="bg-white p-5 rounded-xl border border-[#86efac] flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#166534] bg-green-100 px-2 py-0.5 rounded border border-[#86efac]/30">
                          Rank {supplier.rank}
                        </span>
                        <h3 className="text-sm font-bold text-[#1a1d27] mt-1">{supplier.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-extrabold text-[#166534]">{supplier.healthScore}</span>
                        <span className="text-[10px] text-[#6b7280] block font-mono">Health Score</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7280] leading-relaxed">
                      <strong>Operational Health:</strong> {supplier.riskSummary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs font-semibold text-[#1a1d27]">
                      Spend: {formatGBP(supplier.spend)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 border border-green-200">
                      Approved Vendor
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-[#e2e8f0] py-6 px-6 bg-white text-center text-xs text-[#6b7280]" id="dashboard-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span>Supplier Risk Scoring Suite &bull; Private Internal Operations Portal</span>
          <span className="font-mono">Last refreshed: {new Date().toLocaleDateString('en-GB')}</span>
        </div>
      </footer>
    </div>
  );
}
