/**
 * PulseAI Inventory Decision Support Dashboard
 * Main Application Controller & View Router
 */

class DashboardApp {
  constructor() {
    this.currentView = "dashboard";
    this.charts = {};
    this.init();
  }

  init() {
    this.bindEvents();
    this.initViews();
    this.renderAll();
    this.showToast("⚡ PulseAI Engine Initialized with 15 active SKUs", "info");
  }

  bindEvents() {
    // Navigation Routing
    document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const viewName = btn.getAttribute("data-view");
        this.switchView(viewName);
      });
    });

    // Global Search
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 0) {
          this.switchView("catalog");
          const catalogSearch = document.getElementById("catalog-search");
          if (catalogSearch) catalogSearch.value = query;
          this.renderCatalog();
        }
      });
    }

    // AI Copilot Drawer Toggle
    const btnToggleAI = document.getElementById("btn-toggle-ai");
    const btnCloseAI = document.getElementById("btn-close-ai");
    const aiDrawer = document.getElementById("ai-drawer");

    if (btnToggleAI && aiDrawer) {
      btnToggleAI.addEventListener("click", () => aiDrawer.classList.toggle("open"));
    }
    if (btnCloseAI && aiDrawer) {
      btnCloseAI.addEventListener("click", () => aiDrawer.classList.remove("open"));
    }

    // AI Prompt Pills
    document.querySelectorAll(".prompt-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const promptText = pill.getAttribute("data-prompt");
        this.handleAIUserPrompt(promptText);
      });
    });

    // AI Form Submission
    const aiForm = document.getElementById("ai-chat-form");
    if (aiForm) {
      aiForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("ai-chat-input");
        if (input && input.value.trim()) {
          this.handleAIUserPrompt(input.value.trim());
          input.value = "";
        }
      });
    }

    // What-If Simulator Sliders
    const simSliders = ["sim-demand", "sim-leadtime", "sim-inflation", "sim-price"];
    simSliders.forEach(id => {
      const slider = document.getElementById(`${id}-slider`);
      if (slider) {
        slider.addEventListener("input", () => this.updateSimulator());
      }
    });

    const btnResetSim = document.getElementById("btn-reset-sim");
    if (btnResetSim) {
      btnResetSim.addEventListener("click", () => {
        document.getElementById("sim-demand-slider").value = 0;
        document.getElementById("sim-leadtime-slider").value = 0;
        document.getElementById("sim-inflation-slider").value = 0;
        document.getElementById("sim-price-slider").value = 0;
        this.updateSimulator();
      });
    }

    // Modal SKU Triggers
    const btnAddSkuTop = document.getElementById("btn-add-sku-top");
    const btnAddSkuCatalog = document.getElementById("btn-add-sku-catalog");
    const skuModal = document.getElementById("dialog-sku");
    const btnCloseSkuModal = document.getElementById("btn-close-sku-modal");
    const btnCancelSku = document.getElementById("btn-cancel-sku");

    [btnAddSkuTop, btnAddSkuCatalog].forEach(btn => {
      if (btn) btn.addEventListener("click", () => this.openSKUModal());
    });

    [btnCloseSkuModal, btnCancelSku].forEach(btn => {
      if (btn && skuModal) btn.addEventListener("click", () => skuModal.close());
    });

    // SKU Form Submission
    const formSku = document.getElementById("form-sku");
    if (formSku) {
      formSku.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveSKUForm();
      });
    }

    // Catalog Filters
    const catalogSearch = document.getElementById("catalog-search");
    const catalogCategory = document.getElementById("catalog-filter-category");
    const catalogRisk = document.getElementById("catalog-filter-risk");

    [catalogSearch, catalogCategory, catalogRisk].forEach(el => {
      if (el) el.addEventListener("input", () => this.renderCatalog());
    });

    // Reorder View Filters
    const reorderStatusFilter = document.getElementById("reorder-filter-status");
    if (reorderStatusFilter) {
      reorderStatusFilter.addEventListener("change", () => this.renderReorderView());
    }

    // Action buttons
    const btnGoReorderView = document.getElementById("btn-go-reorder-view");
    if (btnGoReorderView) {
      btnGoReorderView.addEventListener("click", () => this.switchView("reorder"));
    }

    const btnGenerateAllPOs = document.getElementById("btn-generate-all-pos");
    if (btnGenerateAllPOs) {
      btnGenerateAllPOs.addEventListener("click", () => this.generatePurchaseOrders());
    }

    const btnExportCSV = document.getElementById("btn-export-csv");
    if (btnExportCSV) {
      btnExportCSV.addEventListener("click", () => this.exportCSV());
    }

    const btnAlertAction = document.getElementById("btn-alert-action");
    if (btnAlertAction) {
      btnAlertAction.addEventListener("click", () => this.switchView("reorder"));
    }

    const btnAlertDismiss = document.getElementById("btn-alert-dismiss");
    if (btnAlertDismiss) {
      btnAlertDismiss.addEventListener("click", () => {
        document.getElementById("urgent-alert-banner").style.display = "none";
      });
    }

    const btnResetData = document.getElementById("btn-reset-data");
    if (btnResetData) {
      btnResetData.addEventListener("click", () => {
        if (confirm("Reset all inventory items back to initial demo data?")) {
          store.resetToDefaults();
          this.renderAll();
          this.showToast("Demo data successfully reset!", "info");
        }
      });
    }

    // Modal PO Controls
    const poModal = document.getElementById("dialog-po");
    const btnClosePoModal = document.getElementById("btn-close-po-modal");
    const btnClosePo = document.getElementById("btn-close-po");
    const btnPrintPo = document.getElementById("btn-print-po");

    [btnClosePoModal, btnClosePo].forEach(btn => {
      if (btn && poModal) btn.addEventListener("click", () => poModal.close());
    });
    if (btnPrintPo) {
      btnPrintPo.addEventListener("click", () => window.print());
    }
  }

  initViews() {
    this.populateSupplierDropdown();
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update Nav buttons state
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-view") === viewName);
    });

    // Update View Panels visibility
    document.querySelectorAll(".view-content").forEach(panel => {
      panel.classList.toggle("active", panel.id === `view-${viewName}`);
    });

    // Update Page Header Titles
    const titleMap = {
      dashboard: { title: "Executive Overview", sub: "Real-time inventory valuation and risk monitoring" },
      reorder: { title: "Smart Reorder & Purchase Orders", sub: "AI replenishment model and automated PO generation" },
      abc: { title: "ABC Analysis & Overstock Matrix", sub: "Revenue contribution breakdown and deadstock liquidation" },
      simulator: { title: "What-If Decision Lab", sub: "Simulate demand surges, shipping delays, and price changes" },
      suppliers: { title: "Supplier Intelligence", sub: "Vendor reliability scores and lead time analysis" },
      catalog: { title: "Inventory Catalog Manager", sub: "Full SKU repository and parameter configuration" }
    };

    const info = titleMap[viewName] || titleMap.dashboard;
    document.getElementById("page-title").textContent = info.title;
    document.getElementById("page-subtitle").textContent = info.sub;

    // Render specific view logic
    this.renderAll();
  }

  renderAll() {
    const rawItems = store.getItems();
    const metrics = aiEngine.getExecutiveMetrics(rawItems);

    this.updateSidebarHealth(metrics);
    this.updateUrgentBanner(metrics);

    switch (this.currentView) {
      case "dashboard":
        this.renderDashboard(metrics);
        break;
      case "reorder":
        this.renderReorderView(metrics);
        break;
      case "abc":
        this.renderABCView(metrics);
        break;
      case "simulator":
        this.updateSimulator();
        break;
      case "suppliers":
        this.renderSuppliersView();
        break;
      case "catalog":
        this.renderCatalog();
        break;
    }
  }

  updateSidebarHealth(metrics) {
    const healthPct = metrics.healthScore;
    const bar = document.getElementById("sidebar-health-bar");
    const text = document.getElementById("sidebar-health-pct");
    const badge = document.getElementById("reorder-badge");

    if (bar) bar.style.width = `${healthPct}%`;
    if (text) text.textContent = `${healthPct}%`;
    if (badge) {
      const reorderNeeded = metrics.criticalCount + metrics.lowStockCount;
      badge.textContent = reorderNeeded;
      badge.style.display = reorderNeeded > 0 ? "inline-flex" : "none";
    }
  }

  updateUrgentBanner(metrics) {
    const banner = document.getElementById("urgent-alert-banner");
    const text = document.getElementById("alert-banner-text");

    if (metrics.criticalCount > 0) {
      banner.style.display = "flex";
      text.innerHTML = `<strong>Urgent Action Needed:</strong> ${metrics.criticalCount} SKUs are at critical stockout risk within lead-time window!`;
    } else {
      banner.style.display = "none";
    }
  }

  /* ------------------------------------------------------------------------
     VIEW 1: EXECUTIVE DASHBOARD
     ------------------------------------------------------------------------ */
  renderDashboard(metrics) {
    // KPI Cards
    document.getElementById("kpi-asset-value").textContent = `$${metrics.totalAssetValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById("kpi-retail-value").textContent = `Retail Value: $${metrics.totalRetailValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    
    document.getElementById("kpi-critical-count").textContent = metrics.criticalCount;
    document.getElementById("kpi-low-count").textContent = `Low Stock: ${metrics.lowStockCount} | Optimal: ${metrics.totalSKUs - metrics.criticalCount - metrics.lowStockCount - metrics.overstockedCount}`;

    document.getElementById("kpi-overstock-value").textContent = `$${metrics.totalOverstockTiedCapital.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    document.getElementById("kpi-overstock-count").textContent = `${metrics.overstockedCount} items overstocked / stagnant`;

    document.getElementById("kpi-health-score").textContent = `${metrics.healthScore}%`;

    // Urgent Table
    const tbody = document.getElementById("dashboard-urgent-tbody");
    const urgentItems = metrics.items
      .filter(i => i.riskStatus === "CRITICAL" || i.riskStatus === "LOW_STOCK" || i.riskStatus === "OVERSTOCKED")
      .slice(0, 5);

    if (urgentItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-muted text-center py-4">✨ All items are operating within healthy inventory thresholds.</td></tr>`;
    } else {
      tbody.innerHTML = urgentItems.map(item => `
        <tr>
          <td>
            <div style="font-weight:600;">${item.name}</div>
            <div class="table-sku-id">${item.id}</div>
          </td>
          <td><span class="badge badge-info">${item.category}</span></td>
          <td><strong>${item.stock}</strong> units</td>
          <td>${item.daysOfSupply} days</td>
          <td>${this.getStatusBadge(item.riskStatus)}</td>
          <td style="font-size:0.8rem;" class="text-muted">${item.riskReason}</td>
          <td class="text-right">
            <button class="btn btn-xs btn-outline-primary" onclick="app.quickReorderItem('${item.id}')">Order +${item.suggestedReorderQty || 20}</button>
          </td>
        </tr>
      `).join("");
    }

    // Render Charts
    this.renderDashboardCharts(metrics);
  }

  renderDashboardCharts(metrics) {
    // 1. Demand Velocity vs Stock Chart
    const ctxDemand = document.getElementById("chart-demand-stock");
    if (ctxDemand) {
      if (this.charts.demandStock) this.charts.demandStock.destroy();

      const topItems = metrics.items.slice(0, 8);
      this.charts.demandStock = new Chart(ctxDemand, {
        type: 'bar',
        data: {
          labels: topItems.map(i => i.name.split(' ')[0] + ' ' + i.name.split(' ')[1]),
          datasets: [
            {
              label: 'Current Stock Level',
              data: topItems.map(i => i.stock),
              backgroundColor: 'rgba(16, 185, 129, 0.65)',
              borderColor: '#10b981',
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Monthly Demand (Units)',
              data: topItems.map(i => i.monthlySales),
              backgroundColor: 'rgba(6, 182, 212, 0.4)',
              borderColor: '#06b6d4',
              borderWidth: 1,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
          },
          scales: {
            x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // 2. Risk Distribution Doughnut Chart
    const ctxRisk = document.getElementById("chart-risk-doughnut");
    if (ctxRisk) {
      if (this.charts.riskDoughnut) this.charts.riskDoughnut.destroy();

      const counts = {
        Critical: metrics.criticalCount,
        LowStock: metrics.lowStockCount,
        Optimal: metrics.totalSKUs - metrics.criticalCount - metrics.lowStockCount - metrics.overstockedCount,
        Overstocked: metrics.overstockedCount
      };

      this.charts.riskDoughnut = new Chart(ctxRisk, {
        type: 'doughnut',
        data: {
          labels: ['Critical Stockout', 'Low Stock', 'Optimal', 'Overstocked'],
          datasets: [{
            data: [counts.Critical, counts.LowStock, counts.Optimal, counts.Overstocked],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
          },
          cutout: '70%'
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     VIEW 2: SMART REORDER
     ------------------------------------------------------------------------ */
  renderReorderView(metrics) {
    if (!metrics) metrics = aiEngine.getExecutiveMetrics(store.getItems());

    const statusFilter = document.getElementById("reorder-filter-status").value;
    const tbody = document.getElementById("reorder-tbody");

    let itemsToReorder = metrics.items.filter(i => i.stock <= i.dynamicReorderPoint || i.riskStatus === "CRITICAL");
    if (statusFilter === "CRITICAL") {
      itemsToReorder = itemsToReorder.filter(i => i.riskStatus === "CRITICAL");
    } else if (statusFilter === "LOW_STOCK") {
      itemsToReorder = itemsToReorder.filter(i => i.riskStatus === "LOW_STOCK");
    }

    if (itemsToReorder.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-muted text-center py-4">🎉 No items currently require purchase order reorders under selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = itemsToReorder.map(item => `
      <tr>
        <td>
          <div style="font-weight:600;">${item.name}</div>
          <div class="table-sku-id">${item.id}</div>
        </td>
        <td>${item.supplier}</td>
        <td><strong>${item.stock}</strong> units</td>
        <td>${item.recommendedSafetyStock} units</td>
        <td><span class="text-amber" style="font-weight:600;">${item.dynamicReorderPoint} units</span></td>
        <td><span class="badge badge-success">+${item.suggestedReorderQty} units</span></td>
        <td><strong>$${(item.suggestedReorderQty * item.cost).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
        <td class="text-right">
          <button class="btn btn-xs btn-primary" onclick="app.generateSinglePO('${item.id}')">Create PO</button>
        </td>
      </tr>
    `).join("");
  }

  /* ------------------------------------------------------------------------
     VIEW 3: ABC & OVERSTOCK MATRIX
     ------------------------------------------------------------------------ */
  renderABCView(metrics) {
    if (!metrics) metrics = aiEngine.getExecutiveMetrics(store.getItems());

    const classA = metrics.items.filter(i => i.abcClass === 'A');
    const classB = metrics.items.filter(i => i.abcClass === 'B');
    const classC = metrics.items.filter(i => i.abcClass === 'C');

    document.getElementById("abc-a-count").textContent = `${classA.length} SKUs (${metrics.items.length ? Math.round((classA.length/metrics.items.length)*100) : 0}% of catalog)`;
    document.getElementById("abc-b-count").textContent = `${classB.length} SKUs (${metrics.items.length ? Math.round((classB.length/metrics.items.length)*100) : 0}% of catalog)`;
    document.getElementById("abc-c-count").textContent = `${classC.length} SKUs (${metrics.items.length ? Math.round((classC.length/metrics.items.length)*100) : 0}% of catalog)`;

    const tbody = document.getElementById("abc-overstock-tbody");
    const overstocked = metrics.items.filter(i => i.riskStatus === "OVERSTOCKED" || i.riskStatus === "DEADSTOCK");

    if (overstocked.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center py-4">👍 No deadstock or severe overstock detected in inventory.</td></tr>`;
      return;
    }

    tbody.innerHTML = overstocked.map(item => {
      let strategy = "Bundle with fast-moving Class A items at 15% discount.";
      if (item.abcClass === 'C') strategy = "Clearance markdown (-25%) or Return-to-Vendor credit.";
      
      return `
        <tr>
          <td>
            <div style="font-weight:600;">${item.name}</div>
            <div class="table-sku-id">${item.id}</div>
          </td>
          <td>${item.daysOfSupply} days</td>
          <td class="text-amber"><strong>$${item.totalAssetCost.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
          <td><span class="badge badge-info">Class ${item.abcClass}</span></td>
          <td style="font-size:0.8rem;" class="text-muted">${strategy}</td>
          <td class="text-right">
            <button class="btn btn-xs btn-outline-danger" onclick="app.applyMarkdownRecommendation('${item.id}')">Apply Promo</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------------------
     VIEW 4: WHAT-IF SIMULATOR
     ------------------------------------------------------------------------ */
  updateSimulator() {
    const demandSurge = parseInt(document.getElementById("sim-demand-slider").value) || 0;
    const leadTimeDelay = parseInt(document.getElementById("sim-leadtime-slider").value) || 0;
    const inflation = parseInt(document.getElementById("sim-inflation-slider").value) || 0;
    const priceChange = parseInt(document.getElementById("sim-price-slider").value) || 0;

    document.getElementById("sim-demand-val").textContent = `${demandSurge >= 0 ? '+' : ''}${demandSurge}%`;
    document.getElementById("sim-leadtime-val").textContent = `+${leadTimeDelay} days`;
    document.getElementById("sim-inflation-val").textContent = `${inflation >= 0 ? '+' : ''}${inflation}%`;
    document.getElementById("sim-price-val").textContent = `${priceChange >= 0 ? '+' : ''}${priceChange}%`;

    const result = aiEngine.runWhatIfScenario(store.getItems(), {
      demandSurgePct: demandSurge,
      leadTimeDelayDays: leadTimeDelay,
      costInflationPct: inflation,
      priceChangePct: priceChange
    });

    document.getElementById("sim-kpi-stockouts").textContent = `${result.simulated.criticalCount} SKUs`;
    document.getElementById("sim-delta-stockouts").textContent = `Baseline: ${result.original.criticalCount} (Δ ${result.delta.stockoutCountDelta >= 0 ? '+' : ''}${result.delta.stockoutCountDelta})`;

    document.getElementById("sim-kpi-lost-sales").textContent = `$${result.delta.projectedLostRevenue.toLocaleString('en-US', {minimumFractionDigits:2})}`;
    
    document.getElementById("sim-kpi-reorder-cost").textContent = `$${result.simulated.totalSuggestedReorderCost.toLocaleString('en-US', {minimumFractionDigits:2})}`;
    document.getElementById("sim-delta-reorder-cost").textContent = `Baseline: $${result.original.totalSuggestedReorderCost.toLocaleString('en-US', {minimumFractionDigits:2})}`;

    document.getElementById("sim-kpi-health").textContent = `${result.simulated.healthScore}%`;
    document.getElementById("sim-delta-health").textContent = `Δ ${result.delta.healthScoreDelta >= 0 ? '+' : ''}${result.delta.healthScoreDelta}%`;

    this.renderSimulatorChart(result.original, result.simulated);
  }

  renderSimulatorChart(baseline, simulated) {
    const ctx = document.getElementById("chart-simulator-comparison");
    if (!ctx) return;

    if (this.charts.simulator) this.charts.simulator.destroy();

    this.charts.simulator = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Critical Stockouts', 'Reorder Cost ($100s)', 'Health Score (%)'],
        datasets: [
          {
            label: 'Current Baseline',
            data: [baseline.criticalCount, baseline.totalSuggestedReorderCost / 100, baseline.healthScore],
            backgroundColor: 'rgba(16, 185, 129, 0.65)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Simulated What-If',
            data: [simulated.criticalCount, simulated.totalSuggestedReorderCost / 100, simulated.healthScore],
            backgroundColor: 'rgba(239, 68, 68, 0.65)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     VIEW 5: SUPPLIER INTELLIGENCE
     ------------------------------------------------------------------------ */
  renderSuppliersView() {
    const container = document.getElementById("supplier-cards-container");
    const suppliers = store.getSuppliers();
    const items = store.getItems();

    container.innerHTML = suppliers.map(s => {
      const supplierItems = items.filter(i => i.supplierId === s.id || i.supplier === s.name);
      
      return `
        <div class="supplier-card">
          <div class="supplier-card-header">
            <div>
              <div class="supplier-name">${s.name}</div>
              <div class="supplier-email">${s.contact}</div>
            </div>
            <span class="badge ${s.reliabilityScore >= 90 ? 'badge-success' : 'badge-warning'}">${s.reliabilityScore}% Score</span>
          </div>

          <div class="supplier-stats-row">
            <span class="text-muted">Avg Lead Time:</span>
            <strong>${s.avgLeadTime} days</strong>
          </div>
          <div class="supplier-stats-row">
            <span class="text-muted">Price Trend:</span>
            <span class="text-cyan">${s.priceTrend}</span>
          </div>
          <div class="supplier-stats-row">
            <span class="text-muted">Active SKUs Supplied:</span>
            <strong>${supplierItems.length} SKUs</strong>
          </div>

          <button class="btn btn-xs btn-outline-primary btn-block mt-3" onclick="app.generateSupplierPO('${s.id}')">Draft Vendor Purchase Order</button>
        </div>
      `;
    }).join("");
  }

  /* ------------------------------------------------------------------------
     VIEW 6: INVENTORY CATALOG & CRUD
     ------------------------------------------------------------------------ */
  renderCatalog() {
    const rawItems = store.getItems();
    const enriched = rawItems.map(i => aiEngine.enrichItem(i));

    const query = (document.getElementById("catalog-search").value || "").toLowerCase().trim();
    const catFilter = document.getElementById("catalog-filter-category").value;
    const riskFilter = document.getElementById("catalog-filter-risk").value;

    let filtered = enriched.filter(item => {
      const matchQuery = item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
      const matchCat = catFilter === "ALL" || item.category === catFilter;
      const matchRisk = riskFilter === "ALL" || item.riskStatus === riskFilter;

      return matchQuery && matchCat && matchRisk;
    });

    const tbody = document.getElementById("catalog-tbody");
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-muted text-center py-4">No matching inventory SKUs found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td class="table-sku-id"><strong>${item.id}</strong></td>
        <td>
          <div style="font-weight:600;">${item.name}</div>
          <div style="font-size:0.72rem; color:var(--text-subtle);">${item.supplier}</div>
        </td>
        <td><span class="badge badge-info">${item.category}</span></td>
        <td><strong>${item.stock}</strong> units</td>
        <td>${item.monthlySales}/mo</td>
        <td>$${item.cost.toFixed(2)}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td><span class="text-cyan">${item.profitMargin}%</span></td>
        <td>${this.getStatusBadge(item.riskStatus)}</td>
        <td class="text-right">
          <button class="btn btn-xs btn-secondary" onclick="app.editSKU('${item.id}')">Edit</button>
          <button class="btn btn-xs btn-outline-danger" onclick="app.deleteSKU('${item.id}')">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  /* ------------------------------------------------------------------------
     AI COPILOT CHAT ENGINE
     ------------------------------------------------------------------------ */
  handleAIUserPrompt(queryText) {
    const chatBody = document.getElementById("ai-chat-body");

    // Render User Message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "chat-message user-message";
    userMsgDiv.innerHTML = `<div class="message-bubble">${queryText}</div>`;
    chatBody.appendChild(userMsgDiv);

    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate AI thinking typing state
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message ai-message";
    typingDiv.innerHTML = `<div class="message-bubble text-muted"><em>✨ PulseAI is calculating inventory metrics...</em></div>`;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      chatBody.removeChild(typingDiv);

      const aiResponse = aiEngine.processAIQuery(queryText, store.getItems());
      const aiMsgDiv = document.createElement("div");
      aiMsgDiv.className = "chat-message ai-message";

      let actionsHtml = "";
      if (aiResponse.actions && aiResponse.actions.length > 0) {
        actionsHtml = `<div class="message-actions">` +
          aiResponse.actions.map(act => `<button class="btn btn-xs btn-secondary" onclick="app.executeAIAction('${act.action}')">${act.label}</button>`).join("") +
          `</div>`;
      }

      if (aiResponse.type === "card") {
        aiMsgDiv.innerHTML = `
          <div class="message-bubble">
            <h4 style="font-size:0.9rem; margin-bottom:0.4rem; color:var(--accent-cyan);">${aiResponse.title}</h4>
            <div>${aiResponse.response.replace(/\n/g, '<br>')}</div>
            ${actionsHtml}
          </div>
        `;
      } else {
        aiMsgDiv.innerHTML = `
          <div class="message-bubble">
            <div>${aiResponse.response.replace(/\n/g, '<br>')}</div>
            ${actionsHtml}
          </div>
        `;
      }

      chatBody.appendChild(aiMsgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
  }

  executeAIAction(actionName) {
    switch(actionName) {
      case "generate_low_stock_po":
      case "generate_all_po":
        this.generatePurchaseOrders();
        break;
      case "nav_reorder":
        this.switchView("reorder");
        break;
      case "nav_abc":
        this.switchView("abc");
        break;
      case "nav_suppliers":
        this.switchView("suppliers");
        break;
      case "nav_simulator":
        this.switchView("simulator");
        break;
      case "simulate_markdown":
        this.switchView("abc");
        this.showToast("Markdown strategy recommendation highlighted!", "info");
        break;
      case "query_critical":
        this.handleAIUserPrompt("Which items are at critical risk of stockout?");
        break;
      case "query_overstock":
        this.handleAIUserPrompt("How much cash is tied up in overstocked items?");
        break;
    }
  }

  /* ------------------------------------------------------------------------
     SKU MODAL CRUD & FORMS
     ------------------------------------------------------------------------ */
  populateSupplierDropdown() {
    const select = document.getElementById("sku-supplier");
    if (!select) return;

    const suppliers = store.getSuppliers();
    select.innerHTML = suppliers.map(s => `<option value="${s.name}" data-id="${s.id}">${s.name}</option>`).join("");
  }

  openSKUModal(itemToEdit = null) {
    this.populateSupplierDropdown();

    const dialog = document.getElementById("dialog-sku");
    const title = document.getElementById("modal-sku-title");
    const form = document.getElementById("form-sku");

    if (itemToEdit) {
      title.textContent = `Edit Inventory SKU: ${itemToEdit.id}`;
      document.getElementById("sku-form-id").value = itemToEdit.id;
      document.getElementById("sku-name").value = itemToEdit.name;
      document.getElementById("sku-category").value = itemToEdit.category;
      document.getElementById("sku-supplier").value = itemToEdit.supplier;
      document.getElementById("sku-stock").value = itemToEdit.stock;
      document.getElementById("sku-monthly-sales").value = itemToEdit.monthlySales;
      document.getElementById("sku-cost").value = itemToEdit.cost;
      document.getElementById("sku-price").value = itemToEdit.price;
      document.getElementById("sku-leadtime").value = itemToEdit.leadTime;
      document.getElementById("sku-max-stock").value = itemToEdit.maxStock;
    } else {
      title.textContent = "Add New Inventory SKU";
      form.reset();
      document.getElementById("sku-form-id").value = "";
    }

    dialog.showModal();
  }

  saveSKUForm() {
    const id = document.getElementById("sku-form-id").value;
    const supplierSelect = document.getElementById("sku-supplier");
    const selectedSupplierOption = supplierSelect.options[supplierSelect.selectedIndex];

    const skuObj = {
      name: document.getElementById("sku-name").value.trim(),
      category: document.getElementById("sku-category").value,
      supplier: supplierSelect.value,
      supplierId: selectedSupplierOption ? selectedSupplierOption.getAttribute("data-id") : "SUP-01",
      stock: parseInt(document.getElementById("sku-stock").value) || 0,
      monthlySales: parseInt(document.getElementById("sku-monthly-sales").value) || 0,
      cost: parseFloat(document.getElementById("sku-cost").value) || 0,
      price: parseFloat(document.getElementById("sku-price").value) || 0,
      leadTime: parseInt(document.getElementById("sku-leadtime").value) || 7,
      maxStock: parseInt(document.getElementById("sku-max-stock").value) || 100,
      minStock: Math.round((parseInt(document.getElementById("sku-monthly-sales").value) / 30) * parseInt(document.getElementById("sku-leadtime").value) * 0.5),
      reorderPoint: Math.round((parseInt(document.getElementById("sku-monthly-sales").value) / 30) * parseInt(document.getElementById("sku-leadtime").value) * 1.5)
    };

    if (id) {
      store.updateItem(id, skuObj);
      this.showToast(`Updated SKU ${id}`, "success");
    } else {
      const newCreated = store.addItem(skuObj);
      this.showToast(`Created new SKU ${newCreated.id}`, "success");
    }

    document.getElementById("dialog-sku").close();
    this.renderAll();
  }

  editSKU(id) {
    const items = store.getItems();
    const item = items.find(i => i.id === id);
    if (item) this.openSKUModal(item);
  }

  deleteSKU(id) {
    if (confirm(`Are you sure you want to delete SKU ${id}?`)) {
      store.deleteItem(id);
      this.showToast(`Deleted SKU ${id}`, "warning");
      this.renderAll();
    }
  }

  quickReorderItem(id) {
    const items = store.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      const enriched = aiEngine.enrichItem(item);
      const reorderQty = enriched.suggestedReorderQty || 25;
      item.stock += reorderQty;
      store.updateItem(id, { stock: item.stock });
      this.showToast(`Reordered +${reorderQty} units of ${item.name}`, "success");
      this.renderAll();
    }
  }

  quickDiscount(id) {
    const items = store.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      const newPrice = parseFloat((item.price * 0.85).toFixed(2));
      store.updateItem(id, { price: newPrice });
      this.showToast(`Applied 15% markdown to ${item.name} ($${newPrice})`, "info");
      this.renderAll();
    }
  }

  applyMarkdownRecommendation(id) {
    this.quickDiscount(id);
  }

  /* ------------------------------------------------------------------------
     PURCHASE ORDER GENERATOR
     ------------------------------------------------------------------------ */
  generatePurchaseOrders() {
    const rawItems = store.getItems();
    const metrics = aiEngine.getExecutiveMetrics(rawItems);
    const reorderItems = metrics.items.filter(i => i.stock <= i.dynamicReorderPoint || i.riskStatus === "CRITICAL");

    if (reorderItems.length === 0) {
      this.showToast("All items have healthy stock levels. No PO generation needed.", "info");
      return;
    }

    // Group items by supplier
    const grouped = {};
    reorderItems.forEach(item => {
      const suppKey = item.supplier || "Default Supplier";
      if (!grouped[suppKey]) grouped[suppKey] = [];
      grouped[suppKey].push(item);
    });

    const poModalBody = document.getElementById("po-modal-body");
    let poNumber = "PO-2026-" + Math.floor(1000 + Math.random() * 9000);
    let today = new Date().toISOString().split('T')[0];

    let html = `
      <div style="padding:1rem; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="color:var(--primary); font-family:var(--font-display);">${poNumber}</h2>
            <div style="font-size:0.8rem; color:var(--text-muted);">Generated by PulseAI Engine • ${today}</div>
          </div>
          <span class="badge badge-success">Approved Draft</span>
        </div>
      </div>
    `;

    let grandTotal = 0;
    Object.keys(grouped).forEach(supplierName => {
      const supplierOrderItems = grouped[supplierName];
      const supplierTotalCost = supplierOrderItems.reduce((sum, i) => sum + (i.suggestedReorderQty * i.cost), 0);
      grandTotal += supplierTotalCost;

      html += `
        <div style="margin-bottom:1.5rem; border:1px solid var(--border-color); border-radius:8px; overflow:hidden;">
          <div style="padding:0.75rem 1rem; background:rgba(255,255,255,0.05); font-weight:600; display:flex; justify-content:space-between;">
            <span>Vendor: ${supplierName}</span>
            <span style="color:var(--accent-cyan);">$${supplierTotalCost.toLocaleString('en-US', {minimumFractionDigits:2})}</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Rec. Order Qty</th>
                <th>Unit Cost</th>
                <th class="text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${supplierOrderItems.map(item => `
                <tr>
                  <td class="table-sku-id">${item.id}</td>
                  <td>${item.name}</td>
                  <td>${item.stock}</td>
                  <td><strong>+${item.suggestedReorderQty}</strong></td>
                  <td>$${item.cost.toFixed(2)}</td>
                  <td class="text-right"><strong>$${(item.suggestedReorderQty * item.cost).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
    });

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:8px;">
        <span style="font-weight:700; font-size:1.1rem;">Total Reorder Capital Required:</span>
        <span style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; color:var(--primary);">$${grandTotal.toLocaleString('en-US', {minimumFractionDigits:2})}</span>
      </div>
    `;

    poModalBody.innerHTML = html;
    document.getElementById("dialog-po").showModal();
  }

  generateSinglePO(skuId) {
    const rawItems = store.getItems();
    const item = rawItems.find(i => i.id === skuId);
    if (!item) return;

    const enriched = aiEngine.enrichItem(item);
    const poModalBody = document.getElementById("po-modal-body");
    let poNumber = "PO-2026-" + Math.floor(1000 + Math.random() * 9000);
    let today = new Date().toISOString().split('T')[0];

    const totalCost = enriched.suggestedReorderQty * enriched.cost;

    poModalBody.innerHTML = `
      <div style="padding:1rem; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="color:var(--primary); font-family:var(--font-display);">${poNumber} (Single Vendor)</h2>
            <div style="font-size:0.8rem; color:var(--text-muted);">Vendor: ${enriched.supplier} • ${today}</div>
          </div>
          <span class="badge badge-success">Single SKU PO</span>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Item Name</th>
            <th>Current Stock</th>
            <th>Rec. Order Qty</th>
            <th>Unit Cost</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="table-sku-id">${enriched.id}</td>
            <td>${enriched.name}</td>
            <td>${enriched.stock}</td>
            <td><strong>+${enriched.suggestedReorderQty}</strong></td>
            <td>$${enriched.cost.toFixed(2)}</td>
            <td class="text-right"><strong>$${totalCost.toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:1.5rem; text-align:right;">
        <span style="font-size:1.2rem; font-weight:700;">Total Investment: <span style="color:var(--primary);">$${totalCost.toLocaleString('en-US', {minimumFractionDigits:2})}</span></span>
      </div>
    `;

    document.getElementById("dialog-po").showModal();
  }

  generateSupplierPO(supplierId) {
    const suppliers = store.getSuppliers();
    const supp = suppliers.find(s => s.id === supplierId);
    if (!supp) return;

    const rawItems = store.getItems();
    const suppItems = rawItems.filter(i => i.supplierId === supplierId || i.supplier === supp.name);

    if (suppItems.length === 0) {
      this.showToast(`No active SKUs associated with ${supp.name}`, "info");
      return;
    }

    const poModalBody = document.getElementById("po-modal-body");
    let poNumber = "PO-2026-" + Math.floor(1000 + Math.random() * 9000);
    let today = new Date().toISOString().split('T')[0];

    const totalCost = suppItems.reduce((sum, i) => sum + ((i.maxStock - i.stock) * i.cost), 0);

    poModalBody.innerHTML = `
      <div style="padding:1rem; background:rgba(0,0,0,0.2); border-radius:8px; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="color:var(--primary); font-family:var(--font-display);">${poNumber}</h2>
            <div style="font-size:0.8rem; color:var(--text-muted);">Vendor: ${supp.name} (${supp.contact}) • ${today}</div>
          </div>
          <span class="badge badge-info">Vendor Batch PO</span>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Item Name</th>
            <th>Stock</th>
            <th>Order Qty</th>
            <th>Unit Cost</th>
            <th class="text-right">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${suppItems.map(item => {
            const qty = Math.max(10, item.maxStock - item.stock);
            return `
              <tr>
                <td class="table-sku-id">${item.id}</td>
                <td>${item.name}</td>
                <td>${item.stock}</td>
                <td><strong>+${qty}</strong></td>
                <td>$${item.cost.toFixed(2)}</td>
                <td class="text-right"><strong>$${(qty * item.cost).toLocaleString('en-US', {minimumFractionDigits:2})}</strong></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    document.getElementById("dialog-po").showModal();
  }

  /* ------------------------------------------------------------------------
     CSV EXPORT FUNCTIONALITY
     ------------------------------------------------------------------------ */
  exportCSV() {
    const items = store.getItems();
    const enriched = items.map(i => aiEngine.enrichItem(i));

    const headers = ["SKU_ID", "Name", "Category", "Stock", "Monthly_Sales", "Unit_Cost", "Retail_Price", "Lead_Time_Days", "Supplier", "Risk_Status"];
    const rows = enriched.map(i => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      i.category,
      i.stock,
      i.monthlySales,
      i.cost,
      i.price,
      i.leadTime,
      `"${i.supplier.replace(/"/g, '""')}"`,
      i.riskStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PulseAI_Inventory_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast("Exported inventory catalog to CSV file!", "success");
  }

  /* ------------------------------------------------------------------------
     UTILITY HELPERS & TOASTS
     ------------------------------------------------------------------------ */
  getStatusBadge(status) {
    switch (status) {
      case "CRITICAL":
      case "OUT_OF_STOCK":
        return `<span class="badge badge-danger">🚨 Critical Risk</span>`;
      case "LOW_STOCK":
        return `<span class="badge badge-warning">⚠️ Low Stock</span>`;
      case "OPTIMAL":
        return `<span class="badge badge-success">✓ Optimal</span>`;
      case "OVERSTOCKED":
        return `<span class="badge badge-info">📦 Overstocked</span>`;
      case "DEADSTOCK":
        return `<span class="badge badge-ai">❄️ Deadstock</span>`;
      default:
        return `<span class="badge badge-info">${status}</span>`;
    }
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
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
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new DashboardApp();
});
