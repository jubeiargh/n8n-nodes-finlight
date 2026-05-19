import { FinlightWebhookTrigger } from "./triggers/FinlightWebhookTrigger.node";
import { FinlightApi } from "./actions/FinlightApi.node";
import { FinlightWebhookSecret } from "./credentials/FinlightWebhookSecret.credentials";

export const nodes = [FinlightWebhookTrigger, FinlightApi];
export const credentials = [FinlightWebhookSecret];
