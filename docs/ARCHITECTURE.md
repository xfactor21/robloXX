# robloXX architecture

## Product surfaces

### Web Studio

Owns discovery, outfit planning, acquisition guidance, creator tools, saved looks, and account settings.

### Server boundary

Will own OAuth code exchange, refresh and revocation, session security, normalized Roblox responses, rate limiting, signed companion handoffs, audit events, and data deletion.

### Roblox companion experience

Will provide the authoritative Roblox-native preview and user-approved purchase, claim, save, and apply actions using supported Roblox services.

## Integration truth states

| State | Meaning |
| --- | --- |
| Implemented | Source exists and local checks pass |
| Deployed | A release is serving from the selected host |
| Verified | The live behavior was independently exercised |
| External | Roblox or another provider still controls approval or execution |

## Security rules

- Never collect a Roblox password.
- Use OAuth authorization code flow with minimum scopes.
- Keep access and refresh tokens server-side.
- Do not put tokens in URLs, local storage, analytics, or client logs.
- Sign short-lived web-to-companion payloads and reject replay or tampering.
- Treat ownership as unknown unless Roblox provides authoritative evidence.
- Collect the minimum child/account data needed and provide deletion/disconnect controls.

## Data model preparation

- `users`
- `oauth_connections`
- `saved_looks`
- `look_items`
- `catalog_cache`
- `handoff_sessions`
- `product_entitlements`
- `audit_events`

No database is connected in v0.1. Local demo state is stored only in the browser.
