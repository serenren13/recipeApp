// Reusable sx objects for consistent styling across the app

// Page wrapper — used on every page
export const pageWrapperSx = {
    backgroundColor: "background.default",
    minHeight: "100vh",
    px: 4,
    py: 4,
};

// Section header row — title + action button
export const sectionHeaderSx = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
};

// Active (filled) chip
export const chipActiveSx = {
    backgroundColor: "primary.main",
    color: "secondary.main",
    borderColor: "primary.main",
    cursor: "pointer",
    "& .MuiChip-deleteIcon": { color: "secondary.main" },
};

// Outlined (inactive) chip
export const chipOutlinedSx = {
    backgroundColor: "transparent",
    color: "text.secondary",
    borderColor: "primary.main",
    cursor: "pointer",
};

// Auth card — centered card on SignIn and Register
export const authCardSx = {
    width: "100%",
    maxWidth: 400,
    p: 4,
    border: "1px solid",
    borderColor: "primary.main",
    borderRadius: "12px",
};

// TextField — search and input styling
export const textFieldSx = {
    input: { color: "text.primary" },
    input: { color: "text.secondary" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "primary.main" },
        "&:hover fieldset": { borderColor: "primary.light" },
    },
};

// Auth page wrapper — centers the card on screen
export const authPageWrapperSx = {
    minHeight: "100vh",
    backgroundColor: "background.default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};