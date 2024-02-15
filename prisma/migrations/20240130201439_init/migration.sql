/*
  Warnings:

  - The primary key for the `Eventos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `calendaId` on the `Eventos` table. All the data in the column will be lost.
  - Changed the type of `end` on the `Eventos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Eventos" DROP CONSTRAINT "Eventos_pkey",
DROP COLUMN "calendaId",
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "end",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id");
