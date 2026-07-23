const ExportManager = {
  download(filename, content, mimeType) {
    mimeType = mimeType || "text/plain";
    var blob = new Blob([content], { type: mimeType + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1e3);
  },
  downloadJSON(filename, data) {
    this.download(filename, JSON.stringify(data, null, 2), "application/json");
  },
  downloadCSV(filename, headers, rows) {
    var csv = headers.join(",") + "\n";
    csv += rows.map(function(row) {
      return row.map(function(cell) {
        var s = String(cell);
        return s.includes(",") || s.includes('"') || s.includes("\n") ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(",");
    }).join("\n");
    this.download(filename, "\uFEFF" + csv, "text/csv");
  },
  exportDashboard() {
    var state = AppStore.getState();
    var stats = AppStore.getDashboardStats();
    var lines = [];
    lines.push("=== Dashboard Report ===");
    lines.push("Generated: " + (/* @__PURE__ */ new Date()).toLocaleString());
    lines.push("");
    lines.push("--- Key Metrics ---");
    lines.push("Total Revenue: " + Utils.formatCurrency(stats.revenue.value));
    lines.push("Active Users: " + Utils.formatNumber(stats.users.value));
    lines.push("Subscribers: " + Utils.formatNumber(stats.subscribers.value));
    lines.push("Churn Rate: " + Utils.formatPercent(stats.churn.value));
    lines.push("");
    lines.push("--- Top Transactions ---");
    (state.transactions || []).slice(0, 10).forEach(function(t) {
      lines.push(t.invoice + " | " + Utils.escapeHtml(t.customer) + " | " + Utils.formatCurrency(t.amount) + " | " + t.status + " | " + t.date);
    });
    this.download("dashboard-report-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".txt", lines.join("\n"));
    ActivityLog.add("export", "Dashboard report exported", "export");
  },
  exportAnalytics() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var now = /* @__PURE__ */ new Date();
    var headers = ["Month", "Revenue", "Users", "Refunds"];
    var rows = months.map(function(m, i) {
      return [
        m,
        Math.round(18e3 + i * 1400 + Math.sin(i) * 2e3),
        Math.round(110 + i * 18 + Math.sin(i * 1.3) * 25),
        Math.round(200 + Math.sin(i * 0.8) * 120 + i * 15)
      ];
    });
    this.downloadCSV("analytics-" + now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + ".csv", headers, rows);
    ActivityLog.add("export", "Analytics report exported", "export");
  },
  exportSettings() {
    var settings = AppStore.getState("settings") || {};
    this.downloadJSON("settings-backup-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json", settings);
    ActivityLog.add("export", "Settings exported", "export");
  },
  importSettings(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        if (data && typeof data === "object") {
          AppStore.updateState("settings", data);
          ToastSystem.success("Settings imported successfully");
          ActivityLog.add("import", "Settings imported from file", "import");
        }
      } catch (err) {
        ToastSystem.error("Invalid settings file");
      }
    };
    reader.readAsText(file);
  }
};
window.ExportManager = ExportManager;
