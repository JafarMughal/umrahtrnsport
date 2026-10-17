Act as a senior product designer, UI/UX expert, and frontend engineer. Redesign my existing Umrah Transport Management System into a polished, professional, user-friendly business application.

First inspect the complete existing project and understand its screens, workflows, data structures, Firebase integration, permissions, and current behavior. Then implement the redesign in the existing project.

PRODUCT CONTEXT
This is a transport management system used to manage Umrah transport operations. It includes:
- Login and user roles/permissions
- New transport entries and passenger/flight details
- Transporter/party records
- Payments and account ledger
- Transport records and search/filtering
- Reports and daily reports
- Admin panel and settings
- Urdu, English, and Arabic language support
- Excel export and printable reports

IMPORTANT: Preserve all existing functionality and business logic. This is primarily a UI/UX redesign, not a rewrite of the application.

DESIGN DIRECTION
Create a premium, trustworthy, calm, modern business interface suitable for daily use by office staff.
Use a refined color palette:
- Deep navy for primary navigation and headings: #142B4A
- Teal/emerald for primary actions and positive states: #147D64
- Muted gold for restrained accents: #C9A84C
- Soft off-white/light gray page background: #F5F7FA
- White surfaces with subtle borders and restrained shadows
- Clear semantic colors for success, warning, error, and information

Avoid excessive gradients, emoji-heavy controls, visual clutter, overly rounded cards, and low-contrast text. Use a consistent spacing, typography, border-radius, icon, and component system. Choose legible fonts for Urdu and Arabic; ensure English, Urdu, and Arabic all look intentional and polished.

UX AND LAYOUT
- Make the main navigation clear and easy to scan; use a responsive sidebar or another layout that fits the existing application architecture.
- Give each page a clear title, short description where helpful, and a consistent page structure.
- Make forms easier to complete by grouping related fields, using clear labels and helpful validation/error messages, and highlighting primary actions.
- Make tables readable and practical: clear column hierarchy, aligned numbers, useful empty/loading states, and responsive handling on smaller screens.
- Improve search, filtering, date-range selection, and status visibility without changing their underlying behavior.
- Use confirmation dialogs for destructive actions where appropriate.
- Ensure the application works well on desktop, tablet, and mobile.
- Support keyboard navigation, visible focus states, accessible contrast, and touch-friendly controls.
- Respect RTL layout correctly for Urdu and Arabic, including forms, tables, icons, navigation, and mixed Arabic/English content. English must remain correctly LTR.
- Keep print layouts clean and professional; do not let the new screen styles break printed reports or Excel exports.

REPORTS
Redesign the reports and daily reports as professional operational/financial reporting screens:
- Put report filters (date range, report type, transporter/party, and other existing filters) in a clear filter panel.
- Show useful summary cards for existing totals, such as passenger count, transport charges, payments received, and balance, only where those values are already supported by the current data.
- Improve report tables with clear headings, readable totals/subtotals, aligned SAR amounts, and visible grouping.
- Make report output suitable both on screen and when printed/exported.
- Do not invent metrics or alter report calculations.

IMPLEMENTATION RULES
- Reuse the existing project structure and dependencies; do not migrate frameworks or introduce a new UI library unless absolutely necessary.
- Preserve existing element IDs, event handlers, function names, Firebase behavior, data formats, authentication, permissions, calculations, and export/print behavior unless a change is essential. If a change is necessary, explain it and verify all affected flows.
- Do not remove existing features or silently replace working behavior with mock data.
- Keep the implementation maintainable and consistent; avoid duplicating styles or adding unnecessary abstractions.
- Update related documentation only if the redesign changes how the project is run or used.

WORKFLOW
1. Briefly map the current screens and identify the key UI files and constraints before editing.
2. Implement the redesign across all relevant screens, not just the landing page.
3. Check Urdu, English, and Arabic layouts, including RTL/LTR behavior.
4. Run the available project checks and fix issues caused by the redesign.
5. Summarize the main design changes, files changed, checks performed, and any remaining limitations.

ACCEPTANCE CRITERIA
- Existing workflows and data operations still work.
- Every existing screen has a consistent, professional design.
- The UI is responsive and usable on mobile and desktop.
- Urdu and Arabic are correctly RTL; English is correctly LTR.
- Reports remain accurate and readable on screen and in print.
- No existing feature is removed or replaced with a non-functional visual mockup.