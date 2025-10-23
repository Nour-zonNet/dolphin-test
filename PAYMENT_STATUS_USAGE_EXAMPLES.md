# Payment Status Components Usage Examples

The application now has separate components for payment recharge and subscription renewal scenarios.

## URL Structure

### Payment Recharge (Balance)
- `status`: The payment status (`success`, `failed`, or `pending`)
- Route: `/payment-status/:status`

### Subscription Renewal
- `status`: The payment status (`success`, `failed`, or `pending`)
- Route: `/renew-subscription/status/:status`

## Usage Examples

### Payment Recharge (Balance)
```
/payment-status/success
/payment-status/failed  
/payment-status/pending
```

### Subscription Renewal
```
/renew-subscription/status/success
/renew-subscription/status/failed
/renew-subscription/status/pending
```

## Route Configuration

```javascript
// Payment recharge routes
{
  path: "/payment-status/:status",
  element: PaymentStatus,
  protected: true,
  layout: false,
}

// Subscription renewal routes
{
  path: "/renew-subscription/status/:status",
  element: RenewalStatus,
  protected: true,
  layout: false,
}
```

## Automatic Routing

The `PaymentStatus` component automatically detects renewal transactions and redirects to the appropriate renewal status page:

```javascript
// If transaction type is 'renewal', redirect to renewal status
if (parsedTransaction.type === 'renewal') {
  navigate(`/renew-subscription/status/${status}`, { replace: true });
  return;
}
```

## Different Text Content

### Recharge Success
- Title: "نجاح الدفع"
- Heading: "تمت عملية الإيداع بنجاح"
- Message: "تمت إضافة رصيدك بنجاح إلى المحفظة"
- Action: "معاينة الرصيد" → `/balance-details`

### Renewal Success  
- Title: "نجاح التجديد"
- Heading: "تم تجديد الاشتراك بنجاح"
- Message: "تم تجديد اشتراكك بنجاح ويمكنك الآن الاستمتاع بخدماتنا"
- Action: "معاينة الاشتراكات" → `/subscription`

### Failed Scenarios
- Recharge: "فشل الدفع" / "لم نتمكن من معالجة عملية الدفع الخاصة بك"
- Renewal: "فشل التجديد" / "لم نتمكن من معالجة عملية تجديد الاشتراك الخاصة بك"

### Pending Scenarios
- Recharge: "الدفع معلق" / "عملية الدفع قيد المعالجة"
- Renewal: "التجديد معلق" / "عملية تجديد الاشتراك قيد المعالجة"

## Implementation Notes

1. The component automatically detects the context type from the URL parameter
2. For recharge success, it adds balance to the user's wallet
3. For renewal success, you may want to add subscription status updates (currently commented out)
4. All transaction data is stored with the context type for proper tracking
5. The component maintains backward compatibility with existing recharge flows
