# API response format

All JSON responses from this API follow a single contract unless a future endpoint explicitly documents an exception (for example `204 No Content` with an empty body).

Related: [Authentication](auth.md).

## Success (2xx)

Successful responses that return JSON use this envelope:

```json
{
  "message": "<short human-readable summary>",
  "data": {}
}
```

- **`message`** — Stable enough for logs or generic UI copy; not a substitute for i18n keys unless you add them later.
- **`data`** — Endpoint-specific payload (objects, arrays, primitives). For auth, this holds `token` and `user` (see [auth.md](auth.md)).

Use the **HTTP status** to distinguish outcomes (created vs OK); do not put errors inside a `200` body.

## Errors (4xx / 5xx)

Error responses use at least:

```json
{
  "message": "<error message>"
}
```

Optional fields:

| Field | When |
|-------|------|
| `code` | Present when the server attaches an application error code (`AppError`). |
| `errors` | Present on **400** validation failures (Zod `flatten()` shape) for field-level details. |

Example validation error (`400`):

```json
{
  "message": "Validation failed",
  "errors": {}
}
```

The `errors` object matches Zod’s `flatten()` output (`formErrors`, `fieldErrors`, etc.).

## HTTP status guidelines

Signal the result with the **status line**; the body carries details. Do not return `200 OK` with an error payload.

| Status | Use |
|--------|-----|
| **200 OK** | Success without creating a new resource URI (e.g. login, typical reads). |
| **201 Created** | A resource was created (e.g. register). Body still uses `{ message, data }`. |
| **204 No Content** | Success with no response body (e.g. some deletes). No JSON envelope. |
| **400 Bad Request** | Malformed input or validation failure. |
| **401 Unauthorized** | Missing or invalid authentication. |
| **403 Forbidden** | Authenticated but not allowed to perform the action. |
| **404 Not Found** | Resource does not exist. |
| **409 Conflict** | Request conflicts with current state (e.g. duplicate username). |
| **422 Unprocessable Entity** | Optional alternative to 400 for semantic validation; this project uses **400** with Zod for validation. |
| **500 Internal Server Error** | Unexpected failure; client sees a generic `message`; details are logged server-side. |

## Current coverage

As of this document, every implemented JSON route follows this contract (**authentication** only). New routes should use `sendSuccess` (or equivalent) and the global `errorHandler` for consistency.
