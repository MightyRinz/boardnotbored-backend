-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopGame" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "ShopGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopGame_shopId_gameId_key" ON "ShopGame"("shopId", "gameId");

-- AddForeignKey
ALTER TABLE "ShopGame" ADD CONSTRAINT "ShopGame_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopGame" ADD CONSTRAINT "ShopGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "BoardGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
