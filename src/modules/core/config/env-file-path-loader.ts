import { Profile } from "src/modules/core/config/constants/profiles";

export const setEnvFilePath = (profile?: Profile): string => {
  const path = !profile ? ".env" : `.env.${profile}`;
  console.log(`env file path: ${path}`);
  return path;
};
