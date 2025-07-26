import { ICredentialType, INodeProperties } from "n8n-workflow";

export class FinlightApi implements ICredentialType {
  name = "finlightApi";
  displayName = "finlight API Key";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      default: "",
    },
  ];
}
