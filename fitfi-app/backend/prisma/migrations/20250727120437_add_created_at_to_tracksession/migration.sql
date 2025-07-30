/*
  Warnings:

  - You are about to drop the column `created_by` on the `TrackSession` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `TrackSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackSession" DROP COLUMN "created_by",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL;
