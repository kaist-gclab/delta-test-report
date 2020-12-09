CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE asset_format (
    id bigserial NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    file_extension text NULL,
    CONSTRAINT "PK_asset_format" PRIMARY KEY (id)
);

CREATE TABLE asset_type (
    id bigserial NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    CONSTRAINT "PK_asset_type" PRIMARY KEY (id)
);

CREATE TABLE encryption_key (
    id bigserial NOT NULL,
    name text NOT NULL,
    value text NULL,
    enabled boolean NOT NULL,
    CONSTRAINT "PK_encryption_key" PRIMARY KEY (id)
);

CREATE TABLE processor_type (
    id bigserial NOT NULL,
    key text NOT NULL,
    name text NULL,
    CONSTRAINT "PK_processor_type" PRIMARY KEY (id)
);

CREATE TABLE processor_version (
    id bigserial NOT NULL,
    processor_type_id bigint NOT NULL,
    key text NOT NULL,
    description text NOT NULL,
    created_at timestamp NOT NULL,
    CONSTRAINT "PK_processor_version" PRIMARY KEY (id),
    CONSTRAINT "FK_processor_version_processor_type_processor_type_id" FOREIGN KEY (processor_type_id) REFERENCES processor_type (id) ON DELETE CASCADE
);

CREATE TABLE processor_node (
    id bigserial NOT NULL,
    processor_version_id bigint NOT NULL,
    key text NOT NULL,
    name text NULL,
    CONSTRAINT "PK_processor_node" PRIMARY KEY (id),
    CONSTRAINT "FK_processor_node_processor_version_processor_version_id" FOREIGN KEY (processor_version_id) REFERENCES processor_version (id) ON DELETE CASCADE
);

CREATE TABLE processor_version_input_capability (
    id bigserial NOT NULL,
    processor_version_id bigint NOT NULL,
    asset_format_id bigint NOT NULL,
    asset_type_id bigint NULL,
    CONSTRAINT "PK_processor_version_input_capability" PRIMARY KEY (id),
    CONSTRAINT "FK_processor_version_input_capability_asset_format_asset_forma~" FOREIGN KEY (asset_format_id) REFERENCES asset_format (id) ON DELETE CASCADE,
    CONSTRAINT "FK_processor_version_input_capability_asset_type_asset_type_id" FOREIGN KEY (asset_type_id) REFERENCES asset_type (id) ON DELETE RESTRICT,
    CONSTRAINT "FK_processor_version_input_capability_processor_version_proces~" FOREIGN KEY (processor_version_id) REFERENCES processor_version (id) ON DELETE CASCADE
);

CREATE TABLE processor_node_status (
    id bigserial NOT NULL,
    processor_node_id bigint NOT NULL,
    timestamp timestamp NOT NULL,
    status text NOT NULL,
    CONSTRAINT "PK_processor_node_status" PRIMARY KEY (id),
    CONSTRAINT "FK_processor_node_status_processor_node_processor_node_id" FOREIGN KEY (processor_node_id) REFERENCES processor_node (id) ON DELETE CASCADE
);

CREATE TABLE asset_tag (
    id bigserial NOT NULL,
    asset_id bigint NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    CONSTRAINT "PK_asset_tag" PRIMARY KEY (id)
);

CREATE TABLE job (
    id bigserial NOT NULL,
    processor_type_id bigint NOT NULL,
    input_asset_id bigint NULL,
    job_arguments text NOT NULL,
    created_at timestamp NOT NULL,
    CONSTRAINT "PK_job" PRIMARY KEY (id),
    CONSTRAINT "FK_job_processor_type_processor_type_id" FOREIGN KEY (processor_type_id) REFERENCES processor_type (id) ON DELETE CASCADE
);

CREATE TABLE job_execution (
    id bigserial NOT NULL,
    job_id bigint NOT NULL,
    processor_node_id bigint NOT NULL,
    CONSTRAINT "PK_job_execution" PRIMARY KEY (id),
    CONSTRAINT "FK_job_execution_job_job_id" FOREIGN KEY (job_id) REFERENCES job (id) ON DELETE CASCADE,
    CONSTRAINT "FK_job_execution_processor_node_processor_node_id" FOREIGN KEY (processor_node_id) REFERENCES processor_node (id) ON DELETE CASCADE
);

