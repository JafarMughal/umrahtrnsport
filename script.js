const T = {
  ur:{
    dir:'rtl', lang:'ur',
    appTitle:'عمرہ ٹرانسپورٹ مینجمنٹ سسٹم',
    appSub:'حاجیوں کی آمدورفت کا مکمل ریکارڈ — جدہ، مکہ، مدینہ',
    nav:['📝 نئی انٹری','💰 ادائیگی','📒 لیجر','📋 تمام ریکارڈ','📊 رپورٹ','✏️ اپڈیٹ','⚙️ ترتیبات'],
    // Entry
    entry:'نئی ٹرانسپورٹ انٹری 🚌', date:'تاریخ', party:'پارٹی', newParty:'(+ نئی پارٹی)', sector:'سیکٹر', newSector:'(+ نیا سیکٹر)',
    transport:'ٹرانسپورٹ', count:'حاجیوں کی تعداد', fare:'فی حاجی کرایہ (SAR)', total:'کل رقم (SAR) — خودکار',
    notes:'نوٹس', save:'✅ انٹری محفوظ کریں', clear:'🔄 صاف کریں',
    bus:'بس', van:'وین', car:'کار', coach:'کوچ',
    newTransport:'(+ نئی)', selectTransport:'-- ٹرانسپورٹ منتخب --',
    setTransports:'ٹرانسپورٹ 🚌', newTransportLbl:'نئی ٹرانسپورٹ', transportPlaceholder:'مثلاً: بس، وین، کوچ',
    noneTransport:'کوئی ٹرانسپورٹ نہیں',
    sharingBusLabel:'شیئرنگ بس',
    sharingBusHint:'(شیئرنگ بس منتخب کریں تاکہ فی حاجی فیلڈ کھلیں)',
    vehicleTotalLbl:'پوری گاڑی کی رقم (SAR)',
    vehicleTotalCol:'گاڑی رقم (SAR)',
    typeSharing:'شیئرنگ', typeWhole:'پوری گاڑی',
    sharingNote:'⚠️ شیئرنگ بس میں حاجیوں کی تعداد اور فی حاجی کرایہ ضروری ہے',
    wholeNote:'⚠️ پوری گاڑی کی رقم ضروری ہے',
    todaySummary:'آج کا خلاصہ 📊', todayParties:'پارٹیاں آج', todayHujjaj:'کل حاجی آج', todayAmount:'کل رقم (SAR)', todayTrips:'کل سفر آج',
    selectParty:'-- پارٹی منتخب --', selectSector:'-- سیکٹر منتخب --',
    required:'★',
    // Payment
    payTitle:'پارٹی کی ادائیگی درج کریں 💰', received:'موصول رقم (SAR)', method:'ادائیگی کا طریقہ',
    cash:'نقد', bank:'بینک ٹرانسفر', cheque:'چیک', online:'آن لائن',
    savePay:'✅ ادائیگی محفوظ کریں', recentPay:'حالیہ ادائیگیاں 💳',
    // Ledger
    ledgerTitle:'پارٹی لیجر 📒', selectAll:'-- سب پارٹیاں --', fromDate:'تاریخ سے', toDate:'تاریخ تک',
    print:'🖨️ پرنٹ', resetFilter:'↩ صاف',
    debitCol:'واجب (SAR)', creditCol:'وصول (SAR)', balance:'بقایا', txType:'قسم', desc:'تفصیل',
    debitTx:'📤 واجب', creditTx:'📥 وصول', subTotal:'مجموعہ',
    totalDebit:'کل واجب', totalCredit:'کل وصول', surplus:'زائد ادائیگی', owing:'باقی واجب',
    noTx:'کوئی لین دین نہیں',
    // Records
    recTitle:'تمام ریکارڈ 📋', allParties:'سب', allSectors:'سب',
    filter:'🔍 فلٹر', totalRec:'کل ریکارڈ', totalHujjaj:'کل حاجی', totalAmt:'کل رقم (SAR)',
    edit:'✏️', del:'🗑️', noRec:'کوئی ریکارڈ نہیں',
    numCol:'#', dateCol:'تاریخ', partyCol:'پارٹی', sectorCol:'سیکٹر', transportCol:'ٹرانسپورٹ',
    hujjajCol:'حاجی', fareCol:'فی حاجی', totalCol:'کل (SAR)', actionCol:'کارروائی',
    // Report
    repTitle:'رپورٹ سینٹر 📊', repType:'رپورٹ کی قسم', genReport:'📊 رپورٹ بنائیں',
    byDate:'تاریخ وائز', byParty:'پارٹی وائز', bySector:'سیکٹر وائز',
    trips:'سفر', hujjaj:'حاجی', amount:'رقم (SAR)', repKind:'قسم',
    // Update
    updTitle:'ریکارڈ اپڈیٹ کریں ✏️', saveUpd:'💾 اپڈیٹ محفوظ کریں', cancel:'❌ منسوخ', selectRecord:'ریکارڈ منتخب کریں 📋',
    updOk:'✅ ریکارڈ اپڈیٹ ہوگیا', delOk:'🗑️ ریکارڈ حذف ہوگیا', confirmDel:'کیا یہ ریکارڈ حذف کریں؟', confirmDelPay:'کیا یہ ادائیگی حذف کریں؟',
    // Settings
    setParties:'پارٹیاں 👥', setSectors:'سیکٹر 🗺️', newPartyLbl:'نئی پارٹی', newSectorLbl:'نیا سیکٹر',
    add:'➕ شامل', addedOk:'✅ شامل ہوگیا', alreadyExists:'⚠️ پہلے سے موجود', enterName:'⚠️ نام لکھیں',
    usedWarning:'ریکارڈ میں موجود ہے۔ پھر بھی حذف کریں؟',
    noneParty:'کوئی پارٹی نہیں', noneSector:'کوئی سیکٹر نہیں',
    // Modal
    addPartyTitle:'➕ نئی پارٹی شامل کریں', addSectorTitle:'➕ نیا سیکٹر شامل کریں',
    partyPlaceholder:'پارٹی کا نام', sectorPlaceholder:'مثلاً: جدہ ➜ مکہ',
    modalSave:'✅ شامل کریں', modalCancel:'❌ منسوخ',
    entryRequired:'⚠️ تاریخ، پارٹی، سیکٹر اور تعداد ضروری ہے',
    payRequired:'⚠️ تاریخ، پارٹی اور رقم ضروری ہے',
    entrySaved:'✅ انٹری محفوظ ہوگئی', paySaved:'✅ ادائیگی محفوظ ہوگئی',
    noData:'کوئی ڈیٹا نہیں', noPayments:'کوئی ادائیگی نہیں',
    defaultSectors:['جدہ ➜ مکہ','مکہ ➜ مدینہ','مدینہ ➜ مکہ','مکہ ➜ جدہ'],
    defaultParties:['پارٹی الف','پارٹی ب'],
    sectorRef:'سفر:', hujPerSector:'حاجی ×',
    payMethodRef:'ادائیگی —',
    runBalance:'(باقی)','runOwing':'(واجب)',
    methodCol:'طریقہ', notesCol:'نوٹس',
    codeCol:'کوڈ', searchParty:'🔍 پارٹی تلاش کریں...', noMatch:'کوئی نتیجہ نہیں',
    partyCodeLbl:'پارٹی کوڈ',
    setApp:'ایپ کی ترتیب ⚙️', appNameLbl:'ایپ کا نام', appSubLbl:'ذیلی عنوان',
    logoLbl:'لوگو تبدیل کریں', logoHint:'PNG / JPG / SVG (کلک یا ڈراپ کریں)',
    saveApp:'💾 محفوظ کریں', appSavedOk:'✅ محفوظ ہوگیا',
    renameParty:'پارٹی کا نام تبدیل کریں ✏️', oldName:'پرانا نام', newName:'نیا نام',
    renameBtn:'✏️ نام تبدیل', renameSave:'💾 محفوظ', renameOk:'✅ نام تبدیل ہوگیا',
    renameErr:'⚠️ نیا نام لکھیں', renameDup:'⚠️ یہ نام پہلے سے موجود ہے',
    voucherCol:'واوچر نمبر', voucherLbl:'واوچر نمبر (خودکار)',
  },
  en:{
    dir:'ltr', lang:'en',
    appTitle:'Umrah Transport Management System',
    appSub:'Complete record of pilgrims — Jeddah, Makkah, Madinah',
    nav:['📝 New Entry','💰 Payment','📒 Ledger','📋 All Records','📊 Report','✏️ Update','⚙️ Settings'],
    entry:'New Transport Entry 🚌', date:'Date', party:'Party', newParty:'(+ New)', sector:'Sector', newSector:'(+ New)',
    transport:'Transport', count:'No. of Pilgrims', fare:'Fare per Pilgrim (SAR)', total:'Total (SAR) — Auto',
    notes:'Notes', save:'✅ Save Entry', clear:'🔄 Clear',
    bus:'Bus', van:'Van', car:'Car', coach:'Coach',
    newTransport:'(+ New)', selectTransport:'-- Select Transport --',
    setTransports:'Transport 🚌', newTransportLbl:'New Transport', transportPlaceholder:'e.g. Bus, Van, Coach',
    noneTransport:'No transport added',
    todaySummary:"Today's Summary 📊", todayParties:'Parties Today', todayHujjaj:'Total Pilgrims', todayAmount:'Total Amount (SAR)', todayTrips:'Total Trips',
    selectParty:'-- Select Party --', selectSector:'-- Select Sector --',
    required:'★',
    payTitle:'Record Party Payment 💰', received:'Amount Received (SAR)', method:'Payment Method',
    cash:'Cash', bank:'Bank Transfer', cheque:'Cheque', online:'Online',
    savePay:'✅ Save Payment', recentPay:'Recent Payments 💳',
    ledgerTitle:'Party Ledger 📒', selectAll:'-- All Parties --', fromDate:'From Date', toDate:'To Date',
    print:'🖨️ Print', resetFilter:'↩ Reset',
    debitCol:'Debit (SAR)', creditCol:'Credit (SAR)', balance:'Balance', txType:'Type', desc:'Description',
    debitTx:'📤 Debit', creditTx:'📥 Credit', subTotal:'Sub Total',
    totalDebit:'Total Debit', totalCredit:'Total Credit', surplus:'Surplus', owing:'Balance Due',
    noTx:'No transactions',
    recTitle:'All Records 📋', allParties:'All', allSectors:'All',
    filter:'🔍 Filter', totalRec:'Total Records', totalHujjaj:'Total Pilgrims', totalAmt:'Total Amount (SAR)',
    edit:'✏️', del:'🗑️', noRec:'No records found',
    numCol:'#', dateCol:'Date', partyCol:'Party', sectorCol:'Sector', transportCol:'Transport',
    hujjajCol:'Pilgrims', fareCol:'Fare/Pilgrim', totalCol:'Total (SAR)', actionCol:'Action',
    repTitle:'Report Center 📊', repType:'Report Type', genReport:'📊 Generate Report',
    byDate:'By Date', byParty:'By Party', bySector:'By Sector',
    trips:'Trips', hujjaj:'Pilgrims', amount:'Amount (SAR)', repKind:'Type',
    updTitle:'Update Record ✏️', saveUpd:'💾 Save Update', cancel:'❌ Cancel', selectRecord:'Select Record 📋',
    updOk:'✅ Record updated', delOk:'🗑️ Record deleted', confirmDel:'Delete this record?', confirmDelPay:'Delete this payment?',
    setParties:'Parties 👥', setSectors:'Sectors 🗺️', newPartyLbl:'New Party', newSectorLbl:'New Sector',
    add:'➕ Add', addedOk:'✅ Added', alreadyExists:'⚠️ Already exists', enterName:'⚠️ Enter a name',
    usedWarning:'Used in records. Delete anyway?',
    noneParty:'No parties', noneSector:'No sectors',
    addPartyTitle:'➕ Add New Party', addSectorTitle:'➕ Add New Sector',
    partyPlaceholder:'Party name', sectorPlaceholder:'e.g. Jeddah ➜ Makkah',
    modalSave:'✅ Add', modalCancel:'❌ Cancel',
    entryRequired:'⚠️ Date, Party, Sector and Pilgrim count are required',
    payRequired:'⚠️ Date, Party and Amount are required',
    entrySaved:'✅ Entry saved successfully', paySaved:'✅ Payment saved',
    noData:'No data', noPayments:'No payments',
    defaultSectors:['Jeddah ➜ Makkah','Makkah ➜ Madinah','Madinah ➜ Makkah','Makkah ➜ Jeddah'],
    defaultParties:['Party A','Party B'],
    sectorRef:'Trip:', hujPerSector:'Pilgrims ×',
    payMethodRef:'Payment —',
    runBalance:'(surplus)','runOwing':'(due)',
    methodCol:'Method', notesCol:'Notes',
    codeCol:'Code', searchParty:'🔍 Search party...', noMatch:'No match found',
    partyCodeLbl:'Party Code',
    setApp:'App Settings ⚙️', appNameLbl:'App Name', appSubLbl:'Subtitle',
    logoLbl:'Change Logo', logoHint:'PNG / JPG / SVG (click or drop)',
    saveApp:'💾 Save', appSavedOk:'✅ Saved',
    renameParty:'Rename Party ✏️', oldName:'Current Name', newName:'New Name',
    renameBtn:'✏️ Rename', renameSave:'💾 Save', renameOk:'✅ Name updated',
    renameErr:'⚠️ Enter a new name', renameDup:'⚠️ Name already exists',
    voucherCol:'Voucher No.', voucherLbl:'Voucher No. (Auto)',
    sharingBusLabel:'Sharing Bus', sharingBusHint:'(Select "Sharing Bus" to enter per-pilgrim fare)',
    vehicleTotalLbl:'Full Vehicle Amount (SAR)', vehicleTotalCol:'Vehicle Amt (SAR)',
    typeSharing:'Sharing', typeWhole:'Full Vehicle',
    sharingNote:'⚠️ Enter pilgrim count and fare per pilgrim', wholeNote:'⚠️ Full vehicle amount is required',
    dir:'rtl', lang:'ar',
    appTitle:'نظام إدارة نقل الحجاج',
    appSub:'سجل كامل لتنقلات الحجاج — جدة، مكة، المدينة',
    nav:['📝 إدخال جديد','💰 دفعة','📒 دفتر الحساب','📋 كل السجلات','📊 تقرير','✏️ تعديل','⚙️ الإعدادات'],
    entry:'إدخال نقل جديد 🚌', date:'التاريخ', party:'المجموعة', newParty:'(+ جديد)', sector:'القطاع', newSector:'(+ جديد)',
    transport:'وسيلة النقل', count:'عدد الحجاج', fare:'الأجرة لكل حاج (ريال)', total:'المجموع (ريال) — تلقائي',
    notes:'ملاحظات', save:'✅ حفظ الإدخال', clear:'🔄 مسح',
    bus:'حافلة', van:'فان', car:'سيارة', coach:'كوتش',
    newTransport:'(+ جديد)', selectTransport:'-- اختر وسيلة النقل --',
    setTransports:'وسائل النقل 🚌', newTransportLbl:'وسيلة نقل جديدة', transportPlaceholder:'مثال: حافلة، فان، كوتش',
    noneTransport:'لا توجد وسائل نقل',
    todaySummary:'ملخص اليوم 📊', todayParties:'المجموعات اليوم', todayHujjaj:'إجمالي الحجاج', todayAmount:'إجمالي المبلغ (ريال)', todayTrips:'إجمالي الرحلات',
    selectParty:'-- اختر المجموعة --', selectSector:'-- اختر القطاع --',
    required:'★',
    payTitle:'تسجيل دفعة المجموعة 💰', received:'المبلغ المستلم (ريال)', method:'طريقة الدفع',
    cash:'نقداً', bank:'تحويل بنكي', cheque:'شيك', online:'أون لاين',
    savePay:'✅ حفظ الدفعة', recentPay:'الدفعات الأخيرة 💳',
    ledgerTitle:'دفتر حساب المجموعة 📒', selectAll:'-- كل المجموعات --', fromDate:'من تاريخ', toDate:'إلى تاريخ',
    print:'🖨️ طباعة', resetFilter:'↩ إعادة',
    debitCol:'المطلوب (ريال)', creditCol:'المستلم (ريال)', balance:'الرصيد', txType:'النوع', desc:'التفاصيل',
    debitTx:'📤 مطلوب', creditTx:'📥 مستلم', subTotal:'المجموع الفرعي',
    totalDebit:'إجمالي المطلوب', totalCredit:'إجمالي المستلم', surplus:'دفع زيادة', owing:'الرصيد المستحق',
    noTx:'لا توجد معاملات',
    recTitle:'كل السجلات 📋', allParties:'الكل', allSectors:'الكل',
    filter:'🔍 تصفية', totalRec:'إجمالي السجلات', totalHujjaj:'إجمالي الحجاج', totalAmt:'إجمالي المبلغ (ريال)',
    edit:'✏️', del:'🗑️', noRec:'لا توجد سجلات',
    numCol:'#', dateCol:'التاريخ', partyCol:'المجموعة', sectorCol:'القطاع', transportCol:'وسيلة النقل',
    hujjajCol:'الحجاج', fareCol:'الأجرة/حاج', totalCol:'المجموع (ريال)', actionCol:'إجراء',
    repTitle:'مركز التقارير 📊', repType:'نوع التقرير', genReport:'📊 إنشاء تقرير',
    byDate:'حسب التاريخ', byParty:'حسب المجموعة', bySector:'حسب القطاع',
    trips:'رحلات', hujjaj:'حجاج', amount:'المبلغ (ريال)', repKind:'النوع',
    updTitle:'تعديل السجل ✏️', saveUpd:'💾 حفظ التعديل', cancel:'❌ إلغاء', selectRecord:'اختر سجلاً 📋',
    updOk:'✅ تم تعديل السجل', delOk:'🗑️ تم حذف السجل', confirmDel:'هل تريد حذف هذا السجل؟', confirmDelPay:'هل تريد حذف هذه الدفعة؟',
    setParties:'المجموعات 👥', setSectors:'القطاعات 🗺️', newPartyLbl:'مجموعة جديدة', newSectorLbl:'قطاع جديد',
    add:'➕ إضافة', addedOk:'✅ تمت الإضافة', alreadyExists:'⚠️ موجود مسبقاً', enterName:'⚠️ أدخل اسماً',
    usedWarning:'مستخدم في السجلات. هل تحذف على أي حال؟',
    noneParty:'لا توجد مجموعات', noneSector:'لا توجد قطاعات',
    addPartyTitle:'➕ إضافة مجموعة جديدة', addSectorTitle:'➕ إضافة قطاع جديد',
    partyPlaceholder:'اسم المجموعة', sectorPlaceholder:'مثال: جدة ➜ مكة',
    modalSave:'✅ إضافة', modalCancel:'❌ إلغاء',
    entryRequired:'⚠️ التاريخ والمجموعة والقطاع وعدد الحجاج مطلوبة',
    payRequired:'⚠️ التاريخ والمجموعة والمبلغ مطلوبة',
    entrySaved:'✅ تم حفظ الإدخال', paySaved:'✅ تم حفظ الدفعة',
    noData:'لا توجد بيانات', noPayments:'لا توجد دفعات',
    defaultSectors:['جدة ➜ مكة','مكة ➜ المدينة','المدينة ➜ مكة','مكة ➜ جدة'],
    defaultParties:['المجموعة الأولى','المجموعة الثانية'],
    sectorRef:'رحلة:', hujPerSector:'حجاج ×',
    payMethodRef:'دفعة —',
    runBalance:'(فائض)','runOwing':'(مستحق)',
    methodCol:'الطريقة', notesCol:'ملاحظات',
    codeCol:'الرمز', searchParty:'🔍 ابحث عن مجموعة...', noMatch:'لا توجد نتائج',
    partyCodeLbl:'رمز المجموعة',
    setApp:'إعدادات التطبيق ⚙️', appNameLbl:'اسم التطبيق', appSubLbl:'العنوان الفرعي',
    logoLbl:'تغيير الشعار', logoHint:'PNG / JPG / SVG (انقر أو اسحب)',
    saveApp:'💾 حفظ', appSavedOk:'✅ تم الحفظ',
    renameParty:'إعادة تسمية المجموعة ✏️', oldName:'الاسم الحالي', newName:'الاسم الجديد',
    renameBtn:'✏️ تسمية', renameSave:'💾 حفظ', renameOk:'✅ تم تحديث الاسم',
    renameErr:'⚠️ أدخل اسماً جديداً', renameDup:'⚠️ الاسم موجود مسبقاً',
    voucherCol:'رقم الإيصال', voucherLbl:'رقم الإيصال (تلقائي)',
    sharingBusLabel:'حافلة مشتركة', sharingBusHint:'(اختر "حافلة مشتركة" لإدخال أجرة كل حاج)',
    vehicleTotalLbl:'إجمالي المركبة الكاملة (ريال)', vehicleTotalCol:'مبلغ المركبة (ريال)',
    typeSharing:'مشترك', typeWhole:'مركبة كاملة',
    sharingNote:'⚠️ أدخل عدد الحجاج وأجرة كل حاج', wholeNote:'⚠️ مبلغ المركبة الكاملة مطلوب',
};
let lang = localStorage.getItem('uts_lang') || 'ur';



/* ─── STORAGE KEYS ─── */
const KEY_RECS = 'uts_records', KEY_PAYS = 'uts_payments', KEY_PARTIES = 'uts_parties', KEY_SECTORS = 'uts_sectors', KEY_CODES = 'uts_codes', KEY_LOGO = 'uts_logo', KEY_APPNAME = 'uts_appname', KEY_APPSUB = 'uts_appsub', KEY_TRANSPORTS = 'uts_transports';

let records  = JSON.parse(localStorage.getItem(KEY_RECS)  || '[]');
let payments = JSON.parse(localStorage.getItem(KEY_PAYS)  || '[]');
let parties  = JSON.parse(localStorage.getItem(KEY_PARTIES) || 'null');
let sectors  = JSON.parse(localStorage.getItem(KEY_SECTORS) || 'null');
let transports = JSON.parse(localStorage.getItem(KEY_TRANSPORTS) || 'null');
let partyCodes = JSON.parse(localStorage.getItem(KEY_CODES) || '{}');

function svR(){ localStorage.setItem(KEY_RECS, JSON.stringify(records)); }
function svPy(){ localStorage.setItem(KEY_PAYS, JSON.stringify(payments)); }
function svP(){ localStorage.setItem(KEY_PARTIES, JSON.stringify(parties)); }
function svS(){ localStorage.setItem(KEY_SECTORS, JSON.stringify(sectors)); }
function svTr(){ localStorage.setItem(KEY_TRANSPORTS, JSON.stringify(transports)); }
function svC(){ localStorage.setItem(KEY_CODES, JSON.stringify(partyCodes)); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).substr(2,5); }
function fd(d){ if(!d)return''; const p=d.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }
function sar(n){ return Number(n||0).toLocaleString(); }
function today(){ return new Date().toISOString().split('T')[0]; }
function t(k){ return T[lang][k]||k; }

