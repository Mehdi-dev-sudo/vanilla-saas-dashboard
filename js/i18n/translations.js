(function () {
  var dict = {
    en: {
      common: { cancel: 'Cancel', confirm: 'Confirm', save: 'Save', close: 'Close', loading: 'Loading...', back: 'Back' },
      route: { dashboard: 'Dashboard', analytics: 'Analytics', users: 'Users', transactions: 'Transactions', settings: 'Settings', support: 'Support', error: 'Error' },
      breadcrumb: { home: 'Home' },
      header: {
        search: { placeholder: 'Search users, transactions...', focusPlaceholder: 'Search users or transactions...' },
        online: '{count} online', lastUpdated: 'Updated {time}',
        api: { online: 'API ✓', mock: 'Mock' },
        profile: { plan: 'Enterprise Plan' }
      },
      table: { invoice: 'Invoice', customer: 'Customer', amount: 'Amount', status: 'Status', date: 'Date', method: 'Method', name: 'Name', email: 'Email', role: 'Role', plan: 'Plan', revenue: 'Revenue', actions: 'Actions' },
      role: { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' },
      plan: { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' },
      status: { active: 'Active', inactive: 'Inactive', suspended: 'Suspended', completed: 'Completed', pending: 'Pending', failed: 'Failed', refunded: 'Refunded' },
      pagination: { pageOf: 'Page {page} of {totalPages}', prev: 'Previous', next: 'Next' },
      dashboard: {
        title: 'Dashboard',
        subtitle: "Welcome back {name}! Here's what's happening today.",
        widgets: { configure: 'Configure widgets', button: 'Widgets', configTitle: 'Configure Widgets' },
        stat: { totalRevenue: 'Total Revenue', activeUsers: 'Active Users', subscribers: 'Subscribers', churnRate: 'Churn Rate' },
        chart: { revenueOverview: { title: 'Revenue Overview', subtitle: 'Monthly revenue for the past 12 months' }, userGrowth: { title: 'User Growth', subtitle: 'New users acquired per month' }, download: 'Download', downloadTooltip: 'Download chart' },
        transactions: { title: 'Recent Transactions', subtitle: 'Latest payment activities', viewAll: 'View All' },
        traffic: { title: 'Traffic Sources', subtitle: "Where your visitors come from" },
        quickActions: { title: 'Quick Actions', subtitle: 'Common tasks', addUser: 'Add User', exportCsv: 'Export CSV', toggleTheme: 'Toggle Theme', quickSearch: 'Quick Search', settings: 'Settings', undo: 'Undo' },
        activity: { title: 'Recent Activity', subtitle: 'Latest actions and events', clear: 'Clear', empty: 'No recent activity' },
        recentUsers: { title: 'Recent Users', subtitle: 'Latest team members', viewAll: 'View All' },
        export: { button: 'Export' }
      },
      analytics: {
        title: 'Analytics', subtitle: 'Detailed metrics and performance trends',
        exportReport: 'Export Report', refresh: 'Refresh',
        stat: { totalRevenue: 'Total Revenue', avgOrderValue: 'Avg. Order Value', conversionRate: 'Conversion Rate' },
        chart: {
          revenueTrend: { title: 'Revenue Trend', subtitle: 'Monthly revenue over time', tabYearly: 'Yearly', tabQuarterly: 'Quarterly' },
          userAcquisition: { title: 'User Acquisition', subtitle: 'New users per month' },
          refundRate: { title: 'Refund & Dispute Rate', subtitle: 'Monthly refund amounts' }
        }
      },
      users: {
        title: 'Users', subtitle: 'Manage your team members and their permissions',
        addUser: 'Add User', selectAll: 'Select all',
        search: { placeholder: 'Search users...' },
        filter: { status: { all: 'All Status', active: 'Active', inactive: 'Inactive', suspended: 'Suspended' }, role: { all: 'All Roles' } },
        empty: { title: 'No users found', hint: 'Try adjusting your search or filter criteria' },
        action: { edit: 'Edit', delete: 'Delete' },
        form: { fullName: 'Full Name', email: 'Email', role: 'Role', plan: 'Plan' },
        modal: { addTitle: 'Add New User', addSubmit: 'Add User', editTitle: 'Edit User', saveChanges: 'Save Changes', deleteTitle: 'Delete User', deleteMessage: 'Are you sure you want to delete {name}? This action cannot be undone.', deleteConfirm: 'Delete' },
        validation: { nameRequired: 'Name is required', emailRequired: 'Email is required', emailInvalid: 'Invalid email format' },
        batch: { selected: '{count} selected', deleteSelected: 'Delete Selected', exportSelected: 'Export Selected' },
        pagination: { info: '{count} users', searchInfo: '{count} results for "{search}"' }
      },
      transactions: {
        title: 'Transactions', subtitle: 'View and manage all payment transactions',
        exportCsv: 'Export CSV', copyInvoice: 'Copy invoice',
        search: { placeholder: 'Search transactions...' },
        filter: { status: { all: 'All Status' }, method: { all: 'All Methods' } },
        empty: { title: 'No transactions found', hint: 'Try adjusting your search or filter criteria' },
        pagination: { info: '{count} transactions', searchInfo: '{count} results for "{search}"' },
        method: { creditCard: 'Credit Card', paypal: 'PayPal', bankTransfer: 'Bank Transfer', wireTransfer: 'Wire Transfer', ach: 'ACH' }
      },
      settings: {
        title: 'Settings', subtitle: 'Manage your application preferences',
        saveChanges: 'Save Changes', resetToDefaults: 'Reset to Defaults',
        section: {
          appearance: 'Appearance', appearanceDesc: 'Customize the look and feel',
          notifications: 'Notifications', notificationsDesc: 'Configure how you receive notifications',
          dashboard: 'Dashboard', dashboardDesc: 'Configure your dashboard layout',
          account: 'Account', accountDesc: 'Your account information'
        },
        theme: 'Theme', themeDesc: 'Switch between light and dark mode',
        language: 'Language', languageDesc: 'Interface language',
        density: 'Density', densityDesc: 'Controls the spacing in the interface',
        accentColor: 'Accent Color', accentColorDesc: 'Primary brand color',
        animations: 'Animations', animationsDesc: 'Enable UI animations and transitions',
        reducedMotion: 'Reduced Motion', reducedMotionDesc: 'Minimize animations for accessibility',
        dateFormat: 'Date Format', dateFormatDesc: 'Display format for dates',
        currency: 'Currency', currencyDesc: 'Currency symbol for revenue',
        compactView: 'Compact View', compactViewDesc: 'Use a more compact layout with less spacing',
        defaultPage: 'Default Page', defaultPageDesc: 'Landing page after login',
        sidebarCollapsed: 'Sidebar Collapsed', sidebarCollapsedDesc: 'Start with sidebar collapsed by default',
        autoSave: 'Auto-Save', autoSaveDesc: 'Automatically save changes as you work',
        showActivityLog: 'Activity Log', showActivityLogDesc: 'Show recent activity on dashboard',
        showQuickActions: 'Quick Actions', showQuickActionsDesc: 'Show quick action buttons on dashboard',
        emailNotifications: 'Email Notifications', emailNotificationsDesc: 'Receive email alerts for important updates',
        pushNotifications: 'Push Notifications', pushNotificationsDesc: 'Receive push notifications in your browser',
        weeklyDigest: 'Weekly Digest', weeklyDigestDesc: 'Receive a weekly summary of your account activity',
        account: { name: 'Name', email: 'Email', plan: 'Plan', planValue: 'Enterprise Plan', upgrade: 'Upgrade' },
        color: { indigo: 'Indigo', blue: 'Blue', green: 'Green', purple: 'Purple', orange: 'Orange', red: 'Red' },
        densityOpt: { comfortable: 'Comfortable', compact: 'Compact', cozy: 'Cozy' },
        modal: { resetTitle: 'Reset Settings', resetMessage: 'Are you sure you want to reset all settings to their default values?', resetConfirm: 'Reset' }
      },
      support: {
        title: 'Support', subtitle: 'Frequently asked questions and contact form',
        faq: { title: 'Frequently Asked Questions', subtitle: 'Quick answers to common questions' },
        contact: { title: 'Contact Us', subtitle: 'We usually respond within 24 hours', fullName: 'Full Name', namePlaceholder: 'Your name', email: 'Email', emailPlaceholder: 'your@email.com', subject: 'Subject', selectTopic: 'Select a topic...', message: 'Message', messagePlaceholder: 'Describe your issue in detail...', responseTime: 'We typically respond within 24 hours', send: 'Send Message' },
        topic: { billing: 'Billing Issue', technical: 'Technical Support', account: 'Account Management', feature: 'Feature Request', other: 'Other' },
        validation: { nameRequired: 'Name is required', emailInvalid: 'Please enter a valid email address', subjectRequired: 'Please select a topic', messageRequired: 'Message is required' }
      },
      error: {
        404: { title: 'Page Not Found', message: 'The page you are looking for does not exist or has been moved.' },
        500: { title: 'Server Error', message: 'Something went wrong on our end. Please try again later.' },
        network: { code: 'No Connection', title: 'Network Error', message: 'Unable to connect to the server. Please check your internet connection.' },
        generic: { title: 'Something went wrong' },
        goToDashboard: 'Go to Dashboard', goBack: 'Go Back', reload: 'Reload'
      },
      auth: {
        login: { title: 'Sign in to SaaSify', subtitle: 'Enter your credentials to access the dashboard', usernameLabel: 'Username or Email', usernamePlaceholder: 'Enter your username', passwordLabel: 'Password', passwordPlaceholder: 'Enter your password', rememberMe: 'Remember me', forgotPassword: 'Forgot password?', signIn: 'Sign In', demoHint: 'Demo: any username / password (3+ chars)' },
        validation: { allFields: 'Please fill in all fields', passwordLength: 'Password must be at least 3 characters' },
        modal: { signOutTitle: 'Sign Out', signOutMessage: 'Are you sure you want to sign out?', signOutConfirm: 'Sign Out' },
        guest: 'Guest'
      },
      toast: {
        changesSaved: 'Changes saved',
        dashboard: { exported: 'Dashboard exported successfully' },
        analytics: { exported: 'Analytics report exported as PDF', refreshed: 'Data refreshed successfully' },
        users: { added: 'User "{name}" added successfully', updated: 'User "{name}" updated successfully', deleted: 'User deleted successfully', batchDeleted: '{count} user(s) deleted', batchExported: '{count} user(s) exported' },
        transactions: { csvExported: 'CSV file exported successfully' },
        settings: { saved: 'Settings saved successfully', reset: 'Settings reset to defaults', optionApplied: '{name} applied' },
        auth: { welcome: 'Welcome, {name}!', noPasswordReset: 'Password reset is not available in demo' },
        notifications: { markedRead: 'All notifications marked as read' },
        clipboard: { copied: 'Copied: {text}', failed: 'Failed to copy' },
        history: { nothingToUndo: 'Nothing to undo', undoSuccessful: 'Undo successful', nothingToRedo: 'Nothing to redo', redoSuccessful: 'Redo successful' },
        chart: { notFound: 'Chart not found', downloaded: 'Chart downloaded' },
        support: { messageSent: 'Message sent successfully! We will get back to you within 24 hours.' },
        devConsole: { cacheCleared: 'API cache cleared', storageCleared: 'Storage cleared' },
        contextMenu: { emailCopied: 'Email copied', userDuplicated: 'User duplicated', invoiceCopied: 'Invoice copied', rowExported: 'Row exported' }
      },
      commandPalette: {
        placeholder: 'Type > for actions, or search...',
        escHint: 'ESC to close',
        empty: 'No commands found',
        category: { navigation: 'Navigation', actions: 'Actions', pages: 'Pages', recent: 'Recent' },
        footer: { navigate: 'Navigate', select: 'Select', actions: '> Actions', esc: 'ESC Cancel' }
      },
      devConsole: {
        title: 'Developer Console',
        metric: { fps: 'FPS', memory: 'Memory', domNodes: 'DOM Nodes', storage: 'Storage' },
        detail: { route: 'Route', theme: 'Theme', auth: 'Auth', users: 'Users', transactions: 'Transactions', apiStatus: 'API Status', settings: 'Settings' },
        action: { clearCache: 'Clear Cache', clearStorage: 'Clear Storage', resetData: 'Reset All Data' },
        confirm: { clearStorage: 'Clear all localStorage?', resetData: 'Reset all data to defaults?' }
      },
      time: { justNow: 'Just now', minutesAgo: '{n}m ago', hoursAgo: '{n}h ago', daysAgo: '{n}d ago' },
      trafficSource: { organic: 'Organic', social: 'Social', direct: 'Direct', referral: 'Referral', email: 'Email' },
      language: { en: 'English', fa: 'Persian (RTL)', de: 'Deutsch', fr: 'Français', es: 'Español' }
    },

    fa: {
      common: { cancel: 'لغو', confirm: 'تأیید', save: 'ذخیره', close: 'بستن', loading: 'در حال بارگذاری...', back: 'بازگشت' },
      route: { dashboard: 'داشبورد', analytics: 'تحلیل', users: 'کاربران', transactions: 'تراکنش‌ها', settings: 'تنظیمات', support: 'پشتیبانی', error: 'خطا' },
      breadcrumb: { home: 'خانه' },
      header: {
        search: { placeholder: 'جستجوی کاربران، تراکنش‌ها...', focusPlaceholder: 'جستجوی کاربران یا تراکنش‌ها...' },
        online: '{count} آنلاین', lastUpdated: 'آخرین به‌روزرسانی {time}',
        api: { online: 'API ✓', mock: 'آفلاین' },
        profile: { plan: 'طرح سازمانی' }
      },
      table: { invoice: 'فاکتور', customer: 'مشتری', amount: 'مبلغ', status: 'وضعیت', date: 'تاریخ', method: 'روش', name: 'نام', email: 'ایمیل', role: 'نقش', plan: 'طرح', revenue: 'درآمد', actions: 'عملیات' },
      role: { admin: 'مدیر', editor: 'ویرایشگر', viewer: 'بیننده' },
      plan: { free: 'رایگان', pro: 'حرفه‌ای', enterprise: 'سازمانی' },
      status: { active: 'فعال', inactive: 'غیرفعال', suspended: 'معلق', completed: 'تکمیل شده', pending: 'در انتظار', failed: 'ناموفق', refunded: 'بازگشت وجه' },
      pagination: { pageOf: 'صفحه {page} از {totalPages}', prev: 'قبلی', next: 'بعدی' },
      dashboard: {
        title: 'داشبورد',
        subtitle: 'خوش آمدید {name}! خلاصه وضعیت امروز:',
        widgets: { configure: 'تنظیم ویجت‌ها', button: 'ویجت‌ها', configTitle: 'تنظیم ویجت‌ها' },
        stat: { totalRevenue: 'کل درآمد', activeUsers: 'کاربران فعال', subscribers: 'مشترکین', churnRate: 'نرخ ریزش' },
        chart: { revenueOverview: { title: 'نمای کلی درآمد', subtitle: 'درآمد ماهانه در ۱۲ ماه گذشته' }, userGrowth: { title: 'رشد کاربران', subtitle: 'کاربران جدید در ماه' }, download: 'دانلود', downloadTooltip: 'دانلود نمودار' },
        transactions: { title: 'تراکنش‌های اخیر', subtitle: 'آخرین فعالیت‌های پرداخت', viewAll: 'مشاهده همه' },
        traffic: { title: 'منابع ترافیک', subtitle: 'بازدیدکنندگان از کجا می‌آیند' },
        quickActions: { title: 'عملیات سریع', subtitle: 'کارهای رایج', addUser: 'افزودن کاربر', exportCsv: 'خروجی CSV', toggleTheme: 'تغییر پوسته', quickSearch: 'جستجوی سریع', settings: 'تنظیمات', undo: 'بازگشت' },
        activity: { title: 'فعالیت‌های اخیر', subtitle: 'آخرین رویدادها', clear: 'پاک کردن', empty: 'فعالیتی وجود ندارد' },
        recentUsers: { title: 'کاربران اخیر', subtitle: 'آخرین اعضای تیم', viewAll: 'مشاهده همه' },
        export: { button: 'خروجی' }
      },
      analytics: {
        title: 'تحلیل', subtitle: 'معیارهای دقیق و روندهای عملکرد',
        exportReport: 'خروجی گزارش', refresh: 'به‌روزرسانی',
        stat: { totalRevenue: 'کل درآمد', avgOrderValue: 'میانگین ارزش سفارش', conversionRate: 'نرخ تبدیل' },
        chart: {
          revenueTrend: { title: 'روند درآمد', subtitle: 'درآمد ماهانه', tabYearly: 'سالانه', tabQuarterly: 'فصلی' },
          userAcquisition: { title: 'جذب کاربر', subtitle: 'کاربران جدید در ماه' },
          refundRate: { title: 'نرخ بازگشت وجه', subtitle: 'مبالغ بازگشتی ماهانه' }
        }
      },
      users: {
        title: 'کاربران', subtitle: 'مدیریت اعضای تیم و دسترسی‌ها',
        addUser: 'افزودن کاربر', selectAll: 'انتخاب همه',
        search: { placeholder: 'جستجوی کاربران...' },
        filter: { status: { all: 'همه وضعیت‌ها', active: 'فعال', inactive: 'غیرفعال', suspended: 'معلق' }, role: { all: 'همه نقش‌ها' } },
        empty: { title: 'کاربری یافت نشد', hint: 'معیارهای جستجو را تغییر دهید' },
        action: { edit: 'ویرایش', delete: 'حذف' },
        form: { fullName: 'نام و نام خانوادگی', email: 'ایمیل', role: 'نقش', plan: 'طرح' },
        modal: { addTitle: 'افزودن کاربر جدید', addSubmit: 'افزودن کاربر', editTitle: 'ویرایش کاربر', saveChanges: 'ذخیره تغییرات', deleteTitle: 'حذف کاربر', deleteMessage: 'آیا از حذف {name} اطمینان دارید؟ این عمل قابل بازگشت نیست.', deleteConfirm: 'حذف' },
        validation: { nameRequired: 'نام الزامی است', emailRequired: 'ایمیل الزامی است', emailInvalid: 'فرمت ایمیل نامعتبر است' },
        batch: { selected: '{count} انتخاب شده', deleteSelected: 'حذف انتخاب شده‌ها', exportSelected: 'خروجی انتخاب شده‌ها' },
        pagination: { info: '{count} کاربر', searchInfo: '{count} نتیجه برای "{search}"' }
      },
      transactions: {
        title: 'تراکنش‌ها', subtitle: 'مشاهده و مدیریت تراکنش‌های پرداخت',
        exportCsv: 'خروجی CSV', copyInvoice: 'کپی فاکتور',
        search: { placeholder: 'جستجوی تراکنش‌ها...' },
        filter: { status: { all: 'همه وضعیت‌ها' }, method: { all: 'همه روش‌ها' } },
        empty: { title: 'تراکنشی یافت نشد', hint: 'معیارهای جستجو را تغییر دهید' },
        pagination: { info: '{count} تراکنش', searchInfo: '{count} نتیجه برای "{search}"' },
        method: { creditCard: 'کارت اعتباری', paypal: 'پی‌پال', bankTransfer: 'انتقال بانکی', wireTransfer: 'حواله', ach: 'ACH' }
      },
      settings: {
        title: 'تنظیمات', subtitle: 'مدیریت تنظیمات برنامه',
        saveChanges: 'ذخیره تغییرات', resetToDefaults: 'بازنشانی به پیش‌فرض',
        section: { appearance: 'ظاهر', appearanceDesc: 'شخصی‌سازی ظاهر', notifications: 'اعلان‌ها', notificationsDesc: 'تنظیم نحوه دریافت اعلان‌ها', dashboard: 'داشبورد', dashboardDesc: 'تنظیم چیدمان داشبورد', account: 'حساب کاربری', accountDesc: 'اطلاعات حساب شما' },
        theme: 'پوسته', themeDesc: 'تغییر بین حالت روشن و تاریک',
        language: 'زبان', languageDesc: 'زبان رابط کاربری',
        density: 'تراکم', densityDesc: 'کنترل فاصله‌ها در رابط',
        accentColor: 'رنگ اصلی', accentColorDesc: 'رنگ اصلی برند',
        animations: 'انیمیشن‌ها', animationsDesc: 'فعال کردن انیمیشن‌ها',
        reducedMotion: 'حرکت کاهش یافته', reducedMotionDesc: 'کمینه کردن انیمیشن‌ها برای دسترسی',
        dateFormat: 'فرمت تاریخ', dateFormatDesc: 'فرمت نمایش تاریخ',
        currency: 'واحد پول', currencyDesc: 'نماد پول برای درآمد',
        compactView: 'نمای فشرده', compactViewDesc: 'استفاده از چیدمان فشرده',
        defaultPage: 'صفحه پیش‌فرض', defaultPageDesc: 'صفحه پس از ورود',
        sidebarCollapsed: 'سایدبار بسته', sidebarCollapsedDesc: 'شروع با سایدبار بسته',
        autoSave: 'ذخیره خودکار', autoSaveDesc: 'ذخیره خودکار تغییرات',
        showActivityLog: 'گزارش فعالیت', showActivityLogDesc: 'نمایش فعالیت‌های اخیر در داشبورد',
        showQuickActions: 'عملیات سریع', showQuickActionsDesc: 'نمایش دکمه‌های عملیات سریع در داشبورد',
        emailNotifications: 'اعلان ایمیل', emailNotificationsDesc: 'دریافت هشدارهای ایمیلی',
        pushNotifications: 'اعلان push', pushNotificationsDesc: 'دریافت اعلان در مرورگر',
        weeklyDigest: 'خلاصه هفتگی', weeklyDigestDesc: 'دریافت خلاصه هفتگی فعالیت',
        account: { name: 'نام', email: 'ایمیل', plan: 'طرح', planValue: 'طرح سازمانی', upgrade: 'ارتقا' },
        color: { indigo: 'نیلی', blue: 'آبی', green: 'سبز', purple: 'بنفش', orange: 'نارنجی', red: 'قرمز' },
        densityOpt: { comfortable: 'راحت', compact: 'فشرده', cozy: 'دنج' },
        modal: { resetTitle: 'بازنشانی تنظیمات', resetMessage: 'آیا از بازنشانی تنظیمات اطمینان دارید؟', resetConfirm: 'بازنشانی' }
      },
      support: {
        title: 'پشتیبانی', subtitle: 'سوالات متداول و فرم تماس',
        faq: { title: 'سوالات متداول', subtitle: 'پاسخ سریع به سوالات رایج' },
        contact: { title: 'تماس با ما', subtitle: 'معمولاً ظرف ۲۴ ساعت پاسخ می‌دهیم', fullName: 'نام و نام خانوادگی', namePlaceholder: 'نام شما', email: 'ایمیل', emailPlaceholder: 'your@email.com', subject: 'موضوع', selectTopic: 'موضوع را انتخاب کنید...', message: 'پیام', messagePlaceholder: 'مشکل خود را شرح دهید...', responseTime: 'معمولاً ظرف ۲۴ ساعت پاسخ می‌دهیم', send: 'ارسال پیام' },
        topic: { billing: 'مشکل صورتحساب', technical: 'پشتیبانی فنی', account: 'مدیریت حساب', feature: 'درخواست ویژگی', other: 'سایر' },
        validation: { nameRequired: 'نام الزامی است', emailInvalid: 'لطفاً یک ایمیل معتبر وارد کنید', subjectRequired: 'لطفاً یک موضوع انتخاب کنید', messageRequired: 'پیام الزامی است' }
      },
      error: {
        404: { title: 'صفحه پیدا نشد', message: 'صفحه مورد نظر وجود ندارد یا منتقل شده است.' },
        500: { title: 'خطای سرور', message: 'مشکلی پیش آمده. لطفاً بعداً تلاش کنید.' },
        network: { code: 'بدون اتصال', title: 'خطای شبکه', message: 'اتصال به سرور ممکن نیست. اتصال اینترنت خود را بررسی کنید.' },
        generic: { title: 'مشکلی پیش آمده' },
        goToDashboard: 'رفتن به داشبورد', goBack: 'بازگشت', reload: 'بارگذاری مجدد'
      },
      auth: {
        login: { title: 'ورود به SaaSify', subtitle: 'برای دسترسی به داشبورد وارد شوید', usernameLabel: 'نام کاربری یا ایمیل', usernamePlaceholder: 'نام کاربری خود را وارد کنید', passwordLabel: 'رمز عبور', passwordPlaceholder: 'رمز عبور خود را وارد کنید', rememberMe: 'مرا به خاطر بسپار', forgotPassword: 'رمز عبور را فراموش کرده‌اید؟', signIn: 'ورود', demoHint: 'دمو: هر نام کاربری / رمز عبور (۳+ کاراکتر)' },
        validation: { allFields: 'لطفاً همه فیلدها را پر کنید', passwordLength: 'رمز عبور باید حداقل ۳ کاراکتر باشد' },
        modal: { signOutTitle: 'خروج', signOutMessage: 'آیا از خروج اطمینان دارید؟', signOutConfirm: 'خروج' },
        guest: 'مهمان'
      },
      toast: {
        changesSaved: 'تغییرات ذخیره شد',
        dashboard: { exported: 'داشبورد با موفقیت خروجی گرفته شد' },
        analytics: { exported: 'گزارش تحلیل با فرمت PDF خروجی شد', refreshed: 'داده‌ها با موفقیت به‌روزرسانی شد' },
        users: { added: 'کاربر "{name}" با موفقیت اضافه شد', updated: 'کاربر "{name}" با موفقیت به‌روزرسانی شد', deleted: 'کاربر با موفقیت حذف شد', batchDeleted: '{count} کاربر حذف شد', batchExported: '{count} کاربر خروجی شد' },
        transactions: { csvExported: 'فایل CSV با موفقیت خروجی شد' },
        settings: { saved: 'تنظیمات ذخیره شد', reset: 'تنظیمات به پیش‌فرض بازگشت', optionApplied: '{name} اعمال شد' },
        auth: { welcome: 'خوش آمدید، {name}!', noPasswordReset: 'بازنشانی رمز عبور در نسخه دمو در دسترس نیست' },
        notifications: { markedRead: 'همه اعلان‌ها به عنوان خوانده شده علامت خوردند' },
        clipboard: { copied: 'کپی شد: {text}', failed: 'کپی ناموفق' },
        history: { nothingToUndo: 'چیزی برای بازگشت وجود ندارد', undoSuccessful: 'بازگشت موفق', nothingToRedo: 'چیزی برای جلو وجود ندارد', redoSuccessful: 'بازگشت به جلو موفق' },
        chart: { notFound: 'نمودار یافت نشد', downloaded: 'نمودار دانلود شد' },
        support: { messageSent: 'پیام با موفقیت ارسال شد! ظرف ۲۴ ساعت پاسخ می‌دهیم.' },
        devConsole: { cacheCleared: 'کش API پاک شد', storageCleared: 'فضای ذخیره‌سازی پاک شد' },
        contextMenu: { emailCopied: 'ایمیل کپی شد', userDuplicated: 'کاربر کپی شد', invoiceCopied: 'فاکتور کپی شد', rowExported: 'ردیف خروجی شد' }
      },
      commandPalette: {
        placeholder: 'برای عملیات > را تایپ کنید یا جستجو کنید...',
        escHint: 'ESC برای بستن',
        empty: 'دستوری یافت نشد',
        category: { navigation: 'ناوبری', actions: 'عملیات', pages: 'صفحات', recent: 'اخیر' },
        footer: { navigate: 'ناوبری', select: 'انتخاب', actions: '> عملیات', esc: 'خروج ESC' }
      },
      devConsole: {
        title: 'کنسول توسعه',
        metric: { fps: 'FPS', memory: 'حافظه', domNodes: 'گره‌های DOM', storage: 'فضا' },
        detail: { route: 'مسیر', theme: 'پوسته', auth: 'ورود', users: 'کاربران', transactions: 'تراکنش‌ها', apiStatus: 'وضعیت API', settings: 'تنظیمات' },
        action: { clearCache: 'پاک کردن کش', clearStorage: 'پاک کردن فضا', resetData: 'بازنشانی همه داده‌ها' },
        confirm: { clearStorage: 'همه localStorage پاک شود؟', resetData: 'همه داده‌ها به پیش‌فرض بازگردد؟' }
      },
      time: { justNow: 'اکنون', minutesAgo: '{n} دقیقه پیش', hoursAgo: '{n} ساعت پیش', daysAgo: '{n} روز پیش' },
      trafficSource: { organic: 'ارگانیک', social: 'اجتماعی', direct: 'مستقیم', referral: 'ارجاعی', email: 'ایمیل' },
      language: { en: 'English', fa: 'فارسی', de: 'Deutsch', fr: 'Français', es: 'Español' }
    }
  };

  for (var lang in dict) {
    I18n.registerTranslations(lang, dict[lang]);
  }
})();