CREATE TABLE asset (
    id bigserial NOT NULL,
    asset_format_id bigint NULL,
    encryption_key_id bigint NULL,
    asset_type_id bigint NULL,
    store_key text NULL,
    parent_job_execution_id bigint NULL,
    created_at timestamp NOT NULL,
    CONSTRAINT "PK_asset" PRIMARY KEY (id),
    CONSTRAINT "FK_asset_asset_format_asset_format_id" FOREIGN KEY (asset_format_id) REFERENCES asset_format (id) ON DELETE RESTRICT,
    CONSTRAINT "FK_asset_asset_type_asset_type_id" FOREIGN KEY (asset_type_id) REFERENCES asset_type (id) ON DELETE RESTRICT,
    CONSTRAINT "FK_asset_encryption_key_encryption_key_id" FOREIGN KEY (encryption_key_id) REFERENCES encryption_key (id) ON DELETE RESTRICT,
    CONSTRAINT "FK_asset_job_execution_parent_job_execution_id" FOREIGN KEY (parent_job_execution_id) REFERENCES job_execution (id) ON DELETE RESTRICT
);

CREATE TABLE job_execution_status (
    id bigserial NOT NULL,
    job_execution_id bigint NOT NULL,
    timestamp timestamp NOT NULL,
    status text NOT NULL,
    CONSTRAINT "PK_job_execution_status" PRIMARY KEY (id),
    CONSTRAINT "FK_job_execution_status_job_execution_job_execution_id" FOREIGN KEY (job_execution_id) REFERENCES job_execution (id) ON DELETE CASCADE
);

CREATE INDEX "IX_asset_asset_format_id" ON asset (asset_format_id);

CREATE INDEX "IX_asset_asset_type_id" ON asset (asset_type_id);

CREATE INDEX "IX_asset_encryption_key_id" ON asset (encryption_key_id);

CREATE INDEX "IX_asset_parent_job_execution_id" ON asset (parent_job_execution_id);

CREATE INDEX "IX_asset_tag_asset_id" ON asset_tag (asset_id);

CREATE INDEX "IX_job_input_asset_id" ON job (input_asset_id);

CREATE INDEX "IX_job_processor_type_id" ON job (processor_type_id);

CREATE INDEX "IX_job_execution_job_id" ON job_execution (job_id);

CREATE INDEX "IX_job_execution_processor_node_id" ON job_execution (processor_node_id);

CREATE INDEX "IX_job_execution_status_job_execution_id" ON job_execution_status (job_execution_id);

CREATE INDEX "IX_processor_node_processor_version_id" ON processor_node (processor_version_id);

CREATE INDEX "IX_processor_node_status_processor_node_id" ON processor_node_status (processor_node_id);

CREATE INDEX "IX_processor_version_processor_type_id" ON processor_version (processor_type_id);

CREATE INDEX "IX_processor_version_input_capability_asset_format_id" ON processor_version_input_capability (asset_format_id);

CREATE INDEX "IX_processor_version_input_capability_asset_type_id" ON processor_version_input_capability (asset_type_id);

CREATE INDEX "IX_processor_version_input_capability_processor_version_id" ON processor_version_input_capability (processor_version_id);

ALTER TABLE asset_tag ADD CONSTRAINT "FK_asset_tag_asset_asset_id" FOREIGN KEY (asset_id) REFERENCES asset (id) ON DELETE CASCADE;

ALTER TABLE job ADD CONSTRAINT "FK_job_asset_input_asset_id" FOREIGN KEY (input_asset_id) REFERENCES asset (id) ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20190905092948_InitialCreate', '5.0.0');

COMMIT;

START TRANSACTION;

ALTER TABLE processor_version_input_capability DROP CONSTRAINT "FK_processor_version_input_capability_asset_format_asset_forma~";

ALTER TABLE processor_version_input_capability ALTER COLUMN asset_format_id DROP NOT NULL;

ALTER SEQUENCE processor_version_input_capability_id_seq RENAME TO processor_version_input_capability_id_old_seq;
ALTER TABLE processor_version_input_capability ALTER COLUMN id DROP DEFAULT;
ALTER TABLE processor_version_input_capability ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('processor_version_input_capability_id_seq', nextval('processor_version_input_capability_id_old_seq'), false);
DROP SEQUENCE processor_version_input_capability_id_old_seq;

ALTER SEQUENCE processor_version_id_seq RENAME TO processor_version_id_old_seq;
ALTER TABLE processor_version ALTER COLUMN id DROP DEFAULT;
ALTER TABLE processor_version ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('processor_version_id_seq', nextval('processor_version_id_old_seq'), false);
DROP SEQUENCE processor_version_id_old_seq;

