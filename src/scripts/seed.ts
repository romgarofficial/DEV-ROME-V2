import { seedAll } from "../lib/seed";

const force = process.argv.includes("--force");

seedAll(force)
  .then(() => {
    console.log(`Seed complete${force ? " (forced)" : ""}.`);
    console.log(`Admin: ${process.env.ADMIN_EMAIL || "admin@example.com"}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
