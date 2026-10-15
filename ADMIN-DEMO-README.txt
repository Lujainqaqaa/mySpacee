MySpace Admin demo update
========================

Start: open index.html with VS Code Live Server.
Click Admin beside Login to open admin-login.html.

Admin accounts are configured in the demo authentication script. For a deployed app, use server-side authentication and never store credentials in front-end code.

Role permissions (front-end demo only):
- Admin: full access, including Settings and user/provider management.
- Moderator: projects, bookings, reuse furniture, reviews, content, notifications and reports.
- Support: users, bookings, complaints and reports.

Shared demo data is stored in localStorage under myspace_platform_data and related app keys.
The admin dashboard recalculates counts and booking/project totals from saved demo data.
Project/room records and furniture listings can be shared between the user-facing pages and admin panel.
Currency displayed for budgets/prices is Jordanian Dinar (JD/JOD); demo dates use 2026.

Important: This is a classroom prototype. localStorage and front-end role checks are not secure authentication.
A real deployment requires a server, database, and server-side authorization.
