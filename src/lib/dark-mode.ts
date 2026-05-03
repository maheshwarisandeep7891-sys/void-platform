import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const DARK_MODE_SALT = process.env.DARK_MODE_SALT ?? "void_dark_mode_salt_v1";

// Adjectives and nouns for handle generation
const ADJECTIVES = [
  "ghost",
  "null",
  "void",
  "shadow",
  "phantom",
  "silent",
  "dark",
  "hidden",
  "anon",
  "masked",
  "stealth",
  "cipher",
  "cryptic",
  "binary",
  "hex",
  "zero",
  "root",
  "sudo",
  "kernel",
  "daemon",
];

const NOUNS = [
  "ptr",
  "ref",
  "node",
  "byte",
  "bit",
  "stack",
  "heap",
  "loop",
  "fork",
  "pipe",
  "socket",
  "thread",
  "mutex",
  "signal",
  "buffer",
  "cache",
  "hash",
  "key",
  "token",
  "flag",
];

/**
 * Generate a random anonymous handle like "ghost_0x7f" or "null_ptr_42"
 */
export function generateDarkHandle(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const hex = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  return `${adj}_${noun}_${hex}`;
}

/**
 * Hash user ID with salt — stored in DB, never the real ID
 */
export function hashUserId(userId: string): string {
  return crypto
    .createHmac("sha256", DARK_MODE_SALT)
    .update(userId)
    .digest("hex");
}

/**
 * Create a new dark mode session
 */
export async function createDarkModeSession(userId: string): Promise<{
  sessionId: string;
  handle: string;
}> {
  const userHash = hashUserId(userId);
  let handle = generateDarkHandle();

  // Ensure handle is unique
  let attempts = 0;
  while (
    (await prisma.darkModeSession.findUnique({ where: { handle } })) &&
    attempts < 10
  ) {
    handle = generateDarkHandle();
    attempts++;
  }

  // Deactivate any existing sessions for this user hash
  await prisma.darkModeSession.updateMany({
    where: { userHash, isActive: true },
    data: { isActive: false },
  });

  const session = await prisma.darkModeSession.create({
    data: {
      userHash,
      handle,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isActive: true,
    },
  });

  return { sessionId: session.id, handle };
}

/**
 * Validate a dark mode session
 */
export async function validateDarkModeSession(
  sessionId: string
): Promise<{ valid: boolean; handle?: string }> {
  const session = await prisma.darkModeSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || !session.isActive || session.expiresAt < new Date()) {
    return { valid: false };
  }

  return { valid: true, handle: session.handle };
}

/**
 * End a dark mode session
 */
export async function endDarkModeSession(sessionId: string): Promise<void> {
  await prisma.darkModeSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
}
