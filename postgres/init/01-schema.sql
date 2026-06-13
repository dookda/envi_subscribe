-- ENVIR Store – initial schema
-- Generated from live DB. Run automatically by Postgres on first volume init.
-- Prisma migrate deploy will skip all migrations because _prisma_migrations is pre-populated below.

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

CREATE TABLE public."User" (
    id                text NOT NULL,
    "lineUserId"      text,
    name              text,
    email             text,
    "emailVerified"   timestamp(3) without time zone,
    image             text,
    "createdAt"       timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt"       timestamp(3) without time zone NOT NULL
);

CREATE TABLE public."Account" (
    id                  text NOT NULL,
    "userId"            text NOT NULL,
    type                text NOT NULL,
    provider            text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token       text,
    access_token        text,
    expires_at          integer,
    token_type          text,
    scope               text,
    id_token            text,
    session_state       text
);

CREATE TABLE public."Session" (
    id             text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId"       text NOT NULL,
    expires        timestamp(3) without time zone NOT NULL
);

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token      text NOT NULL,
    expires    timestamp(3) without time zone NOT NULL
);

CREATE TABLE public."EquipmentItem" (
    id              text NOT NULL,
    "userId"        text NOT NULL,
    "equipmentName" text NOT NULL,
    model           text NOT NULL,
    "customerName"  text NOT NULL,
    location        text NOT NULL,
    image           text,
    "installedAt"   timestamp(3) without time zone,
    "expiredAt"     timestamp(3) without time zone,
    latitude        double precision,
    longitude       double precision,
    "isArchived"    boolean DEFAULT false NOT NULL,
    "archivedAt"    timestamp(3) without time zone,
    "createdAt"     timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt"     timestamp(3) without time zone NOT NULL
);

CREATE TABLE public._prisma_migrations (
    id                    character varying(36)  NOT NULL,
    checksum              character varying(64)  NOT NULL,
    finished_at           timestamp with time zone,
    migration_name        character varying(255) NOT NULL,
    logs                  text,
    rolled_back_at        timestamp with time zone,
    started_at            timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count   integer DEFAULT 0 NOT NULL
);

-- ------------------------------------------------------------
-- Primary keys
-- ------------------------------------------------------------

ALTER TABLE ONLY public."User"             ADD CONSTRAINT "User_pkey"             PRIMARY KEY (id);
ALTER TABLE ONLY public."Account"          ADD CONSTRAINT "Account_pkey"          PRIMARY KEY (id);
ALTER TABLE ONLY public."Session"          ADD CONSTRAINT "Session_pkey"          PRIMARY KEY (id);
ALTER TABLE ONLY public."VerificationToken" ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY (identifier, token);
ALTER TABLE ONLY public."EquipmentItem"    ADD CONSTRAINT "EquipmentItem_pkey"    PRIMARY KEY (id);
ALTER TABLE ONLY public._prisma_migrations ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);

-- ------------------------------------------------------------
-- Unique indexes
-- ------------------------------------------------------------

CREATE UNIQUE INDEX "User_lineUserId_key"                     ON public."User"              USING btree ("lineUserId");
CREATE UNIQUE INDEX "User_email_key"                          ON public."User"              USING btree (email);
CREATE UNIQUE INDEX "Session_sessionToken_key"                ON public."Session"           USING btree ("sessionToken");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key"  ON public."Account"           USING btree (provider, "providerAccountId");
CREATE UNIQUE INDEX "VerificationToken_token_key"             ON public."VerificationToken" USING btree (token);
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key"  ON public."VerificationToken" USING btree (identifier, token);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------

CREATE INDEX "EquipmentItem_userId_idx"        ON public."EquipmentItem" USING btree ("userId");
CREATE INDEX "EquipmentItem_equipmentName_idx" ON public."EquipmentItem" USING btree ("equipmentName");
CREATE INDEX "EquipmentItem_model_idx"         ON public."EquipmentItem" USING btree (model);
CREATE INDEX "EquipmentItem_customerName_idx"  ON public."EquipmentItem" USING btree ("customerName");
CREATE INDEX "EquipmentItem_isArchived_idx"    ON public."EquipmentItem" USING btree ("isArchived");

-- ------------------------------------------------------------
-- Foreign keys
-- ------------------------------------------------------------

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public."EquipmentItem"
    ADD CONSTRAINT "EquipmentItem_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- ------------------------------------------------------------
-- Mark all Prisma migrations as already applied
-- so that `prisma migrate deploy` is a no-op on this DB.
-- ------------------------------------------------------------

INSERT INTO public._prisma_migrations
    (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES
    ('8925e8bb-fb01-4313-b45e-8c96954c083a',
     '400bc0f838c2fe592995a4cc7c42118d5b949e94279fa51d339f00aaa3cfa712',
     now(), '20260613024800_init', NULL, NULL, now(), 1),

    ('0d41827e-65e5-40c7-8394-d822af89ec19',
     'd85c615ea2232e30dfa29a199aeb465b043e0b97fb0c35088a04c684e2cc8d2a',
     now(), '20260613044328_make_line_user_id_optional', NULL, NULL, now(), 1),

    ('53d9fe89-55a4-47ae-82bf-1dc7fd9e77b9',
     '85413685bced382311a5dbe4e04a6cba32981e2fa7aa33578e2ab4d4ce715942',
     now(), '20260613120000_add_equipment_image', NULL, NULL, now(), 1),

    ('e1f2a3b4-c5d6-7890-abcd-ef1234567890',
     'd6464293d8c6f03a3c1bdca66f457fd36cf28e315b3995f596e92c9487f52ee6',
     now(), '20260613130000_remove_service_records', NULL, NULL, now(), 1),

    ('f2a3b4c5-d6e7-8901-bcde-f12345678901',
     'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
     now(), '20260613140000_add_installed_at', NULL, NULL, now(), 1),

    ('a3b4c5d6-e7f8-9012-cdef-123456789012',
     'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
     now(), '20260613150000_add_expired_at', NULL, NULL, now(), 1),

    ('b4c5d6e7-f8a9-0123-defa-234567890123',
     'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
     now(), '20260613160000_add_lat_lng', NULL, NULL, now(), 1);
