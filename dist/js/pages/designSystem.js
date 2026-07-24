const DesignSystemPage = (function() {
  var activeSection = "colors";
  var playgroundState = {};
  var toastDemoCount = 0;
  var sections = [
    { id: "colors", title: "Colors", icon: "droplet" },
    { id: "typography", title: "Typography", icon: "type" },
    { id: "spacing", title: "Spacing", icon: "move" },
    { id: "shadows", title: "Shadows", icon: "sun" },
    { id: "buttons", title: "Buttons", icon: "square" },
    { id: "inputs", title: "Form Inputs", icon: "edit-3" },
    { id: "cards", title: "Cards", icon: "credit-card" },
    { id: "badges", title: "Badges", icon: "tag" },
    { id: "modals", title: "Modals", icon: "layout" },
    { id: "toasts", title: "Toasts", icon: "bell" },
    { id: "tables", title: "Tables", icon: "grid" },
    { id: "pagination", title: "Pagination", icon: "chevrons-right" },
    { id: "skeletons", title: "Skeletons", icon: "loader" },
    { id: "border", title: "Border & Radius", icon: "square" },
    { id: "opacity", title: "Opacity", icon: "eye" },
    { id: "zindex", title: "Z-Index", icon: "layers" },
    { id: "emptystates", title: "Empty States", icon: "inbox" },
    { id: "states", title: "States", icon: "activity" },
    { id: "playground", title: "Playground", icon: "zap" }
  ];
  function render() {
    return `
      <div class="page-header" style="border-bottom:2px solid var(--ds-color-border-light);padding-bottom:var(--ds-space-4)">
        <div>
          <h1 class="page-header__title" style="font-size:var(--ds-typography-size-2xl)">Design System</h1>
          <p class="page-header__subtitle" style="color:var(--ds-color-text-secondary)">Live component library and design token reference</p>
        </div>
        <div class="page-header__actions" style="gap:var(--ds-space-2);align-items:center">
          <span style="font-size:var(--ds-typography-size-sm);color:var(--ds-color-text-tertiary)" id="dsModeLabel">${document.documentElement.getAttribute("data-theme") === "dark" ? "Dark" : "Light"} mode</span>
          <button class="btn btn--sm btn--secondary" id="dsThemeToggle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/></svg>
            Toggle Theme
          </button>
        </div>
      </div>

      <div style="display:flex;gap:var(--ds-space-6);flex:1;min-height:0">
        <nav style="width:200px;flex-shrink:0;display:flex;flex-direction:column;gap:var(--ds-space-1);padding-top:var(--ds-space-3);position:sticky;top:0;align-self:flex-start;max-height:calc(100vh - 200px);overflow-y:auto" aria-label="Design system sections">
          ${sections.map(function(s) {
      return '<button class="ds-nav-btn' + (s.id === "colors" ? " ds-nav-btn--active" : "") + '" data-ds-section="' + s.id + '">' + s.title + "</button>";
    }).join("")}
        </nav>

        <main style="flex:1;min-width:0;padding-top:var(--ds-space-3);overflow-y:auto" id="dsContent">
          ${renderColorsSection()}
        </main>
      </div>
    `;
  }
  function renderColorsSection() {
    var tokenDoc = typeof DesignTokens !== "undefined" ? DesignTokens.getDoc() : [];
    var colorTokens = tokenDoc.filter(function(t) {
      return t.name && t.name.indexOf("--ds-color") === 0;
    });
    var groups = {};
    colorTokens.forEach(function(t) {
      var parts = t.name.replace("--ds-color-", "").split("-");
      var group = parts[0];
      if (!groups[group]) groups[group] = [];
      groups[group].push(t);
    });
    var groupOrder = ["brand", "semantic", "surface", "text", "border", "chart"];
    var groupLabels = { brand: "Brand Colors", semantic: "Semantic Colors", surface: "Surface Colors", text: "Text Colors", border: "Border Colors", chart: "Chart Colors" };
    return '<div class="ds-section" id="ds-section-colors"><h2 class="ds-section__title">Colors</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">All color tokens available in the design system</p>' + groupOrder.map(function(g) {
      var tokens = groups[g] || [];
      if (tokens.length === 0) return "";
      return '<div style="margin-bottom:var(--ds-space-6)"><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin-bottom:var(--ds-space-3)">' + (groupLabels[g] || g) + '</h3><div class="ds-color-grid">' + tokens.map(function(t) {
        var val = getComputedStyle(document.documentElement).getPropertyValue(t.name).trim();
        return '<div class="ds-color-swatch" data-token="' + t.name + `" onclick="copyToken('` + t.name + `')" data-tooltip="Click to copy"><div class="ds-color-swatch__preview" style="background:` + val + '"></div><div class="ds-color-swatch__info"><span class="ds-color-swatch__name">' + t.name.replace("--ds-color-", "") + '</span><span class="ds-color-swatch__value">' + val + "</span></div></div>";
      }).join("") + "</div></div>";
    }).join("") + "</div>";
  }
  function renderTypographySection() {
    var sizes = [
      { name: "xs", css: "--ds-typography-size-xs", label: "Extra Small (10px)" },
      { name: "sm", css: "--ds-typography-size-sm", label: "Small (12px)" },
      { name: "base", css: "--ds-typography-size-base", label: "Base (14px)" },
      { name: "md", css: "--ds-typography-size-md", label: "Medium (16px)" },
      { name: "lg", css: "--ds-typography-size-lg", label: "Large (18px)" },
      { name: "xl", css: "--ds-typography-size-xl", label: "XL (20px)" },
      { name: "2xl", css: "--ds-typography-size-2xl", label: "2XL (24px)" },
      { name: "3xl", css: "--ds-typography-size-3xl", label: "3XL (30px)" }
    ];
    return '<div class="ds-section" id="ds-section-typography"><h2 class="ds-section__title">Typography</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Type scale and font families</p><div style="background:var(--ds-color-surface-input);padding:var(--ds-space-4);border-radius:var(--ds-radius-md);font-family:var(--ds-typography-font-family-mono);font-size:var(--ds-typography-size-sm);margin-bottom:var(--ds-space-6)">Font: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif</div><div style="display:flex;flex-direction:column;gap:var(--ds-space-3)">' + sizes.map(function(s) {
      return '<div style="display:flex;align-items:center;gap:var(--ds-space-4);padding:var(--ds-space-2) var(--ds-space-4);background:var(--ds-color-surface-card);border-radius:var(--ds-radius-md);border:1px solid var(--ds-color-border-light)"><span style="width:80px;font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-tertiary);font-family:var(--ds-typography-font-family-mono)">' + s.name + '</span><span style="flex:1;font-size:var(' + s.css + ');font-weight:600">The quick brown fox jumps over the lazy dog</span><span style="font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-tertiary)">' + s.label + "</span></div>";
    }).join("") + '</div><div style="margin-top:var(--ds-space-6)"><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin-bottom:var(--ds-space-3)">Font Weights</h3><div style="display:flex;gap:var(--ds-space-4);flex-wrap:wrap">' + ["400 Normal", "500 Medium", "600 SemiBold", "700 Bold", "800 ExtraBold"].map(function(w) {
      var parts = w.split(" ");
      return '<div style="padding:var(--ds-space-3) var(--ds-space-4);background:var(--ds-color-surface-card);border-radius:var(--ds-radius-md);border:1px solid var(--ds-color-border-light);font-weight:' + parts[0] + ';font-size:var(--ds-typography-size-lg)">' + parts[1] + "</div>";
    }).join("") + "</div></div></div>";
  }
  function renderSpacingSection() {
    var spaces = [
      { token: "--ds-space-0", name: "space-0", value: "0px" },
      { token: "--ds-space-1", name: "space-1", value: "4px" },
      { token: "--ds-space-2", name: "space-2", value: "8px" },
      { token: "--ds-space-3", name: "space-3", value: "12px" },
      { token: "--ds-space-4", name: "space-4", value: "16px" },
      { token: "--ds-space-5", name: "space-5", value: "20px" },
      { token: "--ds-space-6", name: "space-6", value: "24px" },
      { token: "--ds-space-7", name: "space-7", value: "32px" },
      { token: "--ds-space-8", name: "space-8", value: "40px" },
      { token: "--ds-space-9", name: "space-9", value: "56px" }
    ];
    return '<div class="ds-section" id="ds-section-spacing"><h2 class="ds-section__title">Spacing</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">4px-base spacing scale</p><div style="display:flex;flex-direction:column;gap:var(--ds-space-2)">' + spaces.map(function(s) {
      var px = parseInt(s.value);
      return '<div style="display:flex;align-items:center;gap:var(--ds-space-3)"><span style="width:80px;font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-tertiary);font-family:var(--ds-typography-font-family-mono)">' + s.name + '</span><div style="background:var(--ds-color-brand-primary);height:' + Math.max(px, 4) + "px;width:" + Math.max(px, 4) + 'px;border-radius:2px;flex-shrink:0;transition:all var(--ds-motion-duration-base)"></div><span style="font-size:var(--ds-typography-size-sm);color:var(--ds-color-text-secondary)">' + s.value + "</span></div>";
    }).join("") + "</div></div>";
  }
  function renderShadowsSection() {
    var shadows = [
      { token: "--ds-shadow-sm", name: "shadow-sm" },
      { token: "--ds-shadow-md", name: "shadow-md" },
      { token: "--ds-shadow-lg", name: "shadow-lg" },
      { token: "--ds-shadow-card", name: "shadow-card" },
      { token: "--ds-shadow-elevated", name: "shadow-elevated" },
      { token: "--ds-shadow-modal", name: "shadow-modal" },
      { token: "--ds-shadow-toast", name: "shadow-toast" }
    ];
    return '<div class="ds-section" id="ds-section-shadows"><h2 class="ds-section__title">Shadows / Elevation</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Box shadow tokens for surface elevation</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--ds-space-4)">' + shadows.map(function(s) {
      var val = getComputedStyle(document.documentElement).getPropertyValue(s.token).trim();
      return '<div style="background:var(--ds-color-surface-card);border-radius:var(--ds-radius-md);padding:var(--ds-space-5);box-shadow:' + val + ';border:1px solid var(--ds-color-border-light);display:flex;flex-direction:column;align-items:center;gap:var(--ds-space-2)"><span style="font-size:var(--ds-typography-size-sm);font-weight:600">' + s.name + '</span><span style="font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-tertiary);text-align:center;font-family:var(--ds-typography-font-family-mono);word-break:break-all">' + val + "</span></div>";
    }).join("") + "</div></div>";
  }
  function renderButtonsSection() {
    return `<div class="ds-section" id="ds-section-buttons"><h2 class="ds-section__title">Buttons</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Button variants, sizes, and states</p><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin-bottom:var(--ds-space-3)">Variants</h3><div class="ds-component-row"><button class="btn btn--primary">Primary</button><button class="btn btn--secondary">Secondary</button><button class="btn btn--ghost">Ghost</button><button class="btn btn--danger">Danger</button></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">Sizes</h3><div class="ds-component-row"><button class="btn btn--primary btn--sm">Small</button><button class="btn btn--primary">Default</button><button class="btn btn--primary btn--lg">Large</button></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">States</h3><div class="ds-state-grid"><div class="ds-state-card" data-state-name="default"><div class="ds-state-preview"><button class="btn btn--primary">Default</button></div><span class="ds-state-label">Default</span></div><div class="ds-state-card" data-state-name="hover"><div class="ds-state-preview ds-sim-hover"><button class="btn btn--primary">Hover</button></div><span class="ds-state-label">Hover</span></div><div class="ds-state-card" data-state-name="focus"><div class="ds-state-preview"><button class="btn btn--primary" style="outline:2px solid var(--ds-color-brand-primary);outline-offset:2px">Focus</button></div><span class="ds-state-label">Focus</span></div><div class="ds-state-card" data-state-name="active"><div class="ds-state-preview"><button class="btn btn--primary" style="transform:scale(0.97)">Active</button></div><span class="ds-state-label">Active</span></div><div class="ds-state-card" data-state-name="disabled"><div class="ds-state-preview"><button class="btn btn--primary" disabled>Disabled</button></div><span class="ds-state-label">Disabled</span></div><div class="ds-state-card" data-state-name="loading"><div class="ds-state-preview"><button class="btn btn--primary btn--loading"><span class="btn__text">Loading</span></button></div><span class="ds-state-label">Loading</span></div><div class="ds-state-card" data-state-name="interactive"><div class="ds-state-preview"><button class="btn btn--primary" id="dsLoadingDemoBtn" onclick="var b=this;b.classList.add('btn--loading');b.disabled=true;setTimeout(function(){b.classList.remove('btn--loading');b.disabled=false},2000)"><span class="btn__text">Click me</span></button></div><span class="ds-state-label">Interactive (2s)</span></div></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">All Variants \xD7 States</h3><div style="overflow-x:auto"><table class="ds-matrix-table"><thead><tr><th>State</th><th>Primary</th><th>Secondary</th><th>Ghost</th><th>Danger</th></tr></thead><tbody>` + ["Default", "Hover", "Focus", "Active", "Disabled", "Loading"].map(function(state) {
      var hoverClass = state === "Hover" ? " ds-sim-hover" : "";
      var focusStyle = state === "Focus" ? ' style="outline:2px solid var(--ds-color-brand-primary);outline-offset:2px"' : "";
      var activeStyle = state === "Active" ? ' style="transform:scale(0.97)"' : "";
      var disabledAttr = state === "Disabled" || state === "Loading" ? " disabled" : "";
      var loadingClass = state === "Loading" ? " btn--loading" : "";
      return '<tr><td><span style="font-size:var(--ds-typography-size-sm);font-weight:500">' + state + '</span></td><td><div class="ds-state-preview' + hoverClass + '"><button class="btn btn--primary btn--sm' + loadingClass + '"' + focusStyle + activeStyle + disabledAttr + ">" + (state === "Loading" ? '<span class="btn__text">Button</span>' : "Button") + '</button></div></td><td><div class="ds-state-preview' + hoverClass + '"><button class="btn btn--secondary btn--sm' + loadingClass + '"' + focusStyle + activeStyle + disabledAttr + ">" + (state === "Loading" ? '<span class="btn__text">Button</span>' : "Button") + '</button></div></td><td><div class="ds-state-preview' + hoverClass + '"><button class="btn btn--ghost btn--sm' + loadingClass + '"' + focusStyle + activeStyle + disabledAttr + ">" + (state === "Loading" ? '<span class="btn__text">Button</span>' : "Button") + '</button></div></td><td><div class="ds-state-preview' + hoverClass + '"><button class="btn btn--danger btn--sm' + loadingClass + '"' + focusStyle + activeStyle + disabledAttr + ">" + (state === "Loading" ? '<span class="btn__text">Button</span>' : "Button") + "</button></div></td></tr>";
    }).join("") + "</tbody></table></div></div>";
  }
  function renderInputsSection() {
    return '<div class="ds-section" id="ds-section-inputs"><h2 class="ds-section__title">Form Inputs</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Form field types and states</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--ds-space-6)"><div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin-bottom:var(--ds-space-3)">Text Input</h3><div style="display:flex;flex-direction:column;gap:var(--ds-space-3)"><div class="form-group"><label class="form-label">Default</label><input type="text" class="form-input" placeholder="Placeholder text" value=""></div><div class="form-group"><label class="form-label">With Value</label><input type="text" class="form-input" value="John Doe"></div><div class="form-group"><label class="form-label">Focus</label><input type="text" class="form-input" value="Focused" style="border-color:var(--ds-color-brand-primary);background:var(--ds-color-surface-card)"></div><div class="form-group"><label class="form-label">Error</label><input type="text" class="form-input form-input--error" value="invalid@"><span class="form-error form-error--visible">Please enter a valid email</span></div><div class="form-group"><label class="form-label">Disabled</label><input type="text" class="form-input" value="Disabled" disabled style="opacity:0.5"></div></div></div><div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin-bottom:var(--ds-space-3)">Select &amp; Textarea</h3><div style="display:flex;flex-direction:column;gap:var(--ds-space-3)"><div class="form-group"><label class="form-label">Select</label><select class="form-select"><option>Option 1</option><option>Option 2</option><option>Option 3</option></select></div><div class="form-group"><label class="form-label">Textarea</label><textarea class="form-textarea" placeholder="Multi-line text input" rows="3"></textarea></div></div></div></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">Toggle Switch</h3><div style="display:flex;gap:var(--ds-space-6)"><label class="toggle active"><div class="toggle__track"></div><span>Enabled</span></label><label class="toggle"><div class="toggle__track"></div><span>Disabled</span></label></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">Search Input</h3><div class="search-input" style="width:320px"><svg class="search-input__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="search-input__field" placeholder="Search..." readonly></div></div>';
  }
  function renderCardsSection() {
    return '<div class="ds-section" id="ds-section-cards"><h2 class="ds-section__title">Cards</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Card component variants</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--ds-space-4)"><div class="card"><div class="card__body" style="padding:var(--ds-space-4)"><div class="card__title" style="margin-bottom:var(--ds-space-2)">Default Card</div><div style="font-size:var(--ds-typography-size-sm);color:var(--ds-color-text-secondary)">Basic card with body content only</div></div></div><div class="card"><div class="card__header"><div><div class="card__title">With Header</div><div class="card__subtitle">Card with title and subtitle</div></div></div><div class="card__body"><div style="font-size:var(--ds-typography-size-sm);color:var(--ds-color-text-secondary)">Body content here</div></div></div><div class="card" style="cursor:pointer"><div class="card__body" style="padding:var(--ds-space-4)"><div class="card__title" style="margin-bottom:var(--ds-space-2)">Hoverable Card</div><div style="font-size:var(--ds-typography-size-sm);color:var(--ds-color-text-secondary)">Hover to see elevation change</div></div></div><div class="card"><div class="card__header"><div><div class="card__title">With Actions</div></div><a class="card__link">View All</a></div><div class="card__body"><div style="font-size:var(--ds-typography-size-sm);color:var(--ds-color-text-secondary)">Card with action link in header</div></div></div></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">Stat Cards</h3><div class="stats" style="grid-template-columns:repeat(4,1fr)"><div class="stat-card stat-card--primary"><div class="stat-card__icon stat-card__icon--primary"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="stat-card__info"><span class="stat-card__label">Revenue</span><span class="stat-card__value">$45.2K</span></div><div class="stat-card__change stat-card__change--up">\u2191 12.5%</div></div><div class="stat-card stat-card--success"><div class="stat-card__icon stat-card__icon--success"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="stat-card__info"><span class="stat-card__label">Users</span><span class="stat-card__value">1,284</span></div><div class="stat-card__change stat-card__change--up">\u2191 8.2%</div></div><div class="stat-card stat-card--warning"><div class="stat-card__icon stat-card__icon--warning"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div><div class="stat-card__info"><span class="stat-card__label">Subscribers</span><span class="stat-card__value">892</span></div><div class="stat-card__change stat-card__change--up">\u2191 3.1%</div></div><div class="stat-card stat-card--danger"><div class="stat-card__icon stat-card__icon--danger"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="stat-card__info"><span class="stat-card__label">Churn</span><span class="stat-card__value">2.4%</span></div><div class="stat-card__change stat-card__change--down">\u2193 0.8%</div></div></div></div>';
  }
  function renderBadgesSection() {
    var badgeTypes = ["completed", "pending", "failed", "active", "inactive", "suspended", "refunded", "info"];
    return '<div class="ds-section" id="ds-section-badges"><h2 class="ds-section__title">Badges &amp; Status Indicators</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Status badges with dot indicators</p><div style="display:flex;flex-wrap:wrap;gap:var(--ds-space-3)">' + badgeTypes.map(function(t) {
      return '<span class="status-badge status-badge--' + t + '">' + t.charAt(0).toUpperCase() + t.slice(1) + "</span>";
    }).join("") + "</div></div>";
  }
  function renderModalsSection() {
    return `<div class="ds-section" id="ds-section-modals"><h2 class="ds-section__title">Modals / Dialogs</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Click buttons to preview modal dialogs</p><div style="display:flex;flex-wrap:wrap;gap:var(--ds-space-3)"><button class="btn btn--primary" onclick="ModalSystem.open('<div class=modal__header><h3 class=modal__title>Information</h3><button class=modal__close data-modal-close aria-label=Close><svg width=20 height=20 viewBox=\\"0 0 24 24\\" fill=none stroke=currentColor stroke-width=2><line x1=18 y1=6 x2=6 y2=18/><line x1=6 y1=6 x2=18 y2=18/></svg></button></div><div class=modal__body><p style=color:var(--ds-color-text-secondary)>This is a basic information modal dialog.</p></div><div class=modal__footer><button class=\\"btn btn--secondary\\" data-modal-close>Close</button></div>')">Open Dialog</button><button class="btn btn--secondary" onclick="ModalSystem.confirm('Confirm Action','Are you sure you want to proceed?','Confirm','Cancel',function(){ToastSystem.success('Confirmed!')})">Open Confirm</button><button class="btn btn--secondary" onclick="ModalSystem.form('Edit Form','<div class=form-group><label class=form-label>Name</label><input type=text class=form-input name=name value=\\'Sample\\'></div><div class=form-group><label class=form-label>Email</label><input type=email class=form-input name=email value=\\'sample@test.com\\'></div>','Save',function(d){ToastSystem.success('Saved: '+d.name)})">Open Form</button></div></div>`;
  }
  function renderToastsSection() {
    return `<div class="ds-section" id="ds-section-toasts"><h2 class="ds-section__title">Toast Notifications</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Click buttons to trigger toast notifications</p><div style="display:flex;flex-wrap:wrap;gap:var(--ds-space-3)"><button class="btn btn--primary" onclick="ToastSystem.success('Operation completed successfully')">Success Toast</button><button class="btn btn--secondary" onclick="ToastSystem.error('An error occurred')">Error Toast</button><button class="btn btn--secondary" onclick="ToastSystem.warning('Please check your input')">Warning Toast</button><button class="btn btn--secondary" onclick="ToastSystem.info('New update available')">Info Toast</button><button class="btn btn--ghost" onclick="ToastSystem.success('With long message');ToastSystem.error('Stacked toasts');ToastSystem.info('Three at once!')">Stacked Toasts</button></div><div style="margin-top:var(--ds-space-4);padding:var(--ds-space-4);background:var(--ds-color-surface-card);border-radius:var(--ds-radius-md);border:1px solid var(--ds-color-border-light)"><h4 style="font-size:var(--ds-typography-size-sm);font-weight:600;margin-bottom:var(--ds-space-2)">Preview (static)</h4><div style="display:flex;flex-direction:column;gap:var(--ds-space-2)"><div class="toast toast--success" style="position:relative;animation:none;pointer-events:none;box-shadow:var(--ds-shadow-toast)"><svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="toast__message">Success message</span></div><div class="toast toast--error" style="position:relative;animation:none;pointer-events:none;box-shadow:var(--ds-shadow-toast)"><svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span class="toast__message">Error message</span></div><div class="toast toast--warning" style="position:relative;animation:none;pointer-events:none;box-shadow:var(--ds-shadow-toast)"><svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span class="toast__message">Warning message</span></div><div class="toast toast--info" style="position:relative;animation:none;pointer-events:none;box-shadow:var(--ds-shadow-toast)"><svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span class="toast__message">Info message</span></div></div></div></div>`;
  }
  function renderTablesSection() {
    return '<div class="ds-section" id="ds-section-tables"><h2 class="ds-section__title">Tables</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Table states: default, empty, and loading</p><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin-bottom:var(--ds-space-3)">Loaded</h3><div class="card"><div class="card__body card__body--no-padding"><div class="table-wrapper"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody><tr><td><strong>Sarah Lee</strong></td><td>sarah@acme.com</td><td>Admin</td><td><span class="status-badge status-badge--active">Active</span></td></tr><tr><td><strong>Mike Johnson</strong></td><td>mike@startup.io</td><td>Editor</td><td><span class="status-badge status-badge--active">Active</span></td></tr><tr><td><strong>Emily Chen</strong></td><td>emily@devshop.com</td><td>Viewer</td><td><span class="status-badge status-badge--inactive">Inactive</span></td></tr><tr><td><strong>David Kim</strong></td><td>david@fintech.co</td><td>Admin</td><td><span class="status-badge status-badge--suspended">Suspended</span></td></tr></tbody></table></div></div></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">Empty</h3><div class="card"><div class="card__body"><div class="empty-state"><div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><p class="empty-state__text">No users found</p><p class="empty-state__hint">Try adjusting your search or filter criteria</p></div></div></div><h3 style="font-size:var(--ds-typography-size-md);font-weight:600;margin:var(--ds-space-6) 0 var(--ds-space-3)">Loading (Skeleton)</h3><div class="card"><div class="card__body card__body--no-padding">' + SkeletonLoader.getTableSkeleton(4) + "</div></div></div>";
  }
  function renderPaginationSection() {
    return '<div class="ds-section" id="ds-section-pagination"><h2 class="ds-section__title">Pagination</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Pagination controls for tables and lists</p><div class="card"><div class="card__body" style="display:flex;justify-content:center;padding:var(--ds-space-6)"><div class="pagination"><button class="pagination__btn" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button><span class="pagination__info">Page 1 of 5</span><button class="pagination__btn active">1</button><button class="pagination__btn">2</button><button class="pagination__btn">3</button><button class="pagination__btn">4</button><button class="pagination__btn">5</button><button class="pagination__btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button></div></div></div></div>';
  }
  function renderSkeletonsSection() {
    return '<div class="ds-section" id="ds-section-skeletons"><h2 class="ds-section__title">Skeleton Loaders</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Loading placeholders for various content types</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--ds-space-4)"><div><h3 style="font-size:var(--ds-typography-size-sm);font-weight:600;margin-bottom:var(--ds-space-2)">Card Skeleton</h3>' + SkeletonLoader.getCardSkeleton() + '</div><div><h3 style="font-size:var(--ds-typography-size-sm);font-weight:600;margin-bottom:var(--ds-space-2)">Chart Skeleton</h3>' + SkeletonLoader.getChartSkeleton() + '</div><div><h3 style="font-size:var(--ds-typography-size-sm);font-weight:600;margin-bottom:var(--ds-space-2)">Stats Skeleton</h3>' + SkeletonLoader.getStatsSkeleton() + '</div></div><div style="margin-top:var(--ds-space-4)"><h3 style="font-size:var(--ds-typography-size-sm);font-weight:600;margin-bottom:var(--ds-space-2)">Text Skeleton Variants</h3><div style="display:flex;flex-direction:column;gap:var(--ds-space-2);padding:var(--ds-space-4);background:var(--ds-color-surface-card);border-radius:var(--ds-radius-md);border:1px solid var(--ds-color-border-light)"><div class="skeleton skeleton--text skeleton--w-60"></div><div class="skeleton skeleton--text skeleton--w-40"></div><div class="skeleton skeleton--text skeleton--w-25"></div><div class="skeleton skeleton--title skeleton--w-35" style="margin-top:var(--ds-space-2)"></div></div></div></div>';
  }
  function renderBorderSection() {
    function cp(name) {
      return "var(--ds-" + name + ")";
    }
    var radii = [
      { token: "border-radius-sm", label: "Small (4px)" },
      { token: "border-radius-md", label: "Medium (6px)" },
      { token: "border-radius-lg", label: "Large (12px)" },
      { token: "border-radius-xl", label: "XL (16px)" },
      { token: "border-radius-full", label: "Full (9999px)" }
    ];
    return '<div class="ds-section" id="ds-section-border"><h2 class="ds-section__title">Border & Radius</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Border radius tokens for UI surfaces</p><div style="display:flex;flex-wrap:wrap;gap:var(--ds-space-4)">' + radii.map(function(r) {
      return '<div style="width:160px;text-align:center"><div style="width:80px;height:80px;margin:0 auto var(--ds-space-2);background:var(--ds-color-brand-primary);border-radius:' + cp(r.token) + ';display:flex;align-items:center;justify-content:center;color:white;font-size:var(--ds-typography-size-xs)"></div><span style="font-size:var(--ds-typography-size-sm);font-weight:500">' + r.label + '</span><br><span style="font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-secondary)">' + cp(r.token) + "</span></div>";
    }).join("") + "</div></div>";
  }
  function renderOpacitySection() {
    var opacities = ["invisible", "subtle", "light", "medium", "heavy", "solid"];
    return '<div class="ds-section" id="ds-section-opacity"><h2 class="ds-section__title">Opacity</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Opacity tokens for overlays and surfaces</p><div style="display:flex;flex-wrap:wrap;gap:var(--ds-space-4)">' + opacities.map(function(o) {
      var val = "var(--ds-opacity-" + o + ")";
      return '<div style="width:120px;text-align:center"><div style="width:80px;height:60px;margin:0 auto var(--ds-space-2);background:var(--ds-color-brand-primary);opacity:' + val + ';border-radius:var(--ds-radius-md)"></div><span style="font-size:var(--ds-typography-size-sm);font-weight:500">' + o + '</span><br><span style="font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-secondary)">' + val + "</span></div>";
    }).join("") + "</div></div>";
  }
  function renderZindexSection() {
    var layers = [
      { label: "Dropdown", val: "var(--ds-zindex-dropdown)" },
      { label: "Sticky", val: "var(--ds-zindex-sticky)" },
      { label: "Sidebar", val: "var(--ds-zindex-sidebar)" },
      { label: "Modal", val: "var(--ds-zindex-modal)" },
      { label: "Toast", val: "var(--ds-zindex-toast)" },
      { label: "Tooltip", val: "var(--ds-zindex-tooltip)" }
    ];
    return '<div class="ds-section" id="ds-section-zindex"><h2 class="ds-section__title">Z-Index Scale</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Z-index tokens for layered UI elements</p><div style="display:flex;flex-direction:column;gap:var(--ds-space-3);max-width:400px">' + layers.slice().reverse().map(function(l, i) {
      var z = parseInt(l.val.replace("var(--ds-zindex-", "").replace(")", ""));
      var h = 30 + i * 12;
      return '<div style="display:flex;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-2) var(--ds-space-3);background:var(--ds-color-surface-card);border:1px solid var(--ds-color-border-light);border-radius:var(--ds-radius-md);z-index:' + l.val + ';position:relative"><span style="width:24px;height:24px;border-radius:4px;background:var(--ds-color-brand-primary);opacity:0.8;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:600">' + (6 - i) + '</span><span style="flex:1;font-size:var(--ds-typography-size-sm)">' + l.label + '</span><span style="font-size:var(--ds-typography-size-xs);color:var(--ds-color-text-secondary)">' + l.val + "</span></div>";
    }).join("") + "</div></div>";
  }
  function renderEmptyStatesSection() {
    return '<div class="ds-section" id="ds-section-emptystates"><h2 class="ds-section__title">Empty States</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Empty state patterns for data views</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:var(--ds-space-4)"><div class="card"><div class="card__body">' + SkeletonLoader.getEmptyState(
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
      "No data yet",
      "Get started by adding your first item"
    ) + '</div></div><div class="card"><div class="card__body">' + SkeletonLoader.getEmptyState(
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      "No results found",
      "Try different search terms or filters"
    ) + '</div></div><div class="card"><div class="card__body">' + SkeletonLoader.getEmptyState(
      '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      "Error loading data",
      "Something went wrong. Please try again.",
      { label: "Retry" }
    ) + "</div></div></div></div>";
  }
  function renderStatesSection() {
    var states = typeof StateRenderer !== "undefined" ? [
      { label: "Loading (table)", html: StateRenderer.loading("table") },
      { label: "Loading (card)", html: StateRenderer.loading("card") },
      { label: "Loading (row)", html: StateRenderer.loading("row") },
      { label: "Empty", html: '<table style="width:100%"><tbody>' + StateRenderer.empty(6) + "</tbody></table>" },
      { label: "Filtered Empty", html: '<table style="width:100%"><tbody>' + StateRenderer.filteredEmpty("search term", "active", 6) + "</tbody></table>" },
      { label: "Error", html: '<table style="width:100%"><tbody>' + StateRenderer.error("Something went wrong while fetching data", "retryDemo", 6) + "</tbody></table>" }
    ] : [];
    var html = '<div class="ds-section" id="ds-section-states"><h2 class="ds-section__title">State Coverage</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">All async data views follow the same lifecycle: Loading \u2192 Loaded | Empty | Error</p><div style="display:grid;gap:var(--ds-space-6);grid-template-columns:repeat(auto-fill,minmax(400px,1fr))">';
    states.forEach(function(s) {
      html += '<div style="background:var(--ds-color-surface-card);border-radius:var(--ds-radius-lg);border:1px solid var(--ds-color-border-light);overflow:hidden"><div style="padding:var(--ds-space-3) var(--ds-space-4);border-bottom:1px solid var(--ds-color-border-light);font-size:var(--ds-typography-size-xs);font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:var(--ds-color-text-secondary)">' + s.label + '</div><div style="padding:var(--ds-space-3)">' + s.html + "</div></div>";
    });
    html += "</div></div>";
    return html;
  }
  window.retryDemo = function() {
    alert("Retry triggered! In a real app this would re-fetch data.");
  };
  function renderPlaygroundSection() {
    return `<div class="ds-section" id="ds-section-playground"><h2 class="ds-section__title">Component Playground</h2><p class="ds-section__desc" style="color:var(--ds-color-text-secondary);margin-bottom:var(--ds-space-6)">Interactive sandbox to test components live</p><div style="display:grid;grid-template-columns:200px 1fr;gap:var(--ds-space-6);background:var(--ds-color-surface-card);border-radius:var(--ds-radius-lg);border:1px solid var(--ds-color-border-light);padding:var(--ds-space-5);min-height:300px"><div><h3 style="font-size:var(--ds-typography-size-sm);font-weight:600;margin-bottom:var(--ds-space-3)">Controls</h3><div style="display:flex;flex-direction:column;gap:var(--ds-space-2)"><label style="display:flex;align-items:center;gap:var(--ds-space-2);font-size:var(--ds-typography-size-sm);cursor:pointer"><input type="checkbox" id="pgHover" onchange="document.querySelectorAll('.pg-preview').forEach(function(e){e.classList.toggle('ds-sim-hover',this.checked)},this)"> Simulate Hover</label><label style="display:flex;align-items:center;gap:var(--ds-space-2);font-size:var(--ds-typography-size-sm);cursor:pointer"><input type="checkbox" id="pgDisabled" onchange="document.querySelectorAll('.pg-preview button,.pg-preview input').forEach(function(e){e.disabled=this.checked},this)"> Disabled</label><label style="display:flex;align-items:center;gap:var(--ds-space-2);font-size:var(--ds-typography-size-sm);cursor:pointer"><input type="checkbox" id="pgDark" onchange="ThemeManager.toggle()"> Toggle Dark</label></div></div><div class="pg-preview" style="display:flex;flex-direction:column;gap:var(--ds-space-4)"><div style="display:flex;gap:var(--ds-space-2);flex-wrap:wrap"><button class="btn btn--primary">Primary</button><button class="btn btn--secondary">Secondary</button><button class="btn btn--danger">Danger</button></div><div><input type="text" class="form-input" placeholder="Type something..." style="width:100%"></div><div class="toggle active"><div class="toggle__track"></div><span>Toggle me</span></div><div><span class="status-badge status-badge--active">Active</span> <span class="status-badge status-badge--pending">Pending</span> <span class="status-badge status-badge--failed">Failed</span></div></div></div></div>`;
  }
  var sectionRenderers = {
    colors: renderColorsSection,
    typography: renderTypographySection,
    spacing: renderSpacingSection,
    shadows: renderShadowsSection,
    buttons: renderButtonsSection,
    inputs: renderInputsSection,
    cards: renderCardsSection,
    badges: renderBadgesSection,
    modals: renderModalsSection,
    toasts: renderToastsSection,
    tables: renderTablesSection,
    pagination: renderPaginationSection,
    skeletons: renderSkeletonsSection,
    border: renderBorderSection,
    opacity: renderOpacitySection,
    zindex: renderZindexSection,
    emptystates: renderEmptyStatesSection,
    states: renderStatesSection,
    playground: renderPlaygroundSection
  };
  function init() {
    var navBtns = document.querySelectorAll(".ds-nav-btn");
    navBtns.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var sectionId = this.dataset.dsSection;
        navBtns.forEach(function(b) {
          b.classList.remove("ds-nav-btn--active");
        });
        this.classList.add("ds-nav-btn--active");
        activeSection = sectionId;
        var content = document.getElementById("dsContent");
        if (content && sectionRenderers[sectionId]) {
          content.innerHTML = sectionRenderers[sectionId]();
          content.scrollTop = 0;
        }
      });
    });
    var themeToggle = document.getElementById("dsThemeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", function() {
        ThemeManager.toggle();
        var label = document.getElementById("dsModeLabel");
        if (label) label.textContent = (ThemeManager.getCurrent() === "dark" ? "Dark" : "Light") + " mode";
      });
    }
    return function cleanup() {
    };
  }
  window.copyToken = function(name) {
    var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText("var(" + name + ")");
      if (typeof ToastSystem !== "undefined") ToastSystem.info("Copied: var(" + name + ")");
    }
  };
  return { render, init };
})();
