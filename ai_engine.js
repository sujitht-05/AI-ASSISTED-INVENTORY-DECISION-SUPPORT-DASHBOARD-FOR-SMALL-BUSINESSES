/**
 * AI-Assisted Inventory Decision Support Dashboard
 */

class AIEngine {
  constructor() {}

  enrichItem(item) {
    const dailySales = Math.max(0.01, item.monthlySales / 30.0);
    const daysOfSupply = item.stock / dailySales;
    
    // Recommended Safety Stock formula: (Avg Daily Sales * Lead Time) * 0.5 (for 95% service level)
    const recommendedSafetyStock = Math.ceil(dailySales * item.leadTime * 0.6);
    
    // Dynamic Reorder Point = Safety Stock + (Daily Sales * Lead Time)
    const dynamicReorderPoint = Math.ceil(recommendedSafetyStock + (dailySales * item.leadTime));

    // Suggested Reorder Quantity to reach max stock capacity
    const suggestedReorderQty = item.stock <= dynamicReorderPoint 
      ? Math.max(0, item.maxStock - item.stock)
      : 0;

    const estimatedHoldingCost = (item.stock * item.cost * 0.18) / 12; // 18% annual holding cost rate
    const profitMargin = item.price > 0 ? ((item.price - item.cost) / item.price) * 100 : 0;
    const totalAssetCost = item.stock * item.cost;
    const totalRetailValue = item.stock * item.price;

    // Determine Risk Status
    let riskStatus = "OPTIMAL";
    let riskReason = "Stock level within healthy operational boundaries.";

    if (item.stock === 0) {
      riskStatus = "OUT_OF_STOCK";
      riskReason = "Zero stock on hand! Immediate lost revenue occurrence.";
    } else if (daysOfSupply <= Math.max(3, item.leadTime * 0.5)) {
      riskStatus = "CRITICAL";
      riskReason = `Critical stockout predicted in ${Math.round(daysOfSupply)} days (Lead time: ${item.leadTime}d).`;
    } else if (item.stock <= dynamicReorderPoint) {
      riskStatus = "LOW_STOCK";
      riskReason = `Stock below reorder point (${dynamicReorderPoint} units). Replenishment required.`;
    } else if (daysOfSupply > 120 && item.monthlySales < 30) {
      riskStatus = "DEADSTOCK";
      riskReason = `High holding period (>120 days supply). Excess capital stagnant.`;
    } else if (item.stock > item.maxStock * 1.25) {
      riskStatus = "OVERSTOCKED";
      riskReason = `Inventory exceeds max target by ${Math.round(((item.stock - item.maxStock) / item.maxStock) * 100)}%.`;
    }

    return {
      ...item,
      dailySales: parseFloat(dailySales.toFixed(2)),
      daysOfSupply: Math.round(daysOfSupply),
      recommendedSafetyStock,
      dynamicReorderPoint,
      suggestedReorderQty,
      estimatedHoldingCost: parseFloat(estimatedHoldingCost.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(1)),
      totalAssetCost: parseFloat(totalAssetCost.toFixed(2)),
      totalRetailValue: parseFloat(totalRetailValue.toFixed(2)),
      riskStatus,
      riskReason
    };
  }

  /**
   * Applies ABC Classification to a list of enriched items
   * Based on Pareto Principle (Revenue contribution)
   */
  applyABCClassification(enrichedItems) {
    // Calculate total annual revenue potential per item
    const itemsWithRevenue = enrichedItems.map(item => ({
      ...item,
      annualRevenue: item.monthlySales * 12 * item.price
    }));

    // Sort descending by annual revenue
    itemsWithRevenue.sort((a, b) => b.annualRevenue - a.annualRevenue);

    const grandTotalRevenue = itemsWithRevenue.reduce((sum, item) => sum + item.annualRevenue, 0) || 1;

    let cumulativeRevenue = 0;
    return itemsWithRevenue.map(item => {
      cumulativeRevenue += item.annualRevenue;
      const cumulativePct = (cumulativeRevenue / grandTotalRevenue) * 100;

      let abcClass = 'C';
      if (cumulativePct <= 70) {
        abcClass = 'A'; // Top 70% revenue generator
      } else if (cumulativePct <= 90) {
        abcClass = 'B'; // Next 20% revenue generator
      } else {
        abcClass = 'C'; // Bottom 10% revenue generator
      }

      return {
        ...item,
        annualRevenue: parseFloat(item.annualRevenue.toFixed(2)),
        revenueContributionPct: parseFloat(((item.annualRevenue / grandTotalRevenue) * 100).toFixed(1)),
        abcClass
      };
    });
  }

