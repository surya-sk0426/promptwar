export type PolicyDecision = 'ALLOW' | 'BLOCK' | 'REQUIRE_APPROVAL';

export interface ActionRequest {
  tool: string;
  parameters?: any;
}

export interface PolicyResult {
  decision: PolicyDecision;
  reason: string;
  requiredPermission: string;
}

export const evaluatePolicy = (request: ActionRequest): PolicyResult => {
  switch (request.tool) {
    case 'read_demo_document':
      return {
        decision: 'ALLOW',
        reason: 'Reading demo documents is explicitly permitted.',
        requiredPermission: 'doc:read',
      };
    case 'draft_email':
      return {
        decision: 'ALLOW',
        reason: 'Drafting emails without sending is a safe operation.',
        requiredPermission: 'email:draft',
      };
    case 'read_mock_customer_records':
      return {
        decision: 'REQUIRE_APPROVAL',
        reason: 'Accessing customer records requires explicit human approval.',
        requiredPermission: 'customer:read',
      };
    case 'export_mock_customer_data':
      return {
        decision: 'BLOCK',
        reason: 'Exporting customer data is strictly prohibited by policy.',
        requiredPermission: 'customer:export',
      };
    case 'send_simulated_email':
      return {
        decision: 'BLOCK',
        reason: 'Sending external emails is prohibited in the current environment.',
        requiredPermission: 'email:send',
      };
    default:
      return {
        decision: 'BLOCK',
        reason: `Unknown or unauthorized tool: ${request.tool}`,
        requiredPermission: 'none',
      };
  }
};
