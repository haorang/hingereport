# Hinge Report

Frontend-only app to process and visualize Hinge personal data.

Live at: [hingereport.com](https://hingereport.com)

## Development

```bash
cd frontend
npm install
npm run dev
```

## matches.json Format

List of interactions, one per person which can have:

- **`match`**: You matched with someone
  - `timestamp`: Time of match

- **`like`**: You sent a like
  - `timestamp`: Time of like sent
  - `like`:
    - `timestamp`: Same as time above
    - `comment`: Message you sent with like

- **`chats`**: Messages you sent
  - `body`: The message
  - `timestamp`: Time of sent message

- **`block`**: You unmatch or X out an incoming like
  - `block_type`: Usually is "remove"
  - `timestamp`: Timestamp of removal of match or incoming like

- **`voice_notes`**: Voice notes you sent
  - `url`: URL to recording (can only see if authenticated)
  - `timestamp`: Timestamp of sent note
