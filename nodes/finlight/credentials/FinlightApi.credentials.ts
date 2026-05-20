import { IAuthenticateGeneric, ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class FinlightApi implements ICredentialType {
  name = 'finlightApi';
  displayName = 'finlight API Key';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'x-api-key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.finlight.me/',
      url: 'v2/articles',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        pageSize: 1,
        page: 1,
      },
    },
  };
}
