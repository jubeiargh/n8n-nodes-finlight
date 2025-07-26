# @finlight/n8n-nodes-finlight

**Official n8n integration for [finlight](https://finlight.me)** — a real-time news and finance API for geopolitics, markets, and macro headlines.

This package adds native nodes to [n8n](https://n8n.io) to let you consume and query finlight data inside your automated workflows.

---

## ✨ Features

- ✅ `finlight Webhook Trigger` — Listen to live streaming events
- ✅ `finlight Article Search` — Query articles via REST API with flexible filters
- 🔐 Supports API Key and Basic Auth

---

## 🚀 Installation

If you're using a self-hosted n8n instance:

```bash
npm install @finlight/n8n-nodes-finlight
````

Then set the custom extension path in your environment or config:

```env
N8N_CUSTOM_EXTENSIONS=/path/to/node_modules/@finlight/n8n-nodes-finlight
```

Restart n8n and you'll see the `finlight` nodes available in the editor.

---

## 🧪 Included Nodes

### 🔔 `finlight Webhook Trigger`

Listen to webhook events sent from finlight (e.g. breaking news, alerts, geopolitical headlines).

**Manual webhook registration is required.**

You can create webhooks in your account at:
🔧 [app.finlight.me](https://app.finlight.me)

Authentication options:

* `x-finlight-key` header
* Basic Auth

---

### 📡 `finlight Article Search`

Fetch news articles from the finlight `/v2/articles` REST API using a flexible set of parameters:

* `query`
* `sources` (array)
* `excludeSources` (array)
* `tickers` (array)
* `from`, `to`, `language`, `order`, `page`, `pageSize`
* `includeContent`, `includeEntities`, `excludeEmptyContent`

See full API reference at:
📚 [docs.finlight.me](https://docs.finlight.me)

---

## 📦 Development

Clone the repo and build:

```bash
npm install
npm run build
```

To test with your local n8n instance:

```bash
export N8N_CUSTOM_EXTENSIONS=/absolute/path/to/dist
n8n start
```

Or map `dist/` into Docker if using a container setup.

---

## 📘 License

[MIT](./LICENSE) – by [finlight](https://finlight.me)