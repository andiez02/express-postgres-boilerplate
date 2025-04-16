export default {
  mailTemplate: {
    verifyToken: 'verification-token',
  },
  validationAction: {
    signUp: 'SignUp',
    resetPassword: 'ResetPassword',
  },
  loginStatus: {
    success: 'SUCCESS',
    invalidAccount: 'INVALID_ACCOUNT',
    inactiveAccount: 'INACTIVE_ACCOUNT',
  },
  category: {
    deleteStatus: {
      hasReferences: 'HAS_REFERENCES',
    },
    updateStatus: {
      existed: 'EXISTED',
    },
  },
  allergen: {
    deleteStatus: {
      hasReferences: 'HAS_REFERENCES',
    },
  },
  status: {
    success: 'SUCCESS',
    failed: 'FAILED',
  },
};

export const FILTER_CONSUMPTION_STATUS = {
  ALL: 'ALL',
  WITH_ALLERGEN: 'WITH_ALLERGEN',
  WITHOUT_ALLERGEN: 'WITHOUT_ALLERGEN',
};

export const INPUT_STRING_EMPTY = 'no title';
