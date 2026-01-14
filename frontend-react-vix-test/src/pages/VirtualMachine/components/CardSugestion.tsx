import { Stack } from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { TextRob20Font1MB } from "../../../components/Text1MB";
import { useTranslation } from "react-i18next";
import { TextRob12Font2Xs } from "../../../components/Text2Xs";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob14FontXsB } from "../../../components/TextXsB";

interface IProps {
  cpu?: number;
  ram?: number;
  disk?: number;
  title: string;
  description: string;
  onClick: () => void;
}
export const CardSugestion = ({
  cpu,
  ram,
  disk,
  title,
  description,
  onClick,
}: IProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        backgroundColor: theme[mode].light,
        border: `1px solid ${theme[mode].grayLightV2}`,
        borderRadius: "8px",
        height: "225px",
        padding: "16px",
        gap: "8px",
        width: "100%",
        maxWidth: "200px",
        justifyContent: "space-between",
      }}
    >
      <Stack
        sx={{
          gap: "8px",
        }}
      >
        <TextRob20Font1MB
          sx={{
            color: theme[mode].black,
            width: "100%",
            fontSize: "14px",
            fontFamily: "Roboto",
            fontWeight: "500",
            lineHeight: "20px",
            wordWrap: "break-word",
          }}
        >
          {title}
        </TextRob20Font1MB>

        <TextRob12Font2Xs
          sx={{
            color: theme[mode].gray,
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "20px",
          }}
        >
          {description}
        </TextRob12Font2Xs>
      </Stack>

      <Stack
        sx={{
          borderBottom: `1px solid ${theme[mode].grayLightV2}`,
          height: "0px",
        }}
      />
      {/* Tags */}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* CPU */}
        {cpu && (
          <Stack
            flexDirection={"row"}
            gap={"8px"}
            sx={{
              backgroundColor: "transparent",
              borderRadius: "4px",
              width: "72px",
              height: "20px",
              alignItems: "center",
              padding: "2px 4px",
              border: `1px solid ${theme[mode].black}`,
            }}
          >
            <TextRob12Font2Xs
              sx={{
                color: theme[mode].black,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {t("createVm.cpuSuggestion")}
            </TextRob12Font2Xs>
            <TextRob12Font2Xs
              sx={{
                color: theme[mode].black,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {cpu}
            </TextRob12Font2Xs>
          </Stack>
        )}
        {/* RAM */}
        {ram && (
          <Stack
            flexDirection={"row"}
            gap={"8px"}
            sx={{
              backgroundColor: "transparent",
              borderRadius: "4px",
              width: "72px",
              height: "20px",
              alignItems: "center",
              padding: "2px 4px",
              border: `1px solid ${theme[mode].black}`,
            }}
          >
            <TextRob12Font2Xs
              sx={{
                color: theme[mode].black,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {t("createVm.ramSuggestion")}
            </TextRob12Font2Xs>
            <TextRob12Font2Xs
              sx={{
                color: theme[mode].black,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {ram}
            </TextRob12Font2Xs>
          </Stack>
        )}
        {/* Disk */}
        {disk && (
          <Stack
            flexDirection={"row"}
            gap={"8px"}
            sx={{
              backgroundColor: "transparent",
              borderRadius: "4px",
              width: "80px",
              height: "20px",
              alignItems: "center",
              padding: "2px 4px",
              border: `1px solid ${theme[mode].black}`,
            }}
            >
            <TextRob12Font2Xs
              sx={{
                color: theme[mode].black,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {t("home.disk")}
            </TextRob12Font2Xs>
            <TextRob12Font2Xs
              sx={{
                color: theme[mode].black,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "16px",
              }}
            >
              {disk}
            </TextRob12Font2Xs>
          </Stack>
        )}
      </Stack>
      <Btn
        onClick={onClick}
        sx={{
          paddingLeft: "9px",
          paddingRight: "9px",
          paddingTop: "12px",
          paddingBottom: "12px",
          borderRadius: "4px",
          border: "1px solid",
          borderColor: theme[mode].blueDark,
          justifyContent: "center",
          alignItems: "center",
          display: "inline-flex",
          height: "40px",
        }}
      >
        <TextRob14FontXsB
          sx={{
            color: theme[mode].blueDark,
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "16px",
          }}
        >
          {t("createVm.suggestionBtn")}
        </TextRob14FontXsB>
      </Btn>
    </Stack>
  );
};