ALTER SEQUENCE processor_type_id_seq RENAME TO processor_type_id_old_seq;
ALTER TABLE processor_type ALTER COLUMN id DROP DEFAULT;
ALTER TABLE processor_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('processor_type_id_seq', nextval('processor_type_id_old_seq'), false);
DROP SEQUENCE processor_type_id_old_seq;

ALTER SEQUENCE processor_node_status_id_seq RENAME TO processor_node_status_id_old_seq;
ALTER TABLE processor_node_status ALTER COLUMN id DROP DEFAULT;
ALTER TABLE processor_node_status ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('processor_node_status_id_seq', nextval('processor_node_status_id_old_seq'), false);
DROP SEQUENCE processor_node_status_id_old_seq;

ALTER SEQUENCE processor_node_id_seq RENAME TO processor_node_id_old_seq;
ALTER TABLE processor_node ALTER COLUMN id DROP DEFAULT;
ALTER TABLE processor_node ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('processor_node_id_seq', nextval('processor_node_id_old_seq'), false);
DROP SEQUENCE processor_node_id_old_seq;

ALTER SEQUENCE job_execution_status_id_seq RENAME TO job_execution_status_id_old_seq;
ALTER TABLE job_execution_status ALTER COLUMN id DROP DEFAULT;
ALTER TABLE job_execution_status ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('job_execution_status_id_seq', nextval('job_execution_status_id_old_seq'), false);
DROP SEQUENCE job_execution_status_id_old_seq;

ALTER SEQUENCE job_execution_id_seq RENAME TO job_execution_id_old_seq;
ALTER TABLE job_execution ALTER COLUMN id DROP DEFAULT;
ALTER TABLE job_execution ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('job_execution_id_seq', nextval('job_execution_id_old_seq'), false);
DROP SEQUENCE job_execution_id_old_seq;

ALTER SEQUENCE job_id_seq RENAME TO job_id_old_seq;
ALTER TABLE job ALTER COLUMN id DROP DEFAULT;
ALTER TABLE job ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('job_id_seq', nextval('job_id_old_seq'), false);
DROP SEQUENCE job_id_old_seq;

ALTER SEQUENCE encryption_key_id_seq RENAME TO encryption_key_id_old_seq;
ALTER TABLE encryption_key ALTER COLUMN id DROP DEFAULT;
ALTER TABLE encryption_key ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('encryption_key_id_seq', nextval('encryption_key_id_old_seq'), false);
DROP SEQUENCE encryption_key_id_old_seq;

ALTER SEQUENCE asset_type_id_seq RENAME TO asset_type_id_old_seq;
ALTER TABLE asset_type ALTER COLUMN id DROP DEFAULT;
ALTER TABLE asset_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('asset_type_id_seq', nextval('asset_type_id_old_seq'), false);
DROP SEQUENCE asset_type_id_old_seq;

ALTER SEQUENCE asset_tag_id_seq RENAME TO asset_tag_id_old_seq;
ALTER TABLE asset_tag ALTER COLUMN id DROP DEFAULT;
ALTER TABLE asset_tag ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('asset_tag_id_seq', nextval('asset_tag_id_old_seq'), false);
DROP SEQUENCE asset_tag_id_old_seq;

ALTER SEQUENCE asset_format_id_seq RENAME TO asset_format_id_old_seq;
ALTER TABLE asset_format ALTER COLUMN id DROP DEFAULT;
ALTER TABLE asset_format ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('asset_format_id_seq', nextval('asset_format_id_old_seq'), false);
DROP SEQUENCE asset_format_id_old_seq;

ALTER SEQUENCE asset_id_seq RENAME TO asset_id_old_seq;
ALTER TABLE asset ALTER COLUMN id DROP DEFAULT;
ALTER TABLE asset ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY;
SELECT * FROM setval('asset_id_seq', nextval('asset_id_old_seq'), false);
DROP SEQUENCE asset_id_old_seq;

ALTER TABLE processor_version_input_capability ADD CONSTRAINT "FK_processor_version_input_capability_asset_format_asset_forma~" FOREIGN KEY (asset_format_id) REFERENCES asset_format (id) ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20191119220428_ProcessorVersionInputCapabilityNullAssetFormat', '5.0.0');

COMMIT;

START TRANSACTION;

ALTER TABLE job DROP CONSTRAINT "FK_job_processor_type_processor_type_id";

DROP INDEX "IX_job_processor_type_id";

