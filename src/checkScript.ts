import { VENDOR_DATABASE } from './mockVendorDb';

export interface InvoiceData {
  id: string;
  vendorId: string;
  vendorName: string;
  submittedAmount: number;
  submittedAccountNo: string;
  submittedPhone: string;
}

export function runSentinelCheck(invoice: InvoiceData) {
  const flags: string[] = [];
  const vendor = VENDOR_DATABASE[invoice.vendorId];

  if (!vendor) {
    return {
      status: 'HELD_SUSPICIOUS',
      fraudFlags: ['🚨 CRITICAL: Vendor ID not recognized in official master database!'],
      verifiedPhone: 'UNKNOWN (DO NOT PAY)'
    };
  }

  if (invoice.submittedAccountNo !== vendor.officialAccountNo) {
    flags.push(`🚨 BANK TAMPERING: Submitted account (${invoice.submittedAccountNo}) does not match master record.`);
  }

  if (invoice.submittedAmount > vendor.avgInvoiceAmount * 2.5) {
    flags.push(`⚠️ ANOMALY: Invoice amount ($${invoice.submittedAmount}) is 250%+ higher than average.`);
  }

  if (invoice.submittedPhone !== vendor.verifiedPhone) {
    flags.push(`⚠️ COMMS ALERT: Phone on invoice (${invoice.submittedPhone}) differs from official file.`);
  }

  return {
    status: flags.length > 0 ? 'HELD_SUSPICIOUS' : 'SAFE',
    fraudFlags: flags,
    verifiedPhone: vendor.verifiedPhone
  };
}