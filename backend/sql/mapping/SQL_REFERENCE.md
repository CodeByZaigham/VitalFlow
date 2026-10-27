# SQL_REFERENCE.md (Endpoint → SQL mapping)

Use this file to quickly show your teacher how the API maps to SQL.

## Schema
- `database_schema.sql` — creates tables + constraints

## Users / Auth
- Register (INSERT): `sql/queries/01_users.sql` (Create user)
- Login lookup (SELECT by email): `sql/queries/01_users.sql` (Get user by email)
- Admin user list: `sql/queries/01_users.sql`

## Donors
- List + filters: `sql/queries/02_donors.sql`
- Join/subquery reports: `sql/advanced/10_reports_and_analytics.sql`

## Blood Requests
- List + filters: `sql/queries/03_blood_requests.sql`
- Request + user JOIN: `sql/advanced/10_reports_and_analytics.sql` section A
- EXISTS / NOT EXISTS examples: `sql/advanced/10_reports_and_analytics.sql`

## Donations
- CRUD: `sql/queries/04_donations.sql`
- Donation history JOIN: `sql/advanced/10_reports_and_analytics.sql` section B
- Transaction demo: `sql/advanced/30_transactions.sql`

## Inventory
- CRUD: `sql/queries/05_inventory.sql`
- Pending requests vs stock: `sql/advanced/10_reports_and_analytics.sql` section E
