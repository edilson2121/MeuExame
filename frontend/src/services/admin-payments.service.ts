import { API_URL } from '@/lib/config';

export interface Subscription {
  id: string;
  userId: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'INACTIVE' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  amount: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  method: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'OTHER';
  reference?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionRequest {
  userId: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  amount: number;
  currency?: string;
}

export interface RecordPaymentRequest {
  userId: string;
  subscriptionId: string;
  amount: number;
  method: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'OTHER';
  reference?: string;
  currency?: string;
}

export interface ApprovePaymentRequest {
  approve: boolean;
  reason?: string;
}

export const adminPaymentsService = {
  /**
   * Criar assinatura para usuário
   */
  async createSubscription(
    data: CreateSubscriptionRequest,
    token: string,
  ): Promise<Subscription> {
    const response = await fetch(`${API_URL}/admin/payments/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar assinatura: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Registrar pagamento
   */
  async recordPayment(
    data: RecordPaymentRequest,
    token: string,
  ): Promise<PaymentTransaction> {
    const response = await fetch(`${API_URL}/admin/payments/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro ao registrar pagamento: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Aprovar/Rejeitar pagamento
   */
  async approvePayment(
    paymentId: string,
    data: ApprovePaymentRequest,
    token: string,
  ): Promise<PaymentTransaction> {
    const response = await fetch(
      `${API_URL}/admin/payments/approve/${paymentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao aprovar pagamento: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter assinatura do usuário
   */
  async getUserSubscription(
    userId: string,
    token: string,
  ): Promise<Subscription | null> {
    const response = await fetch(`${API_URL}/admin/payments/subscription/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar assinatura: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter pagamentos do usuário
   */
  async getUserPayments(
    userId: string,
    token: string,
  ): Promise<PaymentTransaction[]> {
    const response = await fetch(`${API_URL}/admin/payments/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pagamentos: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter pagamentos pendentes
   */
  async getPendingPayments(token: string): Promise<PaymentTransaction[]> {
    const response = await fetch(`${API_URL}/admin/payments/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pagamentos pendentes: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter todos os pagamentos (com filtro de status opcional)
   */
  async getAllPayments(
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED',
    token?: string,
  ): Promise<PaymentTransaction[]> {
    const url = new URL(`${API_URL}/admin/payments`);
    if (status) {
      url.searchParams.append('status', status);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pagamentos: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obter status de pagamento da instituição
   */
  async getInstitutionPaymentStatus(
    institutionId: string,
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${API_URL}/admin/payments/institution/${institutionId}/status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar status de pagamento: ${response.statusText}`);
    }

    return response.json();
  },
};
