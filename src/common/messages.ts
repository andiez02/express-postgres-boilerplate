export default {
  generalMessage: {
    error: 'There was some error',
    apiNotExist: 'Method does not exist',
    success: 'Success',
  },
  httpMessages: {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    544: 'Unknown HTTP Error',
  },
  auth: {
    failed: 'Either email or password is incorrect. Please try again',
    userExists: 'Email Address already in use',
    inactive: 'The account has not been verified',
    userNotExists: 'The email address you entered does not exist',
    invalidCode: 'Incorrect verification code',
    invalidAction: 'Not Supported',
    invalidToken: 'Token invalid',
    oldPasswordNotMatch: 'Old password is incorrect',
    userIdNotExists: 'The user ID does not exist',
    isExistEmail: 'Email is exist',
  },
  mail: {
    sendError: 'An error occurred while sending mail',
    subject: {
      resetPassword: 'Project Name reset password',
      verification: 'Project Name verification',
      inviteVerification: 'Project Name invite verification',
    },
  },
  project: {
    isNotExist: 'Project does not exist',
    memberExists: 'Members already in current project',
    isMemberNotExists: 'Members not exist in current project',
  },
  milestone: {
    isNotExist: 'Milestone does not exist',
  },
  testPlan: {
    isNotExist: 'Test Plan does not exist',
  },
  testCase: {
    isNotExist: 'Test Case does not exist',
  },
  upload: {
    extensionNotAllowed: 'upload.extensionNotAllowed',
    noFileUpload: 'upload.noFileUpload',
  },
};
