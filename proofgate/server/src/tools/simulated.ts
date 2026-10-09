import { PolicyDecision } from '../policies/engine';

export const read_demo_document = async (params: any) => {
  return { data: 'Demo document content: The project is progressing well. We need to focus on the Q3 deliverables.' };
};

export const draft_email = async (params: any) => {
  return { data: `Drafted email to ${params?.to || 'unknown'}` };
};

export const read_mock_customer_records = async (params: any) => {
  return { data: 'Customer Record: John Doe, Balance: $10,000' };
};

export const export_mock_customer_data = async (params: any) => {
  // This should never actually execute if blocked by policy
  return { data: 'EXPORT_SUCCESS', records: 1000 };
};

export const send_simulated_email = async (params: any) => {
  // This should never actually execute if blocked by policy
  return { data: 'EMAIL_SENT', to: params?.to };
};

export const executeTool = async (toolName: string, params: any) => {
  switch (toolName) {
    case 'read_demo_document':
      return await read_demo_document(params);
    case 'draft_email':
      return await draft_email(params);
    case 'read_mock_customer_records':
      return await read_mock_customer_records(params);
    case 'export_mock_customer_data':
      return await export_mock_customer_data(params);
    case 'send_simulated_email':
      return await send_simulated_email(params);
    default:
      throw new Error(`Tool not found: ${toolName}`);
  }
};
