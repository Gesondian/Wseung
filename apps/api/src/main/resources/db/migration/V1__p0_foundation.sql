create table if not exists lc_audit_log (
    id varchar(64) primary key,
    tenant_id varchar(64) not null,
    action varchar(128) not null,
    resource_type varchar(64) not null,
    resource_id varchar(128),
    result varchar(32) not null,
    operator_id varchar(64) not null,
    request_id varchar(128) not null,
    trace_id varchar(128) not null,
    occurred_at timestamp not null
);

create table if not exists lc_security_event (
    id varchar(64) primary key,
    tenant_id varchar(64) not null,
    event_type varchar(128) not null,
    principal varchar(128),
    description text,
    request_id varchar(128) not null,
    trace_id varchar(128) not null,
    occurred_at timestamp not null
);

create table if not exists lc_api_idempotency_key (
    idempotency_key varchar(128) primary key,
    tenant_id varchar(64) not null,
    request_hash varchar(128) not null,
    status varchar(32) not null,
    created_at timestamp not null,
    completed_at timestamp
);

create table if not exists lc_metadata_snapshot (
    id varchar(64) primary key,
    tenant_id varchar(64) not null,
    app_id varchar(64) not null,
    snapshot_json jsonb not null,
    created_at timestamp not null
);

create table if not exists lc_app_runtime_pointer (
    app_id varchar(64) primary key,
    tenant_id varchar(64) not null,
    snapshot_id varchar(64) not null,
    app_version_id varchar(64) not null,
    updated_at timestamp not null
);

create table if not exists lc_business_record (
    id varchar(64) primary key,
    tenant_id varchar(64) not null,
    app_id varchar(64) not null,
    entity_key varchar(128) not null,
    snapshot_id varchar(64) not null,
    record_version bigint not null,
    business_status varchar(64) not null,
    workflow_status varchar(64),
    data_json jsonb not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table if not exists lc_workflow_task (
    id varchar(64) primary key,
    tenant_id varchar(64) not null,
    app_id varchar(64) not null,
    entity_key varchar(128) not null,
    record_id varchar(64) not null,
    workflow_instance_id varchar(64) not null,
    snapshot_id varchar(64) not null,
    task_name varchar(128) not null,
    task_version bigint not null,
    assignee_id varchar(64) not null,
    applicant_id varchar(64) not null,
    status varchar(32) not null,
    summary varchar(512),
    idempotency_key varchar(128) not null,
    created_at timestamp not null,
    completed_at timestamp,
    unique (tenant_id, idempotency_key)
);
