-- AlterTable
ALTER TABLE "User" ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "age" SET DEFAULT 'OAuth_Registeration',
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" SET DEFAULT 'OAuth_Registeration';