  /**
   * Calculates overall dashboard executive metrics
   */
  getExecutiveMetrics(items) {
    const enriched = items.map(i => this.enrichItem(i));
    const classified = this.applyABCClassification(enriched);

    const totalAssetValue = classified.reduce((sum, i) => sum + i.totalAssetCost, 0);
    const totalRetailValue = classified.reduce((sum, i) => sum + i.totalRetailValue, 0);
    const totalSKUs = classified.length;

    const criticalItems = classified.filter(i => i.riskStatus === 'CRITICAL' || i.riskStatus === 'OUT_OF_STOCK');
    const lowStockItems = classified.filter(i => i.riskStatus === 'LOW_STOCK');
    const overstockedItems = classified.filter(i => i.riskStatus === 'OVERSTOCKED' || i.riskStatus === 'DEADSTOCK');

    const totalOverstockTiedCapital = overstockedItems.reduce((sum, i) => sum + (i.stock - i.maxStock > 0 ? (i.stock - i.maxStock) * i.cost : i.totalAssetCost * 0.4), 0);

    const totalSuggestedReorderCost = classified.reduce((sum, i) => sum + (i.suggestedReorderQty * i.cost), 0);

    // Health Index Calculation (Weighted 0 to 100%)
    const optimalCount = classified.filter(i => i.riskStatus === 'OPTIMAL').length;
    const healthScore = Math.max(0, Math.min(100, Math.round(
      (optimalCount / (totalSKUs || 1)) * 60 +
      (1 - (criticalItems.length / (totalSKUs || 1))) * 30 +
      (1 - (overstockedItems.length / (totalSKUs || 1))) * 10
    )));

    return {
      totalAssetValue: parseFloat(totalAssetValue.toFixed(2)),
      totalRetailValue: parseFloat(totalRetailValue.toFixed(2)),
      totalSKUs,
      criticalCount: criticalItems.length,
      lowStockCount: lowStockItems.length,
      overstockedCount: overstockedItems.length,
      healthScore,
      totalOverstockTiedCapital: parseFloat(totalOverstockTiedCapital.toFixed(2)),
      totalSuggestedReorderCost: parseFloat(totalSuggestedReorderCost.toFixed(2)),
      items: classified
    };
  }

  /**
   * Runs What-If Scenario Simulations
   * @param {Array} items 
   * @param {Object} scenarioParams { demandSurgePct, leadTimeDelayDays, costInflationPct, priceChangePct }
   */
  runWhatIfScenario(items, scenarioParams) {
    const {
      demandSurgePct = 0,
      leadTimeDelayDays = 0,
      costInflationPct = 0,
      priceChangePct = 0
    } = scenarioParams;

    const originalMetrics = this.getExecutiveMetrics(items);
    
    // Simulate modified items
    const simulatedItems = items.map(rawItem => {
      const simulatedMonthlySales = Math.round(rawItem.monthlySales * (1 + demandSurgePct / 100));
      const simulatedLeadTime = Math.max(1, rawItem.leadTime + leadTimeDelayDays);
      const simulatedCost = rawItem.cost * (1 + costInflationPct / 100);
      const simulatedPrice = rawItem.price * (1 + priceChangePct / 100);

      const modified = {
        ...rawItem,
        monthlySales: simulatedMonthlySales,
        leadTime: simulatedLeadTime,
        cost: parseFloat(simulatedCost.toFixed(2)),
        price: parseFloat(simulatedPrice.toFixed(2))
      };

      return this.enrichItem(modified);
    });

    const simulatedClassified = this.applyABCClassification(simulatedItems);
    const simulatedMetrics = this.getExecutiveMetrics(simulatedItems);

    // Calculate baseline vs simulated deltas
    const stockoutCountDelta = simulatedMetrics.criticalCount - originalMetrics.criticalCount;
    const reorderCostDelta = simulatedMetrics.totalSuggestedReorderCost - originalMetrics.totalSuggestedReorderCost;
    
    // Estimated lost revenue due to potential stockouts under surge
    const projectedLostRevenue = simulatedClassified
      .filter(i => i.riskStatus === 'CRITICAL' || i.riskStatus === 'OUT_OF_STOCK')
      .reduce((sum, i) => sum + (i.monthlySales / 30 * 15 * i.price), 0); // 15 days potential loss

    return {
      original: originalMetrics,
      simulated: simulatedMetrics,
      delta: {
        stockoutCountDelta,
        reorderCostDelta: parseFloat(reorderCostDelta.toFixed(2)),
        projectedLostRevenue: parseFloat(projectedLostRevenue.toFixed(2)),
        healthScoreDelta: simulatedMetrics.healthScore - originalMetrics.healthScore
      },
      simulatedItems: simulatedClassified
    };
  }

