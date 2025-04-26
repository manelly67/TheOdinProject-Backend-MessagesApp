/*
  Warnings:

  - You are about to drop the column `users` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "users",
ADD COLUMN     "usersInChat" TEXT[];
