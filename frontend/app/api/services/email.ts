import apiClient from "~/api/axios.server";

/**
 * Resend a confirmation email
 * POST /api/Email/send-confirmation-email
 */
export const resendConfirmation = async (email: string) => {
  const { data } = await apiClient.post(
    `/api/Email/send-confirmation-email/${email}`
  );

  return data;
};
