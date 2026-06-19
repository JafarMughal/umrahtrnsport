// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TRANSLATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const T = {
  ur: {
    dir: 'rtl', lang: 'ur',
    appTitle: 'عمرہ ٹرانسپورٹ مینجمنٹ سسٹم',
    appSub: 'حاجیوں کی آمدورفت کا مکمل ریکارڈ — جدہ، مکہ، مدینہ',
    nav: ['📝 نئی', '💰 ادائیگی', '📒 لیجر', '📋 ریکارڈ', '📊 رپورٹ', '✏️ اپڈیٹ', '📋 ڈیلی', '⚙️ سیٹنگ'],
    entry: 'نئی ٹرانسپورٹ انٹری 🚌', date: 'تاریخ', party: 'پارٹی', sector: 'سیکٹر',
    transport: 'ٹرانسپورٹ', count: 'حاجیوں کی تعداد', fare: 'فی حاجی کرایہ (SAR)', total: 'کل رقم (SAR)',
    notes: 'نوٹس', save: '✅ انٹری محفوظ کریں', clear: '🔄 صاف کریں',
    todaySummary: 'آج کا خلاصہ 📊', todayParties: 'پارٹیاں آج', todayHujjaj: 'کل حاجی آج', todayAmount: 'کل رقم (SAR)', todayTrips: 'کل سفر آج',
    selectParty: '-- پارٹی منتخب --', selectSector: '-- سیکٹر منتخب --',
    payTitle: 'پارٹی کی ادائیگی درج کریں 💰', received: 'موصول رقم (SAR)', method: 'ادائیگی کا طریقہ',
    cash: 'نقد', bank: 'بینک', cheque: 'چیک', online: 'آن لائن',
    savePay: '✅ ادائیگی محفوظ کریں', recentPay: 'حالیہ ادائیگیاں 💳',
    ledgerTitle: 'پارٹی لیجر 📒', selectAll: '-- سب پارٹیاں --', fromDate: 'تاریخ سے', toDate: 'تاریخ تک',
    print: '🖨️ پرنٹ', resetFilter: '↩ صاف',
    debitCol: 'واجب (SAR)', creditCol: 'وصول (SAR)', balance: 'بقایا', txType: 'قسم', desc: 'تفصیل',
    debitTx: '📤 واجب', creditTx: '📥 وصول', subTotal: 'مجموعہ',
    totalDebit: 'کل واجب', totalCredit: 'کل وصول', surplus: 'زائد ادائیگی', owing: 'باقی واجب',
    noTx: 'کوئی لین دین نہیں',
    recTitle: 'تمام ریکارڈ 📋', allParties: 'سب', allSectors: 'سب',
    filter: '🔍 فلٹر', totalRec: 'کل ریکارڈ', totalHujjaj: 'کل حاجی', totalAmt: 'کل رقم (SAR)',
    edit: '✏️', del: '🗑️', noRec: 'کوئی ریکارڈ نہیں',
    numCol: '#', dateCol: 'تاریخ', partyCol: 'پارٹی', sectorCol: 'سیکٹر', transportCol: 'ٹرانسپورٹ',
    hujjajCol: 'حاجی', fareCol: 'فی حاجی', totalCol: 'کل (SAR)', actionCol: 'کارروائی',
    repTitle: 'رپورٹ سینٹر 📊', repType: 'رپورٹ کی قسم', genReport: '📊 رپورٹ بنائیں',
    byDate: 'تاریخ وائز', byParty: 'پارٹی وائز', bySector: 'سیکٹر وائز',
    trips: 'سفر', hujjaj: 'حاجی', amount: 'رقم (SAR)', repKind: 'قسم',
    updTitle: 'ریکارڈ اپڈیٹ کریں ✏️', saveUpd: '💾 اپڈیٹ محفوظ کریں', cancel: '❌ منسوخ', selectRecord: 'ریکارڈ منتخب کریں 📋',
    updOk: '✅ ریکارڈ اپڈیٹ ہوگیا', delOk: '🗑️ ریکارڈ حذف ہوگیا', confirmDel: 'کیا یہ ریکارڈ حذف کریں؟', confirmDelPay: 'کیا یہ ادائیگی حذف کریں؟',
    setParties: 'پارٹیاں 👥', setSectors: 'سیکٹر 🗺️', newPartyLbl: 'نئی پارٹی', newSectorLbl: 'نیا سیکٹر',
    add: '➕ شامل', addedOk: '✅ شامل ہوگیا', alreadyExists: '⚠️ پہلے سے موجود', enterName: '⚠️ نام لکھیں',
    usedWarning: 'ریکارڈ میں موجود ہے۔ پھر بھی حذف کریں؟',
    noneParty: 'کوئی پارٹی نہیں', noneSector: 'کوئی سیکٹر نہیں',
    addPartyTitle: '➕ نئی پارٹی شامل کریں', addSectorTitle: '➕ نیا سیکٹر شامل کریں',
    partyPlaceholder: 'پارٹی کا نام', sectorPlaceholder: 'مثلاً: جدہ ➜ مکہ',
    modalSave: '✅ شامل کریں', modalCancel: '❌ منسوخ',
    entryRequired: '⚠️ تاریخ، پارٹی، سیکٹر اور تعداد ضروری ہے',
    payRequired: '⚠️ تاریخ، پارٹی اور رقم ضروری ہے',
    entrySaved: '✅ انٹری محفوظ ہوگئی', paySaved: '✅ ادائیگی محفوظ ہوگئی',
    noData: 'کوئی ڈیٹا نہیں', noPayments: 'کوئی ادائیگی نہیں',
    defaultSectors: ['جدہ ➜ مکہ', 'مکہ ➜ مدینہ', 'مدینہ ➜ مکہ', 'مکہ ➜ جدہ'],
    defaultParties: ['پارٹی الف', 'پارٹی ب'],
    sectorRef: 'سفر:', hujPerSector: 'حاجی ×',
    payMethodRef: 'ادائیگی —',
    runBalance: '(باقی)', 'runOwing': '(واجب)',
    methodCol: 'طریقہ', notesCol: 'نوٹس',
    codeCol: 'کوڈ', searchParty: '🔍 پارٹی تلاش کریں...', noMatch: 'کوئی نتیجہ نہیں',
    partyCodeLbl: 'پارٹی کوڈ',
    setApp: 'ایپ کی ترتیب ⚙️', appNameLbl: 'ایپ کا نام', appSubLbl: 'ذیلی عنوان',
    logoLbl: 'لوگو تبدیل کریں', logoHint: 'PNG / JPG / SVG (کلک یا ڈراپ کریں)',
    saveApp: '💾 محفوظ کریں', appSavedOk: '✅ محفوظ ہوگیا',
    renameParty: 'پارٹی کا نام تبدیل کریں ✏️', oldName: 'پرانا نام', newName: 'نیا نام',
    renameSave: '💾 محفوظ', renameOk: '✅ نام تبدیل ہوگیا',
    renameErr: '⚠️ نیا نام لکھیں', renameDup: '⚠️ یہ نام پہلے سے موجود ہے',
    voucherCol: 'واوچر نمبر', voucherLbl: 'واوچر نمبر (خودکار)',
    overallBalance: 'کل بقایا',
    loggedUser: 'صارف: ', logout: 'لاگ آؤٹ 🚪',
    login: 'لاگ ان', username: 'صارف نام', password: 'پاس ورڈ',
    loginTitle: 'سسٹم میں لاگ ان کریں', invalidLogin: 'غلط صارف نام یا پاس ورڈ', loginSuccess: 'لاگ ان کامیاب',
    userManagement: 'صارفین کی ترتیبات 👥', addNewUser: 'نیا صارف شامل کریں',
    userList: 'صارفین کی فہرست', userDeleteConfirm: 'کیا آپ اس صارف کو حذف کرنا چاہتے ہیں؟',
    userDeleteErrorSelf: 'آپ خود کو حذف نہیں کر سکتے!', userAdded: '✅ صارف شامل ہو گیا',
    userExists: '⚠️ یہ صارف نام پہلے سے موجود ہے',
    dnNav: '📋 ڈیلی', dnTitle: 'ڈیلی ٹرانسپورٹ نوٹ 📋',
    dnDate: 'تاریخ', dnRef: 'واوچر نمبر', dnParty: 'پارٹی کا نام',
    dnGroup: 'گروپ کوڈ', dnMobile: 'موبائل نمبر', dnSector: 'سیکٹر',
    dnCount: 'حاجیوں کی تعداد', dnFlightNo: 'فلائیٹ نمبر', dnFlightTime: 'وقت',
    dnSave: '✅ نوٹ محفوظ کریں', dnClear: '🔄 صاف کریں',
    dnRepTitle: 'ڈیلی نوٹ رپورٹ 📊', dnRepFrom: 'تاریخ سے', dnRepTo: 'تاریخ تک',
    dnReset: '↩ صاف', dnSaved: '✅ ڈیلی نوٹ محفوظ ہوگیا',
    dnRequired: '⚠️ تاریخ، پارٹی، سیکٹر اور تعداد ضروری ہے',
    dnNoData: 'کوئی ڈیلی نوٹ نہیں', dnTotalLbl: 'کل افراد:',
    dnDelConfirm: 'کیا یہ ڈیلی نوٹ حذف کریں؟', dnDelOk: '🗑️ حذف ہوگیا',
    dnEditTitle: '✏️ نوٹ اپڈیٹ کریں',
    setTransports: 'ٹرانسپورٹ 🚌', newTransportLbl: 'نئی ٹرانسپورٹ', transportPlaceholder: 'مثلاً: بس، وین، کوچ',
    noneTransport: 'کوئی ٹرانسپورٹ نہیں', selectTransport: '-- ٹرانسپورٹ منتخب --',
    sharingBusLabel: 'شیئرنگ بس', sharingBusHint: '(شیئرنگ بس منتخب کریں تاکہ فی حاجی فیلڈ کھلیں)',
    vehicleTotalLbl: 'پوری گاڑی کی رقم (SAR)', vehicleTotalCol: 'گاڑی رقم (SAR)',
    typeSharing: 'شیئرنگ', typeWhole: 'پوری گاڑی',
    sharingNote: '⚠️ شیئرنگ بس میں حاجیوں کی تعداد اور فی حاجی کرایہ ضروری ہے',
    wholeNote: '⚠️ پوری گاڑی کی رقم ضروری ہے',
    bus: 'بس', van: 'وین', car: 'کار', coach: 'کوچ', newTransport: '(+ نئی)',
  },
  en: {
    dir: 'ltr', lang: 'en',
    appTitle: 'Umrah Transport Management System',
    appSub: 'Complete record of pilgrims — Jeddah, Makkah, Madinah',
    nav: ['📝 New', '💰 Payment', '📒 Ledger', '📋 Records', '📊 Report', '✏️ Update', '📋 Daily', '⚙️ Settings'],
    entry: 'New Transport Entry 🚌', date: 'Date', party: 'Party', sector: 'Sector',
    transport: 'Transport', count: 'No. of Pilgrims', fare: 'Fare per Pilgrim (SAR)', total: 'Total (SAR)',
    notes: 'Notes', save: '✅ Save Entry', clear: '🔄 Clear',
    todaySummary: "Today's Summary 📊", todayParties: 'Parties Today', todayHujjaj: 'Total Pilgrims', todayAmount: 'Total Amount (SAR)', todayTrips: 'Total Trips',
    selectParty: '-- Select Party --', selectSector: '-- Select Sector --',
    payTitle: 'Record Party Payment 💰', received: 'Amount Received (SAR)', method: 'Payment Method',
    cash: 'Cash', bank: 'Bank', cheque: 'Cheque', online: 'Online',
    savePay: '✅ Save Payment', recentPay: 'Recent Payments 💳',
    ledgerTitle: 'Party Ledger 📒', selectAll: '-- All Parties --', fromDate: 'From Date', toDate: 'To Date',
    print: '🖨️ Print', resetFilter: '↩ Reset',
    debitCol: 'Debit (SAR)', creditCol: 'Credit (SAR)', balance: 'Balance', txType: 'Type', desc: 'Description',
    debitTx: '📤 Debit', creditTx: '📥 Credit', subTotal: 'Sub Total',
    totalDebit: 'Total Debit', totalCredit: 'Total Credit', surplus: 'Surplus', owing: 'Balance Due',
    noTx: 'No transactions',
    recTitle: 'All Records 📋', allParties: 'All', allSectors: 'All',
    filter: '🔍 Filter', totalRec: 'Total Records', totalHujjaj: 'Total Pilgrims', totalAmt: 'Total Amount (SAR)',
    edit: '✏️', del: '🗑️', noRec: 'No records found',
    numCol: '#', dateCol: 'Date', partyCol: 'Party', sectorCol: 'Sector', transportCol: 'Transport',
    hujjajCol: 'Pilgrims', fareCol: 'Fare/Pilgrim', totalCol: 'Total (SAR)', actionCol: 'Action',
    repTitle: 'Report Center 📊', repType: 'Report Type', genReport: '📊 Generate Report',
    byDate: 'By Date', byParty: 'By Party', bySector: 'By Sector',
    trips: 'Trips', hujjaj: 'Pilgrims', amount: 'Amount (SAR)', repKind: 'Type',
    updTitle: 'Update Record ✏️', saveUpd: '💾 Save Update', cancel: '❌ Cancel', selectRecord: 'Select Record 📋',
    updOk: '✅ Record updated', delOk: '🗑️ Record deleted', confirmDel: 'Delete this record?', confirmDelPay: 'Delete this payment?',
    setParties: 'Parties 👥', setSectors: 'Sectors 🗺️', newPartyLbl: 'New Party', newSectorLbl: 'New Sector',
    add: '➕ Add', addedOk: '✅ Added', alreadyExists: '⚠️ Already exists', enterName: '⚠️ Enter a name',
    usedWarning: 'Used in records. Delete anyway?',
    noneParty: 'No parties', noneSector: 'No sectors',
    addPartyTitle: '➕ Add New Party', addSectorTitle: '➕ Add New Sector',
    partyPlaceholder: 'Party name', sectorPlaceholder: 'e.g. Jeddah ➜ Makkah',
    modalSave: '✅ Add', modalCancel: '❌ Cancel',
    entryRequired: '⚠️ Date, Party, Sector and Pilgrim count are required',
    payRequired: '⚠️ Date, Party and Amount are required',
    entrySaved: '✅ Entry saved successfully', paySaved: '✅ Payment saved',
    noData: 'No data', noPayments: 'No payments',
    defaultSectors: ['Jeddah ➜ Makkah', 'Makkah ➜ Madinah', 'Madinah ➜ Makkah', 'Makkah ➜ Jeddah'],
    defaultParties: ['Party A', 'Party B'],
    sectorRef: 'Trip:', hujPerSector: 'Pilgrims ×',
    payMethodRef: 'Payment —',
    runBalance: '(surplus)', 'runOwing': '(due)',
    methodCol: 'Method', notesCol: 'Notes',
    codeCol: 'Code', searchParty: '🔍 Search party...', noMatch: 'No match found',
    partyCodeLbl: 'Party Code',
    setApp: 'App Settings ⚙️', appNameLbl: 'App Name', appSubLbl: 'Subtitle',
    logoLbl: 'Change Logo', logoHint: 'PNG / JPG / SVG (click or drop)',
    saveApp: '💾 Save', appSavedOk: '✅ Saved',
    renameParty: 'Rename Party ✏️', oldName: 'Current Name', newName: 'New Name',
    renameSave: '💾 Save', renameOk: '✅ Name updated',
    renameErr: '⚠️ Enter a new name', renameDup: '⚠️ Name already exists',
    voucherCol: 'Voucher No.', voucherLbl: 'Voucher No. (Auto)',
    overallBalance: 'Overall Balance',
    loggedUser: 'User: ', logout: 'Log Out 🚪',
    login: 'Log In', username: 'Username', password: 'Password',
    loginTitle: 'Login to System', invalidLogin: 'Invalid username or password', loginSuccess: 'Login successful',
    userManagement: 'User Management 👥', addNewUser: 'Add New User',
    userList: 'Users List', userDeleteConfirm: 'Are you sure you want to delete this user?',
    userDeleteErrorSelf: 'You cannot delete yourself!', userAdded: '✅ User added successfully',
    userExists: '⚠️ Username already exists',
    dnNav: '📋 Daily', dnTitle: 'Daily Transport Note 📋',
    dnDate: 'Date', dnRef: 'Voucher No.', dnParty: 'Party Name',
    dnGroup: 'Group Code', dnMobile: 'Mobile Number', dnSector: 'Sector',
    dnCount: 'Pilgrims Count', dnFlightNo: 'Flight Number', dnFlightTime: 'Flight Time',
    dnSave: '✅ Save Note', dnClear: '🔄 Clear',
    dnRepTitle: 'Daily Note Report 📊', dnRepFrom: 'From Date', dnRepTo: 'To Date',
    dnReset: '↩ Reset', dnSaved: '✅ Daily note saved successfully',
    dnRequired: '⚠️ Date, Party, Sector and Count are required',
    dnNoData: 'No daily notes found', dnTotalLbl: 'Total Persons:',
    dnDelConfirm: 'Delete this daily note?', dnDelOk: '🗑️ Deleted',
    dnEditTitle: '✏️ Update Note',
    setTransports: 'Transport 🚌', newTransportLbl: 'New Transport', transportPlaceholder: 'e.g. Bus, Van, Coach',
    noneTransport: 'No transport added', selectTransport: '-- Select Transport --',
    sharingBusLabel: 'Sharing Bus', sharingBusHint: '(Select "Sharing Bus" to enter per-pilgrim fare)',
    vehicleTotalLbl: 'Full Vehicle Amount (SAR)', vehicleTotalCol: 'Vehicle Amt (SAR)',
    typeSharing: 'Sharing', typeWhole: 'Full Vehicle',
    sharingNote: '⚠️ Enter pilgrim count and fare per pilgrim', wholeNote: '⚠️ Full vehicle amount is required',
    bus: 'Bus', van: 'Van', car: 'Car', coach: 'Coach', newTransport: '(+ New)',
  },
  ar: {
    dir: 'rtl', lang: 'ar',
    appTitle: 'نظام إدارة نقل الحجاج',
    appSub: 'سجل كامل لتنقلات الحجاج — جدة، مكة، المدينة',
    nav: ['📝 جديد', '💰 دفعة', '📒 دفتر', '📋 سجلات', '📊 تقرير', '✏️ تعديل', '📋 يومي', '⚙️ إعدادات'],
    entry: 'إدخال نقل جديد 🚌', date: 'التاريخ', party: 'المجموعة', sector: 'القطاع',
    transport: 'وسيلة النقل', count: 'عدد الحجاج', fare: 'الأجرة لكل حاج (ريال)', total: 'المجموع (ريال)',
    notes: 'ملاحظات', save: '✅ حفظ الإدخال', clear: '🔄 مسح',
    todaySummary: 'ملخص اليوم 📊', todayParties: 'المجموعات اليوم', todayHujjaj: 'إجمالي الحجاج', todayAmount: 'إجمالي المبلغ (ريال)', todayTrips: 'إجمالي الرحلات',
    selectParty: '-- اختر المجموعة --', selectSector: '-- اختر القطاع --',
    payTitle: 'تسجيل دفعة المجموعة 💰', received: 'المبلغ المستلم (ريال)', method: 'طريقة الدفع',
    cash: 'نقداً', bank: 'بنك', cheque: 'شيك', online: 'أون لاين',
    savePay: '✅ حفظ الدفعة', recentPay: 'الدفعات الأخيرة 💳',
    ledgerTitle: 'دفتر حساب المجموعة 📒', selectAll: '-- كل المجموعات --', fromDate: 'من تاريخ', toDate: 'إلى تاريخ',
    print: '🖨️ طباعة', resetFilter: '↩ إعادة',
    debitCol: 'المطلوب (ريال)', creditCol: 'المستلم (ريال)', balance: 'الرصيد', txType: 'النوع', desc: 'التفاصيل',
    debitTx: '📤 مطلوب', creditTx: '📥 مستلم', subTotal: 'المجموع الفرعي',
    totalDebit: 'إجمالي المطلوب', totalCredit: 'إجمالي المستلم', surplus: 'دفع زيادة', owing: 'الرصيد المستحق',
    noTx: 'لا توجد معاملات',
    recTitle: 'كل السجلات 📋', allParties: 'الكل', allSectors: 'الكل',
    filter: '🔍 تصفية', totalRec: 'إجمالي السجلات', totalHujjaj: 'إجمالي الحجاج', totalAmt: 'إجمالي المبلغ (ريال)',
    edit: '✏️', del: '🗑️', noRec: 'لا توجد سجلات',
    numCol: '#', dateCol: 'التاريخ', partyCol: 'المجموعة', sectorCol: 'القطاع', transportCol: 'وسيلة النقل',
    hujjajCol: 'الحجاج', fareCol: 'الأجرة/حاج', totalCol: 'المجموع (ريال)', actionCol: 'إجراء',
    repTitle: 'مركز التقارير 📊', repType: 'نوع التقرير', genReport: '📊 إنشاء تقرير',
    byDate: 'حسب التاريخ', byParty: 'حسب المجموعة', bySector: 'حسب القطاع',
    trips: 'رحلات', hujjaj: 'حجاج', amount: 'المبلغ (ريال)', repKind: 'النوع',
    updTitle: 'تعديل السجل ✏️', saveUpd: '💾 حفظ التعديل', cancel: '❌ إلغاء', selectRecord: 'اختر سجلاً 📋',
    updOk: '✅ تم تعديل السجل', delOk: '🗑️ تم حذف السجل', confirmDel: 'هل تريد حذف هذا السجل؟', confirmDelPay: 'هل تريد حذف هذه الدفعة؟',
    setParties: 'المجموعات 👥', setSectors: 'القطاعات 🗺️', newPartyLbl: 'مجموعة جديدة', newSectorLbl: 'قطاع جديد',
    add: '➕ إضافة', addedOk: '✅ تمت الإضافة', alreadyExists: '⚠️ موجود مسبقاً', enterName: '⚠️ أدخل اسماً',
    usedWarning: 'مستخدم في السجلات. هل تحذف على أي حال؟',
    noneParty: 'لا توجد مجموعات', noneSector: 'لا توجد قطاعات',
    addPartyTitle: '➕ إضافة مجموعة جديدة', addSectorTitle: '➕ إضافة قطاع جديد',
    partyPlaceholder: 'اسم المجموعة', sectorPlaceholder: 'مثال: جدة ➜ مكة',
    modalSave: '✅ إضافة', modalCancel: '❌ إلغاء',
    entryRequired: '⚠️ التاريخ والمجموعة والقطاع وعدد الحجاج مطلوبة',
    payRequired: '⚠️ التاريخ والمجموعة والمبلغ مطلوبة',
    entrySaved: '✅ تم حفظ الإدخال', paySaved: '✅ تم حفظ الدفعة',
    noData: 'لا توجد بيانات', noPayments: 'لا توجد دفعات',
    defaultSectors: ['جدة ➜ مكة', 'مكة ➜ المدينة', 'المدينة ➜ مكة', 'مكة ➜ جدة'],
    defaultParties: ['المجموعة الأولى', 'المجموعة الثانية'],
    sectorRef: 'رحلة:', hujPerSector: 'حجاج ×',
    payMethodRef: 'دفعة —',
    runBalance: '(فائض)', 'runOwing': '(مستحق)',
    methodCol: 'الطريقة', notesCol: 'ملاحظات',
    codeCol: 'الرمز', searchParty: '🔍 ابحث عن مجموعة...', noMatch: 'لا توجد نتائج',
    partyCodeLbl: 'رمز المجموعة',
    setApp: 'إعدادات التطبيق ⚙️', appNameLbl: 'اسم التطبيق', appSubLbl: 'العنوان الفرعي',
    logoLbl: 'تغيير الشعار', logoHint: 'PNG / JPG / SVG (انقر أو اسحب)',
    saveApp: '💾 حفظ', appSavedOk: '✅ تم الحفظ',
    renameParty: 'إعادة تسمية المجموعة ✏️', oldName: 'الاسم الحالي', newName: 'الاسم الجديد',
    renameSave: '💾 حفظ', renameOk: '✅ تم تحديث الاسم',
    renameErr: '⚠️ أدخل اسماً جديداً', renameDup: '⚠️ الاسم موجود مسبقاً',
    voucherCol: 'رقم الإيصال', voucherLbl: 'رقم الإيصال (تلقائي)',
    overallBalance: 'إجمالي الرصيد',
    loggedUser: 'المستخدم: ', logout: 'تسجيل الخروج 🚪',
    login: 'تسجيل الدخول', username: 'اسم المستخدم', password: 'كلمة المرور',
    loginTitle: 'تسجيل الدخول إلى النظام', invalidLogin: 'اسم المستخدم أو كلمة المرور غير صالحة', loginSuccess: 'تم تسجيل الدخول بنجاح',
    userManagement: 'إدارة المستخدمين 👥', addNewUser: 'إضافة مستخدم جديد',
    userList: 'قائمة المستخدمين', userDeleteConfirm: 'هل أنت متأكد من حذف هذا المستخدم؟',
    userDeleteErrorSelf: 'لا يمكنك حذف نفسك!', userAdded: '✅ تم إضافة المستخدم بنجاح',
    userExists: '⚠️ اسم المستخدم موجود بالفعل',
    dnNav: '📋 يومي', dnTitle: 'الملاحظة اليومية للنقل 📋',
    dnDate: 'التاريخ', dnRef: 'رقم الإيصال', dnParty: 'اسم المجموعة',
    dnGroup: 'رمز المجموعة', dnMobile: 'رقم الجوال', dnSector: 'القطاع',
    dnCount: 'عدد الحجاج', dnFlightNo: 'رقم الرحلة', dnFlightTime: 'وقت الرحلة',
    dnSave: '✅ حفظ الملاحظة', dnClear: '🔄 مسح',
    dnRepTitle: 'تقرير الملاحظة اليومية 📊', dnRepFrom: 'من تاريخ', dnRepTo: 'إلى تاريخ',
    dnReset: '↩ إعادة', dnSaved: '✅ تم حفظ الملاحظة اليومية',
    dnRequired: '⚠️ التاريخ والمجموعة والقطاع مطلوبة',
    dnNoData: 'لا توجد ملاحظات يومية', dnTotalLbl: 'إجمالي الأشخاص:',
    dnDelConfirm: 'هل تريد حذف هذه الملاحظة؟', dnDelOk: '🗑️ تم الحذف',
    dnEditTitle: '✏️ تعديل الملاحظة',
    setTransports: 'وسائل النقل 🚌', newTransportLbl: 'وسيلة نقل جديدة', transportPlaceholder: 'مثال: حافلة، فان، كوتش',
    noneTransport: 'لا توجد وسائل نقل', selectTransport: '-- اختر وسيلة النقل --',
    sharingBusLabel: 'حافلة مشتركة', sharingBusHint: '(اختر "حافلة مشتركة" لإدخال أجرة كل حاج)',
    vehicleTotalLbl: 'إجمالي المركبة الكاملة (ريال)', vehicleTotalCol: 'مبلغ المركبة (ريال)',
    typeSharing: 'مشترك', typeWhole: 'مركبة كاملة',
    sharingNote: '⚠️ أدخل عدد الحجاج وأجرة كل حاج', wholeNote: '⚠️ مبلغ المركبة الكاملة مطلوب',
    bus: 'حافلة', van: 'فان', car: 'سيارة', coach: 'كوتش', newTransport: '(+ جديد)',
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STATE & FIREBASE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let lang = localStorage.getItem('uts_lang') || 'ur';
const firebaseConfig = {
  apiKey: "AIzaSyCUHpJ8VOtGZ2XuIdfhvFmbeTC4sa2yNRw",
  authDomain: "umrahtrasnsport.firebaseapp.com",
  databaseURL: "https://umrahtrasnsport-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "umrahtrasnsport",
  storageBucket: "umrahtrasnsport.firebasestorage.app",
  messagingSenderId: "889214407819",
  appId: "1:889214407819:web:755986a87e1b4cbd55308e",
  measurementId: "G-92K56E1TQX"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const KEY_LOGGEDIN = 'uts_loggedin';
let records = [];
let payments = [];
let parties = [];
let sectors = [];
let transports = [];
let partyCodes = {};
let users = [];
let dailyNotes = [];
let loggedInUser = localStorage.getItem(KEY_LOGGEDIN) || null;
let isFirebaseReady = false;
let fbLogo = null;
let fbAppName = {};
let fbAppSub = {};

function svR() { db.ref('records').set(records); }
function svPy() { db.ref('payments').set(payments); }
function svP() { db.ref('parties').set(parties); }
function svS() { db.ref('sectors').set(sectors); }
function svTr() { db.ref('transports').set(transports); }
function svC() { db.ref('partyCodes').set(partyCodes); }
function svU() { db.ref('users').set(users); }
function svDN() { db.ref('dailyNotes').set(dailyNotes); }

function saveAppSettingsToFb() {
  db.ref('settings').set({ logo: fbLogo || null, appName: fbAppName || {}, appSub: fbAppSub || {} });
}

function initUsers() {
  if (!users.length) { users = [{ username: 'admin', password: 'admin', role: 'admin' }]; svU(); }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function checkAuth() {
  const mainApp = document.getElementById('main-app-container');
  const loginPage = document.getElementById('login-container');
  if (loggedInUser) {
    mainApp.style.display = 'block';
    loginPage.style.display = 'none';
    document.getElementById('lbl-logged-in-user').textContent = (T[lang].loggedUser || 'User: ') + loggedInUser;
    document.getElementById('btn-logout').textContent = T[lang].logout || 'Log Out';
  } else {
    mainApp.style.display = 'none';
    loginPage.style.display = 'flex';
    document.getElementById('li-username').value = '';
    document.getElementById('li-password').value = '';
    document.getElementById('login-title').textContent = T[lang].loginTitle || 'Login';
    document.getElementById('lbl-li-username').textContent = T[lang].username || 'Username';
    document.getElementById('lbl-li-password').textContent = T[lang].password || 'Password';
    document.getElementById('btn-login-submit').textContent = T[lang].login || 'Log In';
  }
}

function login() {
  const L = T[lang];
  const u = document.getElementById('li-username').value.trim();
  const p = document.getElementById('li-password').value;
  const alertEl = document.getElementById('al-login');
  if (!u || !p) { al('al-login', L.entryRequired || 'Username and password required', 'er'); return; }
  const found = users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);
  if (found) {
    loggedInUser = found.username;
    localStorage.setItem(KEY_LOGGEDIN, loggedInUser);
    al('al-login', L.loginSuccess || 'Login successful', 'ok');
    setTimeout(() => { checkAuth(); showPage('entry', document.querySelectorAll('#main-nav button')[0]); }, 500);
  } else {
    al('al-login', L.invalidLogin || 'Invalid username or password', 'er');
  }
}

function logout() { loggedInUser = null; localStorage.removeItem(KEY_LOGGEDIN); checkAuth(); }

function addUser() {
  const L = T[lang];
  const u = document.getElementById('su-username').value.trim();
  const p = document.getElementById('su-password').value;
  if (!u || !p) { al('al-su', L.entryRequired, 'er'); return; }
  if (users.some(x => x.username.toLowerCase() === u.toLowerCase())) { al('al-su', L.userExists || 'Username already exists', 'er'); return; }
  users.push({ username: u, password: p, role: 'operator' });
  svU();
  renderUsers();
  document.getElementById('su-username').value = '';
  document.getElementById('su-password').value = '';
  al('al-su', L.userAdded || 'User added successfully', 'ok');
}

function deleteUser(idx) {
  const L = T[lang];
  const user = users[idx];
  if (user.username === loggedInUser) { alert(L.userDeleteErrorSelf || 'You cannot delete yourself!'); return; }
  if (!confirm(L.userDeleteConfirm || 'Delete this user?')) return;
  users.splice(idx, 1);
  svU();
  renderUsers();
}

function renderUsers() {
  const L = T[lang];
  const el = document.getElementById('users-list');
  if (!el) return;
  if (!users.length) { el.innerHTML = `<span style="color:var(--muted);font-size:12px;">No users found</span>`; return; }
  el.innerHTML = users.map((u, i) => {
    const canDelete = u.username !== loggedInUser && (u.username !== 'admin' || users.filter(x => x.username === 'admin').length > 1);
    const delBtn = canDelete ? `<button class="x" onclick="deleteUser(${i})">✕</button>` : '';
    return `<div class="user-tag"><span class="username-val">${u.username}</span><span class="role-badge">${u.role || 'operator'}</span>${delBtn}</div>`;
  }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function fd(d) { if (!d) return ''; const p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
function sar(n) { return Number(n || 0).toLocaleString(); }
function today() { return new Date().toISOString().split('T')[0]; }
function t(k) { return T[lang][k] || k; }

function genCode() {
  const existing = Object.values(partyCodes).map(c => parseInt(c.replace('UTS-', '')) || 0);
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return 'UTS-' + String(next).padStart(3, '0');
}
function getCode(party) {
  if (!partyCodes[party]) { partyCodes[party] = genCode(); svC(); }
  return partyCodes[party];
}

function genVoucher() {
  const existing = records.map(r => parseInt((r.voucher || '').replace('VCH-', '')) || 0);
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return 'VCH-' + String(next).padStart(4, '0');
}

function genDNRef() {
  const existing = dailyNotes.map(n => parseInt((n.ref || '').replace('DN-', '')) || 0);
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return 'DN-' + String(next).padStart(4, '0');
}

function isSharing(val) { return /شیئرنگ|sharing/i.test(val || ''); }

function getTransportLabel(val) { return val || '—'; }
function getMethodLabel(val) {
  const L = T[lang];
  return { cash: L.cash, bank: L.bank, cheque: L.cheque, online: L.online }[val] || val;
}

function formatTime12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  let hh = parseInt(h);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12 || 12;
  return `${hh}:${m} ${ampm}`;
}

function al(id, msg, type) {
  const e = document.getElementById(id);
  if (!e) return;
  e.innerHTML = `<div class="alert a-${type}">${msg}</div>`;
  setTimeout(() => e.innerHTML = '', 3000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LANGUAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setLang(l) {
  lang = l;
  localStorage.setItem('uts_lang', l);
  const L = T[l];
  document.documentElement.lang = l;
  document.body.className = 'lang-' + l;
  document.getElementById('modal').style.direction = L.dir;
  ['ur', 'en', 'ar'].forEach(x => document.getElementById('lb-' + x).classList.toggle('active', x === l));

  document.getElementById('app-title').textContent = L.appTitle;
  document.getElementById('app-sub').textContent = L.appSub;
  document.getElementById('app-sub-login').textContent = L.appSub;

  const navBtns = document.querySelectorAll('#main-nav button');
  L.nav.forEach((txt, i) => { if (navBtns[i]) navBtns[i].textContent = txt; });

  // Entry
  setText('lbl-entry', L.entry); setText('lbl-date', L.date); setText('lbl-party', L.party);
  setText('lbl-sector', L.sector); setText('lbl-transport', L.transport); setText('lbl-count', L.count);
  setText('lbl-fare', L.fare); setText('lbl-total', L.total); setText('lbl-notes', L.notes);
  setText('btn-save', L.save); setText('btn-clear', L.clear);
  setText('lbl-todaysum', L.todaySummary); setText('lbl-ts-p', L.todayParties);
  setText('lbl-ts-h', L.todayHujjaj); setText('lbl-ts-a', L.todayAmount); setText('lbl-ts-t', L.todayTrips);
  setText('lbl-voucher', L.voucherLbl); setText('lbl-vehicletotal', L.vehicleTotalLbl);

  // Payment
  setText('lbl-payTitle', L.payTitle); setText('lbl-paydate', L.date); setText('lbl-payparty', L.party);
  setText('lbl-received', L.received); setText('lbl-method', L.method); setText('lbl-paynotes', L.notes);
  setText('btn-savepay', L.savePay); setText('lbl-recentpay', L.recentPay);
  setOpt('opt-cash', L.cash, 'cash'); setOpt('opt-bank', L.bank, 'bank');
  setOpt('opt-cheque', L.cheque, 'cheque'); setOpt('opt-online', L.online, 'online');

  // Ledger
  setText('lbl-ledgerTitle', L.ledgerTitle); setText('lbl-ledparty', L.party);
  setText('lbl-ledfrom', L.fromDate); setText('lbl-ledto', L.toDate);
  setText('btn-print', L.print); setText('btn-resetled', L.resetFilter);

  // Records
  setText('lbl-recTitle', L.recTitle); setText('lbl-recfrom', L.fromDate); setText('lbl-recto', L.toDate);
  setText('lbl-recparty', L.party); setText('lbl-recsector', L.sector);
  setText('btn-filter', L.filter); setText('btn-clearfilter', L.resetFilter);
  setText('lbl-totalrec', L.totalRec); setText('lbl-totalhj', L.totalHujjaj); setText('lbl-totalamt', L.totalAmt);

  // Report
  setText('lbl-repTitle', L.repTitle); setText('lbl-repfrom', L.fromDate); setText('lbl-repto', L.toDate);
  setText('lbl-reptype', L.repType); setText('btn-genrep', L.genReport);
  setOpt('opt-bydate', L.byDate, 'date'); setOpt('opt-byparty', L.byParty, 'party');
  setOpt('opt-bysector', L.bySector, 'sector');

  // Update
  setText('lbl-updTitle', L.updTitle); setText('lbl-udate', L.date); setText('lbl-uparty', L.party);
  setText('lbl-usector', L.sector); setText('lbl-utransport', L.transport); setText('lbl-ucount', L.count);
  setText('lbl-ufare', L.fare); setText('lbl-utotal', L.total); setText('lbl-unotes', L.notes);
  setText('btn-saveupd', L.saveUpd); setText('btn-cancel', L.cancel); setText('lbl-selrec', L.selectRecord);
  setText('lbl-uvoucher', L.voucherLbl); setText('lbl-uvehicletotal', L.vehicleTotalLbl);

  // Settings
  setText('lbl-setParties', L.setParties); setText('lbl-setSectors', L.setSectors);
  setText('lbl-newpartylbl', L.newPartyLbl); setText('lbl-newsectorlbl', L.newSectorLbl);
  document.getElementById('sp-in').placeholder = L.partyPlaceholder;
  document.getElementById('ss-in').placeholder = L.sectorPlaceholder;
  setText('btn-addparty', L.add); setText('btn-addsector', L.add);

  setText('lbl-setTransports', L.setTransports); setText('lbl-newtransportlbl', L.newTransportLbl);
  document.getElementById('st-in').placeholder = L.transportPlaceholder;
  setText('btn-addtransport', L.add);

  setText('lbl-setApp', L.setApp); setText('lbl-appNameLbl', L.appNameLbl); setText('lbl-appSubLbl', L.appSubLbl);
  setText('lbl-logoLbl', L.logoLbl); setText('lbl-logoHint', L.logoHint); setText('btn-saveApp', L.saveApp);
  setText('lbl-renameParty', L.renameParty); setText('lbl-oldName', L.oldName); setText('lbl-newName', L.newName);
  setText('btn-renameSave', L.renameSave); document.getElementById('rename-to').placeholder = L.newName;

  setText('lbl-setUsers', L.userManagement); setText('lbl-su-username', L.username);
  setText('lbl-su-password', L.password); setText('lbl-su-title', L.addNewUser);
  setText('btn-add-user', L.add); setText('lbl-users-list-title', L.userList);

  // Daily Note
  setText('lbl-dnTitle', L.dnTitle); setText('lbl-dnDate', L.dnDate); setText('lbl-dnRef', L.dnRef);
  setText('lbl-dnParty', L.dnParty); setText('lbl-dnGroup', L.dnGroup); setText('lbl-dnMobile', L.dnMobile);
  setText('lbl-dnSector', L.dnSector); setText('lbl-dnCount', L.dnCount); setText('lbl-dnFlightNo', L.dnFlightNo);
  setText('lbl-dnFlightTime', L.dnFlightTime); setText('btn-dn-save', L.dnSave); setText('btn-dn-clear', L.dnClear);
  setText('lbl-dnRepTitle', L.dnRepTitle); setText('lbl-dnRepFrom', L.dnRepFrom); setText('lbl-dnRepTo', L.dnRepTo);
  setText('btn-dn-resetrep', L.dnReset); document.getElementById('nav-dailynote').textContent = L.dnNav;

  // Modal
  setText('btn-msave', L.modalSave); setText('btn-mcancel', L.modalCancel);

  // Login
  document.getElementById('login-title').textContent = L.loginTitle;
  document.getElementById('lbl-li-username').textContent = L.username;
  document.getElementById('lbl-li-password').textContent = L.password;
  document.getElementById('btn-login-submit').textContent = L.login;

  if (loggedInUser) {
    document.getElementById('lbl-logged-in-user').textContent = L.loggedUser + loggedInUser;
    document.getElementById('btn-logout').textContent = L.logout;
  }

  loadAppName(l);
  refreshSdPlaceholders();
  refreshAllDrops();

  const ap = document.querySelector('.page.active');
  if (ap) {
    const id = ap.id.replace('page-', '');
    if (id === 'entry') todayStats();
    if (id === 'payment') { renderPayments(); renderPayHead(); }
    if (id === 'ledger') renderLedger();
    if (id === 'records') renderRecords(records);
    if (id === 'update') renderUpdateTable();
    if (id === 'dailynote') renderDailyNoteReport();
    if (id === 'settings') { renderPartyList(); renderSectorList(); renderTransportList(); renderUsers(); }
  }
  renderPayHead(); renderRecHead(); renderUpdHead();
}

function setText(id, txt) { const e = document.getElementById(id); if (e) e.textContent = txt; }
function setOpt(id, txt, val) { const e = document.getElementById(id); if (e) { e.textContent = txt; e.value = val; } }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOGO & APP NAME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function handleLogoUpload(inp) {
  const file = inp.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { fbLogo = e.target.result; saveAppSettingsToFb(); applyLogo(e.target.result); };
  reader.readAsDataURL(file);
}
function handleLogoDrop(e) {
  e.preventDefault();
  document.getElementById('logo-drop-zone').style.borderColor = 'var(--border)';
  const file = e.dataTransfer.files[0]; if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => { fbLogo = ev.target.result; saveAppSettingsToFb(); applyLogo(ev.target.result); };
  reader.readAsDataURL(file);
}
function applyLogo(src) {
  const emoji = document.getElementById('header-logo-emoji');
  const img = document.getElementById('header-logo-img');
  if (src) { emoji.style.display = 'none'; img.src = src; img.style.display = 'block'; }
  else { emoji.style.display = ''; img.style.display = 'none'; }
  const pe = document.getElementById('logo-preview-emoji');
  const pi = document.getElementById('logo-preview-img');
  const rb = document.getElementById('btn-removeLogo');
  if (src) { pe.style.display = 'none'; pi.src = src; pi.style.display = 'block'; if (rb) rb.style.display = 'inline-flex'; }
  else { pe.style.display = ''; pi.style.display = 'none'; if (rb) rb.style.display = 'none'; }
}
function removeLogo() { fbLogo = null; saveAppSettingsToFb(); applyLogo(null); }

function loadAppName(l) {
  const L = T[l];
  const name = fbAppName[l] || L.appTitle;
  const sub = fbAppSub[l] || L.appSub;
  document.getElementById('app-title').textContent = name;
  document.getElementById('app-sub').textContent = sub;
  document.getElementById('app-sub-login').textContent = sub;
  document.getElementById('set-appname').value = name;
  document.getElementById('set-appsub').value = sub;
}

function saveAppSettings() {
  const L = T[lang];
  const name = document.getElementById('set-appname').value.trim();
  const sub = document.getElementById('set-appsub').value.trim();
  if (name) fbAppName[lang] = name;
  if (sub) fbAppSub[lang] = sub;
  saveAppSettingsToFb();
  loadAppName(lang);
  al('al-app', L.appSavedOk, 'ok');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RENAME PARTY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fillRenameFrom() {
  const sel = document.getElementById('rename-from');
  const cur = sel.value;
  sel.innerHTML = parties.map(p => `<option value="${p}"${p === cur ? ' selected' : ''}>${getCode(p)} — ${p}</option>`).join('');
}

function renameParty() {
  const L = T[lang];
  const oldName = document.getElementById('rename-from').value;
  const newName = document.getElementById('rename-to').value.trim();
  if (!newName) { al('al-rename', L.renameErr, 'er'); return; }
  if (parties.includes(newName)) { al('al-rename', L.renameDup, 'er'); return; }
  const idx = parties.indexOf(oldName);
  if (idx === -1) return;
  const code = partyCodes[oldName];
  if (code) { partyCodes[newName] = code; delete partyCodes[oldName]; svC(); }
  parties[idx] = newName;
  records.forEach(r => { if (r.party === oldName) r.party = newName; });
  payments.forEach(p => { if (p.party === oldName) p.party = newName; });
  svP(); svR(); svPy();
  refreshAllDrops();
  fillRenameFrom();
  document.getElementById('rename-to').value = '';
  al('al-rename', L.renameOk, 'ok');
  renderPartyList();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SEARCHABLE DROPDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _sdTimer = {};
function sdBuild(prefix) {
  const L = T[lang];
  const inp = document.getElementById(prefix + '-input');
  const dd = document.getElementById('sd-' + prefix);
  if (!inp || !dd) return;
  inp.placeholder = L.searchParty;
  const q = inp.value.trim().toLowerCase();
  const filtered = parties.filter(p => !q || p.toLowerCase().includes(q) || getCode(p).toLowerCase().includes(q));
  if (!filtered.length) { dd.innerHTML = `<div class="sd-no-result">${L.noMatch}</div>`; return; }
  const cur = document.getElementById(prefix).value;
  dd.innerHTML = filtered.map(p => `<div class="sd-item${p === cur ? ' active' : ''}" onmousedown="sdSelect('${prefix}','${p.replace(/'/g, "\\'")}')">
    <span class="sd-code">${getCode(p)}</span><span class="sd-name">${p}</span>
  </div>`).join('');
}
function sdFilter(prefix) { sdBuild(prefix); sdOpen(prefix); }
function sdOpen(prefix) { const dd = document.getElementById('sd-' + prefix); if (dd) { sdBuild(prefix); dd.classList.add('open'); } }
function sdBlur(prefix) {
  _sdTimer[prefix] = setTimeout(() => {
    const dd = document.getElementById('sd-' + prefix);
    if (dd) dd.classList.remove('open');
    const inp = document.getElementById(prefix + '-input');
    const hidden = document.getElementById(prefix);
    if (inp && hidden && hidden.value && inp.value !== hidden.value + ' (' + getCode(hidden.value) + ')') {
      inp.value = hidden.value;
    }
  }, 200);
}
function sdSelect(prefix, partyName) {
  clearTimeout(_sdTimer[prefix]);
  document.getElementById(prefix).value = partyName;
  document.getElementById(prefix + '-input').value = partyName;
  const dd = document.getElementById('sd-' + prefix);
  if (dd) dd.classList.remove('open');
  sdShowCode(prefix, partyName);
}
function sdShowCode(prefix, partyName) {
  const code = partyName ? getCode(partyName) : '';
  let badge = document.getElementById(prefix + '-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = prefix + '-badge';
    badge.style.cssText = 'margin-top:4px;font-size:12px;color:var(--muted);';
    document.getElementById('sd-' + prefix).parentElement.appendChild(badge);
  }
  badge.innerHTML = partyName ? `<span class="party-code">${code}</span> ${partyName}` : '';
}
function sdSetValue(prefix, partyName) {
  document.getElementById(prefix).value = partyName || '';
  document.getElementById(prefix + '-input').value = partyName || '';
  sdShowCode(prefix, partyName || '');
}
function sdClear(prefix) { sdSetValue(prefix, ''); }
function refreshSdPlaceholders() {
  const L = T[lang];
  ['e-party', 'p-party', 'u-party', 'dn-party'].forEach(p => {
    const inp = document.getElementById(p + '-input');
    if (inp) inp.placeholder = L.searchParty;
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DROPDOWNS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fillDrop(id, arr, withAll = false) {
  const sel = document.getElementById(id);
  if (!sel || !arr) return;
  const L = T[lang];
  const cur = sel.value;
  let placeholder = L.selectParty;
  if (id.includes('sector')) placeholder = L.selectSector;
  else if (id.includes('transport')) placeholder = L.selectTransport;
  sel.innerHTML = withAll ? `<option value="">${L.allParties}</option>` : `<option value="">${placeholder}</option>`;
  arr.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; if (v === cur) o.selected = true; sel.appendChild(o); });
}

function refreshAllDrops() {
  fillDrop('e-sector', sectors);
  fillDrop('e-transport', transports);
  fillDrop('l-party', parties, true);
  fillDrop('f-party', parties, true);
  fillDrop('f-sector', sectors, true);
  fillDrop('u-sector', sectors);
  fillDrop('u-transport', transports);
  fillDrop('dn-sector', sectors);
  ['e-party', 'p-party', 'u-party', 'dn-party'].forEach(p => sdBuild(p));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _mt = 'sector', _mc = 'entry';
function openModal(type, ctx) {
  _mt = type; _mc = ctx;
  const L = T[lang];
  const titles = { party: L.addPartyTitle, sector: L.addSectorTitle, transport: '➕ ' + L.newTransportLbl };
  const holders = { party: L.partyPlaceholder, sector: L.sectorPlaceholder, transport: L.transportPlaceholder };
  document.getElementById('m-title').textContent = titles[type] || '➕';
  document.getElementById('m-input').placeholder = holders[type] || '';
  document.getElementById('m-input').value = '';
  document.getElementById('modal').classList.add('open');
  setTimeout(() => document.getElementById('m-input').focus(), 80);
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }
function confirmModal() {
  const val = document.getElementById('m-input').value.trim();
  if (!val) return;
  const L = T[lang];
  if (_mt === 'party') {
    if (parties.includes(val)) { alert(L.alreadyExists); return; }
    parties.push(val); getCode(val); svP(); refreshAllDrops();
    const tgt = _mc === 'entry' ? 'e-party' : _mc === 'payment' ? 'p-party' : _mc === 'dailynote' ? 'dn-party' : 'u-party';
    sdSetValue(tgt, val);
  } else if (_mt === 'sector') {
    if (sectors.includes(val)) { alert(L.alreadyExists); return; }
    sectors.push(val); svS(); refreshAllDrops();
    let tgtSec = _mc === 'entry' ? 'e-sector' : _mc === 'update' ? 'u-sector' : 'dn-sector';
    document.getElementById(tgtSec).value = val;
  } else if (_mt === 'transport') {
    if (transports.includes(val)) { alert(L.alreadyExists); return; }
    transports.push(val); svTr(); refreshAllDrops();
    document.getElementById(_mc === 'entry' ? 'e-transport' : 'u-transport').value = val;
  }
  closeModal();
  if (document.getElementById('page-settings').classList.contains('active')) {
    renderPartyList(); renderSectorList(); renderTransportList();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function showPage(p, btn) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  if (btn) btn.classList.add('active');
  if (p === 'entry') { fillDrop('e-sector', sectors); fillDrop('e-transport', transports); todayStats(); }
  if (p === 'payment') { renderPayments(); renderPayHead(); }
  if (p === 'ledger') { fillDrop('l-party', parties, true); renderLedger(); }
  if (p === 'records') { fillDrop('f-party', parties, true); fillDrop('f-sector', sectors, true); renderRecords(records); renderRecHead(); }
  if (p === 'update') { fillDrop('u-sector', sectors); fillDrop('u-transport', transports); renderUpdateTable(); renderUpdHead(); }
  if (p === 'dailynote') { fillDrop('dn-sector', sectors); renderDailyNoteReport(); }
  if (p === 'settings') {
    renderPartyList(); renderSectorList(); renderTransportList(); fillRenameFrom(); loadAppName(lang);
    renderUsers();
    document.getElementById('set-appname').value = fbAppName[lang] || T[lang].appTitle;
    document.getElementById('set-appsub').value = fbAppSub[lang] || T[lang].appSub;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SETTINGS (add/delete items)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function addFromSettings(type) {
  const inpMap = { party: 'sp-in', sector: 'ss-in', transport: 'st-in' };
  const alMap = { party: 'al-sp', sector: 'al-ss', transport: 'al-st' };
  const L = T[lang];
  const val = document.getElementById(inpMap[type]).value.trim();
  const arr = type === 'party' ? parties : type === 'sector' ? sectors : transports;
  if (!val) { al(alMap[type], L.enterName, 'er'); return; }
  if (arr.includes(val)) { al(alMap[type], L.alreadyExists, 'er'); return; }
  arr.push(val);
  if (type === 'party') { getCode(val); svP(); } else if (type === 'sector') svS(); else svTr();
  refreshAllDrops();
  document.getElementById(inpMap[type]).value = '';
  al(alMap[type], L.addedOk, 'ok');
  if (type === 'party') renderPartyList();
  else if (type === 'sector') renderSectorList();
  else renderTransportList();
}

function deleteItem(type, idx) {
  const L = T[lang];
  const arr = type === 'party' ? parties : type === 'sector' ? sectors : transports;
  const name = arr[idx];
  let used = false;
  if (type === 'party') used = records.some(r => r.party === name) || payments.some(p => p.party === name);
  else if (type === 'sector') used = records.some(r => r.sector === name);
  else used = records.some(r => r.transport === name);
  if (used && !confirm(`"${name}" ${L.usedWarning}`)) return;
  arr.splice(idx, 1);
  if (type === 'party') svP(); else if (type === 'sector') svS(); else svTr();
  refreshAllDrops();
  if (type === 'party') renderPartyList();
  else if (type === 'sector') renderSectorList();
  else renderTransportList();
}

function renderPartyList() {
  const L = T[lang];
  const el = document.getElementById('parties-list');
  if (!parties.length) { el.innerHTML = `<span style="color:var(--muted);font-size:12px;">${L.noneParty}</span>`; return; }
  el.innerHTML = parties.map((p, i) =>
    `<div class="tag"><span class="tag-code">${getCode(p)}</span><span>${p}</span><button class="x" onclick="deleteItem('party',${i})">✕</button></div>`
  ).join('');
}

function renderSectorList() {
  const L = T[lang];
  const el = document.getElementById('sectors-list');
  el.innerHTML = sectors.length ? sectors.map((s, i) =>
    `<div class="tag"><span>${s}</span><button class="x" onclick="deleteItem('sector',${i})">✕</button></div>`
  ).join('') : `<span style="color:var(--muted);font-size:12px;">${L.noneSector}</span>`;
}

function renderTransportList() {
  const L = T[lang];
  const el = document.getElementById('transports-list');
  if (!el) return;
  el.innerHTML = transports.length ? transports.map((t, i) =>
    `<div class="tag"><span>🚌 ${t}</span><button class="x" onclick="deleteItem('transport',${i})">✕</button></div>`
  ).join('') : `<span style="color:var(--muted);font-size:12px;">${L.noneTransport}</span>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY — SHARING LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function onTransportChange(prefix) {
  const val = document.getElementById(prefix + '-transport').value;
  const sharing = isSharing(val);
  const L = T[lang];
  const countInp = document.getElementById(prefix + '-count');
  const fareInp = document.getElementById(prefix + '-fare');
  const vehicleWrap = document.getElementById(prefix + '-vehicle-wrap');
  const hint = document.getElementById(prefix + '-transport-hint');
  countInp.disabled = false;
  fareInp.disabled = false;
  if (!val) {
    document.getElementById(prefix + '-total').value = '';
    if (vehicleWrap) vehicleWrap.style.display = 'none';
    if (hint) hint.style.display = 'none';
    return;
  }
  if (sharing) {
    if (vehicleWrap) vehicleWrap.style.display = 'none';
    document.getElementById(prefix + '-vehicle-total').value = '';
    if (hint) {
      hint.style.display = 'block';
      hint.style.background = '#E8F5E9';
      hint.style.color = '#2E7D32';
      hint.style.border = '1px solid #A5D6A7';
      hint.textContent = '🚌 ' + L.typeSharing + ' — ' + L.sharingNote.replace('⚠️ ', '');
    }
  } else {
    if (!countInp.value) countInp.value = '1';
    if (vehicleWrap) vehicleWrap.style.display = 'block';
    if (hint) {
      hint.style.display = 'block';
      hint.style.background = '#FFF8E1';
      hint.style.color = '#E65100';
      hint.style.border = '1px solid #FFCC80';
      hint.textContent = '🚐 ' + L.typeWhole + ' — ' + L.wholeNote.replace('⚠️ ', '');
    }
  }
  if (prefix === 'e') calcE(); else calcU();
}

function calcE() {
  const val = document.getElementById('e-transport').value;
  if (!val) { document.getElementById('e-total').value = ''; return; }
  const c = +document.getElementById('e-count').value || 0;
  const f = +document.getElementById('e-fare').value || 0;
  if (isSharing(val)) {
    document.getElementById('e-total').value = (c * f).toFixed(2);
  } else {
    const vt = +document.getElementById('e-vehicle-total').value || 0;
    if (f > 0) {
      const cnt = c || 1; document.getElementById('e-total').value = (cnt * f).toFixed(2);
      document.getElementById('e-vehicle-total').value = (cnt * f).toFixed(2);
    }
    else if (vt > 0) { document.getElementById('e-total').value = vt.toFixed(2); }
    else { document.getElementById('e-total').value = ''; }
  }
}

function calcU() {
  const val = document.getElementById('u-transport').value;
  if (!val) { document.getElementById('u-total').value = ''; return; }
  const c = +document.getElementById('u-count').value || 0;
  const f = +document.getElementById('u-fare').value || 0;
  if (isSharing(val)) {
    document.getElementById('u-total').value = (c * f).toFixed(2);
  } else {
    const vt = +document.getElementById('u-vehicle-total').value || 0;
    if (f > 0) {
      const cnt = c || 1; document.getElementById('u-total').value = (cnt * f).toFixed(2);
      document.getElementById('u-vehicle-total').value = (cnt * f).toFixed(2);
    }
    else if (vt > 0) { document.getElementById('u-total').value = vt.toFixed(2); }
    else { document.getElementById('u-total').value = ''; }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ENTRY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setNextVoucher() { document.getElementById('e-voucher').value = genVoucher(); }

function addEntry() {
  const L = T[lang];
  const date = document.getElementById('e-date').value;
  const party = document.getElementById('e-party').value;
  const sector = document.getElementById('e-sector').value;
  const transport = document.getElementById('e-transport').value;
  const notes = document.getElementById('e-notes').value.trim();
  const voucher = document.getElementById('e-voucher').value || genVoucher();
  if (!date || !party || !sector || !transport) { al('al-entry', L.entryRequired, 'er'); return; }
  let count = 0, fare = 0, total = 0, vehicleTotal = 0, mode = 'sharing';
  if (isSharing(transport)) {
    count = parseInt(document.getElementById('e-count').value) || 0;
    fare = parseFloat(document.getElementById('e-fare').value) || 0;
    if (count < 1) { al('al-entry', L.sharingNote, 'er'); return; }
    total = count * fare;
    mode = 'sharing';
  } else {
    count = parseInt(document.getElementById('e-count').value) || 0;
    fare = parseFloat(document.getElementById('e-fare').value) || 0;
    vehicleTotal = parseFloat(document.getElementById('e-vehicle-total').value) || 0;
    if (fare > 0) { count = count || 1; total = count * fare; vehicleTotal = total; }
    else { if (vehicleTotal <= 0) { al('al-entry', L.wholeNote, 'er'); return; } total = vehicleTotal; count = 1; fare = vehicleTotal; }
    mode = 'whole';
  }
  records.push({ id: uid(), voucher, date, party, sector, transport, mode, count, fare, vehicleTotal, total, notes });
  svR();
  al('al-entry', L.entrySaved, 'ok');
  clearEntryForm();
  todayStats();
}

function clearEntryForm() {
  document.getElementById('e-notes').value = '';
  sdClear('e-party');
  document.getElementById('e-sector').value = '';
  document.getElementById('e-transport').value = '';
  document.getElementById('e-count').value = '';
  document.getElementById('e-fare').value = '';
  document.getElementById('e-total').value = '';
  document.getElementById('e-vehicle-total').value = '';
  document.getElementById('e-vehicle-wrap').style.display = 'none';
  document.getElementById('e-transport-hint').style.display = 'none';
  document.getElementById('e-date').value = today();
  setNextVoucher();
}

function todayStats() {
  const td = records.filter(r => r.date === today());
  document.getElementById('ts-p').textContent = [...new Set(td.map(r => r.party))].length;
  document.getElementById('ts-h').textContent = td.reduce((s, r) => s + r.count, 0);
  document.getElementById('ts-a').textContent = td.reduce((s, r) => s + r.total, 0).toLocaleString();
  document.getElementById('ts-t').textContent = td.length;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAYMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderPayHead() {
  const L = T[lang];
  document.getElementById('pay-head').innerHTML =
    `<th>${L.numCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.received || 'SAR'}</th><th>${L.methodCol}</th><th>${L.notesCol}</th><th>${L.actionCol}</th>`;
}

function addPayment() {
  const L = T[lang];
  const date = document.getElementById('p-date').value;
  const party = document.getElementById('p-party').value;
  const amount = parseFloat(document.getElementById('p-amount').value) || 0;
  const method = document.getElementById('p-method').value;
  const notes = document.getElementById('p-notes').value.trim();
  if (!date || !party || amount <= 0) { al('al-pay', L.payRequired, 'er'); return; }
  payments.push({ id: uid(), date, party, amount, method, notes });
  svPy();
  al('al-pay', L.paySaved, 'ok');
  document.getElementById('p-amount').value = '';
  document.getElementById('p-notes').value = '';
  document.getElementById('p-date').value = today();
  sdClear('p-party');
  renderPayments();
}

function renderPayments() {
  const L = T[lang];
  const tbody = document.getElementById('pay-tbody');
  const sorted = [...payments].sort((a, b) => b.date.localeCompare(a.date));
  if (!sorted.length) { tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="ico">💳</div>${L.noPayments}</div></td></tr>`; return; }
  tbody.innerHTML = sorted.map((p, i) =>
    `<tr><td>${i + 1}</td><td>${fd(p.date)}</td>
    <td><span class="party-code">${getCode(p.party)}</span></td>
    <td><strong>${p.party}</strong></td>
    <td><strong class="led-cr">${sar(p.amount)}</strong></td>
    <td><span class="badge">${getMethodLabel(p.method)}</span></td>
    <td style="font-size:11px;color:var(--muted);">${p.notes || '—'}</td>
    <td><button class="btn btn-sm btn-d" onclick="deletePay('${p.id}')">${L.del}</button></td></tr>`
  ).join('');
}

function deletePay(id) {
  const L = T[lang];
  if (!confirm(L.confirmDelPay)) return;
  payments = payments.filter(x => x.id !== id);
  svPy();
  renderPayments();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LEDGER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function clearLedgerFilter() {
  document.getElementById('l-party').value = '';
  document.getElementById('l-from').value = '';
  document.getElementById('l-to').value = '';
  renderLedger();
}

function renderLedger() {
  const L = T[lang];
  const selParty = document.getElementById('l-party').value;
  const from = document.getElementById('l-from').value;
  const to = document.getElementById('l-to').value;
  const out = document.getElementById('ledger-output');
  const pList = selParty ? [selParty] : parties;
  if (!pList.length) { out.innerHTML = `<div class="empty"><div class="ico">📒</div>${L.noData}</div>`; return; }

  let summaryHtml = '';
  if (!selParty && parties.length) {
    const summaryRows = parties.map(party => {
      const ovDebit = records.filter(r => r.party === party).reduce((s, r) => s + r.total, 0);
      const ovCredit = payments.filter(p => p.party === party).reduce((s, p) => s + p.amount, 0);
      const ovBal = ovCredit - ovDebit;
      const ovBalClass = ovBal >= 0 ? 'led-pos' : 'led-neg';
      const ovBalText = ovBal >= 0 ? `+${sar(ovBal)}` : `-${sar(Math.abs(ovBal))}`;
      const statusLabel = ovBal >= 0 ? L.surplus : L.owing;
      return `<tr><td><span class="party-code">${getCode(party)}</span></td><td><strong>${party}</strong></td>
        <td class="led-dr">${sar(ovDebit)}</td><td class="led-cr">${sar(ovCredit)}</td>
        <td class="${ovBalClass}">${ovBalText} <span style="font-size:10px;color:var(--muted);">(${statusLabel})</span></td></tr>`;
    }).join('');
    summaryHtml = `<div class="card summary-card" style="margin-bottom:20px;"><h3 style="font-size:14px;color:var(--green-dark);margin-bottom:12px;display:flex;align-items:center;gap:6px;">📊 ${L.overallBalance} (${L.selectAll})</h3>
      <div class="tbl-wrap"><table><thead><tr><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.totalDebit}</th><th>${L.totalCredit}</th><th>${L.overallBalance}</th></tr></thead><tbody>${summaryRows}</tbody></table></div></div>`;
  }

  let html = '';
  pList.forEach(party => {
    let recs = [...records].filter(r => r.party === party);
    let pays = [...payments].filter(p => p.party === party);
    const overallDebit = records.filter(r => r.party === party).reduce((s, r) => s + r.total, 0);
    const overallCredit = payments.filter(p => p.party === party).reduce((s, p) => s + p.amount, 0);
    const overallBal = overallCredit - overallDebit;
    const overallBalClass = overallBal >= 0 ? 'led-pos' : 'led-neg';
    const overallBalText = overallBal >= 0 ? `${L.surplus}: ${sar(overallBal)} SAR` : `${L.owing}: ${sar(Math.abs(overallBal))} SAR`;
    if (from) { recs = recs.filter(r => r.date >= from); pays = pays.filter(p => p.date >= from); }
    if (to) { recs = recs.filter(r => r.date <= to); pays = pays.filter(p => p.date <= to); }
    const totalDebit = recs.reduce((s, r) => s + r.total, 0);
    const totalCredit = pays.reduce((s, p) => s + p.amount, 0);
    const balance = totalCredit - totalDebit;
    const txns = [
      ...recs.map(r => ({ date: r.date, type: 'debit', voucher: r.voucher || '—', desc: `${L.sectorRef} ${r.sector} (${r.count} ${L.hujPerSector} ${sar(r.fare)})`, amount: r.total, notes: r.notes || '' })),
      ...pays.map(p => ({ date: p.date, type: 'credit', voucher: '—', desc: `${L.payMethodRef} ${getMethodLabel(p.method)}`, amount: p.amount, notes: p.notes || '' }))
    ].sort((a, b) => a.date.localeCompare(b.date));
    let running = 0;
    const rows = txns.map((tx) => {
      if (tx.type === 'debit') running -= tx.amount;
      else running += tx.amount;
      const bc = running >= 0 ? 'led-pos' : 'led-neg';
      return `<tr><td><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--green-dark);">${tx.voucher}</span></td>
        <td>${fd(tx.date)}</td><td>${tx.type === 'debit' ? `<span style="color:var(--red);">${L.debitTx}</span>` : `<span style="color:#1565C0;">${L.creditTx}</span>`}</td>
        <td style="font-size:11px;">${tx.desc}</td>
        <td class="${tx.type === 'debit' ? 'led-dr' : ''}">${tx.type === 'debit' ? sar(tx.amount) : '—'}</td>
        <td class="${tx.type === 'credit' ? 'led-cr' : ''}">${tx.type === 'credit' ? sar(tx.amount) : '—'}</td>
        <td class="${bc}">${running >= 0 ? '+' : ''}${sar(Math.abs(running))} ${running >= 0 ? L.runBalance : L.runOwing}</td>
        <td style="font-size:10px;color:var(--muted);">${tx.notes || '—'}</td></tr>`;
    }).join('');
    const balClass = balance >= 0 ? 'led-pos' : 'led-neg';
    const balText = balance >= 0 ? `${L.surplus}: ${sar(balance)} SAR` : `${L.owing}: ${sar(Math.abs(balance))} SAR`;
    html += `<div style="margin-bottom:20px;">
      <div style="background:var(--green-dark);color:#fff;padding:8px 12px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
        <strong style="font-size:13px;">👥 <span style="background:var(--gold);padding:2px 8px;border-radius:10px;font-size:10px;font-family:monospace;">${getCode(party)}</span> ${party}</strong>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:10px;align-items:center;">
          <span>${L.totalDebit}: <strong style="color:#ffb3b3;">${sar(totalDebit)} SAR</strong></span>
          <span>${L.totalCredit}: <strong style="color:#b3ffcc;">${sar(totalCredit)} SAR</strong></span>
          <span class="${balClass}" style="${balance < 0 ? 'color:#ff9999' : 'color:#99ffcc'};font-size:11px;">${balText}</span>
          <span class="overall-bal-badge" style="font-size:10px;"><span>${L.overallBalance}:</span>
            <strong class="${overallBalClass}" style="${overallBal < 0 ? 'color:#ff9999' : 'color:#99ffcc'}">${overallBalText}</strong></span>
        </div>
      </div>
      ${txns.length ? `<div style="overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;"><table><thead><tr>
        <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.txType}</th><th>${L.desc}</th>
        <th>${L.debitCol}</th><th>${L.creditCol}</th><th>${L.balance}</th><th>${L.notesCol}</th>
      </tr></thead><tbody>${rows}
        <tr style="background:var(--green-light);font-weight:600;"><td colspan="4" style="text-align:center;color:var(--green-dark);">${L.subTotal}</td>
        <td class="led-dr">${sar(totalDebit)}</td><td class="led-cr">${sar(totalCredit)}</td>
        <td class="${balClass}">${balance >= 0 ? '+' : ''}${sar(Math.abs(balance))}</td><td></td></tr>
      </tbody></table></div>` : `<div style="padding:14px;text-align:center;color:var(--muted);border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">${L.noTx}</div>`}
    </div>`;
  });
  out.innerHTML = summaryHtml + (html || `<div class="empty"><div class="ico">📒</div>${L.noData}</div>`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderRecHead() {
  const L = T[lang];
  document.getElementById('rec-head').innerHTML =
    `<th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.transportCol}</th><th>${L.typeSharing}/${L.typeWhole}</th><th>${L.hujjajCol}</th><th>${L.fareCol}</th><th>${L.vehicleTotalCol || 'گاڑی رقم'}</th><th>${L.totalCol}</th><th>${L.actionCol}</th>`;
}

function renderRecords(rows) {
  const L = T[lang];
  const tbody = document.getElementById('rec-tbody');
  const tot = document.getElementById('rec-totals');
  if (!rows.length) { tbody.innerHTML = `<tr><td colspan="12"><div class="empty"><div class="ico">📂</div>${L.noRec}</div></td></tr>`; tot.style.display = 'none'; return; }
  const s = [...rows].sort((a, b) => b.date.localeCompare(a.date));
  tbody.innerHTML = s.map(r => {
    const sharing = r.mode === 'sharing' || isSharing(r.transport);
    const modeTag = sharing ? `<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚌 ${L.typeSharing}</span>`
      : `<span style="background:#FFF8E1;color:#E65100;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">🚐 ${L.typeWhole}</span>`;
    return `<tr><td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.voucher || '—'}</span></td>
      <td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td>
      <td><strong>${r.party}</strong></td><td><span class="badge">${r.sector}</span></td>
      <td>${r.transport || '—'}</td><td>${modeTag}</td>
      <td>${sharing ? `<strong>${r.count}</strong>` : '—'}</td>
      <td>${sharing ? sar(r.fare) : '—'}</td>
      <td>${!sharing ? `<strong style="color:#E65100;">${sar(r.vehicleTotal || r.total)}</strong>` : '—'}</td>
      <td><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td>
      <td><button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button></td></tr>`;
  }).join('');
  document.getElementById('rt-c').textContent = rows.length;
  document.getElementById('rt-h').textContent = rows.filter(r => r.mode === 'sharing' || isSharing(r.transport)).reduce((s, r) => s + r.count, 0);
  document.getElementById('rt-a').textContent = sar(rows.reduce((s, r) => s + r.total, 0));
  tot.style.display = 'grid';
}

function filterRecords() {
  const from = document.getElementById('f-from').value, to = document.getElementById('f-to').value;
  const party = document.getElementById('f-party').value, sector = document.getElementById('f-sector').value;
  let rows = [...records];
  if (from) rows = rows.filter(r => r.date >= from);
  if (to) rows = rows.filter(r => r.date <= to);
  if (party) rows = rows.filter(r => r.party === party);
  if (sector) rows = rows.filter(r => r.sector === sector);
  renderRecords(rows);
}

function clearFilter() {
  ['f-from', 'f-to'].forEach(id => document.getElementById(id).value = '');
  ['f-party', 'f-sector'].forEach(id => document.getElementById(id).value = '');
  renderRecords(records);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function genReport() {
  const L = T[lang];
  const from = document.getElementById('r-from').value, to = document.getElementById('r-to').value;
  const type = document.getElementById('r-type').value;
  let rows = [...records];
  if (from) rows = rows.filter(r => r.date >= from);
  if (to) rows = rows.filter(r => r.date <= to);
  const out = document.getElementById('rep-out');
  if (!rows.length) { out.innerHTML = `<div class="empty"><div class="ico">📭</div>${L.noData}</div>`; return; }
  const lbl = { date: L.byDate, party: L.byParty, sector: L.bySector };
  const groups = {};
  rows.forEach(r => { const k = type === 'date' ? fd(r.date) : type === 'party' ? r.party : r.sector; if (!groups[k]) groups[k] = []; groups[k].push(r); });
  const gT = rows.reduce((s, r) => s + r.total, 0), gH = rows.reduce((s, r) => s + r.count, 0);
  let html = `<div style="margin-bottom:12px;padding:10px;background:var(--green-dark);color:#fff;border-radius:10px;display:flex;gap:14px;flex-wrap:wrap;">
    <div><div style="font-size:9px;opacity:.8;">${L.trips}</div><div style="font-size:16px;font-weight:700;">${rows.length}</div></div>
    <div><div style="font-size:9px;opacity:.8;">${L.hujjaj}</div><div style="font-size:16px;font-weight:700;">${gH}</div></div>
    <div><div style="font-size:9px;opacity:.8;">${L.amount}</div><div style="font-size:16px;font-weight:700;color:var(--gold-light);">${sar(gT)}</div></div>
    <div><div style="font-size:9px;opacity:.8;">${L.repKind}</div><div style="font-size:12px;font-weight:700;">${lbl[type]}</div></div>
  </div>`;
  Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, items]) => {
    const sT = items.reduce((s, r) => s + r.total, 0), sH = items.reduce((s, r) => s + r.count, 0);
    const codeTag = type === 'party' ? `<span class="party-code" style="margin-left:6px;margin-right:6px;">${getCode(k)}</span>` : '';
    html += `<div style="margin-bottom:12px;">
      <div style="background:var(--cream-dark);padding:6px 10px;border-radius:8px 8px 0 0;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
        <strong style="font-size:13px;color:var(--green-dark);">📌 ${codeTag}${k}</strong>
        <span style="font-size:10px;color:var(--muted);">${L.trips}: ${items.length} | ${L.hujjaj}: ${sH} | ${L.amount}: <strong style="color:var(--green-dark);">${sar(sT)}</strong></span>
      </div>
      <div style="overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">
        <table><thead><tr><th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.transportCol}</th>
          <th>${L.hujjajCol}</th><th>${L.fareCol}</th><th>${L.totalCol}</th>
        </tr></thead><tbody>
          ${items.map(r => `<tr><td><span style="font-family:monospace;font-weight:700;font-size:10px;color:var(--green-dark);">${r.voucher || '—'}</span></td><td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td><td>${r.party}</td><td><span class="badge">${r.sector}</span></td>
            <td>${getTransportLabel(r.transport)}</td><td>${r.count}</td><td>${sar(r.fare)}</td>
            <td><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td></tr>`).join('')}
          <tr style="background:var(--green-light);font-weight:600;"><td colspan="6" style="text-align:center;color:var(--green-dark);">${L.subTotal}</td>
            <td style="color:var(--green-dark);">${sH}</td><td>—</td><td style="color:var(--green-dark);">${sar(sT)}</td></tr>
        </tbody></table>
      </div></div>`;
  });
  out.innerHTML = html;
}

function printReport() {
  const out = document.getElementById('rep-out');
  if (!out.innerHTML.trim()) {
    const L = T[lang];
    al('al-login', L.noData || 'پہلے رپورٹ بنائیں', 'er');
    return;
  }
  const from = document.getElementById('r-from').value;
  const to = document.getElementById('r-to').value;
  const rangeText = (from || to) ? `${from ? fd(from) : '...'} ${L_arrow()} ${to ? fd(to) : '...'}` : '';
  document.getElementById('ph-range').textContent = rangeText ? `📅 ${rangeText}` : '';
  document.getElementById('ph-printed-on').textContent = `🖨️ ${new Date().toLocaleDateString('ur-PK')}`;
  window.print();
}

function exportReportExcel() {
  const out = document.getElementById('rep-out');
  if (!out.innerHTML.trim()) {
    const L = T[lang];
    al('al-login', L.noData || 'پہلے رپورٹ بنائیں', 'er');
    return;
  }

  const L = T[lang];
  const from = document.getElementById('r-from').value;
  const to = document.getElementById('r-to').value;
  const type = document.getElementById('r-type').value;

  let rows = [...records];
  if (from) rows = rows.filter(r => r.date >= from);
  if (to) rows = rows.filter(r => r.date <= to);

  if (!rows.length) { al('al-login', L.noData, 'er'); return; }

  const headers = [L.voucherCol, L.dateCol, L.codeCol, L.partyCol, L.sectorCol, L.transportCol, L.hujjajCol, L.fareCol, L.totalCol];

  const groups = {};
  rows.forEach(r => {
    const k = type === 'date' ? fd(r.date) : type === 'party' ? r.party : r.sector;
    if (!groups[k]) groups[k] = [];
    groups[k].push(r);
  });

  const gT = rows.reduce((s, r) => s + r.total, 0);
  const gH = rows.reduce((s, r) => s + r.count, 0);

  // ─── سٹائلز کی تعریف ───
  const thinBorder = {
    top: { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left: { style: 'thin', color: { rgb: 'CCCCCC' } },
    right: { style: 'thin', color: { rgb: 'CCCCCC' } }
  };

  const S = {
    title:      { font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, alignment: { horizontal: 'center' } },
    sub:        { font: { sz: 10, color: { rgb: '555555' } } },
    groupHead:  { font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '0F7A41' }, patternType: 'solid' } },
    colHead:    { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: 'C9940A' }, patternType: 'solid' }, alignment: { horizontal: 'center' }, border: thinBorder },
    dataRow:    { border: thinBorder },
    subTotal:   { font: { bold: true }, fill: { fgColor: { rgb: 'E8F3EC' }, patternType: 'solid' }, border: thinBorder },
    grandTotal: { font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '054D28' }, patternType: 'solid' }, border: thinBorder }
  };

  // سیل بنانے کا helper — قدر اور سٹائل دونوں رکھے گا
  const cell = (v, styleKey) => ({ v: v ?? '', t: typeof v === 'number' ? 'n' : 's', s: styleKey ? S[styleKey] : undefined });

  const sheetRows = []; // ہر اندراج ایک array of cell-objects ہوگا
  const merges = [];

  const addRow = (cells) => { sheetRows.push(cells); };

  // ٹائٹل
  addRow([cell('Umrah Transport Management System', 'title')]);
  merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });

  addRow([cell(`${L.repKind || 'رپورٹ کی قسم'}: ${type === 'date' ? L.byDate : type === 'party' ? L.byParty : L.bySector}`, 'sub')]);
  merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });

  if (from || to) {
    addRow([cell(`${L.repfrom || 'تاریخ سے'}: ${from ? fd(from) : '—'}   ${L.repto || 'تاریخ تک'}: ${to ? fd(to) : '—'}`, 'sub')]);
    merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });
  }

  addRow([cell('')]); // خالی لائن

  Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0])).forEach(([k, items]) => {
    addRow([cell(`📌 ${k}`, 'groupHead')]);
    merges.push({ s: { r: sheetRows.length - 1, c: 0 }, e: { r: sheetRows.length - 1, c: 8 } });

    addRow(headers.map(h => cell(h, 'colHead')));

    items.forEach(row => {
      addRow([
        cell(row.voucher || '—', 'dataRow'),
        cell(fd(row.date), 'dataRow'),
        cell(getCode(row.party), 'dataRow'),
        cell(row.party, 'dataRow'),
        cell(row.sector, 'dataRow'),
        cell(getTransportLabel(row.transport), 'dataRow'),
        cell(row.count, 'dataRow'),
        cell(row.fare, 'dataRow'),
        cell(row.total, 'dataRow')
      ]);
    });

    const sT = items.reduce((s, x) => s + x.total, 0);
    const sH = items.reduce((s, x) => s + x.count, 0);
    addRow([
      cell(L.subTotal, 'subTotal'), cell('', 'subTotal'), cell('', 'subTotal'),
      cell('', 'subTotal'), cell('', 'subTotal'), cell('', 'subTotal'),
      cell(sH, 'subTotal'), cell('', 'subTotal'), cell(sT, 'subTotal')
    ]);

    addRow([cell('')]); // گروپس کے درمیان خالی لائن
  });

  addRow([
    cell(L.grandTotal || 'مجموعی ٹوٹل', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'),
    cell('', 'grandTotal'), cell('', 'grandTotal'), cell('', 'grandTotal'),
    cell(gH, 'grandTotal'), cell('', 'grandTotal'), cell(gT, 'grandTotal')
  ]);

  // ─── ورک شیٹ بنائیں ───
  const ws = XLSX.utils.aoa_to_sheet(sheetRows.map(row => row.map(c => c.v)));

  // اب ہر سیل پر سٹائل واپس لگائیں (aoa_to_sheet سٹائل نہیں رکھتا، صرف values)
  sheetRows.forEach((row, rIdx) => {
    row.forEach((c, cIdx) => {
      if (c.s) {
        const ref = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
        if (ws[ref]) ws[ref].s = c.s;
      }
    });
  });

  ws['!cols'] = [
    { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 14 },
    { wch: 14 }, { wch: 9 }, { wch: 11 }, { wch: 13 }
  ];
  ws['!merges'] = merges;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  const dateStamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Report_${dateStamp}.xlsx`);
}


function L_arrow() { return document.documentElement.dir === 'rtl' ? '←' : '→'; }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPDATE / DELETE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderUpdHead() {
  const L = T[lang];
  document.getElementById('upd-head').innerHTML =
    `<th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.hujjajCol}</th><th>${L.totalCol}</th><th>${L.actionCol}</th>`;
}

function renderUpdateTable() {
  const L = T[lang];
  const tbody = document.getElementById('upd-tbody');
  const s = [...records].sort((a, b) => b.date.localeCompare(a.date));
  if (!s.length) { tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="ico">📂</div>${L.noRec}</div></td></tr>`; return; }
  tbody.innerHTML = s.map(r =>
    `<tr><td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.voucher || '—'}</span></td>
    <td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td>
    <td><strong>${r.party}</strong></td><td><span class="badge">${r.sector}</span></td>
    <td>${r.count}</td><td><strong>${sar(r.total)}</strong></td>
    <td class="action-btns"><button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button>
    <button class="btn btn-sm btn-d" onclick="deleteRecord('${r.id}')">${L.del}</button></td></tr>`
  ).join('');
}

