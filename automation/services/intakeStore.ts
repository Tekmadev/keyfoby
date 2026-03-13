import type { IntakeAutomationOutput } from "../types/decision";

/**
 * Minimal internal store for AI outputs.
 *
 * IMPORTANT:
 * - This is *not* durable storage.
 * - It exists so we can fulfill "save internally" without adding DB work yet.
 * - Replace with Supabase/Firebase/DB table when you build the owner dashboard.
 */

export type StoredIntake = {
  id: string;
  output: IntakeAutomationOutput;
};

export type IntakeStore = {
  put: (output: IntakeAutomationOutput) => StoredIntake;
  get: (id: string) => StoredIntake | undefined;
  listRecent: (limit: number) => StoredIntake[];
};

function createInMemoryStore(): IntakeStore {
  const items = new Map<string, StoredIntake>();
  const order: string[] = [];

  const put: IntakeStore["put"] = (output) => {
    const id = crypto.randomUUID();
    const stored: StoredIntake = { id, output };
    items.set(id, stored);
    order.unshift(id);
    // keep memory bounded
    if (order.length > 500) {
      const toDelete = order.pop();
      if (toDelete) items.delete(toDelete);
    }
    return stored;
  };

  return {
    put,
    get: (id) => items.get(id),
    listRecent: (limit) => order.slice(0, limit).map((id) => items.get(id)!).filter(Boolean),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __keyfobyIntakeStore: IntakeStore | undefined;
}

export function getIntakeStore(): IntakeStore {
  // Persist across hot reload in dev.
  if (!globalThis.__keyfobyIntakeStore) {
    globalThis.__keyfobyIntakeStore = createInMemoryStore();
  }
  return globalThis.__keyfobyIntakeStore;
}

