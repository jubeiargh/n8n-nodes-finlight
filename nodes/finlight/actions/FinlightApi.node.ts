import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionTypes } from 'n8n-workflow';

export class FinlightApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'finlight',
    name: 'finlight',
    group: ['transform'],
    version: 1,
    description: 'Interact with the finlight REST API',
    defaults: {
      name: 'finlight',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    icon: 'file:../finlight.svg',
    credentials: [{ name: 'finlightApi', required: true }],
    properties: [
      // ---- Operation ----
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Search Articles',
            value: 'search',
            description: 'Search articles using the finlight REST API',
            action: 'Search articles',
          },
          {
            name: 'Get Article by Link',
            value: 'getByLink',
            description: 'Get a specific article by its URL',
            action: 'Get article by link',
          },
          {
            name: 'List Sources',
            value: 'listSources',
            description: 'Get all available news sources',
            action: 'List sources',
          },
        ],
        default: 'search',
      },

      // ---- Get by Link params ----
      {
        displayName: 'Article Link',
        name: 'link',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'https://www.reuters.com/article/...',
        description: 'The URL of the article to retrieve',
        displayOptions: {
          show: { operation: ['getByLink'] },
        },
      },
      {
        displayName: 'Include Content',
        name: 'getByLinkIncludeContent',
        type: 'boolean',
        default: false,
        description: 'Requires a Legacy subscription',
        displayOptions: {
          show: { operation: ['getByLink'] },
        },
      },
      {
        displayName: 'Include Entities',
        name: 'getByLinkIncludeEntities',
        type: 'boolean',
        default: false,
        description: 'Whether to include company entity tagging',
        displayOptions: {
          show: { operation: ['getByLink'] },
        },
      },

      // ---- Search: All optional inputs grouped ----
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
          {
            displayName: 'Query',
            name: 'query',
            type: 'string',
            default: '',
            placeholder: 'earnings OR guidance AND (NVIDIA OR ticker:NVDA)',
            description: 'Full-text query to filter articles',
          },
          {
            displayName: 'From (ISO date)',
            name: 'from',
            type: 'string',
            default: '',
            description: 'Start of date range, e.g. 2025-09-01T00:00:00Z',
          },
          {
            displayName: 'To (ISO date)',
            name: 'to',
            type: 'string',
            default: '',
            description: 'End of date range, e.g. 2025-09-06T23:59:59Z',
          },
          {
            displayName: 'Sources',
            name: 'sources',
            type: 'fixedCollection',
            placeholder: 'Add Source',
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: 'sourceList',
                displayName: 'Source List',
                values: [
                  {
                    displayName: 'Source',
                    name: 'source',
                    type: 'string',
                    default: '',
                    placeholder: 'reuters.com',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Exclude Sources',
            name: 'excludeSources',
            type: 'fixedCollection',
            placeholder: 'Exclude Source',
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: 'sourceList',
                displayName: 'Source List',
                values: [
                  {
                    displayName: 'Source',
                    name: 'source',
                    type: 'string',
                    default: '',
                    placeholder: 'example.com',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Opt-In Sources',
            name: 'optInSources',
            type: 'fixedCollection',
            placeholder: 'Add Opt-In Source',
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: 'sourceList',
                displayName: 'Source List',
                values: [
                  {
                    displayName: 'Source',
                    name: 'source',
                    type: 'string',
                    default: '',
                    placeholder: 'example.com',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Tickers',
            name: 'tickers',
            type: 'fixedCollection',
            placeholder: 'Add Ticker',
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: 'tickerList',
                displayName: 'Ticker List',
                values: [
                  {
                    displayName: 'Ticker',
                    name: 'ticker',
                    type: 'string',
                    default: '',
                    placeholder: 'AAPL',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Countries',
            name: 'countries',
            type: 'fixedCollection',
            placeholder: 'Add Country',
            default: {},
            typeOptions: { multipleValues: true },
            options: [
              {
                name: 'countryList',
                displayName: 'Country List',
                values: [
                  {
                    displayName: 'Country Code (ISO 3166-1 Alpha-2)',
                    name: 'country',
                    type: 'string',
                    default: '',
                    placeholder: 'US',
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Categories',
            name: 'categories',
            type: 'multiOptions',
            options: [
              { name: 'Markets', value: 'markets' },
              { name: 'Economy', value: 'economy' },
              { name: 'Business', value: 'business' },
              { name: 'Politics', value: 'politics' },
              { name: 'Geopolitics', value: 'geopolitics' },
              { name: 'Regulation', value: 'regulation' },
              { name: 'Technology', value: 'technology' },
              { name: 'Energy', value: 'energy' },
              { name: 'Commodities', value: 'commodities' },
              { name: 'Crypto', value: 'crypto' },
              { name: 'Health', value: 'health' },
              { name: 'Climate', value: 'climate' },
              { name: 'Security', value: 'security' },
            ],
            default: [],
          },
          {
            displayName: 'Language',
            name: 'language',
            type: 'string',
            default: 'en',
          },
          {
            displayName: 'Order',
            name: 'order',
            type: 'options',
            options: [
              { name: 'DESC', value: 'DESC' },
              { name: 'ASC', value: 'ASC' },
            ],
            default: 'DESC',
          },
          {
            displayName: 'Order By',
            name: 'orderBy',
            type: 'options',
            options: [
              { name: 'Publish Date', value: 'publishDate' },
              { name: 'Created At', value: 'createdAt' },
              { name: 'Updated At', value: 'updatedAt' },
            ],
            default: 'publishDate',
          },
          {
            displayName: 'Page Size',
            name: 'pageSize',
            type: 'number',
            default: 20,
            typeOptions: { minValue: 1, maxValue: 100 },
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            default: 1,
            typeOptions: { minValue: 1 },
          },
          {
            displayName: 'Include Content',
            name: 'includeContent',
            type: 'boolean',
            default: false,
            description: 'Requires a Legacy subscription',
          },
          {
            displayName: 'Include Entities',
            name: 'includeEntities',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Exclude Empty Content',
            name: 'excludeEmptyContent',
            type: 'boolean',
            default: false,
          },
        ],
        displayOptions: {
          show: { operation: ['search'] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData: any[] = [];
    const apiKey = (await this.getCredentials('finlightApi')) as {
      apiKey: string;
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.apiKey,
    };

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      if (operation === 'search') {
        const additional = (this.getNodeParameter('additionalOptions', i, {}) || {}) as Record<string, any>;

        const body: Record<string, any> = {};

        if (additional.query) body.query = additional.query as string;
        if (additional.from) body.from = additional.from as string;
        if (additional.to) body.to = additional.to as string;

        const sourcesRaw = (additional.sources?.sourceList as Array<{ source: string }>) || [];
        if (sourcesRaw.length) body.sources = sourcesRaw.map((s) => s.source);

        const excludeSourcesRaw =
          (additional.excludeSources?.sourceList as Array<{
            source: string;
          }>) || [];
        if (excludeSourcesRaw.length) body.excludeSources = excludeSourcesRaw.map((s) => s.source);

        const optInSourcesRaw = (additional.optInSources?.sourceList as Array<{ source: string }>) || [];
        if (optInSourcesRaw.length) body.optInSources = optInSourcesRaw.map((s) => s.source);

        const tickersRaw = (additional.tickers?.tickerList as Array<{ ticker: string }>) || [];
        if (tickersRaw.length) body.tickers = tickersRaw.map((t) => t.ticker);

        const countriesRaw = (additional.countries?.countryList as Array<{ country: string }>) || [];
        if (countriesRaw.length) body.countries = countriesRaw.map((c) => c.country);

        if (Array.isArray(additional.categories) && additional.categories.length) {
          body.categories = additional.categories;
        }

        if (additional.language !== undefined) body.language = additional.language as string;
        if (additional.order !== undefined) body.order = additional.order as string;
        if (additional.orderBy !== undefined) body.orderBy = additional.orderBy as string;
        if (additional.pageSize !== undefined) body.pageSize = Number(additional.pageSize);
        if (additional.page !== undefined) body.page = Number(additional.page);
        if (typeof additional.includeContent === 'boolean') body.includeContent = additional.includeContent;
        if (typeof additional.includeEntities === 'boolean') body.includeEntities = additional.includeEntities;
        if (typeof additional.excludeEmptyContent === 'boolean')
          body.excludeEmptyContent = additional.excludeEmptyContent;

        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: 'https://api.finlight.me/v2/articles',
          headers,
          body,
          json: true,
        });

        returnData.push(...(Array.isArray(response?.articles) ? response.articles : [response]));
      } else if (operation === 'getByLink') {
        const link = this.getNodeParameter('link', i) as string;
        const includeContent = this.getNodeParameter('getByLinkIncludeContent', i) as boolean;
        const includeEntities = this.getNodeParameter('getByLinkIncludeEntities', i) as boolean;

        const qs: Record<string, any> = { link };
        if (includeContent) qs.includeContent = true;
        if (includeEntities) qs.includeEntities = true;

        const response = await this.helpers.httpRequest({
          method: 'GET',
          url: 'https://api.finlight.me/v2/articles/by-link',
          headers,
          qs,
          json: true,
        });

        returnData.push(response?.article ?? response);
      } else if (operation === 'listSources') {
        const response = await this.helpers.httpRequest({
          method: 'GET',
          url: 'https://api.finlight.me/v2/sources',
          headers,
          json: true,
        });

        if (Array.isArray(response)) {
          returnData.push(...response.map((s) => (typeof s === 'string' ? { source: s } : s)));
        } else {
          returnData.push(response);
        }
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