function editRecord(id) {
  const r = records.find(x => x.id === id);
  if (!r) return;
  document.getElementById('u-id').value = id;
  document.getElementById('u-date').value = r.date;
  document.getElementById('u-voucher').value = r.voucher || '—';
  fillDrop('u-sector', sectors);
  document.getElementById('u-sector').value = r.sector;
  sdSetValue('u-party', r.party);
  fillDrop('u-transport', transports);
  document.getElementById('u-transport').value = r.transport;
  document.getElementById('u-notes').value = r.notes || '';
  onTransportChange('u');
  if (r.mode === 'sharing' || isSharing(r.transport)) {
    document.getElementById('u-count').value = r.count;
    document.getElementById('u-fare').value = r.fare;
  } else {
    document.getElementById('u-vehicle-total').value = r.vehicleTotal || r.total || '';
  }
  document.getElementById('u-total').value = r.total;
  document.getElementById('upd-form').style.display = 'block';
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
  document.getElementById('page-update').classList.add('active');
  document.querySelectorAll('#main-nav button')[5].classList.add('active');
  renderUpdateTable();
  renderUpdHead();
  setTimeout(() => document.getElementById('upd-form').scrollIntoView({ behavior: 'smooth' }), 50);
}

function saveUpdate() {
  const L = T[lang];
  const id = document.getElementById('u-id').value;
  const idx = records.findIndex(x => x.id === id);
  if (idx === -1) return;
  const transport = document.getElementById('u-transport').value;
  let count = 0, fare = 0, vehicleTotal = 0, total = 0, mode = 'sharing';
  if (isSharing(transport)) {
    count = parseInt(document.getElementById('u-count').value) || 0;
    fare = parseFloat(document.getElementById('u-fare').value) || 0;
    total = count * fare;
    mode = 'sharing';
  } else {
    count = parseInt(document.getElementById('u-count').value) || 0;
    fare = parseFloat(document.getElementById('u-fare').value) || 0;
    vehicleTotal = parseFloat(document.getElementById('u-vehicle-total').value) || 0;
    if (fare > 0) { count = count || 1; total = count * fare; vehicleTotal = total; }
    else { total = vehicleTotal; count = 1; fare = vehicleTotal; }
    mode = 'whole';
  }
  records[idx] = {
    ...records[idx], date: document.getElementById('u-date').value,
    voucher: document.getElementById('u-voucher').value, party: document.getElementById('u-party').value,
    sector: document.getElementById('u-sector').value, transport, mode, count, fare, vehicleTotal, total,
    notes: document.getElementById('u-notes').value.trim()
  };
  svR();
  al('al-upd', L.updOk, 'ok');
  document.getElementById('upd-form').style.display = 'none';
  renderUpdateTable();
}

