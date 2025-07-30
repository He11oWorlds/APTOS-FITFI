/*
  Warnings:

  - A unique constraint covering the columns `[user_id,quest_id]` on the table `UserQuestProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserQuestProfile_user_id_quest_id_key" ON "UserQuestProfile"("user_id", "quest_id");