ALTER TABLE job DROP COLUMN processor_type_id;

ALTER TABLE job ADD processor_version_id bigint NOT NULL DEFAULT 0;

CREATE INDEX "IX_job_processor_version_id" ON job (processor_version_id);

ALTER TABLE job ADD CONSTRAINT "FK_job_processor_version_processor_version_id" FOREIGN KEY (processor_version_id) REFERENCES processor_version (id) ON DELETE CASCADE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20191119225211_JobProcessorVersion', '5.0.0');

COMMIT;

START TRANSACTION;

ALTER TABLE asset DROP CONSTRAINT "FK_asset_asset_format_asset_format_id";

ALTER TABLE asset DROP CONSTRAINT "FK_asset_asset_type_asset_type_id";

ALTER TABLE job DROP CONSTRAINT "FK_job_processor_version_processor_version_id";

ALTER TABLE processor_node DROP CONSTRAINT "FK_processor_node_processor_version_processor_version_id";

DROP TABLE processor_version_input_capability;

DROP TABLE asset_format;

DROP TABLE processor_version;

DROP TABLE processor_type;

DROP INDEX "IX_processor_node_processor_version_id";

DROP INDEX "IX_asset_asset_format_id";

ALTER TABLE asset DROP COLUMN asset_format_id;

ALTER TABLE job RENAME COLUMN processor_version_id TO job_type_id;

ALTER INDEX "IX_job_processor_version_id" RENAME TO "IX_job_job_type_id";

ALTER TABLE job ADD assigned_processor_node_id bigint NULL;

ALTER TABLE asset ALTER COLUMN store_key SET NOT NULL;
ALTER TABLE asset ALTER COLUMN store_key SET DEFAULT '';

ALTER TABLE asset ALTER COLUMN asset_type_id SET NOT NULL;
ALTER TABLE asset ALTER COLUMN asset_type_id SET DEFAULT 0;

ALTER TABLE asset ADD media_type text NOT NULL DEFAULT '';

CREATE TABLE job_type (
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    key text NOT NULL,
    name text NOT NULL,
    CONSTRAINT "PK_job_type" PRIMARY KEY (id)
);

CREATE TABLE setting (
    key text NOT NULL,
    value text NOT NULL,
    CONSTRAINT "PK_setting" PRIMARY KEY (key)
);

CREATE TABLE "user" (
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    name text NOT NULL,
    username text NOT NULL,
    password text NULL,
    salt text NULL,
    CONSTRAINT "PK_user" PRIMARY KEY (id)
);

CREATE TABLE processor_node_capability (
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    processor_node_id bigint NOT NULL,
    job_type_id bigint NOT NULL,
    asset_type_id bigint NULL,
    media_type text NOT NULL,
    CONSTRAINT "PK_processor_node_capability" PRIMARY KEY (id),
    CONSTRAINT "FK_processor_node_capability_asset_type_asset_type_id" FOREIGN KEY (asset_type_id) REFERENCES asset_type (id) ON DELETE RESTRICT,
    CONSTRAINT "FK_processor_node_capability_job_type_job_type_id" FOREIGN KEY (job_type_id) REFERENCES job_type (id) ON DELETE CASCADE,
    CONSTRAINT "FK_processor_node_capability_processor_node_processor_node_id" FOREIGN KEY (processor_node_id) REFERENCES processor_node (id) ON DELETE CASCADE
);

CREATE INDEX "IX_job_assigned_processor_node_id" ON job (assigned_processor_node_id);

CREATE INDEX "IX_processor_node_capability_asset_type_id" ON processor_node_capability (asset_type_id);

CREATE INDEX "IX_processor_node_capability_job_type_id" ON processor_node_capability (job_type_id);

CREATE INDEX "IX_processor_node_capability_processor_node_id" ON processor_node_capability (processor_node_id);

ALTER TABLE asset ADD CONSTRAINT "FK_asset_asset_type_asset_type_id" FOREIGN KEY (asset_type_id) REFERENCES asset_type (id) ON DELETE CASCADE;

ALTER TABLE job ADD CONSTRAINT "FK_job_job_type_job_type_id" FOREIGN KEY (job_type_id) REFERENCES job_type (id) ON DELETE CASCADE;

ALTER TABLE job ADD CONSTRAINT "FK_job_processor_node_assigned_processor_node_id" FOREIGN KEY (assigned_processor_node_id) REFERENCES processor_node (id) ON DELETE RESTRICT;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20201128124044_Delta2', '5.0.0');

COMMIT;
