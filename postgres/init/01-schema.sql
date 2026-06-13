-- ENVIR Store – initial schema + data
-- Generated from live DB. Run automatically by Postgres on first volume init.
-- Prisma migrate deploy will skip all migrations because _prisma_migrations is pre-populated below.

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Tables
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);

CREATE TABLE public."EquipmentItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "equipmentName" text NOT NULL,
    model text NOT NULL,
    "customerName" text NOT NULL,
    location text NOT NULL,
    image text,
    "isArchived" boolean DEFAULT false NOT NULL,
    "archivedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "installedAt" timestamp(3) without time zone,
    "expiredAt" timestamp(3) without time zone,
    latitude double precision,
    longitude double precision,
    "inUse" boolean DEFAULT false NOT NULL
);

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);

CREATE TABLE public."User" (
    id text NOT NULL,
    "lineUserId" text,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);

--
-- Data
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cmqbaccount0001line	cmqbw429q0000o65bs8offnet	oauth	line	Ufd66dd59708cfa4fafd767a8495cb5fb	\N	\N	\N	\N	\N	\N	\N
\.

COPY public."EquipmentItem" (id, "userId", "equipmentName", model, "customerName", location, image, "isArchived", "archivedAt", "createdAt", "updatedAt", "installedAt", "expiredAt", latitude, longitude, "inUse") FROM stdin;
cmqc3z7tj0001od7fvobn2yw9	cmqbw429q0000o65bs8offnet	AAQMS	AAQMS	Acme crop	Floo1	/uploads/d921644e-1f57-4b6d-8b41-035ee14410e0.png	t	2026-06-13 00:00:00	2026-06-13 08:43:46.902	2026-06-13 09:40:30.167	2026-06-17 00:00:00	2026-09-24 00:00:00	\N	\N	f
cmqbw8isf0004o65b4emr5q9t	cmqbw429q0000o65bs8offnet	test	test	test	test	/uploads/67190217-1fd7-4232-b33d-7ef4101481ca.webp	f	\N	2026-06-13 05:07:04.093	2026-06-13 10:12:09.648	2026-06-08 00:00:00	\N	16.76908852095917	100.199089050293	f
cmqbwtkgd0001o65b4nnys569	cmqbw429q0000o65bs8offnet	XR-200	XR-200	Acme crop	Floo3	/uploads/08f9e00c-91ba-4f64-969d-dc8b246ae368.webp	f	\N	2026-06-13 05:23:26.027	2026-06-13 11:48:12.724	2026-06-01 00:00:00	2026-06-30 00:00:00	\N	\N	t
cmqc76ftz0001nz45p2jzd9p4	cmqbw429q0000o65bs8offnet	AAQMS	AAQMS	test	Floo1	/uploads/74f7ad5e-c3f9-48f8-8c64-692bafd8b6d8.png	f	\N	2026-06-13 10:13:22.725	2026-06-13 12:33:39.785	2026-03-10 00:00:00	2026-12-31 00:00:00	16.8079098289024	100.2680969238281	t
\.

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.

COPY public."User" (id, "lineUserId", name, email, "emailVerified", image, "createdAt", "updatedAt") FROM stdin;
cmqbw429q0000o65bs8offnet	Ufd66dd59708cfa4fafd767a8495cb5fb	sakda.homhuan	\N	\N	https://profile.line-scdn.net/0hjiX1GEA_NUZlSBrAnfNKEVkNOysSZjMOHS17dUFNa3RBfXNHDXkvKEgaa3IYK3MTDCgtKEZKaCJN	2026-06-13 05:03:36.062	2026-06-13 05:03:36.062
\.

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8925e8bb-fb01-4313-b45e-8c96954c083a	400bc0f838c2fe592995a4cc7c42118d5b949e94279fa51d339f00aaa3cfa712	2026-06-13 08:51:02.877445+00	20260613024800_init	\N	\N	2026-06-13 08:51:02.877445+00	1
0d41827e-65e5-40c7-8394-d822af89ec19	d85c615ea2232e30dfa29a199aeb465b043e0b97fb0c35088a04c684e2cc8d2a	2026-06-13 08:51:02.877445+00	20260613044328_make_line_user_id_optional	\N	\N	2026-06-13 08:51:02.877445+00	1
53d9fe89-55a4-47ae-82bf-1dc7fd9e77b9	85413685bced382311a5dbe4e04a6cba32981e2fa7aa33578e2ab4d4ce715942	2026-06-13 08:51:02.877445+00	20260613120000_add_equipment_image	\N	\N	2026-06-13 08:51:02.877445+00	1
e1f2a3b4-c5d6-7890-abcd-ef1234567890	d6464293d8c6f03a3c1bdca66f457fd36cf28e315b3995f596e92c9487f52ee6	2026-06-13 08:51:02.877445+00	20260613130000_remove_service_records	\N	\N	2026-06-13 08:51:02.877445+00	1
6f1c70bf-da1b-43b4-b117-ef789185839a	ec146a4bd1362c991795f14b7ab7a4d706283b716cc9ec941bb6ee37e2f58c36	2026-06-13 09:35:29.085516+00	20260613140000_add_installed_at	\N	\N	2026-06-13 09:35:29.044812+00	1
bd4d49f3-294a-477f-9532-806272584f3d	cce130cefecf0a81fd5c18bb5c762f01ca44d525ef9f0a1c83ae9c3fb775337e	2026-06-13 09:39:08.060221+00	20260613150000_add_expired_at	\N	\N	2026-06-13 09:39:08.041342+00	1
270a3cdf-804a-4472-88af-67e21b8fb0bf	a74d49f2271d4f03811e2626055632192598923de362dabf7648fc88bfbe5212	2026-06-13 09:55:08.637247+00	20260613160000_add_lat_lng	\N	\N	2026-06-13 09:55:08.538833+00	1
556d32c5-3151-4375-b186-2b1e8fc60c5f	6b31ba70596a1de8eb6f3899cf3c07ef0efff3a4c2c4b3f57ddddc33e867e2b3	2026-06-13 11:37:31.006326+00	20260613170000_add_in_use	\N	\N	2026-06-13 11:37:30.99531+00	1
\.

--
-- Constraints
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."EquipmentItem"
    ADD CONSTRAINT "EquipmentItem_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY (identifier, token);

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);

--
-- Indexes
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");

CREATE INDEX "EquipmentItem_customerName_idx" ON public."EquipmentItem" USING btree ("customerName");
CREATE INDEX "EquipmentItem_equipmentName_idx" ON public."EquipmentItem" USING btree ("equipmentName");
CREATE INDEX "EquipmentItem_isArchived_idx" ON public."EquipmentItem" USING btree ("isArchived");
CREATE INDEX "EquipmentItem_model_idx" ON public."EquipmentItem" USING btree (model);
CREATE INDEX "EquipmentItem_userId_idx" ON public."EquipmentItem" USING btree ("userId");

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
CREATE UNIQUE INDEX "User_lineUserId_key" ON public."User" USING btree ("lineUserId");

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);
CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);

--
-- Foreign keys
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public."EquipmentItem"
    ADD CONSTRAINT "EquipmentItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
