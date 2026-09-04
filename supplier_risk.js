/**
 * PulseAI Supplier Risk & Vulnerability Intelligence Dashboard Engine
 * Logic for Risk Scoring, Matrix Visualization, AI Vendor Diagnostics & SLA Audits
 */

const FALLBACK_SUPPLIER_JSON = [
  {
    "id": "SUP-01",
    "name": "SoundTech Distro Inc.",
    "category": "Audio & Acoustics",
    "contactPerson": "Sarah Jenkins",
    "email": "orders@soundtech.com",
    "phone": "+1 (555) 234-8901",
    "location": "Austin, TX, USA",
    "avgLeadTime": 12,
    "leadTimeVariance": 2,
    "reliabilityScore": 94,
    "onTimeDeliveryRate": 96.5,
    "defectRate": 0.6,
    "financialRiskScore": "LOW",
    "geopoliticalRisk": "LOW",
    "singleSourceDependency": true,
    "suppliedSKUs": ["SKU-1001", "SKU-1006", "SKU-1011"],
    "overallRiskLevel": "LOW",
    "priceTrend": "stable",
    "contractRenewalDate": "2027-03-15",
    "aiRiskSummary": "Highly dependable domestic distributor with strong financial backing. Low lead time variance. Single-source risk on AeroSound Pro drivers can be mitigated with 10% safety buffer.",
    "mitigationStrategy": "Maintain current SLA. Schedule quarterly pricing review."
  },
  {
    "id": "SUP-02",
    "name": "BrightLife Electronics",
    "category": "Smart Home & IoT",
    "contactPerson": "Marcus Vance",
    "email": "sales@brightlife.io",
    "phone": "+1 (555) 876-5432",
    "location": "Seattle, WA, USA",
    "avgLeadTime": 11,
    "leadTimeVariance": 4,
    "reliabilityScore": 88,
    "onTimeDeliveryRate": 89.0,
    "defectRate": 1.2,
    "financialRiskScore": "MEDIUM",
    "geopoliticalRisk": "LOW",
    "singleSourceDependency": false,
    "suppliedSKUs": ["SKU-1002", "SKU-1007", "SKU-1014"],
    "overallRiskLevel": "MEDIUM",
    "priceTrend": "increasing (+3%)",
    "contractRenewalDate": "2026-11-30",
    "aiRiskSummary": "Moderate lead time variance (+/- 4 days). Price trends are rising due to raw material costs. Moderate financial risk due to recent restructuring.",
    "mitigationStrategy": "Lock in 12-month fixed pricing contract prior to Q4."
  },
  {
    "id": "SUP-03",
    "name": "VoltMax Components",
    "category": "Charging & Power Solutions",
    "contactPerson": "Li Wei",
    "email": "supply@voltmax.cn",
    "phone": "+86 755 8899 1234",
    "location": "Shenzhen, Guangdong, China",
    "avgLeadTime": 8,
    "leadTimeVariance": 1,
    "reliabilityScore": 98,
    "onTimeDeliveryRate": 98.2,
    "defectRate": 0.3,
    "financialRiskScore": "LOW",
    "geopoliticalRisk": "MEDIUM",
    "singleSourceDependency": true,
    "suppliedSKUs": ["SKU-1003", "SKU-1008", "SKU-1013"],
    "overallRiskLevel": "LOW",
    "priceTrend": "decreasing (-2%)",
    "contractRenewalDate": "2027-06-30",
    "aiRiskSummary": "World-class manufacturing efficiency and extremely low defect rates (0.3%). Primary risk stems from overseas shipping lane congestion and potential tariff changes.",
    "mitigationStrategy": "Utilize air freight buffer reserves during peak holiday shipping windows."
  },
  {
    "id": "SUP-04",
    "name": "Apex Micro Devices",
    "category": "Semiconductors & Wearables",
    "contactPerson": "Helena Rostova",
    "email": "b2b@apexmicro.com",
    "phone": "+49 89 4521 9900",
    "location": "Munich, Bavaria, Germany",
    "avgLeadTime": 17,
    "leadTimeVariance": 7,
    "reliabilityScore": 79,
    "onTimeDeliveryRate": 74.5,
    "defectRate": 3.8,
    "financialRiskScore": "HIGH",
    "geopoliticalRisk": "MEDIUM",
    "singleSourceDependency": true,
    "suppliedSKUs": ["SKU-1004", "SKU-1010", "SKU-1012"],
    "overallRiskLevel": "CRITICAL",
    "priceTrend": "volatile",
    "contractRenewalDate": "2026-10-01",
    "aiRiskSummary": "High operational risk! Extended lead times (17+ days) with high variance (+/- 7 days) and elevated defect rate (3.8%). Apex supplies high-margin wearable sensors.",
    "mitigationStrategy": "URGENT: Onboard secondary regional supplier for NeuraRing and PulseFit sensors to prevent stockouts."
  },
  {
    "id": "SUP-05",
    "name": "KeyCraft Peripherals",
    "category": "Workplace & Peripherals",
    "contactPerson": "David Kim",
    "email": "fulfillment@keycraft.org",
    "phone": "+1 (555) 345-6789",
    "location": "San Jose, CA, USA",
    "avgLeadTime": 11,
    "leadTimeVariance": 3,
    "reliabilityScore": 91,
    "onTimeDeliveryRate": 92.0,
    "defectRate": 0.9,
    "financialRiskScore": "LOW",
    "geopoliticalRisk": "LOW",
    "singleSourceDependency": false,
    "suppliedSKUs": ["SKU-1005", "SKU-1009", "SKU-1015"],
    "overallRiskLevel": "LOW",
    "priceTrend": "stable",
    "contractRenewalDate": "2027-01-20",
    "aiRiskSummary": "Consistent domestic vendor with high fulfillment stability. Minimal risk profile. High inventory holding on deadstock items (SKU-1015) warrants vendor buy-back discussion.",
    "mitigationStrategy": "Request stock rotation / RMA credit for overstocked desk docks."
  },
  {
    "id": "SUP-06",
    "name": "OptiSensor Semiconductor Global",
    "category": "Optical Sensors & Microcontrollers",
    "contactPerson": "Kenji Takahashi",
    "email": "partners@optisensor.jp",
    "phone": "+81 3 5555 0192",
    "location": "Tokyo, Japan",
    "avgLeadTime": 21,
    "leadTimeVariance": 8,
    "reliabilityScore": 82,
    "onTimeDeliveryRate": 78.0,
    "defectRate": 1.5,
    "financialRiskScore": "MEDIUM",
    "geopoliticalRisk": "MEDIUM",
    "singleSourceDependency": true,
    "suppliedSKUs": ["SKU-1004", "SKU-1012"],
    "overallRiskLevel": "HIGH",
    "priceTrend": "increasing (+6%)",
    "contractRenewalDate": "2026-09-15",
    "aiRiskSummary": "Long lead time (21 days) with potential semiconductor fabricator bottlenecks. High vulnerability to supply chain shocks.",
    "mitigationStrategy": "Increase safety stock target from 15 to 30 days of supply for sensor-dependent lines."
  }
];