function cancelUpdate() { document.getElementById('upd-form').style.display = 'none'; }

function deleteRecord(id) {
  const L = T[lang];
  if (!confirm(L.confirmDel)) return;
  records = records.filter(x => x.id !== id);
  svR();
  renderUpdateTable();
  al('al-upd', L.delOk, 'ok');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DAILY NOTE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function saveDailyNote() {
  const L = T[lang];
  const date = document.getElementById('dn-date').value;
  const ref = document.getElementById('dn-ref').value.trim() || genDNRef();
  const party = document.getElementById('dn-party').value;
  const group = document.getElementById('dn-group').value.trim();
  const mobile = document.getElementById('dn-mobile').value.trim();
  const sector = document.getElementById('dn-sector').value;
  const count = parseInt(document.getElementById('dn-count').value) || 0;
  const flightNo = document.getElementById('dn-flight-no').value.trim();
  const flightTime = document.getElementById('dn-flight-time').value;
  if (!date || !party || !sector || count <= 0) { al('al-dn', L.dnRequired, 'er'); return; }
  const id = document.getElementById('dn-id').value;
  if (id) {
    const idx = dailyNotes.findIndex(n => n.id === id);
    if (idx !== -1) dailyNotes[idx] = { ...dailyNotes[idx], date, ref, party, group, mobile, sector, count, flightNo, flightTime };
  } else {
    dailyNotes.push({ id: uid(), date, ref, party, group, mobile, sector, count, flightNo, flightTime });
  }
  svDN();
  al('al-dn', L.dnSaved, 'ok');
  clearDailyNoteForm();
  renderDailyNoteReport();
}

function clearDailyNoteForm() {
  document.getElementById('dn-id').value = '';
  document.getElementById('dn-date').value = today();
  document.getElementById('dn-ref').value = genDNRef();
  sdClear('dn-party');
  document.getElementById('dn-group').value = '';
  document.getElementById('dn-mobile').value = '';
  document.getElementById('dn-sector').value = '';
  document.getElementById('dn-count').value = '';
  document.getElementById('dn-flight-no').value = '';
  document.getElementById('dn-flight-time').value = '';
  document.getElementById('btn-dn-save').textContent = T[lang].dnSave;
  document.getElementById('lbl-dnTitle').textContent = T[lang].dnTitle;
}

function editDailyNote(id) {
  const note = dailyNotes.find(n => n.id === id);
  if (!note) return;
  const L = T[lang];
  document.getElementById('dn-id').value = id;
  document.getElementById('dn-date').value = note.date;
  document.getElementById('dn-ref').value = note.ref || '';
  sdSetValue('dn-party', note.party);
  document.getElementById('dn-group').value = note.group || '';
  document.getElementById('dn-mobile').value = note.mobile || '';
  fillDrop('dn-sector', sectors);
  document.getElementById('dn-sector').value = note.sector;
  document.getElementById('dn-count').value = note.count;
  document.getElementById('dn-flight-no').value = note.flightNo || '';
  document.getElementById('dn-flight-time').value = note.flightTime || '';
  document.getElementById('btn-dn-save').textContent = L.dnEditTitle;
  document.getElementById('lbl-dnTitle').textContent = L.dnEditTitle;
  document.getElementById('page-dailynote').scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('#main-nav button').forEach(x => x.classList.remove('active'));
  document.getElementById('page-dailynote').classList.add('active');
  document.getElementById('nav-dailynote').classList.add('active');
}

function deleteDailyNote(id) {
  const L = T[lang];
  if (!confirm(L.dnDelConfirm)) return;
  dailyNotes = dailyNotes.filter(n => n.id !== id);
  svDN();
  renderDailyNoteReport();
  al('al-dn', L.dnDelOk, 'ok');
}

function clearDailyNoteReport() {
  document.getElementById('dnr-from').value = '';
  document.getElementById('dnr-to').value = '';
  renderDailyNoteReport();
}

function renderDailyNoteReport() {
  const L = T[lang];
  const out = document.getElementById('dn-report-out');
  if (!out) return;
  const from = document.getElementById('dnr-from').value || '';
  const to = document.getElementById('dnr-to').value || '';
  let notes = [...dailyNotes].sort((a, b) => b.date.localeCompare(a.date));
  if (from) notes = notes.filter(n => n.date >= from);
  if (to) notes = notes.filter(n => n.date <= to);
  if (!notes.length) { out.innerHTML = `<div class="empty"><div class="ico">📋</div>${L.dnNoData}</div>`; return; }
  const allSectorTotals = {};
  notes.forEach(n => { const s = n.sector; allSectorTotals[s] = (allSectorTotals[s] || 0) + (parseInt(n.count) || 0); });
  const grandTotal = Object.values(allSectorTotals).reduce((a, b) => a + b, 0);
  const summaryCards = Object.entries(allSectorTotals).map(([s, c]) =>
    `<div class="dn-rep-sector"><span class="dn-rep-sector-name">${s}</span><span class="dn-rep-sector-count">${c}</span></div>`
  ).join('');
  const summary = `<div class="dn-rep-card"><div class="dn-rep-header"><span class="dn-rep-date">📊 ${L.dnRepTitle}</span>
    <span class="dn-rep-ref">${L.dnTotalLbl} ${grandTotal}</span></div>
    <div class="dn-rep-body"><div class="dn-rep-sectors">${summaryCards}</div></div></div>`;
  const tbody = notes.map(r =>
    `<tr><td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:11px;">${r.ref || '—'}</span></td>
    <td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td>
    <td><strong>${r.party}</strong></td><td>${r.group || '—'}</td>
    <td style="direction:ltr;text-align:right;font-family:monospace;">${r.mobile || '—'}</td>
    <td><span class="badge">${r.sector}</span></td><td><strong>${r.count}</strong></td>
    <td style="font-family:monospace;">${r.flightNo || '—'}<br><small style="color:var(--muted);">${r.flightTime ? formatTime12(r.flightTime) : ''}</small></td>
    <td class="action-btns"><button class="btn btn-sm btn-o no-print" onclick="editDailyNote('${r.id}')">${L.edit}</button>
    <button class="btn btn-sm btn-d no-print" onclick="deleteDailyNote('${r.id}')">${L.del}</button></td></tr>`
  ).join('');
  out.innerHTML = summary + `<div class="tbl-wrap"><table><thead><tr>
    <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th>
    <th>${L.dnGroup}</th><th>${L.dnMobile}</th><th>${L.sectorCol}</th><th>${L.hujjajCol}</th>
    <th>${L.dnFlightNo}</th><th>${L.actionCol}</th></tr></thead><tbody>${tbody}</tbody></table></div>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL KEYBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('keydown', e => {
  if (!document.getElementById('modal').classList.contains('open')) return;
  if (e.key === 'Enter') confirmModal();
  if (e.key === 'Escape') closeModal();
});
document.getElementById('modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  FIREBASE INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', () => {
  db.ref('/').on('value', snapshot => {
    const data = snapshot.val() || {};
    records = data.records || [];
    payments = data.payments || [];
    parties = data.parties || [];
    sectors = data.sectors || [];
    transports = data.transports || [];
    partyCodes = data.partyCodes || {};
    users = data.users || [];
    dailyNotes = data.dailyNotes || [];
    const settings = data.settings || {};
    fbLogo = settings.logo || null;
    fbAppName = settings.appName || {};
    fbAppSub = settings.appSub || {};

    if (!parties.length) { parties = T[lang].defaultParties.slice(); svP(); }
    if (!sectors.length) { sectors = T[lang].defaultSectors.slice(); svS(); }
    if (!transports.length) { transports = ['بس', 'وین', 'کار', 'کوچ']; svTr(); }
    parties.forEach(p => getCode(p));
    initUsers();

    if (!isFirebaseReady) {
      isFirebaseReady = true;
      document.getElementById('firebase-loader').style.display = 'none';
      applyLogo(fbLogo);
      setLang(lang);
      checkAuth();
      document.getElementById('e-date').value = today();
      document.getElementById('p-date').value = today();
      document.getElementById('dn-date').value = today();
      document.getElementById('e-count').disabled = false;
      document.getElementById('e-fare').disabled = false;
      setNextVoucher();
      renderDailyNoteReport();
    } else {
      applyLogo(fbLogo);
      loadAppName(lang);
      if (loggedInUser) checkAuth();
    }
  }, (error) => {
    console.error("Firebase Read Error:", error);
    document.getElementById('firebase-loader').innerHTML = `
      <div class="loader-container">
        <div style="font-size:48px;">⚠️</div>
        <div style="font-size:18px;font-weight:bold;color:#F5E6A3;">فائر بیس ایرر</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7);text-align:center;max-width:80%;">${error.message}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);text-align:center;max-width:80%;margin-top:8px;">
          یہ اس وجہ سے ہو سکتا ہے کہ آپ کا ڈیٹا بیس کا یو آر ایل مختلف ہو یا رولز صحیح نہ ہوں۔
        </div>
      </div>
    `;
  });
});