import { Router } from 'express';
import {
  createCheckout,
  handlePayOSWebhook,
  checkOrderStatus,
  simulatePayment,
  cancelOrder,
} from '../controllers/checkout.controller';
import { createCustomLead } from '../controllers/customLead.controller';

const router = Router();

// Checkout & Payment Endpoints (Public)
router.post('/checkout', createCheckout);
router.post('/webhooks/payos', handlePayOSWebhook);
router.get('/orders/:orderCode/status', checkOrderStatus);
router.post('/simulate-payment', simulatePayment);
router.post('/orders/cancel', cancelOrder);
router.post('/custom-leads', createCustomLead);

export default router;
