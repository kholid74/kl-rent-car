CREATE TABLE "DemoWorkspace" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "revision" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DemoWorkspace_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DemoAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ownerId" TEXT,
    CONSTRAINT "DemoAccount_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DemoAccount_role_check" CHECK (
      ("role" = 'admin' AND "ownerId" IS NULL) OR
      ("role" = 'owner' AND "ownerId" IS NOT NULL AND "ownerId" IN ('budi', 'andi', 'sari'))
    )
);
CREATE UNIQUE INDEX "DemoAccount_email_key" ON "DemoAccount"("email");

CREATE TABLE "DemoLoginAttempt" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DemoLoginAttempt_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "DemoLoginAttempt_expiresAt_idx" ON "DemoLoginAttempt"("expiresAt");
