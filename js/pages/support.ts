/**
 * SupportPage — Support/FAQ page with accordion sections and contact form.
 * @module SupportPage
 */
const SupportPage = (function () {

  function render() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Support</h1>
          <p class="page-header__subtitle">Frequently asked questions and contact form</p>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Frequently Asked Questions</h3>
            <span class="card__subtitle">Quick answers to common questions</span>
          </div>
        </div>
        <div class="card__body">
          <div class="faq-list" id="faqList">
            ${renderFaqItem(0, 'How do I reset my password?', 'To reset your password, go to the login page and click "Forgot Password". You will receive an email with a password reset link. Follow the instructions in the email to set a new password.')}
            ${renderFaqItem(1, 'How can I upgrade my plan?', 'Navigate to the Settings page and click the "Upgrade" button next to your current plan. You will be guided through the upgrade process, and the changes will take effect immediately.')}
            ${renderFaqItem(2, 'Can I export my data?', 'Yes, you can export your data at any time. Go to the Transactions page and click the "Export CSV" button to download your transaction history in CSV format.')}
            ${renderFaqItem(3, 'How do I invite team members?', 'Go to the Users page and click the "Add User" button. Enter their name, email, and select their role. They will receive an invitation email with instructions to join.')}
            ${renderFaqItem(4, 'Is my data secure?', 'Absolutely. We use industry-standard encryption protocols to protect your data. All data is encrypted at rest and in transit. We also comply with GDPR and SOC 2 standards.')}
            ${renderFaqItem(5, 'How do I change notification preferences?', 'You can manage your notification preferences in the Settings page. Toggle email notifications, push notifications, and weekly digest options on or off as needed.')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Contact Us</h3>
            <span class="card__subtitle">We usually respond within 24 hours</span>
          </div>
        </div>
        <div class="card__body">
          <form class="contact-form" id="contactForm" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="contactName">Full Name <span class="form-label__required">*</span></label>
                <input type="text" class="form-input" id="contactName" name="name" placeholder="Your name" required>
                <span class="form-error" id="contactNameError" role="alert" style="display:none"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="contactEmail">Email <span class="form-label__required">*</span></label>
                <input type="email" class="form-input" id="contactEmail" name="email" placeholder="your@email.com" required>
                <span class="form-error" id="contactEmailError" role="alert" style="display:none"></span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactSubject">Subject <span class="form-label__required">*</span></label>
              <select class="form-select" id="contactSubject" name="subject" required>
                <option value="">Select a topic...</option>
                <option value="billing">Billing Issue</option>
                <option value="technical">Technical Support</option>
                <option value="account">Account Management</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
              <span class="form-error" id="contactSubjectError" role="alert" style="display:none"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="contactMessage">Message <span class="form-label__required">*</span></label>
              <textarea class="form-textarea" id="contactMessage" name="message" placeholder="Describe your issue in detail..." rows="5" required></textarea>
              <span class="form-error" id="contactMessageError" role="alert" style="display:none"></span>
            </div>
            <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:var(--space-md)">
              <span style="font-size:var(--font-sm);color:var(--text-tertiary)">We typically respond within 24 hours</span>
              <button type="submit" class="btn btn--primary btn--lg">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderFaqItem(index, question, answer) {
    var answerId = 'faq-answer-' + index;
    return `
      <div class="faq-item" data-faq="${index}">
        <div class="faq-item__question" tabindex="0" role="button" aria-expanded="false" aria-controls="${answerId}">
          <span>${question}</span>
          <svg class="faq-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-item__answer" id="${answerId}" role="region">${answer}</div>
      </div>
    `;
  }

  function toggleFaq(e) {
    var item = this && this.closest ? this.closest('.faq-item') : null;
    if (!item) return;
    var isOpen = item.classList.contains('open');
    var question = item.querySelector('.faq-item__question');

    document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
      openItem.classList.remove('open');
      var q = openItem.querySelector('.faq-item__question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      if (question) question.setAttribute('aria-expanded', 'true');
    }
  }

  function init() {
    document.querySelectorAll('.faq-item__question').forEach(function (q) {
      q.addEventListener('click', toggleFaq);
      q.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFaq.call(this, e);
        }
      });
    });

    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      isValid = validateField('contactName', 'contactNameError', 'Name is required') && isValid;
      isValid = validateField('contactEmail', 'contactEmailError', 'Email is required', function (val) {
        return val.includes('@') ? '' : 'Please enter a valid email address';
      }) && isValid;
      isValid = validateField('contactSubject', 'contactSubjectError', 'Please select a topic') && isValid;
      isValid = validateField('contactMessage', 'contactMessageError', 'Message is required') && isValid;

      if (isValid) {
        var nameEl = document.getElementById('contactName');
        var emailEl = document.getElementById('contactEmail');
        var subjectEl = document.getElementById('contactSubject');
        var msgEl = document.getElementById('contactMessage');
        const data = {
          name: nameEl ? nameEl.value : '',
          email: emailEl ? emailEl.value : '',
          subject: subjectEl ? subjectEl.value : '',
          message: msgEl ? msgEl.value : ''
        };

        if (typeof ToastSystem !== 'undefined') ToastSystem.success('Message sent successfully! We will get back to you within 24 hours.');
        form.reset();
      }
    });

    ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () {
        clearFieldError(id + 'Error');
        this.classList.remove('form-input--error');
      });
    });

    return function cleanup() {};
  }

  function validateField(inputId, errorId, requiredMsg, validator) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!input) return false;
    const val = input.value.trim();

    if (!val) {
      showFieldError(input, errorEl, requiredMsg);
      return false;
    }

    if (typeof validator === 'function') {
      const msg = validator(val);
      if (msg) {
        showFieldError(input, errorEl, msg);
        return false;
      }
    }

    clearFieldError(errorId);
    input.classList.remove('form-input--error');
    return true;
  }

  function showFieldError(input, errorEl, msg) {
    input.classList.add('form-input--error');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function clearFieldError(errorId) {
    const el = document.getElementById(errorId);
    if (el) {
      el.textContent = '';
      el.style.display = 'none';
    }
  }

  return { render, init };
})();
