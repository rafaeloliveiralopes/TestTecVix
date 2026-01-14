import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { Stack } from "@mui/material";
import { TextRob20Font1M } from "../../../components/Text1M";
import { CardSugestion } from "./CardSugestion";
import { EOS, useZVMSugestion } from "../../../stores/useZVMSugestion";

export const SugestionsCards = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { setVmSugestion } = useZVMSugestion();
  return (
    <Stack
      sx={{
        padding: "24px",
        gap: "12px",
        width: "100%",
      }}
    >
      <TextRob20Font1M
        sx={{
          color: theme[mode].primary,
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "24px",
        }}
      >
        {t("createVm.suggestions")}
      </TextRob20Font1M>
      {/* Sugestion List */}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* Mostra disco (GB) nos cards de sugestão para ficar consistente com o que será aplicado no formulário. */}
        <CardSugestion
          cpu={4}
          ram={8}
          disk={250}
          onClick={() =>
            setVmSugestion({ os: EOS.ubuntu2404, vCPU: 4, ram: 8, disk: 250 })
          }
          title={t("createVm.processingSuggestion")}
          description={t("createVm.processingDescription")}
        />
        <CardSugestion
          cpu={8}
          ram={16}
          disk={512}
          onClick={() =>
            setVmSugestion({ os: EOS.ubuntu2404, vCPU: 8, ram: 16, disk: 512 })
          }
          title={t("createVm.memorySuggestion")}
          description={t("createVm.memoryDescription")}
        />
      </Stack>
    </Stack>
  );
};
