# KeyFoby Automation API (Intake + Owner Review)

This document describes the API endpoints that power the **AI-assisted customer intake** system.

## Principles (non-negotiable)

- **Server-only AI**: OpenAI is only called from server code.
- **Human-in-the-loop**: The system produces recommendations + drafts only. **No email is sent** and **no booking is created** without explicit owner approval.
- **Separation of concerns**: AI/automation logic lives under `automation/`.

## Environment variables

- `OPENAI_API_KEY` (required server-side to generate AI email drafts; pipeline falls back to a template if missing)
- `OPENAI_MODEL` (optional, default: `gpt-4o-mini`)
- `AUTOMATION_OWNER_TOKEN` (required to access **owner-only** endpoints below)

## Authentication (owner-only)

Owner endpoints require:

- Header: `Authorization: Bearer <AUTOMATION_OWNER_TOKEN>`

If `AUTOMATION_OWNER_TOKEN` is not set, owner endpoints return `501`.

## Public endpoint (called by the website contact form)

### `POST /api/intake/`

Accepts a structured payload and runs the server-side automation pipeline:

- service feasibility check (catalog-based)
- urgency classification (heuristic today; can be AI later)
- same-day eligibility suggestion (recommendation only)
- pricing readiness evaluation (no quoting)
- AI draft email generation (or fallback draft)

The response intentionally **does not** return AI output to the public client.

#### Request body

```json
{
  "ignitionType": "Key Start",
  "vehicleYear": "2018",
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry",
  "serviceRequested": "Program",
  "customerMessage": "Lost my keys, need help today.",
  "customerEmail": "customer@example.com",
  "customerPhone": "(416) 123-4567",
  "customerName": "Alex"
}
```

#### Success response

```json
{
  "ok": true,
  "intakeId": "8c1c7a1d-8b5a-4f7a-9b61-4a2cfd0d5a7c",
  "status": "received"
}
```

#### Errors

- `400`: missing required fields
- `500`: unexpected server error

## Owner endpoints (for internal admin tools)

These endpoints are designed so you can build **one intake review screen** for internal admin tools.

### `GET /api/intake/?limit=20`

Returns a lightweight list of recent intakes (summary fields only).

#### Success response

```json
{
  "ok": true,
  "items": [
    {
      "id": "8c1c7a1d-8b5a-4f7a-9b61-4a2cfd0d5a7c",
      "createdAtIso": "2026-01-15T20:00:00.000Z",
      "serviceRequested": "Program",
      "customerEmail": "customer@example.com",
      "customerPhone": "(416) 123-4567",
      "urgency": "high",
      "feasibility": "supported",
      "qualifiesForSameDay": true
    }
  ]
}
```

### `GET /api/intake/:id`

Returns the **full stored intake output** (including AI draft email and decision reasons).

#### Success response

```json
{
  "ok": true,
  "item": {
    "id": "8c1c7a1d-8b5a-4f7a-9b61-4a2cfd0d5a7c",
    "output": {
      "createdAtIso": "2026-01-15T20:00:00.000Z",
      "intake": {
        "customerEmail": "...",
        "customerPhone": "...",
        "serviceRequested": "...",
        "...": "..."
      },
      "decision": {
        "feasibility": "supported",
        "urgency": "high",
        "qualifiesForSameDay": true,
        "requiresHumanApproval": true,
        "reasons": [],
        "missingInfo": []
      },
      "pricing": { "canAutoPriceLater": false, "reason": "..." },
      "draftEmail": { "subject": "...", "bodyText": "...", "intentNotes": [] }
    }
  }
}
```

## Approval flow (planned, not implemented yet)

When you add the owner approval workflow, the recommended API shape is:

- `POST /api/intake/:id/approve`
  - owner supplies/edit:
    - approved email subject/body
    - approved price (optional)
    - approved date/time (optional)
  - server then:
    - sends the email (EmailJS or a server email provider later)
    - optionally creates a **tentative** Google Calendar event

Nothing should be sent/booked without this approval step.

## Notes on storage

Current implementation stores intake outputs **in-memory** (dev-friendly, not durable).
For production and multi-device access, move storage to a database table (Supabase/Firebase/etc).
