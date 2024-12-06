/*
  Warnings:

  - Added the required column `resultInNumbers` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "resultInNumbers" TEXT NOT NULL;
