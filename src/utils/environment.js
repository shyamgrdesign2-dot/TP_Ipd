const PROD_LIKE_ENVIRONMENTS = ["prod", "zy-prod", "zy-preprod"];

export const isProdLikeEnvironment = (environment = process.env.REACT_APP_ENV) =>
  PROD_LIKE_ENVIRONMENTS.includes(environment);

export const isProdEnv = (environment = process.env.REACT_APP_ENV) =>
  environment === "prod";