/* ─── LOADER ─── */
function showLoader(delay = 500) {
  const loader = document.getElementById('loader-overlay');
  if(loader) {
    loader.classList.remove('hidden');
    if(delay > 0) {
      setTimeout(() => loader.classList.add('hidden'), delay);
    }
  }
}
function hideLoader() {
  const loader = document.getElementById('loader-overlay');
  if(loader) loader.classList.add('hidden');
}

/* ─── LOGO & APP NAME ─── */
function handleLogoUpload(inp){
  const file = inp.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const data = e.target.result;
    localStorage.setItem(KEY_LOGO, data);
    applyLogo(data);
  };
  reader.readAsDataURL(file);
}
function handleLogoDrop(e){
  e.preventDefault();
  document.getElementById('logo-drop-zone').style.borderColor='var(--border)';
  const file = e.dataTransfer.files[0]; if(!file||!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => { localStorage.setItem(KEY_LOGO, ev.target.result); applyLogo(ev.target.result); };
  reader.readAsDataURL(file);
}
function applyLogo(src){
  // header
  const emoji = document.getElementById('header-logo-emoji');
  const img   = document.getElementById('header-logo-img');
  if(src){ emoji.style.display='none'; img.src=src; img.style.display='block'; }
  else   { emoji.style.display=''; img.style.display='none'; }
  // settings preview
  const pe = document.getElementById('logo-preview-emoji');
  const pi = document.getElementById('logo-preview-img');
  const rb = document.getElementById('btn-removeLogo');
  if(src){ pe.style.display='none'; pi.src=src; pi.style.display='block'; if(rb)rb.style.display='inline-flex'; }
  else   { pe.style.display=''; pi.style.display='none'; if(rb)rb.style.display='none'; }
}
function removeLogo(){
  localStorage.removeItem(KEY_LOGO);
  applyLogo(null);
}
function loadLogo(){
  const saved = localStorage.getItem(KEY_LOGO);
  if(saved) applyLogo(saved);
}

function saveAppSettings(){
  const L = T[lang];
  const name = document.getElementById('set-appname').value.trim();
  const sub  = document.getElementById('set-appsub').value.trim();
  if(name) localStorage.setItem(KEY_APPNAME+'_'+lang, name);
  if(sub)  localStorage.setItem(KEY_APPSUB+'_'+lang, sub);
  if(name) document.getElementById('app-title').textContent = name;
  if(sub)  document.getElementById('app-sub').textContent   = sub;
  al('al-app', L.appSavedOk, 'ok');
}
function loadAppName(l){
  const L = T[l];
  const name = localStorage.getItem(KEY_APPNAME+'_'+l) || L.appTitle;
  const sub  = localStorage.getItem(KEY_APPSUB+'_'+l)  || L.appSub;
  document.getElementById('app-title').textContent = name;
  document.getElementById('app-sub').textContent   = sub;
  const sn = document.getElementById('set-appname'); if(sn) sn.value = name;
  const ss = document.getElementById('set-appsub');  if(ss) ss.value = sub;
}

/* ─── RENAME PARTY ─── */
function fillRenameFrom(){
  const sel = document.getElementById('rename-from'); if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = parties.map(p=>`<option value="${p}"${p===cur?' selected':''}>${getCode(p)} — ${p}</option>`).join('');
}
function renameParty(){
  const L = T[lang];
  const oldName = document.getElementById('rename-from').value;
  const newName = document.getElementById('rename-to').value.trim();
  if(!newName){ al('al-rename', L.renameErr, 'er'); return; }
  if(parties.includes(newName)){ al('al-rename', L.renameDup, 'er'); return; }
  const idx = parties.indexOf(oldName);
  if(idx === -1) return;
  // rename in parties list
  parties[idx] = newName;
  // move code
  const code = partyCodes[oldName];
  if(code){ partyCodes[newName] = code; delete partyCodes[oldName]; svC(); }
  // rename in records
  records.forEach(r=>{ if(r.party===oldName) r.party=newName; });
  // rename in payments
  payments.forEach(p=>{ if(p.party===oldName) p.party=newName; });
  svP(); svR(); svPy();
  refreshAllDrops();
  fillRenameFrom();
  document.getElementById('rename-to').value='';
  al('al-rename', L.renameOk, 'ok');
  renderPartyList();
}
function genCode(){
  // UTS-001 format, sequential
  const existing = Object.values(partyCodes).map(c=>parseInt(c.replace('UTS-',''))||0);
  const next = existing.length ? Math.max(...existing)+1 : 1;
  return 'UTS-' + String(next).padStart(3,'0');
}
function getCode(party){
  if(!partyCodes[party]){ partyCodes[party]=genCode(); svC(); }
  return partyCodes[party];
}

/* ─── SEARCHABLE DROPDOWN (SD) ─── */
// prefix: 'e-party' | 'p-party' | 'u-party'
let _sdTimer = {};
function sdBuild(prefix){
  const L = T[lang];
  const inp = document.getElementById(prefix+'-input');
  const dd  = document.getElementById('sd-'+prefix);
  if(!inp||!dd) return;
  inp.placeholder = L.searchParty;
  const q = inp.value.trim().toLowerCase();
  const filtered = parties.filter(p=> !q || p.toLowerCase().includes(q) || getCode(p).toLowerCase().includes(q));
  if(!filtered.length){
    dd.innerHTML=`<div class="sd-no-result">${L.noMatch}</div>`;
    return;
  }
  const cur = document.getElementById(prefix).value;
  dd.innerHTML = filtered.map(p=>{
    const code = getCode(p);
    return `<div class="sd-item${p===cur?' active':''}" onmousedown="sdSelect('${prefix}','${p.replace(/'/g,"\\'")}')">
      <span class="sd-code">${code}</span>
      <span class="sd-name">${p}</span>
    </div>`;
  }).join('');
}
function sdFilter(prefix){ sdBuild(prefix); sdOpen(prefix); }
function sdOpen(prefix){
  const dd=document.getElementById('sd-'+prefix);
  if(dd){ sdBuild(prefix); dd.classList.add('open'); }
}
function sdBlur(prefix){
  // small delay so mousedown fires first
  _sdTimer[prefix] = setTimeout(()=>{
    const dd=document.getElementById('sd-'+prefix);
    if(dd) dd.classList.remove('open');
    // if typed text doesn't match any party, restore last valid value
    const inp=document.getElementById(prefix+'-input');
    const hidden=document.getElementById(prefix);
    if(inp && hidden){
      if(hidden.value && inp.value !== hidden.value + ' (' + getCode(hidden.value) + ')'){
        inp.value = hidden.value;
      }
    }
  }, 200);
}
function sdSelect(prefix, partyName){
  clearTimeout(_sdTimer[prefix]);
  document.getElementById(prefix).value = partyName;
  document.getElementById(prefix+'-input').value = partyName;
  const dd=document.getElementById('sd-'+prefix);
  if(dd) dd.classList.remove('open');
  // show code badge next to input
  sdShowCode(prefix, partyName);
}
function sdShowCode(prefix, partyName){
  const code = partyName ? getCode(partyName) : '';
  const badgeId = prefix+'-badge';
  let badge = document.getElementById(badgeId);
  if(!badge){
    badge = document.createElement('div');
    badge.id = badgeId;
    badge.style.cssText='margin-top:4px;';
    const wrap = document.getElementById('sd-'+prefix).parentElement;
    wrap.appendChild(badge);
  }
  badge.innerHTML = partyName ? `<span class="party-code">${code}</span><span style="font-size:12px;color:var(--muted);">${partyName}</span>` : '';
}
function sdSetValue(prefix, partyName){
  document.getElementById(prefix).value = partyName||'';
  document.getElementById(prefix+'-input').value = partyName||'';
  sdShowCode(prefix, partyName||'');
}
function sdClear(prefix){
  sdSetValue(prefix,'');
}
function refreshSdPlaceholders(){
  const L=T[lang];
  ['e-party','p-party','u-party'].forEach(prefix=>{
    const inp=document.getElementById(prefix+'-input');
    if(inp) inp.placeholder=L.searchParty;
  });
}

/* ─── LANGUAGE ─── */
function setLang(l){
  lang=l;
  localStorage.setItem('uts_lang',l);
  const L=T[l];
  if(!parties){ parties=L.defaultParties.slice(); svP(); }
  if(!sectors){ sectors=L.defaultSectors.slice(); svS(); }
  document.documentElement.lang=l;
  document.body.className='lang-'+l;
  document.getElementById('modal').style.direction=L.dir;

  const lt = document.getElementById('loader-text');
  if(lt) lt.textContent = l === 'en' ? 'Please wait...' : (l === 'ar' ? 'يرجى الانتظار...' : 'براہ کرم انتظار کریں...');

  ['ur','en','ar'].forEach(x=>document.getElementById('lb-'+x).classList.toggle('active',x===l));
  document.getElementById('app-title').textContent=L.appTitle;
  document.getElementById('app-sub').textContent=L.appSub;
  const navBtns=document.querySelectorAll('#main-nav button');
  L.nav.forEach((txt,i)=>{ if(navBtns[i]) navBtns[i].textContent=txt; });

  setText('lbl-entry',L.entry);
  setText('lbl-date',L.date);
  setText('lbl-party',L.party);
  setText('lbl-newparty',L.newParty);
  setText('lbl-sector',L.sector);
  setText('lbl-newsector',L.newSector);
  setText('lbl-transport',L.transport);
  setText('lbl-count',L.count);
  setText('lbl-fare',L.fare);
  setText('lbl-total',L.total);
  setText('lbl-notes',L.notes);
  setText('btn-save',L.save);
  setText('btn-clear',L.clear);
  setText('lbl-todaysum',L.todaySummary);
  setText('lbl-ts-p',L.todayParties);
  setText('lbl-ts-h',L.todayHujjaj);
  setText('lbl-ts-a',L.todayAmount);
  setText('lbl-ts-t',L.todayTrips);

  setOpt('opt-bus',L.bus,'bus'); setOpt('opt-van',L.van,'van');
  setOpt('opt-car',L.car,'car'); setOpt('opt-coach',L.coach,'coach');
  setOpt('uopt-bus',L.bus,'bus'); setOpt('uopt-van',L.van,'van');
  setOpt('uopt-car',L.car,'car'); setOpt('uopt-coach',L.coach,'coach');

  setText('lbl-payTitle',L.payTitle);
  setText('lbl-paydate',L.date);
  setText('lbl-payparty',L.party);
  setText('lbl-received',L.received);
  setText('lbl-method',L.method);
  setText('lbl-paynotes',L.notes);
  setText('btn-savepay',L.savePay);
  setText('lbl-recentpay',L.recentPay);
  setOpt('opt-cash',L.cash,'cash'); setOpt('opt-bank',L.bank,'bank');
  setOpt('opt-cheque',L.cheque,'cheque'); setOpt('opt-online',L.online,'online');

  setText('lbl-ledgerTitle',L.ledgerTitle);
  setText('lbl-ledparty',L.party);
  setText('lbl-ledfrom',L.fromDate);
  setText('lbl-ledto',L.toDate);
  setText('btn-print',L.print);
  setText('btn-resetled',L.resetFilter);

  setText('lbl-recTitle',L.recTitle);
  setText('lbl-recfrom',L.fromDate);
  setText('lbl-recto',L.toDate);
  setText('lbl-recparty',L.party);
  setText('lbl-recsector',L.sector);
  setText('btn-filter',L.filter);
  setText('btn-clearfilter',L.resetFilter);
  setText('lbl-totalrec',L.totalRec);
  setText('lbl-totalhj',L.totalHujjaj);
  setText('lbl-totalamt',L.totalAmt);

  setText('lbl-repTitle',L.repTitle);
  setText('lbl-repfrom',L.fromDate);
  setText('lbl-repto',L.toDate);
  setText('lbl-reptype',L.repType);
  setText('btn-genrep',L.genReport);
  setOpt('opt-bydate',L.byDate,'date');
  setOpt('opt-byparty',L.byParty,'party');
  setOpt('opt-bysector',L.bySector,'sector');

  setText('lbl-updTitle',L.updTitle);
  setText('lbl-udate',L.date);
  setText('lbl-uparty',L.party);
  setText('lbl-usector',L.sector);
  setText('lbl-utransport',L.transport);
  setText('lbl-ucount',L.count);
  setText('lbl-ufare',L.fare);
  setText('lbl-utotal',L.total);
  setText('lbl-unotes',L.notes);
  setText('btn-saveupd',L.saveUpd);
  setText('btn-cancel',L.cancel);
  setText('lbl-selrec',L.selectRecord);

  setText('lbl-setParties',L.setParties);
  setText('lbl-setSectors',L.setSectors);
  setText('lbl-newpartylbl',L.newPartyLbl);
  setText('lbl-newsectorlbl',L.newSectorLbl);
  document.getElementById('sp-in').placeholder=L.partyPlaceholder;
  document.getElementById('ss-in').placeholder=L.sectorPlaceholder;
  setText('btn-addparty',L.add);
  setText('btn-addsector',L.add);

  setText('lbl-setTransports', L.setTransports);
  setText('lbl-newtransportlbl', L.newTransportLbl);
  const sti=document.getElementById('st-in'); if(sti) sti.placeholder=L.transportPlaceholder;
  setText('btn-addtransport', L.add);
  setText('lbl-newtransport', L.newTransport);
  setText('lbl-utransport', L.transport);

  setText('btn-msave',L.modalSave);
  setText('btn-mcancel',L.modalCancel);

  // app settings & rename
  setText('lbl-setApp', L.setApp);
  setText('lbl-appNameLbl', L.appNameLbl);
  setText('lbl-appSubLbl', L.appSubLbl);
  setText('lbl-logoLbl', L.logoLbl);
  setText('lbl-logoHint', L.logoHint);
  setText('btn-saveApp', L.saveApp);
  setText('lbl-renameParty', L.renameParty);
  setText('lbl-oldName', L.oldName);
  setText('lbl-newName', L.newName);
  setText('btn-renameSave', L.renameSave);
  const rto = document.getElementById('rename-to'); if(rto) rto.placeholder = L.newName;

  setText('lbl-voucher', L.voucherLbl);
  setText('lbl-uvoucher', L.voucherLbl);
  setText('lbl-vehicletotal', L.vehicleTotalLbl||'پوری گاڑی کی رقم (SAR)');
  setText('lbl-uvehicletotal', L.vehicleTotalLbl||'پوری گاڑی کی رقم (SAR)');

  loadAppName(l);
  refreshSdPlaceholders();
  refreshAllDrops();

  const ap=document.querySelector('.page.active');
  if(ap){
    const id=ap.id.replace('page-','');
    if(id==='entry') todayStats();
    if(id==='payment'){ renderPayments(); renderPayHead(); }
    if(id==='ledger') renderLedger();
    if(id==='records') renderRecords(records);
    if(id==='update') renderUpdateTable();
    if(id==='settings'){ renderPartyList(); renderSectorList(); renderTransportList(); }
  }
  renderPayHead(); renderRecHead(); renderUpdHead();
}

function setText(id,txt){ const e=document.getElementById(id); if(e) e.textContent=txt; }
function setOpt(id,txt,val){ const e=document.getElementById(id); if(e){e.textContent=txt;e.value=val;} }

/* ─── NAV ─── */
function showPage(p,btn){
  showLoader(300);
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('#main-nav button').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  if(btn) btn.classList.add('active');
  if(p==='entry')   { fillDrop('e-sector',sectors); fillDrop('e-transport',transports); todayStats(); }
  if(p==='payment') { renderPayments(); renderPayHead(); }
  if(p==='ledger')  { fillDrop('l-party',parties,true); renderLedger(); }
  if(p==='records') { fillDrop('f-party',parties,true); fillDrop('f-sector',sectors,true); renderRecords(records); renderRecHead(); }
  if(p==='update')  { fillDrop('u-sector',sectors); fillDrop('u-transport',transports); renderUpdateTable(); renderUpdHead(); }
  if(p==='settings'){ renderPartyList(); renderSectorList(); renderTransportList(); fillRenameFrom(); loadAppName(lang);
    const sn=document.getElementById('set-appname'); if(sn) sn.value=localStorage.getItem(KEY_APPNAME+'_'+lang)||T[lang].appTitle;
    const ss=document.getElementById('set-appsub');  if(ss) ss.value=localStorage.getItem(KEY_APPSUB+'_'+lang)||T[lang].appSub;
  }
}

/* ─── REGULAR DROPDOWNS (sectors, filters) ─── */
function fillDrop(id,arr,withAll=false){
  const sel=document.getElementById(id); if(!sel||!arr)return;
  const L=T[lang];
  const cur=sel.value;
  let placeholder = L.selectParty;
  if(id.includes('sector')) placeholder = L.selectSector;
  else if(id.includes('transport')) placeholder = L.selectTransport;
  sel.innerHTML=withAll?`<option value="">${L.allParties}</option>`:`<option value="">${placeholder}</option>`;
  arr.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; if(v===cur)o.selected=true; sel.appendChild(o); });
}
function refreshAllDrops(){
  fillDrop('e-sector',sectors);
  fillDrop('e-transport',transports);
  fillDrop('l-party',parties,true);
  fillDrop('f-party',parties,true); fillDrop('f-sector',sectors,true);
  fillDrop('u-sector',sectors);
  fillDrop('u-transport',transports);
  ['e-party','p-party','u-party'].forEach(p=>sdBuild(p));
}

