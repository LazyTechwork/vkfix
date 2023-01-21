import GlobalConfig from "../GlobalConfig";

export const isDev = process.env.NODE_ENV === 'development';
export const isLog = GlobalConfig.Config.get('logging') as boolean;
