# Documentation

Project documentation that is not tied to a single package (the app [README](../README.md) and [server/README](../server/README.md) cover setup and stack).

## API specifications

HTTP contracts live under [`api-spec/`](api-spec/):

| Document | Description |
|----------|-------------|
| [api-spec/response-format.md](api-spec/response-format.md) | Global JSON envelopes for success and errors, plus HTTP status guidelines. |
| [api-spec/auth.md](api-spec/auth.md) | Authentication endpoints (`/api/auth/*`). |
| [api-spec/nodes.md](api-spec/nodes.md) | Node endpoints (`/api/nodes/*`). |

When you add new surface area, add a focused spec file under `api-spec/` and link it here.
