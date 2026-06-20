/**
 * Service to send transactional emails via Brevo REST API.
 */
export const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderName = process.env.BREVO_SENDER_NAME || 'Coding Pattern Learning Platform';
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@patternlearning.com';

  if (!apiKey || apiKey === 'your_brevo_api_key_here') {
    console.warn('Warning: Brevo API key is not configured. Email was not sent.');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent,
      }),
    });

    if (response.ok) {
      console.log(`Email successfully sent to ${to} via Brevo API.`);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to send email via Brevo REST API:', errorData);
      return false;
    }
  } catch (error) {
    console.error('Error sending email via Brevo REST API:', error);
    return false;
  }
};
