# n8n-nodes-finlight

Official n8n integration for [finlight](https://finlight.me) — a financial news and data API platform for real-time geopolitical and market intelligence.

## Features

✅ Webhook trigger with signature validation  
✅ Basic Auth or API Key support  
✅ News article API integration (coming soon)  
✅ Typed output for easier downstream workflows

## Usage

1. Register your n8n webhook URL in the finlight dashboard.
2. Use the `finlight Webhook Trigger` node in your flow.

## Development

```bash
npm install
npm run build
```

```bash
docker volume create n8n_data

docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v ./data/finlight:/data/custom \
  -e N8N_CUSTOM_EXTENSIONS="/data/custom" \
  n8nio/n8n
```
