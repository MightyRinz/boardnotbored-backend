-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "isOpenParty" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxPlayers" INTEGER;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "openingTime" TEXT;

-- CreateTable
CREATE TABLE "BookingParticipant" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BookingParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingParticipant_bookingId_userId_key" ON "BookingParticipant"("bookingId", "userId");

-- AddForeignKey
ALTER TABLE "BookingParticipant" ADD CONSTRAINT "BookingParticipant_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingParticipant" ADD CONSTRAINT "BookingParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
