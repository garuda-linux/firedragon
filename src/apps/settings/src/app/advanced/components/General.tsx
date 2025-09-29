import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/common/card.tsx";
import { Switch } from "@/components/common/switch.tsx";
import { useFormContext } from "react-hook-form";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdvancedFormData, type ConstantsData } from "@/types/pref.ts";
import { useEffect, useState } from "react";
import { RestartModal } from "@/components/common/restart-modal.tsx";
import { useConstantsData } from "@/app/about/dataManager.ts";

export function General() {
    const { t } = useTranslation();
    const { getValues, setValue } = useFormContext<AdvancedFormData>();
    const [showEnableSyncRestartModal, setShowEnableSyncRestartModal] = useState(false);
    const [showAllowUserChromeCssRestartModal, setShowAllowUserChromeCssRestartModal] = useState(false);
    const [showHidePasswdmgrRestartModal, setShowHidePasswdmgrRestartModal] = useState(false);

    const [constantsData, setConstantsData] = useState<ConstantsData | null>(
        null,
    );
    useEffect(() => {
        async function fetchConstantsData() {
            const data = await useConstantsData();
            setConstantsData(data);
        }
        fetchConstantsData();
    }, []);

    return (
        <>
            {showEnableSyncRestartModal ? (
                <RestartModal
                    onClose={() => setShowEnableSyncRestartModal(false)}
                    label={t("advanced.general.enableSyncNeedsRestartDescription")}
                />
            ) : null}
            {showAllowUserChromeCssRestartModal ? (
                <RestartModal
                    onClose={() => setShowAllowUserChromeCssRestartModal(false)}
                    label={t("advanced.general.allowUserChromeCssNeedsRestartDescription")}
                />
            ) : null}
            {showHidePasswdmgrRestartModal ? (
                <RestartModal
                    onClose={() => setShowHidePasswdmgrRestartModal(false)}
                    label={t("advanced.general.hidePasswdmgrNeedsRestartDescription")}
                />
            ) : null}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="size-5" />
                        {t('advanced.general.header')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="enable-extension-update">
                                {t('advanced.general.enableExtensionUpdate')}
                            </label>
                            <Switch
                                id="enable-extension-update"
                                checked={getValues("enableExtensionUpdate")}
                                onChange={(e) => {
                                    setValue("enableExtensionUpdate", e.target.checked);
                                    setValue("enableExtensionAutoUpdate", e.target.checked);
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.enableExtensionUpdateDescription")}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="enable-sync">
                                {t('advanced.general.enableSync')}
                            </label>
                            <Switch
                                id="enable-sync"
                                checked={getValues("enableSync")}
                                onChange={(e) => {
                                    setValue("enableSync", e.target.checked);
                                    setShowEnableSyncRestartModal(true);
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.enableSyncDescription")}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="enable-middlemouse-paste">
                                {t('advanced.general.enableMiddlemousePaste')}
                            </label>
                            <Switch
                                id="enable-middlemouse-paste"
                                checked={getValues("enableMiddlemousePaste")}
                                onChange={(e) => {
                                    setValue("enableClipboardAutocopy", e.target.checked);
                                    setValue("enableMiddlemousePaste", e.target.checked);
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.enableMiddlemousePasteDescription")}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="allow-user-chrome-css">
                                {t('advanced.general.allowUserChromeCss')}
                            </label>
                            <Switch
                                id="allow-user-chrome-css"
                                checked={getValues("allowUserChromeCss")}
                                onChange={(e) => {
                                    setValue("allowUserChromeCss", e.target.checked);
                                    setShowAllowUserChromeCssRestartModal(true);
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.allowUserChromeCssDescription")}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="hide-passwdmgr">
                                {t('advanced.general.hidePasswdmgr')}
                            </label>
                            <Switch
                                id="hide-passwdmgr"
                                checked={getValues("hidePasswdmgr")}
                                onChange={(e) => {
                                    setValue("hidePasswdmgr", e.target.checked);
                                    setShowHidePasswdmgrRestartModal(true);
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.hidePasswdmgrDescription")}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="enable-translations">
                                {t('advanced.general.enableTranslations')}
                            </label>
                            <Switch
                                id="enable-translations"
                                checked={getValues("enableTranslations") && getValues('servicesSettingsServer') === constantsData?.REMOTE_SETTINGS_SERVER_URL}
                                onChange={(e) => {
                                    setValue("enableTranslations", e.target.checked);
                                    setValue('servicesSettingsServer', e.target.checked ? constantsData!.REMOTE_SETTINGS_SERVER_URL : 'https://%.invalid');
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.enableTranslationsDescription")}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="enable-default-shortcuts">
                                {t('advanced.general.enableDefaultShortcuts')}
                            </label>
                            <Switch
                                id="enable-default-shortcuts"
                                checked={getValues("enableDefaultShortcuts")}
                                onChange={(e) => {
                                    setValue("enableDefaultShortcuts", e.target.checked);
                                }}
                            />
                        </div>
                        <div className="text-sm text-base-content/70">
                            {t("advanced.general.enableDefaultShortcutsDescription")}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
