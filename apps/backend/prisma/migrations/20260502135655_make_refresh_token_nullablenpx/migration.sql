-- AlterTable
ALTER TABLE "request_history" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "refresh_token_hash" DROP NOT NULL;
