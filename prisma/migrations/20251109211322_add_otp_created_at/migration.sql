-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpCreatedAt" TIMESTAMP(3),
ADD COLUMN     "otpExpires" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;
