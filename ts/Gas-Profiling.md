Gas Profiling: Optimize ScVal serialization byte efficiency
Repo Avatar
OpSoll/noc-iq-contracts
Problem
Storing large outage metadata structs consumes excessive ledger write bytes, inflating transaction storage fees.

Proposed change
Refactor outage struct field types using compact integer representations (e.g. u32 timestamps instead of u128).

Acceptance criteria
Replaces redundant u128 timestamp fields with compact u64 Unix timestamps
Uses enum integer representations for severity and status flags
Reduces serialized byte size by at least 30%
Unit test measures byte size reduction
Metadata
Suggested labels: enhancement, smart-contracts
Affected contract or module: sla_calculator/src/payload_optimizer.rs
Dependencies: None


