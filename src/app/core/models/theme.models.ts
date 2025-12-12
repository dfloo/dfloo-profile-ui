export enum MaterialTheme {
    Custom = 'custom', // TODO: finish implementing
    AzureBlue = 'azure-blue',
    CyanOrange = 'cyan-orange',
    MagentaViolet = 'magenta-violet',
    RoseRed = 'rose-red'
}

export const materialThemeOptions = [
    {
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
