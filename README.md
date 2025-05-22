# Room Logbook Application

## Prerequisites

* **Node.js** v16+ and npm
* **Git**
* **MySQL** database (e.g., Amazon RDS)
* **AWS S3** bucket
* **Prisma CLI** (installed globally or via npx)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/room-logbook.git
   cd room-logbook
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Prisma setup**

   * Copy the Prisma schema and generate client:

     ```bash
     npx prisma generate
     ```

   * Run any pending migrations (or create one):

     ```bash
     npx prisma migrate dev --name init
     ```

4. **Environment variables**

   Create a file named `.env` in the project root with the following keys:

   ```dotenv
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
   S3_BUCKET="your-s3-bucket-name"
   AWS_REGION="ap-southeast-3"
   AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
   AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
   SESSION_PASSWORD="a_long_secure_password"
   ```

5. **Seed data (optional)**

   If you have a seed script:

   ```bash
   npm run prisma:seed
   ```

## Running the Application

* **Development mode**

  ```bash
  npm run dev
  ```

  Next.js will start at `http://localhost:3000`.

* **Production build**

  ```bash
  npm run build
  npm start
  ```

## App Structure

* `src/app/(protected)/...` — Protected pages (Dashboard, Absen, Summary)
* `src/app/login/...` — Login & Forgot Password
* `src/pages/api/...` — API routes (auth, dashboard, summary, absen)
* `src/lib` — Database and session helpers
* `src/app/components` — Navbar, Background, Vanta effects

## Database

* Configured via **Prisma** in `prisma/schema.prisma`.
* Tables:

  * `User` (for session/auth)
  * `Logbook` (name, nik, department, remarks, photo\_url, timestamp)

## AWS S3

* Photo uploads (`/api/absen`) store to S3 bucket.
* Photo URLs are saved in MySQL and served via presigned URLs.

## Environment

Ensure you are in the correct AWS IAM environment with permissions to:

* `s3:PutObject`, `s3:GetObject`
* RDS MySQL connectivity

## Troubleshooting

* **Session errors**: Verify `SESSION_PASSWORD` matches in `.env` and `sessionOptions`.
* **Database errors**: Check `DATABASE_URL` format and connectivity to MySQL.
* **S3 errors**: Ensure bucket name & region are correct, and IAM user has S3 permissions.

---

© {new Date().getFullYear()} Faisal Tri Surya. All rights reserved.
