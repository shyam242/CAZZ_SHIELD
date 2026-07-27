"""
CAZZ SHIELD — Hash Chain Utility
Merkle-style append-only log for tamper-detectable audit records
"""
import hashlib
import json
from datetime import datetime


def compute_record_hash(
    event_id: str,
    agent_id: str,
    action: str,
    decision: str,
    timestamp: str,
    prev_hash: str,
) -> str:
    """Compute SHA-256 hash for an audit record, chained to previous record."""
    record_data = f"{event_id}|{agent_id}|{action}|{decision}|{timestamp}|{prev_hash}"
    return hashlib.sha256(record_data.encode("utf-8")).hexdigest()


def verify_chain_integrity(records: list[dict]) -> tuple[bool, list[str]]:
    """Verify the integrity of a chain of audit records.
    Returns (is_valid, list_of_errors).
    """
    errors = []
    for i, record in enumerate(records):
        expected_hash = compute_record_hash(
            event_id=record["event_id"],
            agent_id=record["agent_id"],
            action=record["action"],
            decision=record["decision"],
            timestamp=record["timestamp"],
            prev_hash=record["prev_hash"],
        )
        if record["record_hash"] != expected_hash:
            errors.append(
                f"Record {record['event_id']} at position {i}: hash mismatch "
                f"(expected {expected_hash[:16]}..., got {record['record_hash'][:16]}...)"
            )
        if i > 0 and record["prev_hash"] != records[i - 1]["record_hash"]:
            errors.append(
                f"Record {record['event_id']} at position {i}: chain break "
                f"(prev_hash does not match previous record's hash)"
            )
    return len(errors) == 0, errors


GENESIS_HASH = "0" * 64
