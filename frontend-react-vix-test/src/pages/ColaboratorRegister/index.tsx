import { Box, Button, IconButton, Modal, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { maskPhone } from "../../utils/maskPhone";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { TextRob16Font1S } from "../../components/Text1S";
import { TextRob14Font1Xs } from "../../components/Text1Xs";
import { TextRob12Font2Xs } from "../../components/Text2Xs";
import { InputLabelAndFeedback } from "../../components/Inputs/InputLabelAndFeedback";
import { DropDownDark } from "../../components/Inputs/DropDownDark";
import { DropDown } from "../../components/Inputs/DropDown";
import { CTAsDoubleButtons } from "../../components/Buttons/CTAsDoubleButtons";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { CheckCircleIcon } from "../../icons/CheckCircleIcon";
import { PencilCicleIcon } from "../../icons/PencilCicleIcon";
import { useZTheme } from "../../stores/useZTheme";
import { useZUserProfile } from "../../stores/useZUserProfile";
import { useZColaboratorRegister } from "../../stores/useZColaboratorRegister";
import { IUserDB, useUserResources } from "../../hooks/useUserResources";
import { useBrandMasterResources } from "../../hooks/useBrandMasterResources";

type TRole = "admin" | "manager" | "member";

const roleLabelKey: Record<TRole, string> = {
  admin: "colaboratorRegister.admin",
  manager: "colaboratorRegister.manager",
  member: "colaboratorRegister.member",
};

export const ColaboratorRegisterPage = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { role: currentRole, idBrand } = useZUserProfile();

  const {
    colaboratorName,
    setColaboratorName,
    email,
    setEmail,
    phone,
    setPhone,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    position,
    setPosition,
    department,
    setDepartment,
    permission,
    setPermission,
    hiringDate,
    setHiringDate,
    status,
    setStatus,
    idBrandMaster,
    setIdBrandMaster,
    errorMessage,
    setErrorMessage,
    resetInputs,
  } = useZColaboratorRegister();

  const {
    createUserByManager,
    isLoading: isLoadingUser,
    listUsers,
    updateUserByManager,
    deleteUserByAdmin,
  } = useUserResources();
  const { listAllBrands, isLoading: isLoadingBrands } =
    useBrandMasterResources();

  const [users, setUsers] = useState<IUserDB[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<TRole | null>(null);
  const [modalOpen, setModalOpen] = useState<null | "created" | "edited">(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const requiredSideLabel = (
    <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
      {t("colaboratorRegister.required")}
    </span>
  );

  const canDeleteUser = currentRole === "admin";
  const isEditing = Boolean(selectedUserId);

  const refreshUsers = async () => {
    const response = await listUsers();
    if (!response) return;
    setUsers(response);
  };

  const refreshBrandsAndDefaults = async () => {
    const response = await listAllBrands();
    const brands = response?.result ?? [];
    if (idBrand && !idBrandMaster) {
      setIdBrandMaster(idBrand);
    }
    return brands;
  };

  const [brands, setBrands] = useState<
    { idBrandMaster: number; brandName: string | null }[]
  >([]);

  useEffect(() => {
    (async () => {
      const brandsList = await refreshBrandsAndDefaults();
      setBrands(brandsList);
      await refreshUsers();
    })();
  }, []);

  const companyOptions = useMemo(
    () =>
      brands.map((b) => ({
        id: b.idBrandMaster,
        label: b.brandName || `MSP #${b.idBrandMaster}`,
        value: b.idBrandMaster,
      })),
    [brands],
  );

  const selectedCompanyOption = useMemo(() => {
    if (!idBrandMaster) return null;
    return (
      companyOptions.find((o) => o.value === idBrandMaster) || {
        id: idBrandMaster,
        label: `MSP #${idBrandMaster}`,
        value: idBrandMaster,
      }
    );
  }, [companyOptions, idBrandMaster]);

  const permissionOptions = useMemo(
    () =>
      (["admin", "manager", "member"] as TRole[]).map((r) => ({
        label: t(roleLabelKey[r]),
        value: r,
      })),
    [t],
  );

  const selectedPermissionOption = useMemo(() => {
    const r = (permission as TRole) || null;
    if (!r) return null;
    return permissionOptions.find((o) => o.value === r) || null;
  }, [permission, permissionOptions]);

  const statusOptions = useMemo(
    () => [
      { label: t("colaboratorRegister.active"), value: "active" },
      { label: t("colaboratorRegister.inactive"), value: "inactive" },
    ],
    [t],
  );

  const selectedStatusOption = useMemo(() => {
    if (!status) return null;
    return statusOptions.find((o) => o.value === status) || null;
  }, [status, statusOptions]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => (companyFilter ? u.idBrandMaster === companyFilter : true))
      .filter((u) => (roleFilter ? u.role === roleFilter : true));
  }, [users, companyFilter, roleFilter]);

  const validate = () => {
    setErrorMessage(true);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const requiredMissing =
      !colaboratorName ||
      !email ||
      !username ||
      !position ||
      !permission ||
      !status ||
      (!idBrand && !idBrandMaster);

    if (requiredMissing) return false;
    if (!isEmailValid) return false;
    if (!isEditing && (!password || !confirmPassword)) return false;
    if (!isEditing && password !== confirmPassword) return false;
    setErrorMessage(false);
    return true;
  };

  const handleClear = () => {
    setSelectedUserId(null);
    setErrorMessage(false);
    resetInputs();
    if (idBrand) setIdBrandMaster(idBrand);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const userPayload = {
      username,
      email,
      password: isEditing ? undefined : password,
      role: (permission as TRole) || "member",
      idBrandMaster: idBrand || idBrandMaster || undefined,
      isActive: status === "active",
      fullName: colaboratorName,
      userPhoneNumber: phone || undefined,
      field: position || undefined,
      department: department || undefined,
      contractDate: hiringDate ? new Date(hiringDate).toISOString() : undefined,
    };

    const result = selectedUserId
      ? await updateUserByManager(selectedUserId, userPayload)
      : await createUserByManager(userPayload);

    if (!result) return;

    await refreshUsers();
    setModalOpen(selectedUserId ? "edited" : "created");
    handleClear();
  };

  const startEdit = (u: IUserDB) => {
    setSelectedUserId(u.idUser);
    setColaboratorName(u.fullName || u.username || "");
    setEmail(u.email || "");
    setPhone(u.userPhoneNumber || "");
    setUsername(u.username || "");
    setPosition(u.field || "");
    setDepartment(u.department || "");
    setPermission(u.role);
    setStatus(u.isActive ? "active" : "inactive");
    setIdBrandMaster(u.idBrandMaster || 0);
    setHiringDate(
      u.contractDate ? moment(u.contractDate).format("YYYY-MM-DD") : "",
    );
    setPassword("");
    setConfirmPassword("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    const ok = await deleteUserByAdmin(deleteUserId);
    if (!ok) return;
    setDeleteUserId(null);
    await refreshUsers();
  };

  return (
    <ScreenFullPage
      title={
        <TextRob20Font1MB
          sx={{
            color: theme[mode].primary,
            fontSize: "28px",
            fontWeight: "500",
            lineHeight: "40px",
          }}
        >
          {t("colaboratorRegister.title")}{" "}
          <span style={{ color: theme[mode].gray }}>
            | {t("colaboratorRegister.sideTitle")}
          </span>
        </TextRob20Font1MB>
      }
      subtitle={
        <TextRob16Font1S sx={{ color: theme[mode].gray }}>
          {t("colaboratorRegister.subtitle")}
        </TextRob16Font1S>
      }
      sxTitleSubTitle={{
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
      sxContainer={{
        paddingLeft: "40px",
        paddingRight: "40px",
        paddingBottom: "40px",
      }}
    >
      {(isLoadingUser || isLoadingBrands) && <AbsoluteBackDrop open />}

      <Stack sx={{ width: "100%", gap: "24px" }}>
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
          <TextRob16Font1S
            sx={{
              color: theme[mode].black,
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            {t("colaboratorRegister.registersManagement")}
          </TextRob16Font1S>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              "@media (max-width: 1000px)": { gridTemplateColumns: "1fr" },
            }}
          >
            <InputLabelAndFeedback
              value={colaboratorName}
              onChange={setColaboratorName}
              label={t("colaboratorRegister.completeName")}
              sideLabel={requiredSideLabel}
              placeholder={t("colaboratorRegister.completeNamePlaceholder")}
              errorMessage={
                errorMessage && !colaboratorName
                  ? t("colaboratorRegister.fillFields")
                  : ""
              }
            />
            <InputLabelAndFeedback
              value={email}
              onChange={setEmail}
              label={t("colaboratorRegister.email")}
              sideLabel={requiredSideLabel}
              placeholder={t("colaboratorRegister.emailPlaceholder")}
              errorMessage={
                errorMessage && !email
                  ? t("colaboratorRegister.fillFields")
                  : email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? t("colaboratorRegister.emailAlertMessage")
                    : ""
              }
            />
            <InputLabelAndFeedback
              value={phone}
              onChange={(v) => setPhone(maskPhone(v))}
              label={t("colaboratorRegister.phone")}
              placeholder={"(00) 00000-0000"}
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
              value={username || ""}
              onChange={setUsername}
              label={t("colaboratorRegister.username")}
              sideLabel={requiredSideLabel}
              placeholder={t("colaboratorRegister.username")}
              errorMessage={
                errorMessage && !username
                  ? t("colaboratorRegister.fillFields")
                  : ""
              }
            />
            <InputLabelAndFeedback
              value={password || ""}
              onChange={setPassword}
              label={t("colaboratorRegister.password")}
              sideLabel={!isEditing ? requiredSideLabel : undefined}
              placeholder={t("colaboratorRegister.password")}
              type="password"
              disabled={isEditing}
              errorMessage={
                errorMessage && !isEditing && !password
                  ? t("colaboratorRegister.fillFields")
                  : ""
              }
            />
            <InputLabelAndFeedback
              value={confirmPassword || ""}
              onChange={setConfirmPassword}
              label={t("colaboratorRegister.confirmPassword")}
              sideLabel={!isEditing ? requiredSideLabel : undefined}
              placeholder={t("colaboratorRegister.confirmPassword")}
              type="password"
              disabled={isEditing}
              errorMessage={
                errorMessage && !isEditing && !confirmPassword
                  ? t("colaboratorRegister.fillFields")
                  : !isEditing && password !== confirmPassword
                    ? t("colaboratorRegister.dontMatch")
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
              value={position}
              onChange={setPosition}
              label={t("colaboratorRegister.position")}
              sideLabel={requiredSideLabel}
              placeholder={t("colaboratorRegister.positionPlaceholder")}
              errorMessage={
                errorMessage && !position
                  ? t("colaboratorRegister.fillFields")
                  : ""
              }
            />
            <InputLabelAndFeedback
              value={department}
              onChange={setDepartment}
              label={t("colaboratorRegister.department")}
              placeholder={t("colaboratorRegister.departmentPlaceholder")}
            />
            <Stack sx={{ gap: "12px" }}>
              <TextRob14Font1Xs sx={{ color: theme[mode].primary }}>
                {t("colaboratorRegister.permission")}{" "}
                <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                  {t("colaboratorRegister.required")}
                </span>
              </TextRob14Font1Xs>
              <DropDownDark
                data={permissionOptions}
                value={selectedPermissionOption || null}
                onChange={(val) => setPermission(String(val?.value || ""))}
                placeholder={t("colaboratorRegister.permission")}
              />
            </Stack>
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
              value={hiringDate}
              onChange={setHiringDate}
              label={t("colaboratorRegister.hiringDate")}
              placeholder={"YYYY-MM-DD"}
              type="date"
            />
            <Stack sx={{ gap: "12px" }}>
              <TextRob14Font1Xs sx={{ color: theme[mode].primary }}>
                {t("colaboratorRegister.status")}{" "}
                <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                  {t("colaboratorRegister.required")}
                </span>
              </TextRob14Font1Xs>
              <DropDownDark
                data={statusOptions}
                value={selectedStatusOption || null}
                onChange={(val) => setStatus(String(val?.value || ""))}
                placeholder={t("colaboratorRegister.status")}
              />
            </Stack>
            <Stack sx={{ gap: "12px" }}>
              <TextRob14Font1Xs sx={{ color: theme[mode].primary }}>
                {t("colaboratorRegister.companyName")}{" "}
                <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                  {t("colaboratorRegister.required")}
                </span>
              </TextRob14Font1Xs>
              <DropDownDark
                data={companyOptions}
                value={selectedCompanyOption}
                onChange={(val) =>
                  setIdBrandMaster(Number(val?.value || 0) || 0)
                }
                placeholder={t("colaboratorRegister.companyName")}
                disabled={Boolean(idBrand)}
              />
            </Stack>
          </Box>

          <CTAsDoubleButtons
            handleSave={handleSubmit}
            handleRestore={handleClear}
            labelSave={t("colaboratorRegister.save")}
            labelRestore={t("colaboratorRegister.clear")}
            sxButtonSave={{
              background: theme[mode].blue,
              color: theme[mode].btnText,
              whiteSpace: "nowrap",
            }}
            sxButtonRestore={{
              color: theme[mode].blueDark,
              borderColor: theme[mode].blueDark,
              whiteSpace: "nowrap",
            }}
          />
        </Stack>

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <TextRob16Font1S
              sx={{
                color: theme[mode].black,
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {t("colaboratorRegister.tableTitle")}
            </TextRob16Font1S>
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <DropDown
                data={[
                  {
                    label: t("colaboratorRegister.companyFilterPlaceholder"),
                    value: null,
                  },
                  ...companyOptions,
                ]}
                value={
                  companyFilter
                    ? companyOptions.find((o) => o.value === companyFilter) ||
                      null
                    : null
                }
                onChange={(val) =>
                  setCompanyFilter((val?.value as number) || null)
                }
                sxContainer={{
                  width: "216px",
                  "@media (max-width: 659px)": { width: "100%" },
                }}
                placeholder={t("colaboratorRegister.companyFilterPlaceholder")}
              />
              <DropDown
                data={[
                  {
                    label: t("colaboratorRegister.UserFilterPlaceholder"),
                    value: null,
                  },
                  ...permissionOptions,
                ]}
                value={
                  roleFilter
                    ? permissionOptions.find((o) => o.value === roleFilter) ||
                      null
                    : null
                }
                onChange={(val) => setRoleFilter((val?.value as TRole) || null)}
                sxContainer={{
                  width: "216px",
                  "@media (max-width: 659px)": { width: "100%" },
                }}
                placeholder={t("colaboratorRegister.UserFilterPlaceholder")}
              />
            </Box>
          </Box>

          <Stack sx={{ width: "100%", gap: "16px" }}>
            {filteredUsers.map((u) => (
              <Box
                key={u.idUser}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: "12px" }}
                >
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: theme[mode].grayLight,
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <TextRob14Font1Xs sx={{ color: theme[mode].primary }}>
                      {u.fullName || u.username}
                    </TextRob14Font1Xs>
                    <TextRob12Font2Xs sx={{ color: theme[mode].gray }}>
                      {u.email}
                    </TextRob12Font2Xs>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flex: "1",
                    minWidth: "180px",
                    "@media (max-width: 900px)": { width: "100%" },
                  }}
                >
                  <TextRob12Font2Xs sx={{ color: theme[mode].gray }}>
                    {t("colaboratorRegister.lastActivity")}
                  </TextRob12Font2Xs>
                  <TextRob12Font2Xs sx={{ color: theme[mode].primary }}>
                    {u.lastLoginDate
                      ? moment(u.lastLoginDate).format("DD/MM/YYYY")
                      : t("colaboratorRegister.noActivity")}
                  </TextRob12Font2Xs>
                </Box>

                <Box
                  sx={{
                    flex: "2",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "8px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextRob14Font1Xs
                    sx={{
                      boxSizing: "content-box",
                      padding: "0 10px",
                      fontWeight: "400",
                      borderRadius: "12px",
                      border: `1px solid ${theme[mode].blueDark}`,
                      color: theme[mode].blueDark,
                    }}
                  >
                    {t(roleLabelKey[u.role])}
                  </TextRob14Font1Xs>
                  <TextRob14Font1Xs
                    sx={{
                      boxSizing: "content-box",
                      padding: "0 10px",
                      fontWeight: "400",
                      borderRadius: "12px",
                      border: `1px solid ${theme[mode].blueDark}`,
                      color: theme[mode].blueDark,
                      maxWidth: "160px",
                      overflow: "hidden",
                      textWrap: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.brandMaster?.brandName?.trim() ||
                      (u.idBrandMaster
                        ? companyOptions.find((o) => o.value === u.idBrandMaster)
                            ?.label || `MSP #${u.idBrandMaster}`
                        : t("colaboratorRegister.vituaxCompany"))}
                  </TextRob14Font1Xs>
                  <TextRob14Font1Xs
                    sx={{
                      boxSizing: "content-box",
                      padding: "0 10px",
                      fontWeight: "400",
                      borderRadius: "12px",
                      border: `1px solid ${
                        u.isActive ? theme[mode].ok : theme[mode].danger
                      }`,
                      color: u.isActive ? theme[mode].ok : theme[mode].danger,
                    }}
                  >
                    {t(
                      `colaboratorRegister.${u.isActive ? "active" : "inactive"}`,
                    )}
                  </TextRob14Font1Xs>
                </Box>

                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <IconButton onClick={() => startEdit(u)}>
                    <PencilCicleIcon fill={theme[mode].blueMedium} />
                  </IconButton>
                  {canDeleteUser && (
                    <IconButton onClick={() => setDeleteUserId(u.idUser)}>
                      <DeleteForeverIcon sx={{ color: theme[mode].danger }} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {modalOpen !== null && (
        <Modal
          open={modalOpen !== null}
          onClose={() => setModalOpen(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            sx={{
              width: "fit-content",
              alignSelf: "center",
              justifySelf: "center",
              gap: "20px",
              boxSizing: "border-box",
              padding: "24px",
              borderRadius: "16px",
              background: theme[mode].mainBackground,
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon color={theme[mode].ok} size={"36px"} />
            <TextRob16Font1S sx={{ color: theme[mode].primary }}>
              {modalOpen === "created"
                ? t("colaboratorRegister.userCreated")
                : t("colaboratorRegister.userEdited")}
            </TextRob16Font1S>
            <Button
              sx={{
                width: "100px",
                background: theme[mode].blue,
                height: "40px",
                borderRadius: "12px",
                textTransform: "none",
              }}
              onClick={() => setModalOpen(null)}
            >
              <TextRob16Font1S
                sx={{
                  fontWeight: "400",
                  color: theme[mode].btnText,
                }}
              >
                {t("colaboratorRegister.ok")}
              </TextRob16Font1S>
            </Button>
          </Stack>
        </Modal>
      )}

      {deleteUserId && (
        <Modal
          open={Boolean(deleteUserId)}
          onClose={() => setDeleteUserId(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            sx={{
              width: "fit-content",
              alignSelf: "center",
              justifySelf: "center",
              gap: "20px",
              boxSizing: "border-box",
              padding: "24px",
              borderRadius: "16px",
              background: theme[mode].mainBackground,
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "320px",
            }}
          >
            <TextRob16Font1S sx={{ color: theme[mode].primary }}>
              {t("colaboratorRegister.areYouSure", {
                username:
                  users.find((u) => u.idUser === deleteUserId)?.username || "",
              })}
            </TextRob16Font1S>
            <CTAsDoubleButtons
              handleSave={handleConfirmDelete}
              handleRestore={() => setDeleteUserId(null)}
              labelSave={t("mspRegister.delete")}
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
          </Stack>
        </Modal>
      )}
    </ScreenFullPage>
  );
};
