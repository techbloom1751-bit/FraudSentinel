export interface Vendor {
  id: string;
  name: string;
  officialAccountNo: string;
  verifiedPhone: string;
  avgInvoiceAmount: number;
}

export const VENDOR_DATABASE: Record<string, Vendor> = {
  "VEND-001": {
    id: "VEND-001",
    name: "Acme Logistics Corp",
    officialAccountNo: "987654321011",
    verifiedPhone: "+91-98765-43210",
    avgInvoiceAmount: 45000,
  },
  "VEND-002": {
    id: "VEND-002",
    name: "Global Tech Services",
    officialAccountNo: "112233445566",
    verifiedPhone: "+91-91234-56789",
    avgInvoiceAmount: 120000,
  }
};