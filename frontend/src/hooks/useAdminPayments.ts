import { useState, useCallback } from 'react';
import {
  adminPaymentsService,
  CreateSubscriptionRequest,
  RecordPaymentRequest,
  ApprovePaymentRequest,
  Subscription,
  PaymentTransaction,
} from '@/services/admin-payments.service';

export function useAdminPayments(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSubscription = useCallback(
    async (data: CreateSubscriptionRequest): Promise<Subscription> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPaymentsService.createSubscription(data, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const recordPayment = useCallback(
    async (data: RecordPaymentRequest): Promise<PaymentTransaction> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPaymentsService.recordPayment(data, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const approvePayment = useCallback(
    async (paymentId: string, data: ApprovePaymentRequest): Promise<PaymentTransaction> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPaymentsService.approvePayment(
          paymentId,
          data,
          token,
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const getUserSubscription = useCallback(
    async (userId: string): Promise<Subscription | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPaymentsService.getUserSubscription(
          userId,
          token,
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const getUserPayments = useCallback(
    async (userId: string): Promise<PaymentTransaction[]> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPaymentsService.getUserPayments(userId, token);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const getPendingPayments = useCallback(async (): Promise<PaymentTransaction[]> => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminPaymentsService.getPendingPayments(token);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getInstitutionPaymentStatus = useCallback(
    async (institutionId: string): Promise<any> => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminPaymentsService.getInstitutionPaymentStatus(
          institutionId,
          token,
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return {
    loading,
    error,
    createSubscription,
    recordPayment,
    approvePayment,
    getUserSubscription,
    getUserPayments,
    getPendingPayments,
    getInstitutionPaymentStatus,
  };
}
