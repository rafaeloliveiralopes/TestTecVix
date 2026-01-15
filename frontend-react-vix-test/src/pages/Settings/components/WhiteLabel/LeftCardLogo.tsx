import { useTranslation } from "react-i18next";
import { themeColors } from "../../../../stores/useZTheme";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";
import { LogoUploadCard } from "../../../../components/LogoUploadCard";

interface IWhiteLabelChildProps {
  theme: {
    dark: themeColors;
    light: themeColors;
  };
}

export const LeftCardLogo = ({ theme }: IWhiteLabelChildProps) => {
  const { t } = useTranslation();
  const { setBrandInfo, brandLogoTemp } = useZBrandInfo();

  return (
    <>
      <LogoUploadCard
        title={t("whiteLabel.brandLogo")}
        logoUrl={brandLogoTemp}
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
      />
    </>
  );
};
