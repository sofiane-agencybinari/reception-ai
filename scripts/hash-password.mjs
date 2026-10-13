#!/usr/bin/env node
/** Empreinte d'un mot de passe restaurant, à mettre dans RESTAURANT_ACCOUNTS (voir src/lib/server-auth.ts). */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('\nUsage : node scripts/hash-password.mjs "<mot de passe d’au moins 10 caractères>"\n');
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
console.log(`scrypt:${salt}:${scryptSync(password, salt, 32).toString("hex")}`);
