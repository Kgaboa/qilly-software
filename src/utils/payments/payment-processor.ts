/**
 * Payment Processing System
 * Supports multiple South African payment gateways
 */

import { getSupabaseClient } from '../supabase/client';
import { getCurrentEnvironment } from '../environment';

// Get the Supabase client for the current environment
const getClient = () => getSupabaseClient(getCurrentEnvironment());

export type PaymentGateway = 'payfast' | 'yoco' | 'ozow' | 'paygate' | 'peach' | 'manual-eft';

export type SubscriptionPlan = 'trial' | 'starter' | 'professional' | 'enterprise';

export interface PaymentGatewayConfig {
  id: PaymentGateway;
  name: string;
  description: string;
  logoUrl?: string;
  setupComplexity: 'easy' | 'medium' | 'complex';
  transactionFee: string;
  monthlyFee: string;
  supportedMethods: string[];
  isActive: boolean;
  testMode: boolean;
}

export interface SubscriptionPlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'annual';
  features: string[];
  billsPerMonth: number;
  maxUsers: number;
  supportLevel: string;
}

export interface PaymentRequest {
  userId: string;
  plan: SubscriptionPlan;
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  returnUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  subscriptionId?: string;
}

/**
 * South African Payment Gateway Configurations
 */
export const PAYMENT_GATEWAYS: Record<PaymentGateway, PaymentGatewayConfig> = {
  'payfast': {
    id: 'payfast',
    name: 'PayFast',
    description: 'South Africa\'s leading payment gateway - supports all major banks and cards',
    setupComplexity: 'easy',
    transactionFee: '2.9% + R2.00',
    monthlyFee: 'R0 (Free)',
    supportedMethods: ['Credit Card', 'Debit Card', 'Instant EFT', 'SnapScan', 'Zapper', 'Masterpass'],
    isActive: true,
    testMode: true,
  },
  'yoco': {
    id: 'yoco',
    name: 'Yoco',
    description: 'Simple card payments for South African businesses',
    setupComplexity: 'easy',
    transactionFee: '2.95% per transaction',
    monthlyFee: 'R0 (Free)',
    supportedMethods: ['Credit Card', 'Debit Card'],
    isActive: true,
    testMode: true,
  },
  'ozow': {
    id: 'ozow',
    name: 'Ozow',
    description: 'Instant EFT payments - no card required',
    setupComplexity: 'medium',
    transactionFee: '1.5% (min R2.50)',
    monthlyFee: 'R0 (Free)',
    supportedMethods: ['Instant EFT'],
    isActive: true,
    testMode: true,
  },
  'paygate': {
    id: 'paygate',
    name: 'PayGate',
    description: 'Enterprise payment gateway with multiple payment options',
    setupComplexity: 'complex',
    transactionFee: 'Custom pricing',
    monthlyFee: 'Contact for pricing',
    supportedMethods: ['Credit Card', 'Debit Card', 'EFT', 'SCode', 'Bank Transfer'],
    isActive: false,
    testMode: true,
  },
  'peach': {
    id: 'peach',
    name: 'Peach Payments',
    description: 'Advanced payment orchestration platform',
    setupComplexity: 'complex',
    transactionFee: 'Custom pricing',
    monthlyFee: 'Contact for pricing',
    supportedMethods: ['Credit Card', 'Debit Card', 'EFT', 'Digital Wallets'],
    isActive: false,
    testMode: true,
  },
  'manual-eft': {
    id: 'manual-eft',
    name: 'Manual EFT',
    description: 'Direct bank transfer - manual verification required',
    setupComplexity: 'easy',
    transactionFee: 'R0 (Free)',
    monthlyFee: 'R0 (Free)',
    supportedMethods: ['Bank Transfer'],
    isActive: true,
    testMode: false,
  },
};

/**
 * Subscription Plan Configurations
 */
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanConfig> = {
  'trial': {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    currency: 'ZAR',
    billingPeriod: 'monthly',
    features: ['3 Bills', 'Basic Pricing', 'Email Support'],
    billsPerMonth: 3,
    maxUsers: 1,
    supportLevel: 'Email',
  },
  'starter': {
    id: 'starter',
    name: 'Starter',
    price: 150,
    currency: 'ZAR',
    billingPeriod: 'monthly',
    features: ['10 Bills/month', 'All 9 Provinces', 'Live Pricing', 'Email Support', 'Compliance Tools'],
    billsPerMonth: 10,
    maxUsers: 1,
    supportLevel: 'Email',
  },
  'professional': {
    id: 'professional',
    name: 'Professional',
    price: 500,
    currency: 'ZAR',
    billingPeriod: 'monthly',
    features: ['50 Bills/month', 'All 9 Provinces', 'Live Pricing', 'Priority Support', 'Compliance Tools', 'API Access', 'Multi-user'],
    billsPerMonth: 50,
    maxUsers: 5,
    supportLevel: 'Priority',
  },
  'enterprise': {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2000,
    currency: 'ZAR',
    billingPeriod: 'monthly',
    features: ['Unlimited Bills', 'All 9 Provinces', 'Live Pricing', '24/7 Support', 'Compliance Tools', 'API Access', 'Unlimited Users', 'Custom Integration', 'Dedicated Account Manager'],
    billsPerMonth: -1, // Unlimited
    maxUsers: -1, // Unlimited
    supportLevel: '24/7 Dedicated',
  },
};