/* ─── MODAL ─── */
let _mt='sector',_mc='entry';
function openModal(type,ctx){
  _mt=type;_mc=ctx;
  const L=T[lang];
  const titles={party:L.addPartyTitle, sector:L.addSectorTitle, transport:'➕ '+L.newTransportLbl};
  const holders={party:L.partyPlaceholder, sector:L.sectorPlaceholder, transport:L.transportPlaceholder};
  document.getElementById('m-title').textContent=titles[type]||'➕';
  document.getElementById('m-input').placeholder=holders[type]||'';
  document.getElementById('m-input').value='';
  document.getElementById('modal').classList.add('open');
  setTimeout(()=>document.getElementById('m-input').focus(),80);
}
function closeModal(){ document.getElementById('modal').classList.remove('open'); }
function confirmModal(){
  const val=document.getElementById('m-input').value.trim(); if(!val)return;
  const L=T[lang];
  if(_mt==='party'){
    if(parties.includes(val)){alert(L.alreadyExists);return;}
    parties.push(val); getCode(val); svP(); refreshAllDrops();
    const tgt=_mc==='entry'?'e-party':_mc==='payment'?'p-party':'u-party';
    sdSetValue(tgt, val);
  } else if(_mt==='sector'){
    if(sectors.includes(val)){alert(L.alreadyExists);return;}
    sectors.push(val); svS(); refreshAllDrops();
    document.getElementById(_mc==='entry'?'e-sector':'u-sector').value=val;
  } else if(_mt==='transport'){
    if(transports.includes(val)){alert(L.alreadyExists);return;}
    transports.push(val); svTr(); refreshAllDrops();
    document.getElementById(_mc==='entry'?'e-transport':'u-transport').value=val;
  }
  closeModal();
  if(document.getElementById('page-settings').classList.contains('active')){
    renderPartyList(); renderSectorList(); renderTransportList();
  }
}

