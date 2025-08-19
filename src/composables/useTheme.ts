import { ref, computed } from "vue";
import { darkTheme, lightTheme, type GlobalThemeOverrides } from "naive-ui";
import { useCssVar } from "@vueuse/core";

export function useTheme() {
    // Theme state
    const isDark = ref(false);

    // CSS variables
    const primaryColor = useCssVar("--color-primary");
    const primaryColor100 = useCssVar("--color-primary-100");
    const primaryColor200 = useCssVar("--color-primary-200");
    const primaryColor500 = useCssVar("--color-primary-500");
    const primaryColor600 = useCssVar("--color-primary-600");
    const primaryColor700 = useCssVar("--color-primary-700");
    const primaryColor800 = useCssVar("--color-primary-800");

    const secondaryColor400 = useCssVar("--color-secondary-400");
    const secondaryColor500 = useCssVar("--color-secondary-500");
    const secondaryColor600 = useCssVar("--color-secondary-600");
    const secondaryColor700 = useCssVar("--color-secondary-700");
    const secondaryColor800 = useCssVar("--color-secondary-800");
    const secondaryColor900 = useCssVar("--color-secondary-900");
    const secondaryColor100 = useCssVar("--color-secondary-100");
    const secondaryColor200 = useCssVar("--color-secondary-200");

    const successColor500 = useCssVar("--color-success-500");
    const dangerColor500 = useCssVar("--color-danger-500");
    const warningColor500 = useCssVar("--color-warning-500");

    // dark theme
    const darkThemeOverrides = computed<GlobalThemeOverrides>(() => ({
        common: {
            primaryColor: primaryColor.value,
            primaryColorHover: primaryColor700.value,
            primaryColorPressed: primaryColor800.value,
            primaryColorSuppl: primaryColor700.value,
            borderRadius: "8px",
            cardColor: secondaryColor800.value,
            borderColor: secondaryColor700.value,
            baseColor: "#ffffff",
            textColorBase: "#ffffff",
            bodyColor: secondaryColor900.value,
            iconColor: secondaryColor400.value,
            textColor1: secondaryColor500.value,
            popoverColor: secondaryColor800.value,
            warningColor: warningColor500.value,
            errorColor: dangerColor500.value,
            successColor: successColor500.value,
        },
        Layout: {
            headerColor: secondaryColor800.value,
        },
        Button: {},
        Card: {
            borderColor: secondaryColor700.value,
            titleTextColor: "#fff",
        },
        Input: {
            color: secondaryColor800.value,
            colorDisabled: secondaryColor600.value,
            colorFocus: secondaryColor700.value,
            placeholderColor: secondaryColor400.value,
            border: `1px solid ${secondaryColor700.value}`,
        },
        Checkbox: {
            checkMarkColor: "#fff",
        },
        Select: {
            peers: {
                InternalSelection: {
                    color: secondaryColor800.value,
                    placeholderColor: secondaryColor400.value,
                    border: `1px solid ${secondaryColor700.value}`,
                },
            },
        },
        Modal: {
            peers: {
                Card: {
                    colorModal: secondaryColor900.value,
                },
            },
        },
        Tag: {
            borderRadius: "16px",
            colorPrimary: primaryColor.value,
            colorWarning: warningColor500.value,
            colorError: dangerColor500.value,
            colorSuccess: successColor500.value,
        },
        Progress: {
            fillColorWarning: warningColor500.value,
            fillColorError: dangerColor500.value,
            fillColorSuccess: successColor500.value,
            fillColor: primaryColor.value,
            fillColorInfo: primaryColor.value,
        },
        DataTable: {
            thTextColor: "#fff",
            loadingColor:primaryColor600.value,
            loadingSize:'44px'
        },
    }));

    // light theme
    const lightThemeOverrides = computed<GlobalThemeOverrides>(() => ({
        common: {
            primaryColor: primaryColor.value,
            primaryColorHover: primaryColor700.value,
            primaryColorPressed: primaryColor800.value,
            primaryColorSuppl: primaryColor700.value,
            borderRadius: "8px",
            cardColor: "#fff",
            borderColor: secondaryColor200.value,
            baseColor: "#ffffff",
            textColorBase: "#222222",
            bodyColor: "#f7f7f7",
            iconColor: secondaryColor600.value,
            textColor1: secondaryColor700.value,
            popoverColor: "#fff",
            warningColor: warningColor500.value,
            errorColor: dangerColor500.value,
            successColor: successColor500.value,
        },
        Layout: {
            headerColor: "#fff",
        },
        Button: {},
        Card: {
            borderColor: secondaryColor200.value,
            titleTextColor: "#222",
        },
        Input: {
            color: "#fff",
            colorDisabled: secondaryColor100.value,
            colorFocus: secondaryColor200.value,
            placeholderColor: secondaryColor600.value,
            border: `1px solid ${secondaryColor200.value}`,
        },
        Checkbox: {
            checkMarkColor: "#222",
        },
        Select: {
            peers: {
                InternalSelection: {
                    color: "#fff",
                    placeholderColor: secondaryColor600.value,
                    border: `1px solid ${secondaryColor200.value}`,
                },
            },
        },
        Modal: {
            peers: {
                Card: {
                    colorModal: "#fff",
                },
            },
        },
        Tag: {
            borderRadius: "16px",
            colorPrimary: primaryColor.value,
            colorWarning: warningColor500.value,
            colorError: dangerColor500.value,
            colorSuccess: successColor500.value,
        },
        Progress: {
            fillColorWarning: warningColor500.value,
            fillColorError: dangerColor500.value,
            fillColorSuccess: successColor500.value,
            fillColor: primaryColor.value,
            fillColorInfo: primaryColor.value,
        },
        DataTable: {
            thTextColor: "#222",
        },
    }));

    const themeCustom = computed(() =>
        isDark.value ? darkThemeOverrides.value : lightThemeOverrides.value
    );
    const theme = computed(() => (isDark.value ? darkTheme : lightTheme));

    // Utility: set <html> class and persist
    function applyHtmlClass(dark: boolean) {
        const html = document.documentElement;
        if (dark) {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    // On load: initialize theme from localStorage or system
    function initTheme() {
        if (typeof window !== "undefined") {
            const userPref = localStorage.getItem("theme");
            if (userPref === "dark") {
                isDark.value = true;
            } else if (userPref === "light") {
                isDark.value = false;
            } else {
                // System preference
                isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
            applyHtmlClass(isDark.value);
        }
    }
    initTheme();

    function toggleTheme() {
        isDark.value = !isDark.value;
        applyHtmlClass(isDark.value);
    }

    return {
        isDark,
        toggleTheme,
        theme,
        themeCustom,
    };
}