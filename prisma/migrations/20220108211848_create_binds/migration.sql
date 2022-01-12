-- CreateTable
CREATE TABLE "binds" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "primary_action" TEXT NOT NULL,
    "secondary_action" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "binds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "binds" ADD CONSTRAINT "binds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