/* ─── ALERT ─── */
function al(id,msg,type){ const e=document.getElementById(id); if(!e)return; e.innerHTML=`<div class="alert a-${type}">${msg}</div>`; setTimeout(()=>e.innerHTML='',3000); }

/* ─── SETTINGS ─── */
function addFromSettings(type){
  const inpMap={party:'sp-in', sector:'ss-in', transport:'st-in'};
  const alMap ={party:'al-sp', sector:'al-ss', transport:'al-st'};
  const inpId=inpMap[type]; const alId=alMap[type];
  const L=T[lang];
  const val=document.getElementById(inpId).value.trim();
  const arr=type==='party'?parties:type==='sector'?sectors:transports;
  if(!val){al(alId,L.enterName,'er');return;}
  if(arr.includes(val)){al(alId,L.alreadyExists,'er');return;}
  arr.push(val);
  if(type==='party'){ getCode(val); svP(); }
  else if(type==='sector') svS();
  else svTr();
  refreshAllDrops();
  document.getElementById(inpId).value='';
  al(alId,L.addedOk,'ok');
  if(type==='party') renderPartyList();
  else if(type==='sector') renderSectorList();
  else renderTransportList();
}
function deleteItem(type,idx){
  const L=T[lang];
  const arr=type==='party'?parties:type==='sector'?sectors:transports;
  const name=arr[idx];
  let used=false;
  if(type==='party') used=records.some(r=>r.party===name)||payments.some(p=>p.party===name);
  else if(type==='sector') used=records.some(r=>r.sector===name);
  else used=records.some(r=>r.transport===name);
  if(used&&!confirm(`"${name}" ${L.usedWarning}`))return;
  arr.splice(idx,1);
  if(type==='party') svP(); else if(type==='sector') svS(); else svTr();
  refreshAllDrops();
  if(type==='party') renderPartyList();
  else if(type==='sector') renderSectorList();
  else renderTransportList();
}
function renderPartyList(){
  const L=T[lang]; const el=document.getElementById('parties-list');
  if(!parties.length){el.innerHTML=`<span style="color:var(--muted);font-size:12px;">${L.noneParty}</span>`;return;}
  el.innerHTML=parties.map((p,i)=>{
    const code=getCode(p);
    return `<div class="tag">
      <span class="tag-code">${code}</span>
      <span>${p}</span>
      <button class="x" onclick="deleteItem('party',${i})">✕</button>
    </div>`;
  }).join('');
}
function renderSectorList(){
  const L=T[lang]; const el=document.getElementById('sectors-list');
  el.innerHTML=sectors.length?sectors.map((s,i)=>`<div class="tag"><span>${s}</span><button class="x" onclick="deleteItem('sector',${i})">✕</button></div>`).join(''):`<span style="color:var(--muted);font-size:12px;">${L.noneSector}</span>`;
}
function renderTransportList(){
  const L=T[lang]; const el=document.getElementById('transports-list');
  if(!el) return;
  el.innerHTML=transports.length?transports.map((t,i)=>`<div class="tag"><span>🚌 ${t}</span><button class="x" onclick="deleteItem('transport',${i})">✕</button></div>`).join(''):`<span style="color:var(--muted);font-size:12px;">${L.noneTransport}</span>`;
}