  /**
   * Process Natural Language AI Assistant Queries
   */
  processAIQuery(query, items) {
    const q = query.toLowerCase().trim();
    const metrics = this.getExecutiveMetrics(items);
    const classified = metrics.items;

    if (q.includes("critical") || q.includes("stockout") || q.includes("risk") || q.includes("urgent")) {
      const criticals = classified.filter(i => i.riskStatus === 'CRITICAL' || i.riskStatus === 'OUT_OF_STOCK' || i.riskStatus === 'LOW_STOCK');
      
      if (criticals.length === 0) {
        return {
          type: "text",
          response: "Great news! Currently, **0 items** are at critical stockout risk. All inventory is operating within safe safety stock buffers.",
          actions: []
        };
      }

      const listHtml = criticals.slice(0, 5).map(i => 
        `• **${i.name}** (${i.id}): ${i.stock} units left (${i.daysOfSupply} days supply). Rec. Reorder: **${i.suggestedReorderQty} units**`
      ).join("\n");

      return {
        type: "card",
        title: `🚨 ${criticals.length} SKUs At Risk of Stockout`,
        response: `Based on your sales velocity and lead times, here are the top priority items requiring immediate replenishment:\n\n${listHtml}\n\nTotal capital required to restock all low items: **$${metrics.totalSuggestedReorderCost.toLocaleString('en-US', {minimumFractionDigits:2})}**`,
        actions: [
          { label: "Generate POs for At-Risk Items", action: "generate_low_stock_po" },
          { label: "View Smart Reorder Tab", action: "nav_reorder" }
        ]
      };
    }

    if (q.includes("overstock") || q.includes("deadstock") || q.includes("tied") || q.includes("cash")) {
      const overstocks = classified.filter(i => i.riskStatus === 'OVERSTOCKED' || i.riskStatus === 'DEADSTOCK');
      const listHtml = overstocks.map(i => 
        `• **${i.name}**: ${i.stock} units on hand (${i.daysOfSupply} days supply). Tied asset value: **$${(i.stock * i.cost).toLocaleString()}**`
      ).join("\n");

      return {
        type: "card",
        title: `💰 Overstock & Liquid Capital Optimization`,
        response: `You currently have **$${metrics.totalOverstockTiedCapital.toLocaleString('en-US', {minimumFractionDigits:2})}** tied up in overstocked or deadstock items.\n\nTop items to optimize:\n${listHtml}\n\n**AI Recommendation:** Run a 15-20% bundle discount on **StreamMic Pro** paired with fast-moving accessories, or execute a return-to-vendor agreement for deadstock older than 90 days.`,
        actions: [
          { label: "Open ABC & Liquidation View", action: "nav_abc" },
          { label: "Simulate 15% Markdown", action: "simulate_markdown" }
        ]
      };
    }

    if (q.includes("supplier") || q.includes("lead time") || q.includes("vendor")) {
      const suppliers = store.getSuppliers();
      const listHtml = suppliers.map(s => 
        `• **${s.name}**: Reliability ${s.reliabilityScore}% | Avg Lead Time: ${s.avgLeadTime}d | Price Trend: ${s.priceTrend}`
      ).join("\n");

      return {
        type: "card",
        title: `🚚 Supplier Performance Intelligence`,
        response: `Here is the current operational summary of your active vendor partners:\n\n${listHtml}\n\n**AI Insight:** Apex Micro Devices has a lower reliability score (79%) and longer lead times (17 days). Consider increasing safety stock buffers by +20% for items sourced from Apex Micro.`,
        actions: [
          { label: "View Supplier Intelligence", action: "nav_suppliers" }
        ]
      };
    }

    if (q.includes("recommend") || q.includes("action") || q.includes("summary") || q.includes("what to do")) {
      return {
        type: "card",
        title: `🤖 AI Decision Support Strategy Summary`,
        response: `Here are today's top 3 high-impact inventory recommendations for your business:\n\n1. **Prevent Stockouts**: Reorder **AeroSound Pro** and **ErgoVertical Mouse** immediately (less than 5 days supply remaining).\n2. **Free Up $${Math.round(metrics.totalOverstockTiedCapital).toLocaleString()} Cash**: Bundle overstocked **StreamMic Pro** with high-margin wireless charging pads.\n3. **Negotiate Lead Times**: Request priority dispatch from Apex Micro Devices or raise safety stock by 5 units for SKU-1004.`,
        actions: [
          { label: "Auto-Generate Reorder PO", action: "generate_all_po" },
          { label: "Run What-If Scenario", action: "nav_simulator" }
        ]
      };
    }

    // Default fallback NLP answer
    return {
      type: "text",
      response: `I analyzed your inventory repository (**${items.length} active SKUs**). You have **${metrics.criticalCount} critical stockouts**, **${metrics.lowStockCount} items requiring reorder**, and a total inventory valuation of **$${metrics.totalAssetValue.toLocaleString('en-US', {minimumFractionDigits:2})}**.\n\nTry asking me:\n- *"Which products are at risk of stockout?"*\n- *"How can I free up cash from overstocked inventory?"*\n- *"What supplier insights do you have?"*\n- *"Give me today's priority recommendations."*`,
      actions: [
        { label: "Show At-Risk Items", action: "query_critical" },
        { label: "Check Overstock Capital", action: "query_overstock" }
      ]
    };
  }
}

// Global AI Engine instance
const aiEngine = new AIEngine();
