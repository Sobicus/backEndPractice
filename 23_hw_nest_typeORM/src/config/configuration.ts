enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (
  environmentVariables: EnvironmentVariable,
  currentEnvironment: Environments,
) => {
  const mongoUrl =
    currentEnvironment === Environments.TEST
      ? environmentVariables.MONGO_TESTING_URL
      : environmentVariables.MONGO_URL;
  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
    },

    databaseSettings: {
      MONGO_CONNECTION_URI: mongoUrl,
    },

    JwtSettings: {
      JWT_SECRET: environmentVariables.JWT_SECRET,
    },

    nodemailerSettings: {
      EMAIL_PASS: environmentVariables.EMAIL_PASS,
    },

    environmentSettings: {
      currentEnv: currentEnvironment,
      isProduction: currentEnvironment === Environments.PRODUCTION,
      isStaging: currentEnvironment === Environments.STAGING,
      isTesting: currentEnvironment === Environments.TEST,
      isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
    },
  };
};

export default () => {
  const environmentVariables = process.env;

  console.log('process.env.ENV =', environmentVariables.ENV);
  const currentEnvironment: Environments =
    environmentVariables.ENV as Environments;

  return getConfig(environmentVariables, currentEnvironment);
};
