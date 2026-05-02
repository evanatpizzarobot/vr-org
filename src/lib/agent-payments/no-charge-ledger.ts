// In-memory rolling no-charge ledger for VR.org's local /api/payment/no-charge-stats.
//
// The authoritative network ledger lives on tensorfeed.ai (the federation
// host). VR.org also writes a local mirror so /api/payment/no-charge-stats
// returns instantly without a TF round-trip. Local copy resets on container
// restart; for the canonical view see tensorfeed.ai/api/payment/no-charge-stats.

import { tokenShort } from "./receipts";
import type { NoChargeReason } from "./types";

const MAX_EVENTS_PER_DAY = 200;

interface NoChargeEvent {
  at: string;
  reason: NonNullable<NoChargeReason>;
  endpoint: string;
  cost_skipped: number;
  token_short: string;
}

interface DayRollup {
  date: string;
  count: number;
  credits_skipped: number;
  by_reason: Record<string, number>;
  by_endpoint: Record<string, number>;
  events: NoChargeEvent[];
}

const ledger = new Map<string, DayRollup>();
const dateIndex: string[] = [];

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function logNoChargeEvent(
  reason: NonNullable<NoChargeReason>,
  endpoint: string,
  costSkipped: number,
  token: string,
): void {
  const date = todayUtc();
  let rollup = ledger.get(date);
  if (!rollup) {
    rollup = {
      date,
      count: 0,
      credits_skipped: 0,
      by_reason: {},
      by_endpoint: {},
      events: [],
    };
    ledger.set(date, rollup);
    dateIndex.unshift(date);
    while (dateIndex.length > 30) {
      const drop = dateIndex.pop();
      if (drop) ledger.delete(drop);
    }
  }
  rollup.count++;
  rollup.credits_skipped += costSkipped;
  rollup.by_reason[reason] = (rollup.by_reason[reason] || 0) + 1;
  rollup.by_endpoint[endpoint] = (rollup.by_endpoint[endpoint] || 0) + 1;
  rollup.events.unshift({
    at: new Date().toISOString(),
    reason,
    endpoint,
    cost_skipped: costSkipped,
    token_short: tokenShort(token),
  });
  if (rollup.events.length > MAX_EVENTS_PER_DAY) {
    rollup.events.length = MAX_EVENTS_PER_DAY;
  }
}

export function getRollup(date?: string): DayRollup | null {
  return ledger.get(date || todayUtc()) || null;
}

export function listDates(): string[] {
  return [...dateIndex];
}
