export default (messageId, templateID, mobileNumber, apiKey) => ({
  notificationId: messageId,
  clientApiKey: apiKey,
  notificationTemplate: templateID,
  notificationDestination: mobileNumber,
  notificationType: 'sms',
  notificationData: [],
});
