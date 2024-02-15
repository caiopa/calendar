-- CreateTable
CREATE TABLE "Eventos" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "calendaId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id")
);