/* ─── SHARING BUS LOGIC ─── */
const SHARING_KEY = 'شیئرنگ بس'; // exact name that triggers sharing mode

function isSharing(val){
  // sharing mode if transport name contains "شیئرنگ" or "sharing" (case-insensitive)
  return /شیئرنگ|sharing/i.test(val||'');
}

function onTransportChange(prefix){
  const val = document.getElementById(prefix+'-transport').value;
  const sharing = isSharing(val);
  const L = T[lang];

  // count & fare fields
  const countInp = document.getElementById(prefix+'-count');
  const fareInp  = document.getElementById(prefix+'-fare');
  const vehicleWrap = document.getElementById(prefix+'-vehicle-wrap');
  const hint = document.getElementById(prefix+'-transport-hint');

  if(!val){
    // nothing selected — disable all fare fields
    countInp.disabled=true; countInp.value='';
    fareInp.disabled=true;  fareInp.value='';
    document.getElementById(prefix+'-total').value='';
    if(vehicleWrap) vehicleWrap.style.display='none';
    if(hint) hint.style.display='none';
    return;
  }

  if(sharing){
    // sharing mode: count + fare open, vehicle total hidden
    countInp.disabled=false;
    fareInp.disabled=false;
    if(vehicleWrap) vehicleWrap.style.display='none';
    const vt=document.getElementById(prefix+'-vehicle-total'); if(vt)vt.value='';
    if(hint){
      hint.style.display='block';
      hint.style.background='#E8F5E9'; hint.style.color='#2E7D32'; hint.style.border='1px solid #A5D6A7';
      hint.textContent='🚌 '+L.typeSharing+' — '+L.sharingNote.replace('⚠️ ','');
    }
  } else {
    // whole vehicle mode: count + fare disabled, vehicle total shown
    countInp.disabled=true; countInp.value='1';
    fareInp.disabled=true;  fareInp.value='';
    document.getElementById(prefix+'-total').value='';
    if(vehicleWrap) vehicleWrap.style.display='block';
    if(hint){
      hint.style.display='block';
      hint.style.background='#FFF8E1'; hint.style.color='#E65100'; hint.style.border='1px solid #FFCC80';
      hint.textContent='🚐 '+L.typeWhole+' — '+L.wholeNote.replace('⚠️ ','');
    }
  }
  // recalc
  if(prefix==='e') calcE(); else calcU();
}