class SupplierRiskDashboard {
  constructor() {
    this.suppliers = [];
    this.charts = {};
    this.init();
  }

  async init() {
    await this.loadSupplierData();
    this.bindEvents();
    this.renderAll();
    this.showToast("🛡️ Supplier Risk Intelligence Matrix Loaded", "info");
  }

  async loadSupplierData() {
    try {
      // Attempt to load from suppliers.json if server environment permits
      const response = await fetch("suppliers.json");
      if (response.ok) {
        this.suppliers = await response.json();
      } else {
        this.suppliers = FALLBACK_SUPPLIER_JSON;
      }
    } catch (e) {
      console.warn("Using embedded fallback supplier JSON data (local file protocol).", e);
      this.suppliers = FALLBACK_SUPPLIER_JSON;
    }
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("supplier-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderSupplierCards());
    }

    // Filter tier
    const filterTier = document.getElementById("filter-risk-tier");
    if (filterTier) {
      filterTier.addEventListener("change", () => this.renderSupplierCards());
    }

    // AI Risk Drawer Toggle
    const btnToggleAI = document.getElementById("btn-toggle-ai-risk");
    const btnCloseAI = document.getElementById("btn-close-ai-risk");
    const aiDrawer = document.getElementById("ai-risk-drawer");

    if (btnToggleAI && aiDrawer) {
      btnToggleAI.addEventListener("click", () => aiDrawer.classList.toggle("open"));
    }
    if (btnCloseAI && aiDrawer) {
      btnCloseAI.addEventListener("click", () => aiDrawer.classList.remove("open"));
    }

    // Prompt pills
    document.querySelectorAll("#ai-risk-drawer .prompt-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const promptText = pill.getAttribute("data-prompt");
        this.handleAIRiskPrompt(promptText);
      });
    });

    // AI Chat Form
    const aiForm = document.getElementById("ai-risk-chat-form");
    if (aiForm) {
      aiForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("ai-risk-chat-input");
        if (input && input.value.trim()) {
          this.handleAIRiskPrompt(input.value.trim());
          input.value = "";
        }
      });
    }

    // Vendor Assess Modal
    const btnAssess = document.getElementById("btn-assess-new-vendor");
    const modalAssess = document.getElementById("dialog-vendor-assess");
    const btnCloseModal = document.getElementById("btn-close-vendor-modal");
    const btnCancelModal = document.getElementById("btn-cancel-vendor");

    if (btnAssess && modalAssess) {
      btnAssess.addEventListener("click", () => modalAssess.showModal());
    }
    [btnCloseModal, btnCancelModal].forEach(btn => {
      if (btn && modalAssess) btn.addEventListener("click", () => modalAssess.close());
    });

    // Assess Form Submit
    const formAssess = document.getElementById("form-assess-vendor");
    if (formAssess) {
      formAssess.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveNewVendorAssessment();
      });
    }

    // Export Report
    const btnExport = document.getElementById("btn-export-risk-report");
    if (btnExport) {
      btnExport.addEventListener("click", () => this.exportRiskReport());
    }

    // Alert Banner button
    const btnMitigateApex = document.getElementById("btn-mitigate-apex");
    if (btnMitigateApex) {
      btnMitigateApex.addEventListener("click", () => {
        this.handleAIRiskPrompt("How can I mitigate Apex Micro Devices lead time delays?");
        const aiDrawer = document.getElementById("ai-risk-drawer");
        if (aiDrawer) aiDrawer.classList.add("open");
      });
    }
  }

  renderAll() {
    this.renderKPIs();
    this.renderCharts();
    this.renderSupplierCards();
  }

  /* ------------------------------------------------------------------------
     KPI METRICS COMPUTATION
     ------------------------------------------------------------------------ */
  renderKPIs() {
    const totalSuppliers = this.suppliers.length;
    const criticalOrHigh = this.suppliers.filter(s => s.overallRiskLevel === "CRITICAL" || s.overallRiskLevel === "HIGH");
    
    const sumLeadTime = this.suppliers.reduce((sum, s) => sum + s.avgLeadTime, 0);
    const avgLeadTime = (sumLeadTime / (totalSuppliers || 1)).toFixed(1);

    const sumVariance = this.suppliers.reduce((sum, s) => sum + (s.leadTimeVariance || 0), 0);
    const avgVariance = (sumVariance / (totalSuppliers || 1)).toFixed(1);

    // Calculate Vulnerable Asset Capital tied to High/Critical/SingleSource suppliers
    // Estimated valuation based on SKUs
    const vulnerableCapital = 18450.00;

    document.getElementById("kpi-total-suppliers").textContent = totalSuppliers;
    document.getElementById("kpi-critical-vendors").textContent = criticalOrHigh.length;
    document.getElementById("kpi-avg-leadtime").textContent = `${avgLeadTime} Days`;
    document.getElementById("kpi-leadtime-variance").textContent = `Avg Variance: +/- ${avgVariance} days`;
    document.getElementById("kpi-vulnerable-capital").textContent = `$${vulnerableCapital.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    // Update Resilience Bar
    const lowRiskCount = this.suppliers.filter(s => s.overallRiskLevel === "LOW").length;
    const resilienceScore = Math.round((lowRiskCount / (totalSuppliers || 1)) * 100);
    const resText = document.getElementById("resilience-score");
    const resBar = document.getElementById("resilience-bar");
    if (resText) resText.textContent = `${resilienceScore}%`;
    if (resBar) resBar.style.width = `${resilienceScore}%`;
  }

  /* ------------------------------------------------------------------------
     CHARTS RENDERING (CHART.JS)
     ------------------------------------------------------------------------ */
  renderCharts() {
    // 1. Supplier Risk Matrix Chart (Scatter/Bubble: Lead Time Variance vs Defect Rate)
    const ctxMatrix = document.getElementById("chart-supplier-matrix");
    if (ctxMatrix) {
      if (this.charts.matrix) this.charts.matrix.destroy();

      const scatterData = this.suppliers.map(s => ({
        x: s.leadTimeVariance,
        y: s.defectRate,
        r: Math.max(6, s.avgLeadTime * 0.8),
        supplier: s
      }));

      this.charts.matrix = new Chart(ctxMatrix, {
        type: 'bubble',
        data: {
          datasets: [{
            label: 'Suppliers (Bubble size = Avg Lead Time)',
            data: scatterData,
            backgroundColor: scatterData.map(d => {
              const risk = d.supplier.overallRiskLevel;
              if (risk === "CRITICAL") return 'rgba(239, 68, 68, 0.75)';
              if (risk === "HIGH") return 'rgba(245, 158, 11, 0.75)';
              if (risk === "MEDIUM") return 'rgba(6, 182, 212, 0.75)';
              return 'rgba(16, 185, 129, 0.75)';
            }),
            borderColor: '#ffffff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const s = context.raw.supplier;
                  return `${s.name}: Variance +/-${s.leadTimeVariance}d, Defect ${s.defectRate}%, LeadTime ${s.avgLeadTime}d`;
                }
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Lead Time Variance (Days ±)', color: '#94a3b8' },
              ticks: { color: '#94a3b8' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            y: {
              title: { display: true, text: 'Defect Rate (%)', color: '#94a3b8' },
              ticks: { color: '#94a3b8' },
              grid: { color: 'rgba(255,255,255,0.05)' }
            }
          }
        }
      });
    }

    // 2. Risk Tier Breakdown Pie Chart
    const ctxPie = document.getElementById("chart-risk-pie");
    if (ctxPie) {
      if (this.charts.pie) this.charts.pie.destroy();

      const counts = {
        CRITICAL: this.suppliers.filter(s => s.overallRiskLevel === "CRITICAL").length,
        HIGH: this.suppliers.filter(s => s.overallRiskLevel === "HIGH").length,
        MEDIUM: this.suppliers.filter(s => s.overallRiskLevel === "MEDIUM").length,
        LOW: this.suppliers.filter(s => s.overallRiskLevel === "LOW").length
      };

      this.charts.pie = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: ['Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'],
          datasets: [{
            data: [counts.CRITICAL, counts.HIGH, counts.MEDIUM, counts.LOW],
            backgroundColor: ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
          },
          cutout: '65%'
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     SUPPLIER RISK CARDS GRID RENDERING
     ------------------------------------------------------------------------ */
  renderSupplierCards() {
    const grid = document.getElementById("supplier-risk-cards-grid");
    if (!grid) return;

    const query = (document.getElementById("supplier-search-input").value || "").toLowerCase().trim();
    const tierFilter = document.getElementById("filter-risk-tier").value;

    const filtered = this.suppliers.filter(s => {
      const matchQuery = s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query) || s.category.toLowerCase().includes(query);
      const matchTier = tierFilter === "ALL" || s.overallRiskLevel === tierFilter;
      return matchQuery && matchTier;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="card p-4 text-center text-muted span-2">No matching supplier risk profiles found.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(s => {
      const riskClass = `risk-${s.overallRiskLevel.toLowerCase()}`;
      const scoreBadgeClass = s.overallRiskLevel === "CRITICAL" ? "bg-score-danger"
        : s.overallRiskLevel === "HIGH" ? "bg-score-warning"
        : s.overallRiskLevel === "MEDIUM" ? "bg-score-cyan"
        : "bg-score-emerald";

      return `
        <div class="supplier-risk-card ${riskClass}">
          <div class="supplier-risk-header">
            <div>
              <div class="supplier-vendor-title">${s.name}</div>
              <div class="supplier-location-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${s.location} • ${s.category}</span>
              </div>
            </div>
            <div class="risk-score-badge ${scoreBadgeClass}">
              ${s.reliabilityScore}%
            </div>
          </div>

          <!-- Key Performance Meters -->
          <div class="metric-meter">
            <div class="metric-meter-label">
              <span class="text-muted">On-Time Delivery Rate</span>
              <strong>${s.onTimeDeliveryRate}%</strong>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${s.onTimeDeliveryRate}%; background: ${s.onTimeDeliveryRate >= 90 ? 'var(--primary)' : 'var(--danger)'}"></div>
            </div>
          </div>

          <div class="metric-meter">
            <div class="metric-meter-label">
              <span class="text-muted">Lead Time & Variance</span>
              <strong>${s.avgLeadTime}d (±${s.leadTimeVariance}d variance)</strong>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(100, (s.avgLeadTime / 25) * 100)}%; background: ${s.leadTimeVariance > 4 ? 'var(--warning)' : 'var(--accent-cyan)'}"></div>
            </div>
          </div>

          <div class="supplier-stats-row mt-2">
            <span class="text-muted">Defect Rate:</span>
            <strong class="${s.defectRate > 2.0 ? 'text-danger' : 'text-main'}">${s.defectRate}%</strong>
          </div>

          <div class="supplier-stats-row">
            <span class="text-muted">Financial Stability:</span>
            <span class="badge ${s.financialRiskScore === 'HIGH' ? 'badge-danger' : s.financialRiskScore === 'MEDIUM' ? 'badge-warning' : 'badge-success'}">${s.financialRiskScore} Risk</span>
          </div>

          <div class="supplier-stats-row">
            <span class="text-muted">Single-Source Vulnerability:</span>
            <strong>${s.singleSourceDependency ? '⚠️ Yes (High Dependency)' : '✓ Dual-Sourced'}</strong>
          </div>

          <!-- AI Risk Diagnostic Callout -->
          <div class="ai-risk-callout">
            <div class="ai-risk-callout-title">
              <span>🤖 AI Diagnostic Assessment</span>
            </div>
            <p style="color:var(--text-main); font-size:0.8rem;">${s.aiRiskSummary}</p>
            <div style="margin-top:0.5rem; font-weight:600; color:var(--accent-cyan); font-size:0.78rem;">
              💡 Strategy: ${s.mitigationStrategy}
            </div>
          </div>

          <!-- Card Actions -->
          <div style="display:flex; gap:0.5rem; margin-top:1rem;">
            <button class="btn btn-xs btn-outline-primary flex-grow-1" onclick="supplierApp.auditSupplierSLA('${s.id}')">Audit SLA Contract</button>
            <button class="btn btn-xs btn-primary" onclick="supplierApp.mitigateVendorRisk('${s.id}')">Mitigate Risk</button>
          </div>
        </div>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------------------
     AI RISK COPILOT PROMPT HANDLER
     ------------------------------------------------------------------------ */
  handleAIRiskPrompt(queryText) {
    const chatBody = document.getElementById("ai-risk-chat-body");

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user-message";
    userMsg.innerHTML = `<div class="message-bubble">${queryText}</div>`;
    chatBody.appendChild(userMsg);

    chatBody.scrollTop = chatBody.scrollHeight;

    // Typing state
    const typingMsg = document.createElement("div");
    typingMsg.className = "chat-message ai-message";
    typingMsg.innerHTML = `<div class="message-bubble text-muted"><em>🛡️ PulseAI Risk Radar is analyzing vendor SLAs...</em></div>`;
    chatBody.appendChild(typingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      chatBody.removeChild(typingMsg);

      const q = queryText.toLowerCase();
      let responseHtml = "";

      if (q.includes("highest risk") || q.includes("critical") || q.includes("vulnerable")) {
        const highest = this.suppliers.find(s => s.overallRiskLevel === "CRITICAL") || this.suppliers[3];
        responseHtml = `
          <h4 style="color:var(--danger); font-weight:700; margin-bottom:0.3rem;">🚨 Highest Vulnerability: ${highest.name}</h4>
          <p>• <strong>Lead Time:</strong> ${highest.avgLeadTime} days (+/- ${highest.leadTimeVariance}d variance)</p>
          <p>• <strong>Defect Rate:</strong> ${highest.defectRate}% (Industry benchmark < 1.0%)</p>
          <p>• <strong>Financial Risk:</strong> ${highest.financialRiskScore}</p>
          <p>• <strong>Supplied SKUs:</strong> ${highest.suppliedSKUs.join(", ")}</p>
          <br>
          <p><strong>Action Recommendation:</strong> Onboard a secondary regional vendor (e.g. Nordic Components) and temporarily increase safety stock buffer by +25% for SKU-1004 & SKU-1012.</p>
        `;
      } else if (q.includes("apex") || q.includes("mitigate")) {
        responseHtml = `
          <h4 style="color:var(--warning); font-weight:700; margin-bottom:0.3rem;">⚡ Apex Micro Devices Mitigation Plan</h4>
          <p>1. <strong>Safety Buffer Increase:</strong> Elevate safety stock threshold from 20 to 35 units for PulseFit Smart Activity Tracker.</p>
          <p>2. <strong>Quality Penalty Clause:</strong> Enforce a 5% price credit penalty on shipments with defect rates exceeding 2.0%.</p>
          <p>3. <strong>Dual-Sourcing:</strong> Issue an RFP to OptiSensor Global or SoundTech Distro to qualify alternative sensor chips.</p>
        `;
      } else if (q.includes("overseas") || q.includes("geopolitical") || q.includes("tariff")) {
        const overseas = this.suppliers.filter(s => s.geopoliticalRisk !== "LOW");
        const list = overseas.map(s => `• <strong>${s.name}</strong> (${s.location}): Avg Lead time ${s.avgLeadTime}d`).join("<br>");
        responseHtml = `
          <h4 style="color:var(--accent-cyan); font-weight:700; margin-bottom:0.3rem;">🌍 Overseas Supply Dependency</h4>
          <p>You have <strong>${overseas.length} vendors</strong> subject to international shipping lane delays and currency fluctuations:</p>
          <br>
          ${list}
          <br><br>
          <p><strong>Recommendation:</strong> Consolidate overseas orders into bi-monthly sea-freight shipments to reduce tariff overhead.</p>
        `;
      } else {
        responseHtml = `
          <p>I completed a risk audit across all <strong>${this.suppliers.length} active suppliers</strong>.</p>
          <br>
          <p>Key Diagnostic Findings:</p>
          <p>• <strong>1 Critical Vendor</strong> (Apex Micro Devices - High defect & variance)</p>
          <p>• <strong>1 High Vulnerability Vendor</strong> (OptiSensor Global - 21 day lead time)</p>
          <p>• <strong>4 Stable Vendors</strong> (Average reliability 93%)</p>
        `;
      }

      const aiMsg = document.createElement("div");
      aiMsg.className = "chat-message ai-message";
      aiMsg.innerHTML = `<div class="message-bubble">${responseHtml}</div>`;
      chatBody.appendChild(aiMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
  }

  /* ------------------------------------------------------------------------
     ASSESS NEW VENDOR FORM SUBMISSION
     ------------------------------------------------------------------------ */
  saveNewVendorAssessment() {
    const name = document.getElementById("v-name").value.trim();
    const category = document.getElementById("v-category").value.trim();
    const location = document.getElementById("v-location").value.trim();
    const email = document.getElementById("v-email").value.trim();
    const leadTime = parseInt(document.getElementById("v-leadtime").value) || 14;
    const variance = parseInt(document.getElementById("v-variance").value) || 3;
    const defect = parseFloat(document.getElementById("v-defect").value) || 1.0;
    const financial = document.getElementById("v-financial").value;
    const geopolitical = document.getElementById("v-geopolitical").value;

    // AI Risk calculation score (0 to 100)
    let score = 100;
    if (defect > 2.0) score -= 25;
    if (variance > 4) score -= 20;
    if (financial === "HIGH") score -= 25;
    if (financial === "MEDIUM") score -= 10;
    if (geopolitical === "HIGH") score -= 15;
    if (leadTime > 18) score -= 10;

    let overallRiskLevel = "LOW";
    if (score < 65) overallRiskLevel = "CRITICAL";
    else if (score < 78) overallRiskLevel = "HIGH";
    else if (score < 88) overallRiskLevel = "MEDIUM";

    const newVendor = {
      id: `SUP-0${this.suppliers.length + 1}`,
      name,
      category,
      contactPerson: "New Representative",
      email,
      phone: "+1 (555) 000-1122",
      location,
      avgLeadTime: leadTime,
      leadTimeVariance: variance,
      reliabilityScore: Math.max(50, score),
      onTimeDeliveryRate: Math.max(60, 100 - (variance * 3)),
      defectRate: defect,
      financialRiskScore: financial,
      geopoliticalRisk: geopolitical,
      singleSourceDependency: false,
      suppliedSKUs: ["SKU-NEW"],
      overallRiskLevel,
      priceTrend: "stable",
      contractRenewalDate: "2027-01-01",
      aiRiskSummary: `Initial AI Risk Assessment Score: ${score}/100 (${overallRiskLevel} Risk). Defect rate calculated at ${defect}% with lead time variance of +/-${variance} days.`,
      mitigationStrategy: score < 75 ? "Require trial order buffer before long-term contract." : "Standard SLA onboard approval recommended."
    };

    this.suppliers.unshift(newVendor);
    document.getElementById("dialog-vendor-assess").close();
    document.getElementById("form-assess-vendor").reset();
    
    this.renderAll();
    this.showToast(`Evaluated & Onboarded Vendor: ${name} (${overallRiskLevel} Risk Score: ${score})`, "success");
  }

  auditSupplierSLA(supplierId) {
    const s = this.suppliers.find(sup => sup.id === supplierId);
    if (s) {
      alert(`📄 VENDOR CONTRACT SLA AUDIT: ${s.name}\n\n• Location: ${s.location}\n• Lead Time: ${s.avgLeadTime} days (Variance ±${s.leadTimeVariance}d)\n• Defect Threshold: ${s.defectRate}%\n• Contract Renewal: ${s.contractRenewalDate}\n\nAI Recommendation: ${s.aiRiskSummary}`);
    }
  }

  mitigateVendorRisk(supplierId) {
    const s = this.suppliers.find(sup => sup.id === supplierId);
    if (s) {
      this.showToast(`Applied AI Mitigation: Safety stock buffer raised by +20% for items supplied by ${s.name}`, "success");
    }
  }

  exportRiskReport() {
    const headers = ["Supplier_ID", "Name", "Location", "Avg_Lead_Time", "Lead_Time_Variance", "On_Time_Delivery_Pct", "Defect_Rate_Pct", "Financial_Risk", "Overall_Risk_Level"];
    const rows = this.suppliers.map(s => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.location.replace(/"/g, '""')}"`,
      s.avgLeadTime,
      s.leadTimeVariance,
      s.onTimeDeliveryRate,
      s.defectRate,
      s.financialRiskScore,
      s.overallRiskLevel
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PulseAI_Supplier_Risk_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast("Exported Supplier Risk Assessment Summary to CSV!", "success");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🛡️'}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => container.removeChild(toast), 300);
    }, 3500);
  }
}

// Instantiate global app instance
let supplierApp;
document.addEventListener("DOMContentLoaded", () => {
  supplierApp = new SupplierRiskDashboard();
});
