import {
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
  NodeConnectionType,
} from "n8n-workflow";

export class FinlightWebhookTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: "finlight Webhook Trigger",
    name: "finlightWebhookTrigger",
    group: ["trigger"],
    version: 1,
    description: "Triggers on new webhook events from finlight",
    defaults: {
      name: "finlight Webhook Trigger",
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "finlightApi",
        required: true,
        displayOptions: {
          show: {
            authentication: ["apiKey"],
          },
        },
      },
      {
        name: "httpBasicAuth",
        required: true,
        displayOptions: {
          show: {
            authentication: ["basicAuth"],
          },
        },
      },
    ],
    properties: [
      {
        displayName: "Authentication Method",
        name: "authentication",
        type: "options",
        options: [
          { name: "API Key Header (x-finlight-key)", value: "apiKey" },
          { name: "Basic Auth", value: "basicAuth" },
          { name: "None", value: "none" },
        ],
        default: "apiKey",
      },
    ],
    webhooks: [
      {
        name: "default",
        httpMethod: "POST",
        responseMode: "onReceived",
        path: "finlight",
      },
    ],
    documentationUrl: "https://docs.finlight.me",
    icon: "file:../finlight.svg",
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const headers = req.headers;
    const body = req.body;
    const rawBody = this.getBodyData() as unknown as string; // raw JSON string, not parsed

    const authMethod = this.getNodeParameter("authentication", "") as string;

    // Auth: API Key Header
    if (authMethod === "apiKey") {
      const expectedKey = this.getNodeParameter("apiKey", "") as string;
      const receivedKey = headers["x-finlight-key"] as string;
      if (!receivedKey || receivedKey !== expectedKey) {
        throw new Error("Unauthorized: Invalid API key");
      }
    }

    // Auth: Basic
    if (authMethod === "basicAuth") {
      const credentials = await this.getCredentials("httpBasicAuth");
      const authHeader = headers["authorization"];
      const expected = "Basic " + Buffer.from(`${credentials.user}:${credentials.password}`).toString("base64");
      if (authHeader !== expected) {
        throw new Error("Unauthorized: Invalid Basic Auth");
      }
    }

    // Build clean output with optional fields
    const payload = body as Partial<{
      link: string;
      source: string;
      title: string;
      publishDate: string;
      language: string;
      summary?: string;
      content?: string;
      sentiment?: string;
      confidence?: string;
      images?: string[];
      companies?: any[];
    }>;

    const output: Record<string, any> = {
      link: payload.link,
      source: payload.source,
      title: payload.title,
      publishDate: payload.publishDate,
      language: payload.language,
    };

    if (payload.summary) output.summary = payload.summary;
    if (payload.content) output.content = payload.content;
    if (payload.sentiment) output.sentiment = payload.sentiment;
    if (payload.confidence) output.confidence = payload.confidence;
    if (payload.images?.length) output.images = payload.images;
    if (payload.companies?.length) output.companies = payload.companies;

    return {
      workflowData: [[{ json: output }]],
    };
  }

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        return true;
      },
    },
  };
}
