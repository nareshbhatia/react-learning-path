import { PaletteType } from 'material-ui';
import brown from 'material-ui/colors/brown';
import orange from 'material-ui/colors/orange';
import red from 'material-ui/colors/red';
import createMuiTheme, { Theme } from 'material-ui/styles/createMuiTheme';
import { PaletteOptions } from 'material-ui/styles/createPalette';
import { TypographyOptions } from 'material-ui/styles/createTypography';
import { Overrides } from 'material-ui/styles/overrides';

// Extend Color with 650, 750 & 850 options
declare module 'material-ui' {
    interface Color {
        650?: string;
        750?: string;
        850?: string;
    }
}

// Extend Palette with business colors
declare module 'material-ui/styles/createPalette' {
    interface Palette {
        business: {
            buyBackground: string;
            sellBackground: string;
            buyAction: string;
            sellAction: string;
            buyText: string;
            sellText: string;
            pctCommittedDone: string;
            pctCommittedNotDone: string;
            pctUncommitted: string;
        };
    }

    interface PaletteOptions {
        business: {
            buyBackground: string;
            sellBackground: string;
            buyAction: string;
            sellAction: string;
            buyText: string;
            sellText: string;
            pctCommittedDone: string;
            pctCommittedNotDone: string;
            pctUncommitted: string;
        };
    }
}

// Extend Typography with fontWeightBold
declare module 'material-ui/styles/createTypography' {
    interface FontStyle {
        fontWeightBold: React.CSSProperties['fontWeight'];
    }
}

const paletteType: PaletteType = 'dark';

const typography: TypographyOptions = {
    fontWeightBold: 700
};

const overrides: Overrides = {
    MuiButton: {
        root: {
            // Button text should not be all upper case
            textTransform: 'none',
            fontSize: 11,
            minWidth: 60,
            minHeight: 21,
            padding: '3px 8px'
        }
    }
};

export function getTestTheme(): Theme {
    const palette: PaletteOptions = {
        primary: {
            main: brown[700]
        },
        secondary: {
            main: orange.A400
        },
        error: {
            main: red.A400
        },
        grey: {
            650: '#808080',
            750: '#575757',
            850: '#383838'
        },
        business: {
            buyBackground: '#2c4d3d',
            sellBackground: '#4d3e2e',
            buyAction: '#004734',
            sellAction: '#7a2f18',
            buyText: '#80b79d',
            sellText: '#e57a00',
            pctCommittedDone: '#f2d200',
            pctCommittedNotDone: '#404040',
            pctUncommitted: '#000000'
        },
        type: paletteType,
        background: {
            default: paletteType === 'light' ? '#ffffff' : '#262626'
        }
    };
    return createMuiTheme({ palette, typography, overrides });
}
