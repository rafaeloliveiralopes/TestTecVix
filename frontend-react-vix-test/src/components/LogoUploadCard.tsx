import { useTranslation } from "react-i18next";
import { themeColors, useZTheme } from "../stores/useZTheme";
import { useUploadFile } from "../hooks/useUploadFile";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TextRob16Font1S } from "./Text1S";
import { Box, Button, Stack } from "@mui/material";
import { UploadFileIcon } from "../icons/UploadFileIcon";
import { TextRob12Font2Xs } from "./Text2Xs";
import { CircleIcon } from "../icons/CircleIcon";
import { TextRob16FontL } from "./TextL";
import { ImgFromDB } from "./ImgFromDB";

interface IProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  logoUrl?: string | null;
  logoObjectName?: string | null;
  themeOverride?: { dark: themeColors; light: themeColors };
  onUploaded: (data: { url: string; objectName: string }) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const LogoUploadCard = ({
  title,
  subtitle,
  logoUrl,
  logoObjectName,
  themeOverride,
  onUploaded,
  onRemove,
  disabled = false,
}: IProps) => {
  const { mode, theme: appTheme } = useZTheme();
  const theme = themeOverride ?? appTheme;
  const { t } = useTranslation();
  const { handleUpload, isUploading } = useUploadFile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl ?? null);

  const hasObjectName = Boolean(logoObjectName);
  const hasPreview = Boolean(previewUrl) || hasObjectName;

  const onDrop = async (acceptedFiles: File[]) => {
    if (disabled) return;
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const response = await handleUpload(file);

    if (response?.url && response.objectName) {
      setPreviewUrl(response.url);
      onUploaded({ url: response.url, objectName: response.objectName });
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"] },
    maxSize: 50 * 1024 * 1024,
    disabled,
  });

  useEffect(() => {
    setPreviewUrl(logoUrl ?? null);
  }, [logoUrl]);

  const dropzoneBg = useMemo(() => {
    if (isDragActive) return theme[mode].grayLight;
    return theme[mode].lightV2 ?? theme[mode].mainBackground;
  }, [isDragActive, mode, theme]);

  return (
    <Stack gap={"8px"} width={"100%"}>
      <Stack gap={"4px"}>
        <TextRob16Font1S
          sx={{
            color: theme[mode].primary,
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          {title}
        </TextRob16Font1S>
        {subtitle ? (
          <TextRob12Font2Xs
            sx={{
              color: theme[mode].gray,
              fontWeight: "400",
              fontSize: "12px",
            }}
          >
            {subtitle}
          </TextRob12Font2Xs>
        ) : null}
      </Stack>

      <Box
        {...getRootProps()}
        sx={{
          width: "100%",
          height: "216px",
          border: `1px solid ${theme[mode].grayLight}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          borderRadius: "16px",
          background: dropzoneBg,
          marginBottom: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon color={theme[mode].tertiary} />
        <TextRob12Font2Xs
          sx={{
            color: theme[mode].tertiary,
            fontWeight: "400",
            fontSize: "12px",
            maxWidth: "180px",
            textAlign: "center",
            lineHeight: "20px",
            userSelect: "none",
          }}
        >
          {isUploading ? t("whiteLabel.loading") : t("whiteLabel.clickHere")}
        </TextRob12Font2Xs>
      </Box>

      {hasPreview && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Logo carregado"
              style={{
                maxWidth: "100%",
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          ) : logoObjectName ? (
            <ImgFromDB
              src={logoObjectName}
              style={{
                maxWidth: "100%",
                maxHeight: "100px",
                objectFit: "contain",
              }}
              alt="Logo carregado"
            />
          ) : null}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "8px",
          "@media (max-width: 440px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
        }}
      >
        <Button
          sx={{
            background: theme[mode].blue,
            border: `1px solid ${theme[mode].blue}`,
            color: theme[mode].btnText,
            textTransform: "none",
            borderRadius: "12px",
            flexGrow: 1,
            height: "48px",
            fontWeight: "500",
            fontSize: "16px",
            "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
          }}
          onClick={open}
          disabled={disabled}
        >
          {t("whiteLabel.changeLogo")}
        </Button>
        <Button
          sx={{
            background: "transparent",
            color: theme[mode].blueDark,
            border: `1px solid ${theme[mode].blueDark}`,
            textTransform: "none",
            borderRadius: "12px",
            flexGrow: 0,
            height: "48px",
            fontWeight: "500",
            fontSize: "16px",
            minWidth: "180px",
            "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
            "@media (max-width: 440px)": {
              minWidth: "100%",
            },
          }}
          onClick={() => {
            setPreviewUrl(null);
            onRemove();
          }}
          disabled={disabled}
        >
          {t("whiteLabel.removeLogo")}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: "12px" }}>
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.defaultSize")}
          </TextRob16FontL>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "12px" }}>
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.maxSize")}
          </TextRob16FontL>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "12px" }}>
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.acceptedFormats")}
          </TextRob16FontL>
        </Box>
      </Box>
    </Stack>
  );
};
