/** QILLY-BRQ-BOQ-001: Only creation of an independent BOQ consumes a monthly entitlement.
 * Repricing, scenario edits, allowables, approvals, and exports are operations
 * on an existing BOQ. They must never insert a new bill or decrement credits.
 */
export type BoqEntitlementAction =
  | 'create_boq' | 'import_boq' | 'price_existing_boq'
  | 'reprice_boq' | 'generate_allowables' | 'save_scenario'
  | 'approve_scenario' | 'apply_scenario' | 'export_excel'
  | 'export_pdf' | 'programme' | 'cashflow' | 'training_preview';

export const consumesBoqQuota = (action: BoqEntitlementAction): boolean =>
  action === 'create_boq' || action === 'import_boq';

export const canPerformExistingBoqAction = (
  action: BoqEntitlementAction,
  existingBoqId: string | null | undefined,
): boolean => !consumesBoqQuota(action) && Boolean(existingBoqId?.trim());

export const remainingBoqCredits = (
  baseQuota: number | null,
  topUp: number,
  used: number,
): number | null =>
  baseQuota === null ? null : Math.max(0, baseQuota + Math.max(0, topUp) - Math.max(0, used));
