export enum MaterialTheme {
    Custom = 'custom',
    AzureBlue = 'azure-blue',
    CyanOrange = 'cyan-orange',
    MagentaViolet = 'magenta-violet',
    RoseRed = 'rose-red'
}

export const materialThemeOptions = [
    {
        value: MaterialTheme.Custom,
        label: 'Custom'
    }, {
        value: MaterialTheme.AzureBlue,
        label: 'Azure Blue (Light)'
    }, {
        value: MaterialTheme.RoseRed,
        label: 'Rose Red (Light)'
    }, {
        value: MaterialTheme.CyanOrange,
        label: 'Cyan Orange (Dark)'
    }, {
        value: MaterialTheme.MagentaViolet,
        label: 'Magenta Violet (Dark)'
    }
];

export type PremadeMaterialTheme =
    MaterialTheme.AzureBlue |
    MaterialTheme.RoseRed |
    MaterialTheme.CyanOrange |
    MaterialTheme.MagentaViolet;

export const materialColorOptions = [
    { label: 'Red', value: '#F44336' },
    { label: 'Pink', value: '#E91E63' },
    { label: 'Purple', value: '#9C27B0' },
    { label: 'Deep Purple', value: '#673AB7' },
    { label: 'Indigo', value: '#3F51B5' },
    { label: 'Blue', value: '#2196F3' },
    { label: 'Light Blue', value: '#03A9F4' },
    { label: 'Cyan', value: '#00BCD4' },
    { label: 'Teal', value: '#009688' },
    { label: 'Green', value: '#4CAF50' },
    { label: 'Light Green', value: '#8BC34A' },
    { label: 'Lime', value: '#CDDC39' },
    { label: 'Yellow', value: '#FFEB3B' },
    { label: 'Amber', value: '#FFC107' },
];
