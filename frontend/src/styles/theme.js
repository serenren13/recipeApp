import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#077A7D",
            light: "#7AE2CF",
            dark: "06202B",
            contrastText: "#FDEB9E",
        },
        secondary: {
            main: "#FDEB9E",
            contrastText: "#06202B",
        },
        background: {
            default: "#06202B",
            paper: "#06202B",
        },
        text: {
            primary: "#FDEB9E",
            secondary: "#7AE2CF",
        },
    },

    components: {
        MuiButton: {
            defaultProps: {
                variant: "contained",
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    textTransform: "none",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#06202B",
                    border: "1px solid #077A7D",
                    borderRadius: "12px",
                },
            },
        },
    },
});

export default theme;