import { Box, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../stores/useZTheme";
import { useZMspRegisterPage } from "../../stores/useZMspRegisterPage";
import { InputLabelAndFeedback } from "../../components/Inputs/InputLabelAndFeedback";
import { CTAsDoubleButtons } from "../../components/Buttons/CTAsDoubleButtons";
import { CheckboxLabel } from "../../components/CheckboxLabel";
import { isValidCNPJ } from "../../utils/isValidCNPJ";
import { maskCNPJ } from "../../utils/maskCNPJ";
import { maskCEP } from "../../utils/maskCEP";
import { maskPhone } from "../../utils/maskPhone";
import { useBrandMasterResources } from "../../hooks/useBrandMasterResources";
import { genStrongPass } from "../../utils/genStrongPass";
import { MIN_PASS_SIZE } from "../../configs/contants";
import { LogoUploadCard } from "../../components/LogoUploadCard";
import { TextRob16Font1S } from "../../components/Text1S";
import { Btn } from "../../components/Buttons/Btn";
import { useUserResources } from "../../hooks/useUserResources";

export const MspRegisterWizard = ({
  onUserAdminNotCreated,
}: {
  onUserAdminNotCreated: () => void;
}) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const {
    activeStep,
    setActiveStep,
    companyName,
    setCompanyName,
    locality,
    setLocality,
    cnpj,
    setCnpj,
    phone,
    setPhone,
    sector,
    setSector,
    contactEmail,
    setContactEmail,
    cep,
    setCep,
    countryState,
    setCountryState,
    city,
    setCity,
    street,
    setStreet,
    streetNumber,
    setStreetNumber,
    admName,
    setAdmName,
    admEmail,
    setAdmEmail,
    admPhone,
    setAdmPhone,
    admPassword,
    setAdmPassword,
    admUsername,
    setAdmUsername,
    mspDomain,
    setMSPDomain,
    showError,
    setShowError,
    showErrorPageTwo,
    setShowErrorPageTwo,
    showCnpjError,
    setShowCnpjError,
    showCepError,
    setShowCepError,
    isPoc,
    setIsPoc,
    discountRate,
    setDiscountRate,
    minConsumption,
    setMinConsumption,
    isEditing,
    setIsEditing,
    resetAll,
    setModalOpen,
    setMspList,
    brandLogoUrl,
    brandObjectName,
    setBrandLogo,
    setEnterOnEditing,
    setShowAddressFields,
  } = useZMspRegisterPage();

  const { createAnewBrandMaster, editBrandMaster, listAllBrands } =
    useBrandMasterResources();
  const { createUserByManager } = useUserResources();

  const requiredSideLabel = (
    <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
      {t("mspRegister.required")}
    </span>
  );

  const resetWizard = () => {
    setShowError(false);
    setShowErrorPageTwo(false);
    setShowCnpjError(false);
    setShowCepError(false);
    setIsEditing([]);
    setEnterOnEditing(false);
    setShowAddressFields(false);
    setActiveStep(0);
    resetAll();
  };

  const refreshTable = async () => {
    const response = await listAllBrands();
    setMspList(response.result);
  };

  const validateStepOne = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
    const cnpjOk = isValidCNPJ(cnpj);
    setShowCnpjError(Boolean(cnpj) && !cnpjOk);

    const requiredMissing =
      !companyName || !locality || !cnpj || !sector || !contactEmail;

    if (requiredMissing) return false;
    if (!isEmailValid) return false;
    if (!cnpjOk) return false;
    if (cep && maskCEP(cep).length !== 9) {
      setShowCepError(true);
      return false;
    }
    return true;
  };

  const handleGoToStepTwo = () => {
    setShowError(true);
    if (!validateStepOne()) return;
    if (!admPassword) {
      setAdmPassword(genStrongPass(MIN_PASS_SIZE));
    }
    setActiveStep(1);
  };

  const validateStepTwo = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admEmail);
    const requiredMissing =
      !mspDomain || !admName || !admEmail || !admPhone || !admUsername;

    if (requiredMissing) return false;
    if (!isEmailValid) return false;
    return true;
  };

  const handleConfirm = async () => {
    setShowErrorPageTwo(true);
    if (!validateStepTwo()) return;

    const discountFactor = (100 - Number(discountRate || 0)) / 100;

    const payload = {
      companyName,
      cnpj,
      phone,
      sector,
      contactEmail,
      cep,
      locality,
      countryState,
      city,
      street,
      streetNumber,
      admName,
      admEmail,
      admPhone,
      admPassword,
      brandLogo: brandObjectName || brandLogoUrl,
      position: "admin" as const,
      mspDomain,
      isPoc,
      discountRate: discountFactor,
      minConsumption: Number(minConsumption) || 0,
    };

    const editingId = isEditing[0];
    const response = editingId
      ? await editBrandMaster(editingId, {
          brandName: payload.companyName,
          cnpj: payload.cnpj,
          smsContact: payload.phone,
          setorName: payload.sector,
          emailContact: payload.contactEmail,
          location: payload.locality,
          state: payload.countryState,
          city: payload.city,
          cep: payload.cep,
          street: payload.street,
          placeNumber: payload.streetNumber,
          brandLogo: payload.brandLogo,
          domain: payload.mspDomain,
          isPoc: payload.isPoc,
          discountRate: payload.discountRate,
          minConsumption: payload.minConsumption,
        })
      : await createAnewBrandMaster(payload);

    const brandMasterId = response?.brandMaster?.idBrandMaster;
    if (!brandMasterId) return;

    await refreshTable();

    const createdUser = await createUserByManager({
      username: admUsername,
      email: admEmail,
      password: admPassword,
      role: "admin",
      idBrandMaster: brandMasterId,
      isActive: true,
      fullName: admName,
      userPhoneNumber: admPhone,
    });

    if (!createdUser) {
      onUserAdminNotCreated();
      resetWizard();
      return;
    }

    setModalOpen(editingId ? "editedMsp" : "createdMsp");
    resetWizard();
  };

  return (
    <Stack
      sx={{
        background: theme[mode].mainBackground,
        borderRadius: "16px",
        width: "100%",
        padding: "24px",
        boxSizing: "border-box",
        gap: "24px",
      }}
    >
      {activeStep === 0 ? (
        <>
          <TextRob16Font1S
            sx={{
              color: theme[mode].black,
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            {t("mspRegister.companyInfos")}
          </TextRob16Font1S>
          <Stack gap={"16px"}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                "@media (max-width: 1000px)": { gridTemplateColumns: "1fr" },
              }}
            >
              <InputLabelAndFeedback
                value={companyName}
                onChange={setCompanyName}
                label={t("mspRegister.companyName")}
                sideLabel={requiredSideLabel}
                placeholder={"Vituax"}
                errorMessage={
                  showError && !companyName ? t("mspRegister.fillField") : ""
                }
              />
              <InputLabelAndFeedback
                value={locality}
                onChange={setLocality}
                label={t("mspRegister.location")}
                sideLabel={requiredSideLabel}
                placeholder={t("mspRegister.locationPlaceholder")}
                errorMessage={
                  showError && !locality ? t("mspRegister.fillField") : ""
                }
              />
              <InputLabelAndFeedback
                value={cnpj}
                onChange={(v) => {
                  setShowCnpjError(false);
                  setCnpj(maskCNPJ(v));
                }}
                label={t("mspRegister.cnpj")}
                sideLabel={requiredSideLabel}
                placeholder={"00.000.000/0001-00"}
                errorMessage={
                  showError && !cnpj
                    ? t("mspRegister.fillField")
                    : showCnpjError
                      ? t("mspRegister.cnpjAlertMessage")
                      : ""
                }
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                "@media (max-width: 1000px)": { gridTemplateColumns: "1fr" },
              }}
            >
              <InputLabelAndFeedback
                value={phone}
                onChange={(v) => setPhone(maskPhone(v))}
                label={t("mspRegister.phone")}
                placeholder={"(00) 00000-0000"}
              />
              <InputLabelAndFeedback
                value={sector}
                onChange={setSector}
                label={t("mspRegister.sector")}
                sideLabel={requiredSideLabel}
                placeholder={t("mspRegister.sectorPlaceholder")}
                errorMessage={
                  showError && !sector ? t("mspRegister.fillField") : ""
                }
              />
              <InputLabelAndFeedback
                value={contactEmail}
                onChange={setContactEmail}
                label={t("mspRegister.contactEmail")}
                sideLabel={requiredSideLabel}
                placeholder={"contato@email.com"}
                errorMessage={
                  showError && !contactEmail
                    ? t("mspRegister.fillField")
                    : showError &&
                        contactEmail &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
                      ? t("mspRegister.emailAlertMessage")
                      : ""
                }
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "24px",
                "@media (max-width: 1100px)": { gridTemplateColumns: "1fr" },
              }}
            >
              <InputLabelAndFeedback
                value={cep}
                onChange={(v) => {
                  setShowCepError(false);
                  setCep(maskCEP(v));
                }}
                label={t("mspRegister.cep")}
                placeholder={"00000-000"}
                errorMessage={
                  showCepError ? t("mspRegister.cepAlertMessage") : ""
                }
              />
              <InputLabelAndFeedback
                value={countryState}
                onChange={setCountryState}
                label={t("mspRegister.countryState")}
                placeholder={t("mspRegister.countryStatePlaceholder")}
              />
              <InputLabelAndFeedback
                value={city}
                onChange={setCity}
                label={t("mspRegister.city")}
                placeholder={t("mspRegister.cityPlaceholder")}
              />
              <InputLabelAndFeedback
                value={street}
                onChange={setStreet}
                label={t("mspRegister.street")}
                placeholder={t("mspRegister.streetPlaceholder")}
              />
              <InputLabelAndFeedback
                value={streetNumber}
                onChange={setStreetNumber}
                label={t("mspRegister.number")}
                placeholder={"0"}
              />
            </Box>
          </Stack>

          <Divider sx={{ borderColor: theme[mode].grayLight }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              alignItems: "end",
              "@media (max-width: 1000px)": { gridTemplateColumns: "1fr" },
            }}
          >
            <InputLabelAndFeedback
              value={String(minConsumption ?? "")}
              onChange={(v) =>
                setMinConsumption(Number(v.replace(/[^\d.]/g, "")) || 0)
              }
              label={t("mspRegister.minConsumption")}
              placeholder={"0"}
              type="number"
            />
            <InputLabelAndFeedback
              value={String(discountRate ?? "")}
              onChange={(v) =>
                setDiscountRate(Math.max(0, Math.min(100, Number(v) || 0)))
              }
              label={t("mspRegister.discountPercentage")}
              placeholder={"0"}
              type="number"
              sideLabel={<span style={{ color: theme[mode].gray }}>%</span>}
              sxSidelabel={{ paddingLeft: "8px" }}
            />
            <Stack sx={{ justifyContent: "center" }}>
              <CheckboxLabel
                label={t("mspRegister.isPoc")}
                checked={isPoc}
                handleChange={() => setIsPoc(!isPoc)}
              />
            </Stack>
          </Box>

          <CTAsDoubleButtons
            handleSave={handleGoToStepTwo}
            handleRestore={resetWizard}
            labelSave={t("companyRegister.continue")}
            labelRestore={t("mspRegister.cancel")}
            sxButtonSave={{
              background: theme[mode].blue,
              color: theme[mode].btnText,
            }}
            sxButtonRestore={{
              color: theme[mode].blueDark,
              borderColor: theme[mode].blueDark,
            }}
          />
        </>
      ) : (
        <>
          <TextRob16Font1S
            sx={{
              color: theme[mode].black,
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            {t("mspRegister.stepTwoTitle")}
          </TextRob16Font1S>
          <Stack gap={"24px"}>
            <InputLabelAndFeedback
              value={mspDomain}
              onChange={setMSPDomain}
              label={t("mspRegister.mspDomain")}
              sideLabel={requiredSideLabel}
              placeholder={t("mspRegister.mspDomainPlaceholder")}
              errorMessage={
                showErrorPageTwo && !mspDomain ? t("mspRegister.fillField") : ""
              }
            />

            <Stack gap={"16px"}>
              <TextRob16Font1S
                sx={{
                  color: theme[mode].black,
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "20px",
                }}
              >
                {t("mspRegister.principalAdmin")}
              </TextRob16Font1S>
              <InputLabelAndFeedback
                value={admName}
                onChange={setAdmName}
                label={t("mspRegister.completeName")}
                sideLabel={requiredSideLabel}
                placeholder={t("mspRegister.completeNamePlaceholder")}
                errorMessage={
                  showErrorPageTwo && !admName ? t("mspRegister.fillField") : ""
                }
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "24px",
                  "@media (max-width: 1000px)": { gridTemplateColumns: "1fr" },
                }}
              >
                <InputLabelAndFeedback
                  value={admEmail}
                  onChange={setAdmEmail}
                  label={t("mspRegister.email")}
                  sideLabel={requiredSideLabel}
                  placeholder={t("mspRegister.emailPlaceholder")}
                  errorMessage={
                    showErrorPageTwo && !admEmail
                      ? t("mspRegister.fillField")
                      : showErrorPageTwo &&
                          admEmail &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admEmail)
                        ? t("mspRegister.emailAlertMessage")
                        : ""
                  }
                />
                <InputLabelAndFeedback
                  value={admPhone}
                  onChange={(v) => setAdmPhone(maskPhone(v))}
                  label={t("mspRegister.phone")}
                  sideLabel={requiredSideLabel}
                  placeholder={"(00) 00000-0000"}
                  errorMessage={
                    showErrorPageTwo && !admPhone
                      ? t("mspRegister.fillField")
                      : ""
                  }
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "24px",
                  "@media (max-width: 1000px)": { gridTemplateColumns: "1fr" },
                }}
              >
                <InputLabelAndFeedback
                  value={t("colaboratorRegister.admin")}
                  onChange={() => {}}
                  label={t("mspRegister.position")}
                  disabled
                  placeholder={t("mspRegister.positionPlaceholder")}
                />
                <InputLabelAndFeedback
                  value={admPassword}
                  onChange={setAdmPassword}
                  label={t("mspRegister.initialPassword")}
                  sideLabel={requiredSideLabel}
                  placeholder={t("mspRegister.initialPasswordPlaceholder")}
                  type="password"
                  disabled
                  errorMessage={
                    showErrorPageTwo && !admPassword
                      ? t("mspRegister.fillField")
                      : ""
                  }
                />
                <InputLabelAndFeedback
                  value={admUsername}
                  onChange={setAdmUsername}
                  label={t("colaboratorRegister.username")}
                  sideLabel={requiredSideLabel}
                  placeholder={t("loginRegister.username")}
                  errorMessage={
                    showErrorPageTwo && !admUsername
                      ? t("mspRegister.fillField")
                      : ""
                  }
                />
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: theme[mode].grayLight }} />

          <Stack gap={"8px"}>
            <InputLabelAndFeedback
              value={""}
              onChange={() => {}}
              label={t("mspRegister.companyLogo")}
              disabled
              sx={{ display: "none" }}
            />
            <Box
              sx={{
                color: theme[mode].gray,
                fontSize: "12px",
                marginTop: "-8px",
              }}
            >
              {t("mspRegister.companyLogoSubtitle")}
            </Box>
            <LogoUploadCard
              title={t("mspRegister.companyLogo")}
              subtitle={t("mspRegister.companyLogoSubtitle")}
              logoObjectName={brandObjectName || brandLogoUrl}
              onUploaded={({ objectName }) =>
                setBrandLogo({
                  brandLogoUrl: objectName,
                  brandObjectName: objectName,
                })
              }
              onRemove={() =>
                setBrandLogo({ brandLogoUrl: "", brandObjectName: "" })
              }
            />
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <CTAsDoubleButtons
              handleSave={handleConfirm}
              handleRestore={() => setActiveStep(0)}
              labelSave={t("mspRegister.confirm")}
              labelRestore={t("mspRegister.back")}
              sxButtonSave={{
                background: theme[mode].blue,
                color: theme[mode].btnText,
              }}
              sxButtonRestore={{
                color: theme[mode].blueDark,
                borderColor: theme[mode].blueDark,
              }}
            />
            <Btn
              onClick={resetWizard}
              sx={{
                height: "48px",
                minWidth: "100px",
                marginLeft: "auto",
                padding: "0 8px",
                borderRadius: "12px",
                "&:hover": { background: "transparent", opacity: 0.8 },
              }}
            >
              <TextRob16Font1S
                sx={{
                  color: theme[mode].gray,
                  fontWeight: "400",
                }}
              >
                {t("mspRegister.clear")}
              </TextRob16Font1S>
            </Btn>
          </Box>
        </>
      )}
    </Stack>
  );
};
