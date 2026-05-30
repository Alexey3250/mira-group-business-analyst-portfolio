# Requirements

## Stakeholders

| Stakeholder | Primary Interest | Example Questions |
| --- | --- | --- |
| Business leadership | Performance visibility and decision support | Are opportunities progressing quickly enough? |
| Sales management | Pipeline quality and conversion | Which sources and teams convert best? |
| Client service team | Follow-up quality and workload | Which clients need attention today? |
| Business analyst | Requirements, data quality, and reporting logic | What data is needed and how should metrics be defined? |
| Operations or IT | Feasibility, governance, and maintainability | Can this be supported with available systems? |

## Business Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-001 | Provide a single view of enquiries, opportunities, proposals, and outcomes. | High |
| BR-002 | Track response and follow-up time against agreed service targets. | High |
| BR-003 | Identify bottlenecks by pipeline stage, owner, and source. | High |
| BR-004 | Show weekly management KPIs with clear definitions and filters. | High |
| BR-005 | Highlight records with missing or inconsistent data. | Medium |
| BR-006 | Support exportable summary views for management updates. | Medium |

## Functional Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-001 | Dashboard filters must include date range, source, owner, and pipeline stage. | User can apply each filter independently and in combination. |
| FR-002 | KPI cards must show current value and previous-period comparison. | Each KPI has a current value and comparison period label. |
| FR-003 | Pipeline view must show count and value by stage. | Each stage displays opportunity count and estimated value. |
| FR-004 | Follow-up report must list overdue client actions. | Report includes owner, client, due date, and status. |
| FR-005 | Data quality view must flag incomplete required fields. | Missing owner, source, stage, or next action is visible. |

## Non-Functional Requirements

| ID | Requirement | Rationale |
| --- | --- | --- |
| NFR-001 | KPI definitions must be documented beside the dashboard specification. | Prevents inconsistent interpretation. |
| NFR-002 | Data refresh assumptions must be stated clearly. | Sets expectations for operational use. |
| NFR-003 | Reports should be readable on a laptop screen without horizontal scrolling. | Supports management review meetings. |
| NFR-004 | No private or confidential data should be committed to the repository. | Protects privacy and professionalism. |

## Open Questions

- Which system is the source of truth for enquiry and opportunity records?
- Are sales stages standardized across all teams?
- What is the expected response-time target?
- Should performance be reviewed daily, weekly, or monthly?
- Which KPIs should be visible to leadership versus operational teams?
