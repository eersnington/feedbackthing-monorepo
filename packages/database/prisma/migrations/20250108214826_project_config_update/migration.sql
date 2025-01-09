/*
  Warnings:

  - A unique constraint covering the columns `[project_id]` on the table `project_configs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "project_configs_project_id_key" ON "project_configs"("project_id");
