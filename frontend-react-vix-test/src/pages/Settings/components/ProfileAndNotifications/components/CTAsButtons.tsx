import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { TextRob16FontL } from "../../../../../components/TextL";
import { toast } from "react-toastify";
import { useZFormProfileNotifications } from "../../../../../stores/useZFormProfileNotifications";
import { useUserResources } from "../../../../../hooks/useUserResources";
import { useBrandMasterResources } from "../../../../../hooks/useBrandMasterResources";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import { useZBrandInfo } from "../../../../../stores/useZBrandStore";

export const CTAsButtons = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const {
    role,
    idBrand: idBrandUserProfile,
    objectName,
    username: usernameProfile,
    userEmail: userEmailProfile,
    userPhoneNumber: userPhoneNumberProfile,
    fullName: fullNameProfile,
    profileImgRemoved,
    setUser,
  } = useZUserProfile();
  const { idBrand: idBrandBrandInfo, emailContact, smsContact, timezone } =
    useZBrandInfo();
  const { updateUser, updateSelfPassword } = useUserResources();
  const { updateBrandMasterInfo } = useBrandMasterResources();
  const {
    fullNameForm,
    userName,
    userEmail,
    userPhone,
    password,
    confirmPassword,
    companyEmail,
    companySMS,
    timeZone,
    setFormProfileNotifications,
  } = useZFormProfileNotifications();

  // Notificações corporativas só existem para usuários vinculados a um BrandMaster (MSP).
  const idBrandMaster = idBrandBrandInfo ?? idBrandUserProfile;
  const canEditNotifications = Boolean(
    idBrandMaster && (role === "admin" || role === "manager"),
  );

  const validate = () => {
    let isValid = true;

    // `fullName` é opcional no backend. Valida somente se o usuário preencher.
    if (fullNameForm.value && fullNameForm.value.length < 4) {
      isValid = false;
      setFormProfileNotifications({
        fullNameForm: {
          ...fullNameForm,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    } else if (fullNameForm.errorMessage) {
      setFormProfileNotifications({
        fullNameForm: { ...fullNameForm, errorMessage: "" },
      });
    }

    if (!userName.value || userName.value.length < 4) {
      isValid = false;
      setFormProfileNotifications({
        userName: {
          ...userName,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail.value || !emailRegex.test(userEmail.value)) {
      isValid = false;
      setFormProfileNotifications({
        userEmail: {
          ...userEmail,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    if (password.value) {
      if (password.value.length < 8) {
        isValid = false;
        setFormProfileNotifications({
          password: {
            ...password,
            errorMessage: t("profileAndNotifications.invalidData"),
          },
        });
      }

      if (password.value !== confirmPassword.value) {
        isValid = false;
        setFormProfileNotifications({
          password: {
            ...password,
            errorMessage: t("colaboratorRegister.dontMatch"),
          },
          confirmPassword: {
            ...confirmPassword,
            errorMessage: t("colaboratorRegister.dontMatch"),
          },
        });
      }
    }

    if (canEditNotifications) {
      if (!companyEmail.value || !emailRegex.test(companyEmail.value)) {
        isValid = false;
        setFormProfileNotifications({
          companyEmail: {
            ...companyEmail,
            errorMessage: t("profileAndNotifications.invalidData"),
          },
        });
      }
      if (companySMS.value && companySMS.value.length > 20) {
        isValid = false;
        setFormProfileNotifications({
          companySMS: {
            ...companySMS,
            errorMessage: t("profileAndNotifications.invalidData"),
          },
        });
      }
    }

    return isValid;
  };

  const handleSave = async () => {
    const allValid = validate();
    if (!allValid) return toast.error(t("profileAndNotifications.errorForm"));

    const isRemovingProfileImg = Boolean(profileImgRemoved);

    // Atualiza dados do usuário logado (contato + foto de perfil, se enviada).
    const userUpdated = await updateUser({
      fullName: fullNameForm.value || null,
      username: userName.value,
      email: userEmail.value,
      userPhoneNumber: userPhone.value || null,
      ...(objectName ? { profileImgUrl: objectName } : {}),
      ...(isRemovingProfileImg ? { profileImgUrl: null } : {}),
    });
    if (!userUpdated) return;

    // Limpa estado temporário da imagem após persistir (evita reenvio em saves futuros).
    setFormProfileNotifications({
      password: { ...password, errorMessage: "" },
      confirmPassword: { ...confirmPassword, errorMessage: "" },
    });

    // Atualiza a senha somente se o usuário preencheu os campos.
    if (password.value) {
      const ok = await updateSelfPassword(password.value);
      if (!ok) return;
      // Limpa campos de senha após salvar com sucesso.
      setFormProfileNotifications({
        password: { ...password, value: "", errorMessage: "" },
        confirmPassword: { ...confirmPassword, value: "", errorMessage: "" },
      });
    }

    // Reseta flags/temporários de imagem do perfil.
    // (A imagem persistida continua em `profileImgUrl` via resposta do backend.)
    setUser({
      objectName: "",
      imageUrl: "",
      profileImgRemoved: false,
    });

    // Notificações (dados do BrandMaster) somente para admin/manager.
    if (canEditNotifications) {
      const brandUpdated = await updateBrandMasterInfo({
        emailContact: companyEmail.value,
        ...(companySMS.value ? { smsContact: companySMS.value } : {}),
        ...(timeZone.value ? { timezone: timeZone.value } : {}),
      });
      if (!brandUpdated) return;
    }

    return toast.success(t("generic.dataSavesuccess"));
  };

  const handleReset = () => {
    // Restaura o formulário com os valores atuais do estado (e limpa senha).
    setFormProfileNotifications({
      fullNameForm: {
        ...fullNameForm,
        value: fullNameProfile || "",
        errorMessage: "",
      },
      userName: { ...userName, value: usernameProfile || "", errorMessage: "" },
      userEmail: { ...userEmail, value: userEmailProfile || "", errorMessage: "" },
      userPhone: {
        ...userPhone,
        value: userPhoneNumberProfile || "",
        errorMessage: "",
      },
      companyEmail: {
        ...companyEmail,
        value: emailContact || "",
        errorMessage: "",
      },
      companySMS: {
        ...companySMS,
        value: smsContact || "",
        errorMessage: "",
      },
      timeZone: { ...timeZone, value: timezone || "", errorMessage: "" },
      password: { ...password, value: "", errorMessage: "" },
      confirmPassword: { ...confirmPassword, value: "", errorMessage: "" },
    });
  };

  return (
    <Stack
      flexDirection={"row"}
      sx={{
        gap: "24px",
        "@media (max-width: 745px)": {
          flexDirection: "column",
        },
      }}
    >
      <Button
        sx={{
          background: theme[mode].blue,
          border: `1px solid ${theme[mode].blue}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleSave}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].btnText,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.saveChanges")}
        </TextRob16FontL>
      </Button>
      <Button
        sx={{
          background: "transparent",
          border: `1px solid ${theme[mode].blueDark}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleReset}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].blueDark,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.redefineAllData")}
        </TextRob16FontL>
      </Button>
    </Stack>
  );
};
