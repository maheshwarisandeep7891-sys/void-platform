import { prisma } from "@/lib/prisma";
import { ReputationLevel } from "@prisma/client";

const LEVEL_THRESHOLDS: Record<ReputationLevel, number> = {
  NEWCOMER: 0,
  BUILDER: 100,
  HACKER: 500,
  ARCHITECT: 2000,
  LEGEND: 10000,
};

const POINT_VALUES: Record<string, number> = {
  post_reaction: 2,
  answer_accepted: 25,
  bounty_completed: 50,
  sale_completed: 10,
  question_upvote: 5,
  answer_upvote: 10,
  answer_downvote: -2,
  post_created: 1,
  first_sale: 25,
  guild_created: 15,
  hackathon_shipped: 30,
};

export function getLevelFromScore(score: number): ReputationLevel {
  if (score >= LEVEL_THRESHOLDS.LEGEND) return "LEGEND";
  if (score >= LEVEL_THRESHOLDS.ARCHITECT) return "ARCHITECT";
  if (score >= LEVEL_THRESHOLDS.HACKER) return "HACKER";
  if (score >= LEVEL_THRESHOLDS.BUILDER) return "BUILDER";
  return "NEWCOMER";
}

export async function awardReputation(
  userId: string,
  eventType: string,
  description: string,
  customPoints?: number
): Promise<void> {
  const points = customPoints ?? POINT_VALUES[eventType] ?? 0;
  if (points === 0) return;

  await prisma.$transaction(async (tx) => {
    // Create event record
    await tx.reputationEvent.create({
      data: { userId, type: eventType, points, description },
    });

    // Update reputation score
    const rep = await tx.reputation.upsert({
      where: { userId },
      create: { userId, score: Math.max(0, points), level: "NEWCOMER" },
      update: { score: { increment: points } },
    });

    // Recalculate level
    const newScore = Math.max(0, rep.score + points);
    const newLevel = getLevelFromScore(newScore);

    if (newLevel !== rep.level) {
      await tx.reputation.update({
        where: { userId },
        data: { level: newLevel },
      });

      // Create milestone notification
      await tx.notification.create({
        data: {
          userId,
          type: "REPUTATION_MILESTONE",
          title: `Level up! You're now a ${newLevel}`,
          body: `Your reputation score reached ${newScore} points.`,
          link: `/profile`,
        },
      });
    }
  });
}

export function getNextLevel(
  current: ReputationLevel
): ReputationLevel | null {
  const levels: ReputationLevel[] = [
    "NEWCOMER",
    "BUILDER",
    "HACKER",
    "ARCHITECT",
    "LEGEND",
  ];
  const idx = levels.indexOf(current);
  return idx < levels.length - 1 ? levels[idx + 1] : null;
}

export function getProgressToNextLevel(
  score: number,
  level: ReputationLevel
): number {
  const next = getNextLevel(level);
  if (!next) return 100;
  const current = LEVEL_THRESHOLDS[level];
  const nextThreshold = LEVEL_THRESHOLDS[next];
  return Math.round(((score - current) / (nextThreshold - current)) * 100);
}

/**
 * Export reputation as a signed JSON credential
 */
export async function exportReputationCredential(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      name: true,
      reputation: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error("User not found");

  return {
    "@context": "https://void.dev/credentials/v1",
    type: "VoidReputationCredential",
    issuer: "https://void.dev",
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      platform: "VOID",
      username: user.username,
      name: user.name,
      score: user.reputation?.score ?? 0,
      level: user.reputation?.level ?? "NEWCOMER",
      memberSince: user.createdAt.toISOString(),
    },
  };
}
