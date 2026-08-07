ALTER TABLE "users" DROP CONSTRAINT "users_status_check";

CREATE TYPE "UserStatus" AS ENUM ('Alive', 'Dead', 'unknown');

ALTER TABLE "users"
ALTER COLUMN "status" TYPE "UserStatus"
USING "status"::"UserStatus";