function calcE(){
  const val = document.getElementById('e-transport').value;
  if(!val){ document.getElementById('e-total').value=''; return; }
  if(isSharing(val)){
    const c=+document.getElementById('e-count').value||0;
    const f=+document.getElementById('e-fare').value||0;
    document.getElementById('e-total').value=(c*f).toFixed(2);
  } else {
    const vt=+document.getElementById('e-vehicle-total').value||0;
    document.getElementById('e-total').value=vt.toFixed(2);
  }
}
function calcU(){
  const val = document.getElementById('u-transport').value;
  if(!val){ document.getElementById('u-total').value=''; return; }
  if(isSharing(val)){
    const c=+document.getElementById('u-count').value||0;
    const f=+document.getElementById('u-fare').value||0;
    document.getElementById('u-total').value=(c*f).toFixed(2);
  } else {
    const vt=+document.getElementById('u-vehicle-total').value||0;
    document.getElementById('u-total').value=vt.toFixed(2);
  }
}
function genVoucher(){
  const existing = records.map(r=>parseInt((r.voucher||'').replace('VCH-',''))||0);
  const next = existing.length ? Math.max(...existing)+1 : 1;
  return 'VCH-' + String(next).padStart(4,'0');
}
function setNextVoucher(){
  document.getElementById('e-voucher').value = genVoucher();
}

/* ─── ENTRY ─── */
function calcE(){ const c=+document.getElementById('e-count').value||0; const f=+document.getElementById('e-fare').value||0; document.getElementById('e-total').value=(c*f).toFixed(2); }
function calcU(){ const c=+document.getElementById('u-count').value||0; const f=+document.getElementById('u-fare').value||0; document.getElementById('u-total').value=(c*f).toFixed(2); }

function getTransportLabel(val){
  return val||'—';
}
function getMethodLabel(val){
  const L=T[lang];
  return {cash:L.cash,bank:L.bank,cheque:L.cheque,online:L.online}[val]||val;
}

function addEntry(){
  const L=T[lang];
  const date=document.getElementById('e-date').value;
  const party=document.getElementById('e-party').value;
  const sector=document.getElementById('e-sector').value;
  const transport=document.getElementById('e-transport').value;
  const notes=document.getElementById('e-notes').value.trim();
  const voucher=document.getElementById('e-voucher').value||genVoucher();
  if(!date||!party||!sector||!transport){al('al-entry',L.entryRequired,'er');return;}

  let count=0, fare=0, total=0, vehicleTotal=0, mode='sharing';
  if(isSharing(transport)){
    count=parseInt(document.getElementById('e-count').value)||0;
    fare=parseFloat(document.getElementById('e-fare').value)||0;
    if(count<1){al('al-entry',L.sharingNote,'er');return;}
    total=count*fare; mode='sharing';
  } else {
    vehicleTotal=parseFloat(document.getElementById('e-vehicle-total').value)||0;
    if(vehicleTotal<=0){al('al-entry',L.wholeNote,'er');return;}
    total=vehicleTotal; count=1; fare=vehicleTotal; mode='whole';
  }
  records.push({id:uid(),voucher,date,party,sector,transport,mode,count,fare,vehicleTotal,total,notes});
  svR(); al('al-entry',L.entrySaved,'ok'); clearEntryForm(); todayStats();
}
function clearEntryForm(){
  document.getElementById('e-notes').value='';
  sdClear('e-party');
  document.getElementById('e-sector').value='';
  document.getElementById('e-transport').value='';
  document.getElementById('e-count').value=''; document.getElementById('e-count').disabled=true;
  document.getElementById('e-fare').value='';  document.getElementById('e-fare').disabled=true;
  document.getElementById('e-total').value='';
  const vt=document.getElementById('e-vehicle-total'); if(vt)vt.value='';
  const vw=document.getElementById('e-vehicle-wrap'); if(vw)vw.style.display='none';
  const hint=document.getElementById('e-transport-hint'); if(hint)hint.style.display='none';
  document.getElementById('e-date').value=today();
  setNextVoucher();
}
function todayStats(){
  const td=records.filter(r=>r.date===today());
  document.getElementById('ts-p').textContent=[...new Set(td.map(r=>r.party))].length;
  document.getElementById('ts-h').textContent=td.reduce((s,r)=>s+r.count,0);
  document.getElementById('ts-a').textContent=td.reduce((s,r)=>s+r.total,0).toLocaleString();
  document.getElementById('ts-t').textContent=td.length;
}

/* ─── PAYMENTS ─── */
function renderPayHead(){
  const L=T[lang];
  document.getElementById('pay-head').innerHTML=
    `<th>${L.numCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.received||'SAR'}</th><th>${L.methodCol}</th><th>${L.notesCol}</th><th>${L.actionCol}</th>`;
}
function addPayment(){
  const L=T[lang];
  const date=document.getElementById('p-date').value;
  const party=document.getElementById('p-party').value;
  const amount=parseFloat(document.getElementById('p-amount').value)||0;
  const method=document.getElementById('p-method').value;
  const notes=document.getElementById('p-notes').value.trim();
  if(!date||!party||amount<=0){al('al-pay',L.payRequired,'er');return;}
  payments.push({id:uid(),date,party,amount,method,notes});
  svPy(); al('al-pay',L.paySaved,'ok');
  document.getElementById('p-amount').value='';
  document.getElementById('p-notes').value='';
  document.getElementById('p-date').value=today();
  sdClear('p-party');
  renderPayments();
}
function renderPayments(){
  const L=T[lang];
  const tbody=document.getElementById('pay-tbody');
  const sorted=[...payments].sort((a,b)=>b.date.localeCompare(a.date));
  if(!sorted.length){tbody.innerHTML=`<tr><td colspan="8"><div class="empty"><div class="ico">💳</div>${L.noPayments}</div></td></tr>`;return;}
  tbody.innerHTML=sorted.map((p,i)=>`
    <tr><td>${i+1}</td><td>${fd(p.date)}</td>
    <td><span class="party-code">${getCode(p.party)}</span></td>
    <td><strong>${p.party}</strong></td>
    <td><strong class="led-cr">${sar(p.amount)}</strong></td>
    <td><span class="badge">${getMethodLabel(p.method)}</span></td>
    <td style="font-size:11px;color:var(--muted);">${p.notes||'—'}</td>
    <td><button class="btn btn-sm btn-d" onclick="deletePay('${p.id}')">${L.del}</button></td></tr>`).join('');
}
function deletePay(id){
  const L=T[lang];
  if(!confirm(L.confirmDelPay))return;
  payments=payments.filter(x=>x.id!==id); svPy(); renderPayments();
}

