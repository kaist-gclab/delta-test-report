DELETE FROM processor_node_status;
DELETE FROM processor_version_input_capability;
DELETE FROM asset WHERE asset.parent_job_execution_id IS NOT NULL;
DELETE FROM job_execution_status;
DELETE FROM job_execution;
DELETE FROM job;
DELETE FROM processor_node;
DELETE FROM processor_version;
DELETE FROM processor_type;
DELETE FROM asset;
DELETE FROM asset_format;
DELETE FROM asset_type;