# ♻️ Recyclelify [Backend]

## Tools required:
- Git: Recommended version 2.xx+
- Node JS: Recommended version 18+ (Including NPM as per Node JS version)
- PostgreSQL: Recommended version 14+
- Text Editor: Recommended Visual Studio Code
- Postman (Optional)

## Needs:
- Public & Secret Key Uploadcare

## Steps to run the program
1. Clone this repository
2. Duplicate the **.env.example** file and rename it to .env
3. Fill in the environment variables:
  - **PORT** can be filled with 3000 or 9000 as needed.
  - **SECRET_KEY** can be filled as desired and it is recommended not to fill it with a common word or key
  - **UPLOADCARE_PUBLIC_KEY** and **UPLOADCARE_SECRET_KEY** are filled with the keys obtained on the **API KEYS** page in the Uploadcare dashboard (Make sure to register first).
  - **DATABASE_URL** and **DIRECT_URL** are filled with the **Connection String** of the **PostgreSQL** Database, if running it using a local database then it can be filled with the same value, unless using a Supabase.
4. Install the dependencies with the `npm i` command
5. Run this command to migrate and seed the database:
  - `npx prisma db push`: for **Migration**
  - `npx prisma db seed`: for **Seeding**
6. There are 2 commands to run the program:
  - `npm start`: for the **Production** phase
  - `npm run dev`: for the **Development** phase
