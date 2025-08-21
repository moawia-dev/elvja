/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `ReportCache` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ReportCache_tenantId_scope_period_key";

-- AlterTable
ALTER TABLE "ReportCache" DROP COLUMN "updatedAt";
