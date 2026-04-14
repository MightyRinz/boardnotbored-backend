-- CreateTable
CREATE TABLE "BoardGame" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "yearPublished" INTEGER,
    "rank" INTEGER,
    "bayesAverage" DOUBLE PRECISION,
    "averageRating" DOUBLE PRECISION,
    "usersRated" INTEGER,
    "isExpansion" BOOLEAN NOT NULL,
    "strategyRank" INTEGER,
    "partyRank" INTEGER,
    "familyRank" INTEGER,

    CONSTRAINT "BoardGame_pkey" PRIMARY KEY ("id")
);
