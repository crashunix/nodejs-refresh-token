/*
  Warnings:

  - Added the required column `name` to the `binds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "binds" ADD COLUMN     "name" TEXT NOT NULL;
