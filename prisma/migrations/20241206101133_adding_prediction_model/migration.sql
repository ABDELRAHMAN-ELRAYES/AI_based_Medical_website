-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "predictionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
