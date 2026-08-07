CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "species" VARCHAR(100) NOT NULL,
    "origin_name" TEXT NOT NULL,
    "origin_url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "episode" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_status_check" CHECK ("status" IN ('Alive', 'Dead', 'unknown'))
);

CREATE INDEX "users_status_idx" ON "users"("status");
