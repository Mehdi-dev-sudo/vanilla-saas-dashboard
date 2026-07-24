const SupportPage = typeof BaseComponent !== "undefined" ? BaseComponent.create({
  render: function() {
    return '<div class="page-header"><div><h1 class="page-header__title">Support</h1><p class="page-header__subtitle">Frequently asked questions and contact form</p></div></div><div class="card"><div class="card__header"><div><h3 class="card__title">Frequently Asked Questions</h3><span class="card__subtitle">Quick answers to common questions</span></div></div><div class="card__body"><div class="faq-list" id="faqList">' + renderFaqItem(0, "How do I reset my password?", 'To reset your password, go to the login page and click "Forgot Password". You will receive an email with a password reset link. Follow the instructions in the email to set a new password.') + renderFaqItem(1, "How can I upgrade my plan?", 'Navigate to the Settings page and click the "Upgrade" button next to your current plan. You will be guided through the upgrade process, and the changes will take effect immediately.') + renderFaqItem(2, "Can I export my data?", 'Yes, you can export your data at any time. Go to the Transactions page and click the "Export CSV" button to download your transaction history in CSV format.') + renderFaqItem(3, "How do I invite team members?", 'Go to the Users page and click the "Add User" button. Enter their name, email, and select their role. They will receive an invitation email with instructions to join.') + renderFaqItem(4, "Is my data secure?", "Absolutely. We use industry-standard encryption protocols to protect your data. All data is encrypted at rest and in transit. We also comply with GDPR and SOC 2 standards.") + renderFaqItem(5, "How do I change notification preferences?", "You can manage your notification preferences in the Settings page. Toggle email notifications, push notifications, and weekly digest options on or off as needed.") + '</div></div></div><div class="card"><div class="card__header"><div><h3 class="card__title">Contact Support</h3><span class="card__subtitle">We typically respond within 24 hours</span></div></div><div class="card__body"><div class="form-row"><div class="form-group"><label class="form-label" for="contactName">Name</label><input type="text" class="form-input" id="contactName" name="name" placeholder="Your name"><span class="form-error" id="contactNameError" role="alert" style="display:none"></span></div><div class="form-group"><label class="form-label" for="contactEmail">Email</label><input type="email" class="form-input" id="contactEmail" name="email" placeholder="your@email.com"><span class="form-error" id="contactEmailError" role="alert" style="display:none"></span></div></div><div class="form-group"><label class="form-label" for="contactSubject">Subject</label><input type="text" class="form-input" id="contactSubject" name="subject" placeholder="How can we help?"><span class="form-error" id="contactSubjectError" role="alert" style="display:none"></span></div><div class="form-group"><label class="form-label" for="contactMessage">Message</label><textarea class="form-textarea" id="contactMessage" name="message" placeholder="Describe your issue..." rows="4"></textarea><span class="form-error" id="contactMessageError" role="alert" style="display:none"></span></div><div class="form-actions" style="display:flex;gap:var(--space-sm);margin-top:var(--space-md)"><button class="btn btn--primary" id="contactSubmitBtn">Send Message</button><button class="btn btn--secondary" id="contactClearBtn">Clear</button></div></div></div>';
  },
  init: function() {
    setupFaqAccordion();
    setupContactForm();
  }
}) : /* @__PURE__ */ (function() {
  function render() {
    return "";
  }
  function init() {
  }
  return { render, init };
})();
function renderFaqItem(index, question, answer) {
  var answerId = "faq-answer-" + index;
  return '<div class="faq-item" data-faq="' + index + '"><div class="faq-item__question" tabindex="0" role="button" aria-expanded="false" aria-controls="' + answerId + '"><span>' + question + '</span><svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-item__answer" id="' + answerId + '" role="region">' + answer + "</div></div>";
}
function setupFaqAccordion() {
  document.querySelectorAll(".faq-item__question").forEach(function(q) {
    q.addEventListener("click", function() {
      var item = this && this.closest ? this.closest(".faq-item") : null;
      if (!item) return;
      var isOpen = item.classList.contains("open");
      var question = item.querySelector(".faq-item__question");
      document.querySelectorAll(".faq-item.open").forEach(function(openItem) {
        openItem.classList.remove("open");
        var q2 = openItem.querySelector(".faq-item__question");
        if (q2) q2.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        if (question) question.setAttribute("aria-expanded", "true");
      }
    });
    q.addEventListener("keydown", function(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}
function setupContactForm() {
  var submitBtn = document.getElementById("contactSubmitBtn");
  var clearBtn = document.getElementById("contactClearBtn");
  if (submitBtn) submitBtn.addEventListener("click", function() {
    var name = document.getElementById("contactName");
    var email = document.getElementById("contactEmail");
    var subject = document.getElementById("contactSubject");
    var message = document.getElementById("contactMessage");
    var valid = true;
    [name, email, subject, message].forEach(function(el) {
      if (!el.value.trim()) {
        el.classList.add("form-input--error");
        var errEl2 = document.getElementById(el.id + "Error");
        if (errEl2) {
          errEl2.textContent = "This field is required";
          errEl2.style.display = "block";
        }
        valid = false;
      } else {
        el.classList.remove("form-input--error");
        var errEl2 = document.getElementById(el.id + "Error");
        if (errEl2) {
          errEl2.style.display = "none";
        }
      }
    });
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add("form-input--error");
      var errEl = document.getElementById("contactEmailError");
      if (errEl) {
        errEl.textContent = "Please enter a valid email";
        errEl.style.display = "block";
      }
      valid = false;
    }
    if (valid) {
      if (typeof ToastSystem !== "undefined") ToastSystem.success("Message sent! We will get back to you soon.");
      [name, email, subject, message].forEach(function(el) {
        if (el) el.value = "";
      });
    }
  });
  if (clearBtn) clearBtn.addEventListener("click", function() {
    ["contactName", "contactEmail", "contactSubject", "contactMessage"].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
      var errEl = document.getElementById(id + "Error");
      if (errEl) {
        errEl.style.display = "none";
      }
      var input = document.getElementById(id);
      if (input) input.classList.remove("form-input--error");
    });
  });
}
