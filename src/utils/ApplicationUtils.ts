import i18n from "@/plugins/VueI18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { markRaw } from "vue";
import { CircleCheck, CircleClose, InfoFilled, Warning } from "@element-plus/icons-vue";
import LocalStorageUtils from "@/utils/LocalStorageUtils";

export default class ApplicationUtils {
    private static readonly applicationName = "DevTrack";
    private static suffix = this.applicationName;

    public static locale = i18n.global.messages[i18n.global.locale];

    public static setTitle(prefix?: string, suffix?: string, separator?: string) {
        if (prefix)
            if (suffix)
                if (separator)
                    document.title = prefix + " " + separator + " " + suffix;
                else
                    document.title = prefix + " - " + suffix;
            else
                document.title = prefix + " - " + this.suffix;
        else
            document.title = this.applicationName;
    }

    public static showMessage(message: string | String, type: "success" | "warning" | "info" | "error"): void {
        ElMessage({
            showClose: false,
            message: message.valueOf(),
            type,
            duration: 3000
        });
    }

    public static async showMessageBox(message: string, type: "success" | "warning" | "info" | "error" | undefined, button: "OkCancel" | undefined) {
        let title = this.locale.message.title.information;
        let icon = undefined;
        let confirmButtonText = this.locale.message.button.ok;
        let cancelButtonText = undefined;

        if (type === "success") {
            title = this.locale.message.title.success;
            type = "success";
            icon = markRaw(CircleCheck);
        }
        if (type === "warning") {
            title = this.locale.message.title.warning;
            icon = markRaw(Warning);
        }
        if (type === "info") {
            title = this.locale.message.title.information;
            icon = markRaw(InfoFilled);
        }
        if (type === "error") {
            title = this.locale.message.title.error;
            icon = markRaw(CircleClose);
        }

        if (button === "OkCancel") {
            confirmButtonText = this.locale.message.button.ok;
            cancelButtonText = this.locale.message.button.cancel;
        }

        let context = "<div>";
        let count = 0;
        message.split("\n").map(value => {
            if (count > 0)
                context += "<br/>";
            context += ("<span>" + value + "<span>");
            count++;
        });
        context += "</div>";

        let result: boolean = false;
        return ElMessageBox({
            title,
            message: context,
            showConfirmButton: true,
            confirmButtonText,
            showCancelButton: cancelButtonText !== undefined,
            cancelButtonText,
            type,
            icon,
            dangerouslyUseHTMLString: true
        });
    }

    public static clearStorage(): void {
        sessionStorage.clear();
        localStorage.clear();
    }

    public static changeLocale(locale: typeof i18n.global.locale): boolean {
        if (i18n.global.locale === locale) return false;

        i18n.global.locale = locale;
        LocalStorageUtils.setLocale(locale);
        this.locale = i18n.global.messages[i18n.global.locale];

        return true;
    }
}
