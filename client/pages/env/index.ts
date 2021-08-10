type IEnvConfig = {
  API_HOST: string;
  API_PORT: number;
};

export const config: IEnvConfig = {
  API_HOST: process.env.API_HOST!,
  API_PORT: +process.env.API_PORT!
};
