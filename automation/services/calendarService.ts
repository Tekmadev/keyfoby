/**
 * Calendar service (Google Calendar via OAuth).
 *
 * Requirements:
 * - Prepare a calendarService module using Google OAuth.
 * - Do NOT auto-confirm bookings.
 * - Create tentative events only after approval.
 *
 * This file is intentionally a stub in this increment to keep the AI/intake
 * system safe, server-only, and human-in-the-loop.
 */

export type TentativeCalendarEvent = {
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  attendees?: Array<{ email: string }>;
};

export type CalendarAuthConfig = {
  /**
   * Future: store OAuth tokens for the owner/admin account.
   * For now, we only define the shape.
   */
  accessToken: string;
};

export async function createTentativeEvent(_args: {
  auth: CalendarAuthConfig;
  event: TentativeCalendarEvent;
}): Promise<{ ok: true; eventId: string } | { ok: false; error: string }> {
  return {
    ok: false,
    error:
      "Calendar integration not implemented yet. It will only create tentative events after explicit owner approval.",
  };
}

