import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FinlightWebhookSecret implements ICredentialType {
  name = 'finlightWebhookSecret';
  displayName = 'finlight Webhook Secret';
  properties: INodeProperties[] = [
    {
      displayName: 'Secret',
      name: 'secret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];
}