/**
 * Process payment through selected gateway
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  const gateway = PAYMENT_GATEWAYS[request.gateway];
  
  if (!gateway.isActive) {
    return {
      success: false,
      error: `${gateway.name} is not currently active`,
    };
  }

  // Manual EFT - Create pending subscription
  if (request.gateway === 'manual-eft') {
    return await processManualEFT(request);
  }

  // PayFast integration
  if (request.gateway === 'payfast') {
    return await processPayFast(request);
  }

  // Yoco integration
  if (request.gateway === 'yoco') {
    return await processYoco(request);
  }

  // Ozow integration
  if (request.gateway === 'ozow') {
    return await processOzow(request);
  }

  return {
    success: false,
    error: 'Payment gateway not implemented yet',
  };
}

/**
 * Manual EFT Processing
 */
async function processManualEFT(request: PaymentRequest): Promise<PaymentResult> {
  const client = getClient();
  if (!client) {
    return {
      success: false,
      error: 'Database connection not available',
    };
  }

  const planConfig = SUBSCRIPTION_PLANS[request.plan];
  
  // Create pending subscription in database
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { data, error } = await client
    .from('subscriptions')
    .insert({
      user_id: request.userId,
      plan_type: request.plan,
      status: 'pending', // Will be activated after payment verification
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_method: 'manual-eft',
      amount_paid: request.amount,
      currency: request.currency,
      auto_renew: false,
      notes: 'Awaiting payment verification',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    return {
      success: false,
      error: 'Failed to create subscription record',
    };
  }

  return {
    success: true,
    subscriptionId: data.id,
    paymentUrl: undefined, // No redirect needed
  };
}

/**
 * PayFast Integration (Test Mode)
 */
async function processPayFast(request: PaymentRequest): Promise<PaymentResult> {
  const client = getClient();
  if (!client) {
    return {
      success: false,
      error: 'Database connection not available',
    };
  }

  const planConfig = SUBSCRIPTION_PLANS[request.plan];
  
  // In test mode, create a mock PayFast payment URL
  const merchantId = '10000100'; // PayFast test merchant ID
  const merchantKey = '46f0cd694581a'; // PayFast test merchant key
  
  // Create subscription record (pending until payment confirmed)
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { data, error } = await client
    .from('subscriptions')
    .insert({
      user_id: request.userId,
      plan_type: request.plan,
      status: 'pending',
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_method: 'payfast',
      amount_paid: request.amount,
      currency: request.currency,
      auto_renew: true,
      notes: 'PayFast payment initiated',
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to create subscription',
    };
  }

  // Generate PayFast payment URL (sandbox)
  const paymentUrl = `https://sandbox.payfast.co.za/eng/process?merchant_id=${merchantId}&merchant_key=${merchantKey}&amount=${request.amount}&item_name=${planConfig.name}&return_url=${request.returnUrl}&cancel_url=${request.cancelUrl}`;

  return {
    success: true,
    subscriptionId: data.id,
    paymentUrl,
  };
}

/**
 * Yoco Integration (Test Mode)
 */
async function processYoco(request: PaymentRequest): Promise<PaymentResult> {
  const client = getClient();
  if (!client) {
    return {
      success: false,
      error: 'Database connection not available',
    };
  }

  // Yoco uses a checkout popup - would need their SDK
  // For now, create a mock implementation
  
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { data, error } = await client
    .from('subscriptions')
    .insert({
      user_id: request.userId,
      plan_type: request.plan,
      status: 'pending',
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_method: 'yoco',
      amount_paid: request.amount,
      currency: request.currency,
      auto_renew: true,
      notes: 'Yoco payment initiated',
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to create subscription',
    };
  }

  return {
    success: true,
    subscriptionId: data.id,
    paymentUrl: 'https://yoco.com/checkout/test', // Mock URL
  };
}

/**
 * Ozow Integration (Test Mode)
 */
async function processOzow(request: PaymentRequest): Promise<PaymentResult> {
  const client = getClient();
  if (!client) {
    return {
      success: false,
      error: 'Database connection not available',
    };
  }

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const { data, error } = await client
    .from('subscriptions')
    .insert({
      user_id: request.userId,
      plan_type: request.plan,
      status: 'pending',
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_method: 'ozow',
      amount_paid: request.amount,
      currency: request.currency,
      auto_renew: true,
      notes: 'Ozow EFT payment initiated',
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to create subscription',
    };
  }

  return {
    success: true,
    subscriptionId: data.id,
    paymentUrl: 'https://ozow.com/test-payment', // Mock URL
  };
}

/**
 * Verify and activate subscription after payment
 */
export async function activateSubscription(
  subscriptionId: string,
  transactionId: string
): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const { error } = await client
    .from('subscriptions')
    .update({
      status: 'active',
      payment_reference: transactionId,
      notes: 'Payment verified and subscription activated',
    })
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error activating subscription:', error);
    return false;
  }

  // Update user's premium status
  const { data: subscription } = await client
    .from('subscriptions')
    .select('user_id, expires_at')
    .eq('id', subscriptionId)
    .single();

  if (subscription) {
    await client
      .from('users')
      .update({
        is_premium: true,
        subscription_expires_at: subscription.expires_at,
      })
      .eq('id', subscription.user_id);
  }

  return true;
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: string) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const { error } = await client
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      auto_renew: false,
    })
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error cancelling subscription:', error);
    return false;
  }

  return true;
}