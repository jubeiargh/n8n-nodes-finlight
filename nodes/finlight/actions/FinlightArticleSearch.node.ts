import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionTypes } from "n8n-workflow";

export class FinlightArticleSearch implements INodeType {
  description: INodeTypeDescription = {
    displayName: "finlight Article Search",
    name: "finlightArticleSearch",
    group: ["transform"],
    version: 1,
    description: "Search articles using the finlight REST API",
    defaults: {
      name: "finlight Article Search",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    icon: "file:../finlight.svg",
    credentials: [{ name: "finlightApi", required: true }],
    properties: [
      // ---- Operation ----
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: [
          {
            name: "Search Articles",
            value: "search",
            description: "Search articles using the finlight REST API",
            action: "Search articles",
          },
        ],
        default: "search",
      },

      // ---- All optional inputs grouped ----
      {
        displayName: "Additional Options",
        name: "additionalOptions",
        type: "collection",
        placeholder: "Add option",
        default: {},
        options: [
          {
            displayName: "Query",
            name: "query",
            type: "string",
            default: "",
            placeholder: "earnings OR guidance AND (NVIDIA OR ticker:NVDA)",
            description: "Full-text query to filter articles",
          },
          {
            displayName: "From (ISO date)",
            name: "from",
            type: "string",
            default: "",
            description: "Start of date range, e.g. 2025-09-01T00:00:00Z",
          },
          {
            displayName: "To (ISO date)",
            name: "to",
            type: "string",
            default: "",
            description: "End of date range, e.g. 2025-09-06T23:59:59Z",
          },
          {
            displayName: "Sources",
            name: "sources",
            type: "fixedCollection",
            placeholder: "Add Source",
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: "sourceList",
                displayName: "Source List",
                values: [
                  {
                    displayName: "Source",
                    name: "source",
                    type: "string",
                    default: "",
                    placeholder: "reuters.com",
                  },
                ],
              },
            ],
          },
          {
            displayName: "Exclude Sources",
            name: "excludeSources",
            type: "fixedCollection",
            placeholder: "Exclude Source",
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: "sourceList",
                displayName: "Source List",
                values: [
                  {
                    displayName: "Source",
                    name: "source",
                    type: "string",
                    default: "",
                    placeholder: "example.com",
                  },
                ],
              },
            ],
          },
          {
            displayName: "Tickers",
            name: "tickers",
            type: "fixedCollection",
            placeholder: "Add Ticker",
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: "tickerList",
                displayName: "Ticker List",
                values: [
                  {
                    displayName: "Ticker",
                    name: "ticker",
                    type: "string",
                    default: "",
                    placeholder: "AAPL",
                  },
                ],
              },
            ],
          },
          {
            displayName: "Language",
            name: "language",
            type: "string",
            default: "en",
          },
          {
            displayName: "Order",
            name: "order",
            type: "options",
            options: [
              { name: "DESC", value: "DESC" },
              { name: "ASC", value: "ASC" },
            ],
            default: "DESC",
          },
          {
            displayName: "Page Size",
            name: "pageSize",
            type: "number",
            default: 20,
            typeOptions: { minValue: 1, maxValue: 100 },
          },
          {
            displayName: "Page",
            name: "page",
            type: "number",
            default: 1,
            typeOptions: { minValue: 1 },
          },
          {
            displayName: "Include Content",
            name: "includeContent",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Include Entities",
            name: "includeEntities",
            type: "boolean",
            default: false,
          },
          {
            displayName: "Exclude Empty Content",
            name: "excludeEmptyContent",
            type: "boolean",
            default: false,
          },
        ],
        displayOptions: {
          show: { operation: ["search"] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData: any[] = [];
    const apiKey = (await this.getCredentials("finlightApi")) as { apiKey: string };

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string;

      if (operation !== "search") {
        throw new Error(`Unknown operation: ${operation}`);
      }

      // Build the body from optional collection only
      const additional = (this.getNodeParameter("additionalOptions", i, {}) || {}) as Record<string, any>;

      const body: Record<string, any> = {};

      if (additional.query) body.query = additional.query as string;
      if (additional.from) body.from = additional.from as string;
      if (additional.to) body.to = additional.to as string;

      const sourcesRaw = (additional.sources?.sourceList as Array<{ source: string }>) || [];
      if (sourcesRaw.length) body.sources = sourcesRaw.map(s => s.source);

      const excludeSourcesRaw = (additional.excludeSources?.sourceList as Array<{ source: string }>) || [];
      if (excludeSourcesRaw.length) body.excludeSources = excludeSourcesRaw.map(s => s.source);

      const tickersRaw = (additional.tickers?.tickerList as Array<{ ticker: string }>) || [];
      if (tickersRaw.length) body.tickers = tickersRaw.map(t => t.ticker);

      // Defaults if not provided (harmless if user leaves everything empty)
      body.language = additional.language !== undefined ? (additional.language as string) : "en";
      body.order = additional.order !== undefined ? (additional.order as string) : "DESC";
      body.pageSize = additional.pageSize !== undefined ? Number(additional.pageSize) : 20;
      body.page = additional.page !== undefined ? Number(additional.page) : 1;

      if (typeof additional.includeContent === "boolean") body.includeContent = additional.includeContent;
      else body.includeContent = false;

      if (typeof additional.includeEntities === "boolean") body.includeEntities = additional.includeEntities;
      else body.includeEntities = false;

      if (typeof additional.excludeEmptyContent === "boolean")
        body.excludeEmptyContent = additional.excludeEmptyContent;
      else body.excludeEmptyContent = false;

      const response = await this.helpers.httpRequest({
        method: "POST",
        url: "https://api.finlight.me/v2/articles",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.apiKey,
        },
        body,
        json: true,
      });

      returnData.push(...(Array.isArray(response?.articles) ? response.articles : [response]));
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
