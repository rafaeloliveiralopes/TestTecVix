import { useTranslation } from "react-i18next";
import { themeColors } from "../../../../stores/useZTheme";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";
import { LogoUploadCard } from "../../../../components/LogoUploadCard";
import { useZUserProfile } from "../../../../stores/useZUserProfile";

interface IWhiteLabelChildProps {
  theme: {
    dark: themeColors;
    light: themeColors;
  };
}

export const LeftCardLogo = ({ theme }: IWhiteLabelChildProps) => {
  const { t } = useTranslation();
  const { setBrandInfo, brandLogoTemp, brandLogo } = useZBrandInfo();
  const { role, idBrand } = useZUserProfile();
  // White Label só faz sentido para usuário com BrandMaster; e a alteração de logo é exclusiva de admin.
  const isDisabled = role !== "admin" || !idBrand;

  return (
    <>
      <LogoUploadCard
        title={t("whiteLabel.brandLogo")}
        logoUrl={brandLogoTemp || brandLogo}
        themeOverride={theme}
        onUploaded={({ url, objectName }) =>
          setBrandInfo({
            brandLogoTemp: url,
            brandObjectName: objectName,
          })
        }
        onRemove={() =>
          setBrandInfo({
            brandLogoTemp: "",
            brandObjectName: "",
          })
        }
        disabled={isDisabled}
      />
    </>
  );
};
