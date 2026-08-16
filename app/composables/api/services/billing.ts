import { authApi } from '../axios'
import type { PlanTier } from './workspace'

export interface BillingUsage {
  ordersThisMonth: number
  ordersLimit: number // 0 = unlimited
  staffSeats: number
  staffLimit: number // 0 = unlimited
  menuItems: number
  menuItemsLimit: number // 0 = unlimited
  categories: number
}

export type SubscriptionStatus = 'active' | 'past_due' | 'trialing'

export interface Subscription {
  status: SubscriptionStatus
  renewsOn: string | null // YYYY-MM-DD
}

export interface PaymentMethod {
  id: number
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export type InvoiceStatus = 'paid' | 'due' | 'failed'

export interface Invoice {
  id: number
  number: string
  issuedOn: string | null // YYYY-MM-DD
  amount: number
  status: InvoiceStatus
}

export interface Billing {
  plan: PlanTier
  subscription: Subscription
  usage: BillingUsage
  paymentMethod: PaymentMethod | null
  invoices: Invoice[]
}

/** Plan + usage + subscription meta + default card + invoices, in one call. */
export function show(): Promise<Billing> {
  return authApi.get<Billing>('/billing').then((r) => r.data)
}

export interface PaymentMethodPayload {
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault?: boolean
}

export function createPaymentMethod(payload: PaymentMethodPayload): Promise<PaymentMethod> {
  return authApi.post<{ data: PaymentMethod }>('/payment-methods', payload).then((r) => r.data.data)
}

export function updatePaymentMethod(id: number, payload: Partial<PaymentMethodPayload>): Promise<PaymentMethod> {
  return authApi.patch<{ data: PaymentMethod }>(`/payment-methods/${id}`, payload).then((r) => r.data.data)
}

export function deletePaymentMethod(id: number): Promise<void> {
  return authApi.delete(`/payment-methods/${id}`).then(() => undefined)
}

export interface InvoicePayload {
  number: string
  issuedOn: string
  amount: number
  status: InvoiceStatus
}

export function listInvoices(): Promise<Invoice[]> {
  return authApi.get<{ data: Invoice[] }>('/invoices').then((r) => r.data.data)
}

export function createInvoice(payload: InvoicePayload): Promise<Invoice> {
  return authApi.post<{ data: Invoice }>('/invoices', payload).then((r) => r.data.data)
}

export function updateInvoice(id: number, payload: Partial<InvoicePayload>): Promise<Invoice> {
  return authApi.patch<{ data: Invoice }>(`/invoices/${id}`, payload).then((r) => r.data.data)
}

export function deleteInvoice(id: number): Promise<void> {
  return authApi.delete(`/invoices/${id}`).then(() => undefined)
}

/** Fetch the invoice PDF (authenticated) and trigger a browser download. */
export function downloadInvoicePdf(id: number, number: string): Promise<void> {
  return authApi.get(`/invoices/${id}/pdf`, { responseType: 'blob' }).then((r) => {
    const url = URL.createObjectURL(r.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${number}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  })
}