/* ─── LEDGER ─── */
function clearLedgerFilter(){
  document.getElementById('l-party').value='';
  document.getElementById('l-from').value='';
  document.getElementById('l-to').value='';
  renderLedger();
}
function renderLedger(){
  const L=T[lang];
  const selParty=document.getElementById('l-party').value;
  const from=document.getElementById('l-from').value;
  const to=document.getElementById('l-to').value;
  const out=document.getElementById('ledger-output');
  const pList=selParty?[selParty]:parties;
  if(!pList.length){out.innerHTML=`<div class="empty"><div class="ico">📒</div>${L.noData}</div>`;return;}
  let html='';
  pList.forEach(party=>{
    let recs=[...records].filter(r=>r.party===party);
    let pays=[...payments].filter(p=>p.party===party);
    if(from){recs=recs.filter(r=>r.date>=from);pays=pays.filter(p=>p.date>=from);}
    if(to){recs=recs.filter(r=>r.date<=to);pays=pays.filter(p=>p.date<=to);}
    const totalDebit=recs.reduce((s,r)=>s+r.total,0);
    const totalCredit=pays.reduce((s,p)=>s+p.amount,0);
    const balance=totalCredit-totalDebit;
    const code=getCode(party);
    const txns=[
      ...recs.map(r=>({date:r.date,type:'debit',voucher:r.voucher||'—',desc:`${L.sectorRef} ${r.sector} (${r.count} ${L.hujPerSector} ${sar(r.fare)})`,amount:r.total,notes:r.notes||''})),
      ...pays.map(p=>({date:p.date,type:'credit',voucher:'—',desc:`${L.payMethodRef} ${getMethodLabel(p.method)}`,amount:p.amount,notes:p.notes||''}))
    ].sort((a,b)=>a.date.localeCompare(b.date));
    let running=0;
    const rows=txns.map((tx,i)=>{
      if(tx.type==='debit')running-=tx.amount; else running+=tx.amount;
      const bc=running>=0?'led-pos':'led-neg';
      return `<tr>
        <td><span style="font-family:monospace;font-size:11px;font-weight:700;color:var(--green-dark);">${tx.voucher}</span></td>
        <td>${fd(tx.date)}</td>
        <td>${tx.type==='debit'?`<span style="color:var(--red);">${L.debitTx}</span>`:`<span style="color:#1565C0;">${L.creditTx}</span>`}</td>
        <td style="font-size:11px;">${tx.desc}</td>
        <td class="${tx.type==='debit'?'led-dr':''}">${tx.type==='debit'?sar(tx.amount):'—'}</td>
        <td class="${tx.type==='credit'?'led-cr':''}">${tx.type==='credit'?sar(tx.amount):'—'}</td>
        <td class="${bc}">${running>=0?'+':''}${sar(Math.abs(running))} ${running>=0?L.runBalance:L.runOwing}</td>
        <td style="font-size:10px;color:var(--muted);">${tx.notes||'—'}</td>
      </tr>`;
    }).join('');
    const balClass=balance>=0?'led-pos':'led-neg';
    const balText=balance>=0?`${L.surplus}: ${sar(balance)} SAR`:`${L.owing}: ${sar(Math.abs(balance))} SAR`;
    html+=`<div style="margin-bottom:20px;">
      <div style="background:var(--green-dark);color:#fff;padding:10px 15px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <strong style="font-size:14px;">👥 <span style="background:var(--gold);padding:2px 9px;border-radius:10px;font-size:11px;font-family:monospace;">${code}</span> ${party}</strong>
        <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:11px;">
          <span>${L.totalDebit}: <strong style="color:#ffb3b3;">${sar(totalDebit)} SAR</strong></span>
          <span>${L.totalCredit}: <strong style="color:#b3ffcc;">${sar(totalCredit)} SAR</strong></span>
          <span class="${balClass}" style="${balance<0?'color:#ff9999':'color:#99ffcc'};font-size:12px;">${balText}</span>
        </div>
      </div>
      ${txns.length?`<div style="overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">
        <table><thead><tr>
          <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.txType}</th><th>${L.desc}</th>
          <th>${L.debitCol}</th><th>${L.creditCol}</th><th>${L.balance}</th><th>${L.notesCol}</th>
        </tr></thead><tbody>
          ${rows}
          <tr style="background:var(--green-light);font-weight:600;">
            <td colspan="4" style="text-align:center;color:var(--green-dark);">${L.subTotal}</td>
            <td class="led-dr">${sar(totalDebit)}</td>
            <td class="led-cr">${sar(totalCredit)}</td>
            <td class="${balClass}">${balance>=0?'+':''}${sar(Math.abs(balance))}</td>
            <td></td>
          </tr>
        </tbody></table>
      </div>`:`<div style="padding:18px;text-align:center;color:var(--muted);border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">${L.noTx}</div>`}
    </div>`;
  });
  out.innerHTML=html||`<div class="empty"><div class="ico">📒</div>${L.noData}</div>`;
}

/* ─── RECORDS ─── */
function renderRecHead(){
  const L=T[lang];
  document.getElementById('rec-head').innerHTML=
    `<th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.transportCol}</th><th>${L.typeSharing}/${L.typeWhole}</th><th>${L.hujjajCol}</th><th>${L.fareCol}</th><th>${L.vehicleTotalCol||'گاڑی رقم'}</th><th>${L.totalCol}</th><th>${L.actionCol}</th>`;
}
function renderRecords(rows){
  const L=T[lang];
  const tbody=document.getElementById('rec-tbody');
  const tot=document.getElementById('rec-totals');
  if(!rows.length){tbody.innerHTML=`<tr><td colspan="12"><div class="empty"><div class="ico">📂</div>${L.noRec}</div></td></tr>`;tot.style.display='none';return;}
  const s=[...rows].sort((a,b)=>b.date.localeCompare(a.date));
  tbody.innerHTML=s.map((r)=>{
    const sharing = r.mode==='sharing'||isSharing(r.transport);
    const modeTag = sharing
      ? `<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">🚌 ${L.typeSharing}</span>`
      : `<span style="background:#FFF8E1;color:#E65100;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">🚐 ${L.typeWhole}</span>`;
    return `<tr>
    <td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:12px;">${r.voucher||'—'}</span></td>
    <td>${fd(r.date)}</td>
    <td><span class="party-code">${getCode(r.party)}</span></td>
    <td><strong>${r.party}</strong></td>
    <td><span class="badge">${r.sector}</span></td>
    <td>${r.transport||'—'}</td>
    <td>${modeTag}</td>
    <td>${sharing?`<strong>${r.count}</strong>`:'—'}</td>
    <td>${sharing?sar(r.fare):'—'}</td>
    <td>${!sharing?`<strong style="color:#E65100;">${sar(r.vehicleTotal||r.total)}</strong>`:'—'}</td>
    <td><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td>
    <td><button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button></td></tr>`;
  }).join('');
  document.getElementById('rt-c').textContent=rows.length;
  document.getElementById('rt-h').textContent=rows.filter(r=>r.mode==='sharing'||isSharing(r.transport)).reduce((s,r)=>s+r.count,0);
  document.getElementById('rt-a').textContent=sar(rows.reduce((s,r)=>s+r.total,0));
  tot.style.display='grid';
}
function filterRecords(){
  const from=document.getElementById('f-from').value, to=document.getElementById('f-to').value;
  const party=document.getElementById('f-party').value, sector=document.getElementById('f-sector').value;
  let rows=[...records];
  if(from)rows=rows.filter(r=>r.date>=from); if(to)rows=rows.filter(r=>r.date<=to);
  if(party)rows=rows.filter(r=>r.party===party); if(sector)rows=rows.filter(r=>r.sector===sector);
  renderRecords(rows);
}
function clearFilter(){
  ['f-from','f-to'].forEach(id=>document.getElementById(id).value='');
  ['f-party','f-sector'].forEach(id=>document.getElementById(id).value='');
  renderRecords(records);
}

