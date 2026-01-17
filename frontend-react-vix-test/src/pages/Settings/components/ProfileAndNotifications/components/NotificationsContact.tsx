import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { Stack } from "@mui/material";
import { TextRob16FontL } from "../../../../../components/TextL";
import { InputLabelAndFeedback } from "../../../../../components/Inputs/InputLabelAndFeedback";
import { EditCirclePencilIcon } from "../../../../../icons/EditCirclePencilIcon";
import { DropDrownLabel } from "../../../../../components/Inputs/DropDrownLabel";
import { useGenericResources } from "../../../../../hooks/useGenericResources";
import {
  IFormProfileNotificationsVar,
  useZFormProfileNotifications,
} from "../../../../../stores/useZFormProfileNotifications";
import { useZBrandInfo } from "../../../../../stores/useZBrandStore";
import { useEffect } from "react";
import { maskPhone } from "../../../../../utils/maskPhone";
import { TextRob12Font2Xs } from "../../../../../components/Text2Xs";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";

export const NotificationsContact = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { timeZones } = useGenericResources();
  const { companyEmail, companySMS, timeZone, setFormProfileNotifications } =
    useZFormProfileNotifications();
  const { idBrand: idBrandInfo, emailContact, smsContact, timezone } =
    useZBrandInfo();
  const { idBrand: idBrandUser } = useZUserProfile();
  const { contactEmail, phoneNumber } = {
    contactEmail: emailContact,
    phoneNumber: smsContact,
  };
  const hasBrandMaster = Boolean(idBrandInfo ?? idBrandUser);

  const validEmail = () => {
    // Usuários Vituax (sem BrandMaster) não possuem onde persistir notificações corporativas.
    if (!hasBrandMaster) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar email
    if (!companyEmail.value) {
      return setFormProfileNotifications({
        companyEmail: {
          ...companyEmail,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
    }

    if (
      !emailRegex.test(companyEmail.value) ||
      companyEmail.value.length > 100
    ) {
      return setFormProfileNotifications({
        companyEmail: {
          ...companyEmail,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    // Se o email for válido
    return setFormProfileNotifications({
      companyEmail: {
        ...companyEmail,
        errorMessage: "",
      },
    });
  };

  const validPhoneNumber = () => {
    // Usuários Vituax (sem BrandMaster) não possuem onde persistir notificações corporativas.
    if (!hasBrandMaster) return;
    const digits = companySMS.value.replace(/\D/g, "");
    if (!companySMS.value) {
      return setFormProfileNotifications({
        companySMS: {
          ...companySMS,
          errorMessage: "",
        },
      });
    }
    // Usa o mesmo padrão de telefone das telas de cadastro
    if (digits.length !== 10 && digits.length !== 11) {
      return setFormProfileNotifications({
        companySMS: {
          ...companySMS,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    // Se o telefone for válido
    return setFormProfileNotifications({
      companySMS: {
        ...companySMS,
        errorMessage: "",
      },
    });
  };

  const handleChange = (
    key: keyof IFormProfileNotificationsVar,
    val: string,
  ) => {
    // Mantém o formato `{ value, errorMessage }` do campo, preservando o erro atual.
    const fieldMap = {
      companyEmail,
      companySMS,
      timeZone,
    } as const;
    const currentField = fieldMap[key as keyof typeof fieldMap];
    setFormProfileNotifications({
      [key]: {
        ...currentField,
        value: val,
      },
    });
  };

  useEffect(() => {
    setFormProfileNotifications({
      companyEmail: {
        value: contactEmail || emailContact || "",
        // Quando não há BrandMaster, evita manter erros antigos no estado.
        errorMessage: "",
      },
      companySMS: {
        value: phoneNumber || smsContact || "",
        errorMessage: "",
      },
      timeZone: {
        value: timezone || "",
        errorMessage: "",
      },
    });
  }, [
    contactEmail,
    emailContact,
    hasBrandMaster,
    phoneNumber,
    setFormProfileNotifications,
    smsContact,
    timezone,
  ]);

  return (
    <Stack
      sx={{
        gap: "24px",
      }}
    >
      {/* Title */}
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].black,
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {t("profileAndNotifications.notifications")}
        </TextRob16FontL>
        {!hasBrandMaster ? (
          <TextRob12Font2Xs sx={{ color: theme[mode].gray }}>
            Notificações corporativas são configuradas no nível do MSP (BrandMaster).
            Como este usuário não está vinculado a um MSP, estas alterações não serão
            persistidas.
          </TextRob12Font2Xs>
        ) : null}
      </Stack>
      {/* Inputs */}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "24px",
          "@media (max-width: 745px)": {
            flexDirection: "column",
          },
        }}
      >
        <InputLabelAndFeedback
          label={t("profileAndNotifications.email")}
          value={companyEmail.value}
          onChange={(val) => handleChange("companyEmail", val)}
          placeholder={"contato@email.com"}
          errorMessage={companyEmail.errorMessage}
          onBlur={() => validEmail()}
          icon={
            <EditCirclePencilIcon
              fill={
                companyEmail.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.sms")}
          value={companySMS.value}
          onChange={(val) => handleChange("companySMS", maskPhone(val))}
          placeholder={"(00) 00000-0000"}
          errorMessage={companySMS.errorMessage}
          onBlur={() => validPhoneNumber()}
          icon={
            <EditCirclePencilIcon
              fill={
                companySMS.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
        />
        {
          <DropDrownLabel
            label={t("profileAndNotifications.timeZone")}
            data={timeZones}
            value={
              timeZone.value
                ? { label: timeZone.value, value: timeZone.value }
                : null
            }
            onChange={(val) => {
              if (!val) return handleChange("timeZone", "");
              return handleChange("timeZone", val.label);
            }}
          />
        }
      </Stack>
    </Stack>
  );
};
