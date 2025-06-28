# Multi-Event Route Documentation

## Overview

The new `/events` route allows you to send multiple types of events in a single request, making it more efficient than sending separate requests for each event type. Currently supported event types are:

- **Clicks**: Regular user clicks
- **Rage Clicks**: Multiple rapid clicks on the same element (indicates user frustration)

## API Endpoint

```
POST /events
```

## Request Format

```json
{
  "trackingId": "string",
  "path": "string",
  "browser": "string",
  "device": "string",
  "events": [
    {
      "type": "click|rage_click",
      "timestamp": "ISO-8601 string"
      // ... event-specific fields
    }
  ]
}
```

## Event Types

### Click Events

```json
{
  "type": "click",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "selector": "button.submit-btn",
  "erx": 0.5,
  "ery": 0.3
}
```

**Fields:**

- `type`: Must be `"click"`
- `timestamp`: ISO-8601 timestamp
- `selector`: CSS selector for the clicked element
- `erx`: Relative X position within the element (0-1)
- `ery`: Relative Y position within the element (0-1)

### Rage Click Events

```json
{
  "type": "rage_click",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "selector": "button.broken-btn",
  "erx": 0.5,
  "ery": 0.5
}
```

**Fields:**

- `type`: Must be `"rage_click"`
- `timestamp`: ISO-8601 timestamp
- `selector`: CSS selector for the clicked element
- `erx`: Relative X position within the element (0-1)
- `ery`: Relative Y position within the element (0-1)

## Response Format

### Success Response

```json
{
  "success": true,
  "processed": {
    "clicks": 2,
    "rageClicks": 1
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Example Usage

### JavaScript Frontend

```javascript
const events = [];

// Collect click events
document.addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  const erx = (e.pageX - rect.left) / rect.width;
  const ery = (e.pageY - rect.top) / rect.height;

  events.push({
    type: "click",
    timestamp: new Date().toISOString(),
    selector: getUniqueSelector(e.target),
    erx,
    ery,
  });
});

// Detect rage clicks
let clickCount = 0;
let lastClickTime = 0;
const RAGE_CLICK_THRESHOLD = 3;
const RAGE_CLICK_WINDOW = 2000;

document.addEventListener("click", (e) => {
  const now = Date.now();
  if (now - lastClickTime < RAGE_CLICK_WINDOW) {
    clickCount++;

    if (clickCount >= RAGE_CLICK_THRESHOLD) {
      const rect = e.target.getBoundingClientRect();
      const erx = (e.pageX - rect.left) / rect.width;
      const ery = (e.pageY - rect.top) / rect.height;

      events.push({
        type: "rage_click",
        timestamp: new Date().toISOString(),
        selector: getUniqueSelector(e.target),
        erx,
        ery,
      });
    }
  } else {
    clickCount = 1;
  }
  lastClickTime = now;
});

// Send events periodically
setInterval(() => {
  if (events.length > 0) {
    fetch("/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackingId: "your-tracking-id",
        path: window.location.pathname,
        browser: navigator.userAgent,
        device: "desktop",
        events: events.splice(0), // Send and clear events
      }),
    });
  }
}, 5000);
```

### cURL Example

```bash
curl -X POST http://localhost:8787/events \
  -H "Content-Type: application/json" \
  -d '{
    "trackingId": "test-tracking-id",
    "path": "/test-page",
    "browser": "Chrome",
    "device": "desktop",
    "events": [
      {
        "type": "click",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "selector": "button.submit-btn",
        "erx": 0.5,
        "ery": 0.3
      },
      {
        "type": "rage_click",
        "timestamp": "2024-01-15T10:30:05.000Z",
        "selector": "button.broken-btn",
        "erx": 0.5,
        "ery": 0.5,
      }
    ]
  }'
```

## Database Schema

### Clicks Table (`raw_clicks`)

- `snapshot_id`: UUID
- `tracking_id`: String
- `path`: String
- `device`: String
- `selector`: String
- `erx`: Float
- `ery`: Float
- `browser`: String
- `inserted_at`: DateTime

### Rage Clicks Table (`rage_raw_clicks`)

- `snapshot_id`: UUID
- `tracking_id`: String
- `path`: String
- `device`: String
- `selector`: String
- `erx`: Float
- `ery`: Float
- `browser`: String
- `inserted_at`: DateTime

## Performance Considerations

- Events are processed in batches by type for optimal performance
- Each event type is inserted into its respective ClickHouse table
- The route maintains backward compatibility with the existing `/click` endpoint
- Performance metrics are tracked for each processing step

## Future Event Types

The architecture is designed to easily support additional event types:

- **Scroll Depth**: Track how far users scroll on pages
- **Page Views**: Track page view duration and bounce rates
- **Form Interactions**: Track form field interactions
- **Error Events**: Track JavaScript errors and failed requests

To add a new event type:

1. Add the type definition to `types/clickhouse.ts`
2. Add the insertion method to `services/clickhouse.ts`
3. Add the processing logic to the `/events` route
4. Update the database schema if needed