/* ─── REPORT ─── */
function genReport(){
  const L=T[lang];
  const from=document.getElementById('r-from').value, to=document.getElementById('r-to').value;
  const type=document.getElementById('r-type').value;
  let rows=[...records];
  if(from)rows=rows.filter(r=>r.date>=from); if(to)rows=rows.filter(r=>r.date<=to);
  const out=document.getElementById('rep-out');
  if(!rows.length){out.innerHTML=`<div class="empty"><div class="ico">📭</div>${L.noData}</div>`;return;}
  const lbl={date:L.byDate,party:L.byParty,sector:L.bySector};
  const groups={};
  rows.forEach(r=>{const k=type==='date'?fd(r.date):type==='party'?r.party:r.sector;if(!groups[k])groups[k]=[];groups[k].push(r);});
  const gT=rows.reduce((s,r)=>s+r.total,0), gH=rows.reduce((s,r)=>s+r.count,0);
  let html=`<div style="margin-bottom:12px;padding:12px;background:var(--green-dark);color:#fff;border-radius:10px;display:flex;gap:18px;flex-wrap:wrap;">
    <div><div style="font-size:10px;opacity:.8;">${L.trips}</div><div style="font-size:18px;font-weight:700;">${rows.length}</div></div>
    <div><div style="font-size:10px;opacity:.8;">${L.hujjaj}</div><div style="font-size:18px;font-weight:700;">${gH}</div></div>
    <div><div style="font-size:10px;opacity:.8;">${L.amount}</div><div style="font-size:18px;font-weight:700;color:var(--gold-light);">${sar(gT)}</div></div>
    <div><div style="font-size:10px;opacity:.8;">${L.repKind}</div><div style="font-size:13px;font-weight:700;">${lbl[type]}</div></div>
  </div>`;
  Object.entries(groups).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([k,items])=>{
    const sT=items.reduce((s,r)=>s+r.total,0), sH=items.reduce((s,r)=>s+r.count,0);
    const codeTag = type==='party' ? `<span class="party-code" style="margin-left:6px;margin-right:6px;">${getCode(k)}</span>` : '';
    html+=`<div style="margin-bottom:15px;">
      <div style="background:var(--cream-dark);padding:8px 13px;border-radius:8px 8px 0 0;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
        <strong style="font-size:14px;color:var(--green-dark);">📌 ${codeTag}${k}</strong>
        <span style="font-size:11px;color:var(--muted);">${L.trips}: ${items.length} | ${L.hujjaj}: ${sH} | ${L.amount}: <strong style="color:var(--green-dark);">${sar(sT)}</strong></span>
      </div>
      <div style="overflow-x:auto;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;">
        <table><thead><tr>
          <th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.transportCol}</th>
          <th>${L.hujjajCol}</th><th>${L.fareCol}</th><th>${L.totalCol}</th>
        </tr></thead><tbody>
          ${items.map(r=>`<tr><td><span style="font-family:monospace;font-weight:700;font-size:11px;color:var(--green-dark);">${r.voucher||'—'}</span></td><td>${fd(r.date)}</td><td><span class="party-code">${getCode(r.party)}</span></td><td>${r.party}</td><td><span class="badge">${r.sector}</span></td>
            <td>${getTransportLabel(r.transport)}</td><td>${r.count}</td><td>${sar(r.fare)}</td>
            <td><strong style="color:var(--green-dark);">${sar(r.total)}</strong></td></tr>`).join('')}
          <tr style="background:var(--green-light);font-weight:600;">
            <td colspan="6" style="text-align:center;color:var(--green-dark);">${L.subTotal}</td>
            <td style="color:var(--green-dark);">${sH}</td><td>—</td><td style="color:var(--green-dark);">${sar(sT)}</td>
          </tr>
        </tbody></table>
      </div></div>`;
  });
  out.innerHTML=html;
}

/* ─── UPDATE / DELETE ─── */
function renderUpdHead(){
  const L=T[lang];
  document.getElementById('upd-head').innerHTML=
    `<th>${L.voucherCol}</th><th>${L.dateCol}</th><th>${L.codeCol}</th><th>${L.partyCol}</th><th>${L.sectorCol}</th><th>${L.hujjajCol}</th><th>${L.totalCol}</th><th>${L.actionCol}</th>`;
}
function renderUpdateTable(){
  const L=T[lang];
  const tbody=document.getElementById('upd-tbody');
  const s=[...records].sort((a,b)=>b.date.localeCompare(a.date));
  if(!s.length){tbody.innerHTML=`<tr><td colspan="8"><div class="empty"><div class="ico">📂</div>${L.noRec}</div></td></tr>`;return;}
  tbody.innerHTML=s.map((r,i)=>`
    <tr>
    <td><span style="font-family:monospace;font-weight:700;color:var(--green-dark);font-size:12px;">${r.voucher||'—'}</span></td>
    <td>${fd(r.date)}</td>
    <td><span class="party-code">${getCode(r.party)}</span></td>
    <td><strong>${r.party}</strong></td>
    <td><span class="badge">${r.sector}</span></td>
    <td>${r.count}</td><td><strong>${sar(r.total)}</strong></td>
    <td class="action-btns">
      <button class="btn btn-sm btn-o" onclick="editRecord('${r.id}')">${L.edit}</button>
      <button class="btn btn-sm btn-d" onclick="deleteRecord('${r.id}')">${L.del}</button>
    </td></tr>`).join('');
}
function editRecord(id){
  const r=records.find(x=>x.id===id); if(!r)return;
  document.getElementById('u-id').value=id;
  document.getElementById('u-date').value=r.date;
  document.getElementById('u-voucher').value=r.voucher||'—';
  fillDrop('u-sector',sectors); document.getElementById('u-sector').value=r.sector;
  sdSetValue('u-party', r.party);
  fillDrop('u-transport',transports); document.getElementById('u-transport').value=r.transport;
  document.getElementById('u-notes').value=r.notes||'';
  // restore sharing state
  onTransportChange('u');
  if(r.mode==='sharing'||isSharing(r.transport)){
    document.getElementById('u-count').value=r.count;
    document.getElementById('u-fare').value=r.fare;
  } else {
    const vt=document.getElementById('u-vehicle-total'); if(vt)vt.value=r.vehicleTotal||r.total||'';
  }
  document.getElementById('u-total').value=r.total;
  document.getElementById('upd-form').style.display='block';
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('#main-nav button').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-update').classList.add('active');
  document.querySelectorAll('#main-nav button')[5].classList.add('active');
  renderUpdateTable(); renderUpdHead();
  setTimeout(()=>document.getElementById('upd-form').scrollIntoView({behavior:'smooth'}),50);
}
function saveUpdate(){
  const L=T[lang];
  const id=document.getElementById('u-id').value;
  const idx=records.findIndex(x=>x.id===id); if(idx===-1)return;
  const transport=document.getElementById('u-transport').value;
  let count=0,fare=0,vehicleTotal=0,total=0,mode='sharing';
  if(isSharing(transport)){
    count=parseInt(document.getElementById('u-count').value)||0;
    fare=parseFloat(document.getElementById('u-fare').value)||0;
    total=count*fare; mode='sharing';
  } else {
    vehicleTotal=parseFloat(document.getElementById('u-vehicle-total').value)||0;
    total=vehicleTotal; count=1; fare=vehicleTotal; mode='whole';
  }
  records[idx]={...records[idx],
    date:document.getElementById('u-date').value,
    party:document.getElementById('u-party').value,
    sector:document.getElementById('u-sector').value,
    transport, mode, count, fare, vehicleTotal, total,
    notes:document.getElementById('u-notes').value.trim()
  };
  svR(); al('al-upd',L.updOk,'ok');
  document.getElementById('upd-form').style.display='none';
  renderUpdateTable();
}
function cancelUpdate(){ document.getElementById('upd-form').style.display='none'; }
function deleteRecord(id){
  const L=T[lang];
  if(!confirm(L.confirmDel))return;
  records=records.filter(x=>x.id!==id); svR(); renderUpdateTable();
  al('al-upd',L.delOk,'ok');
}

/* ─── KEYBOARD ─── */
document.addEventListener('keydown',e=>{
  if(!document.getElementById('modal').classList.contains('open'))return;
  if(e.key==='Enter')confirmModal();
  if(e.key==='Escape')closeModal();
});
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal();});

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded',()=>{
  showLoader(600);
  if(!parties){ parties=T[lang].defaultParties.slice(); svP(); }
  if(!sectors){ sectors=T[lang].defaultSectors.slice(); svS(); }
  if(!transports){ transports=['بس','وین','کار','کوچ']; svTr(); }
  parties.forEach(p=>getCode(p));
  loadLogo();
  setLang(lang);
  document.getElementById('e-date').value=today();
  document.getElementById('p-date').value=today();
  // disable fare fields until transport chosen
  document.getElementById('e-count').disabled=true;
  document.getElementById('e-fare').disabled=true;
  setNextVoucher();
});

// (duplicate removed)