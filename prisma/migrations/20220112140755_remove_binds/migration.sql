/*
  Warnings:

  - You are about to drop the `binds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "binds" DROP CONSTRAINT "binds_userId_fkey";

-- DropTable
DROP TABLE "binds";
