const ASAAS_PROD = "https://api.asaas.com/v3";
const ASAAS_SANDBOX = "https://sandbox.asaas.com/api/v3";

export type FormaPagamento = "CREDIT_CARD" | "BOLETO" | "PIX";
export type CicloCobranca =
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "BIMONTHLY"
  | "QUARTERLY"
  | "SEMIANNUAL"
  | "ANNUAL";

export interface AsaasCliente {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
}

export interface AsaasAssinatura {
  id: string;
  customer: string;
  billingType: FormaPagamento;
  value: number;
  cycle: CicloCobranca;
  status: string;
  nextDueDate: string;
}

export interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string;
    customer: string;
    subscription?: string;
    value: number;
    status: string;
    billingType: string;
    confirmedDate?: string;
    paymentDate?: string;
  };
}

export class AsaasClient {
  private baseUrl: string;

  constructor(
    private apiKey: string,
    sandbox = process.env.NODE_ENV !== "production"
  ) {
    this.baseUrl = sandbox ? ASAAS_SANDBOX : ASAAS_PROD;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        access_token: this.apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AsaasError(
        `Asaas API error: ${response.status}`,
        response.status,
        error
      );
    }

    return response.json() as Promise<T>;
  }

  // ─── Clientes ──────────────────────────────────────────

  async criarCliente(data: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone?: string;
  }): Promise<AsaasCliente> {
    return this.request<AsaasCliente>("POST", "/customers", data);
  }

  async buscarCliente(id: string): Promise<AsaasCliente> {
    return this.request<AsaasCliente>("GET", `/customers/${id}`);
  }

  // ─── Assinaturas ──────────────────────────────────────

  async criarAssinatura(data: {
    customer: string;
    billingType: FormaPagamento;
    value: number;
    cycle: CicloCobranca;
    description?: string;
    nextDueDate?: string;
    creditCard?: {
      holderName: string;
      number: string;
      expiryMonth: string;
      expiryYear: string;
      ccv: string;
    };
    creditCardHolderInfo?: {
      name: string;
      email: string;
      cpfCnpj: string;
      postalCode: string;
      addressNumber: string;
      phone: string;
    };
  }): Promise<AsaasAssinatura> {
    // Se não informou nextDueDate, usar amanhã
    if (!data.nextDueDate) {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      data.nextDueDate = amanha.toISOString().split("T")[0];
    }
    return this.request<AsaasAssinatura>("POST", "/subscriptions", data);
  }

  async buscarAssinatura(id: string): Promise<AsaasAssinatura> {
    return this.request<AsaasAssinatura>("GET", `/subscriptions/${id}`);
  }

  async cancelarAssinatura(id: string): Promise<void> {
    await this.request("DELETE", `/subscriptions/${id}`);
  }

  // ─── Cobranças ─────────────────────────────────────────

  async buscarCobranca(id: string) {
    return this.request("GET", `/payments/${id}`);
  }

  async listarCobrancasAssinatura(subscriptionId: string) {
    return this.request<{ data: unknown[] }>(
      "GET",
      `/subscriptions/${subscriptionId}/payments`
    );
  }
}

export class AsaasError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public apiError: unknown
  ) {
    super(message);
    this.name = "AsaasError";
  }
}
