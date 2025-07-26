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
    credentials: [
      {
        name: "finlightApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Query",
        name: "query",
        type: "string",
        required: false,
        default: "",
      },
      {
        displayName: "Sources",
        name: "sources",
        type: "fixedCollection",
        placeholder: "Add Source",
        default: {},
        typeOptions: {
          multipleValues: true,
        },
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
        typeOptions: {
          multipleValues: true,
        },
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
              },
            ],
          },
        ],
      },
      {
        displayName: "From (ISO date)",
        name: "from",
        type: "string",
        default: "",
      },
      {
        displayName: "To (ISO date)",
        name: "to",
        type: "string",
        default: "",
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
      {
        displayName: "Tickers",
        name: "tickers",
        type: "fixedCollection",
        placeholder: "Add Ticker",
        default: {},
        typeOptions: {
          multipleValues: true,
        },
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
              },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    const apiKey = (await this.getCredentials("finlightApi")) as { apiKey: string };

    for (let i = 0; i < items.length; i++) {
      const body: Record<string, any> = {};

      const query = this.getNodeParameter("query", i) as string;
      if (query) body.query = query;

      const from = this.getNodeParameter("from", i) as string;
      if (from) body.from = from;

      const to = this.getNodeParameter("to", i) as string;
      if (to) body.to = to;

      const sourcesRaw = this.getNodeParameter("sources.sourceList", i, []) as Array<{ source: string }>;
      if (sourcesRaw.length) {
        body.sources = sourcesRaw.map(s => s.source);
      }

      const excludeSourcesRaw = this.getNodeParameter("excludeSources.sourceList", i, []) as Array<{ source: string }>;
      if (excludeSourcesRaw.length) {
        body.excludeSources = excludeSourcesRaw.map(s => s.source);
      }

      const tickersRaw = this.getNodeParameter("tickers.tickerList", i, []) as Array<{ ticker: string }>;
      if (tickersRaw.length) {
        body.tickers = tickersRaw.map(t => t.ticker);
      }

      body.language = this.getNodeParameter("language", i) as string;
      body.order = this.getNodeParameter("order", i) as string;
      body.pageSize = this.getNodeParameter("pageSize", i) as number;
      body.page = this.getNodeParameter("page", i) as number;
      body.includeContent = this.getNodeParameter("includeContent", i) as boolean;
      body.includeEntities = this.getNodeParameter("includeEntities", i) as boolean;
      body.excludeEmptyContent = this.getNodeParameter("excludeEmptyContent", i) as boolean;

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

      returnData.push(...(Array.isArray(response.articles) ? response.articles : [response]));
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
