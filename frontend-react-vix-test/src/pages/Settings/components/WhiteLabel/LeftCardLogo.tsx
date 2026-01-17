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
  const { setBrandInfo, brandLogoTemp, brandLogo, idBrand } = useZBrandInfo();
  const { role } = useZUserProfile();
  // O `idBrand` para White Label vem do carregamento inicial (`/brand-master/self`) e fica no store de marca.
  // A alteração de logo é exclusiva de admin.
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
            brandLogoRemoved: false,
          })
        }
        onRemove={() =>
          setBrandInfo({
            brandLogoTemp: "",
            brandObjectName: "",
            // Marca a intenção de remoção para que o backend receba 'brandLogo: null' no salvar.
            brandLogoRemoved: true,
          })
        }
        disabled={isDisabled}
      />
    </>
  );
};
