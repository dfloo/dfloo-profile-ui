import { MaterialTheme } from '@core/models';

export enum FontFamily {
    Roboto = 'Roboto',
    Lexend = 'Lexend',
    ComicRelief = 'Comic Relief',
    Courgette = 'Courgette'
}

export interface CustomThemeConfig {
    fontFamily?: FontFamily
    primary?: string;
    accent?: string;
    dark?: boolean;
}

export interface Settings {
    materialTheme: MaterialTheme;
    customThemeConfig?: CustomThemeConfig
}

export const defaultSettings: Settings = {
    materialTheme: MaterialTheme.AzureBlue
};

export const fontFamilyOptions = [
    FontFamily.Roboto,
    FontFamily.ComicRelief,
    FontFamily.Lexend,
    FontFamily.Courgette,
].map(f => ({ label: f, value: f }));
