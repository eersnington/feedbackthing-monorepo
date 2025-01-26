/*
  Warnings:

  - You are about to alter the column `upvotes` on the `feedback` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `comment_count` on the `feedback` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `upvotes` on the `feedback_comments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "feedback" ALTER COLUMN "upvotes" SET DATA TYPE INTEGER,
ALTER COLUMN "comment_count" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "feedback_comments" ALTER COLUMN "upvotes" SET DATA TYPE INTEGER;
