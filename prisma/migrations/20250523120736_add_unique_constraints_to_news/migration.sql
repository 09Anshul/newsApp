/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `News` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "News" ALTER COLUMN "url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "News_title_key" ON "News"("title");

-- CreateIndex
CREATE UNIQUE INDEX "News_url_key" ON "News"("url");
