import { Divider, Stack } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { PersonalInformation } from "./components/PersonalInformation";
import { NotificationsContact } from "./components/NotificationsContact";
import { CTAsButtons } from "./components/CTAsButtons";
import { useZUserProfile } from "../../../../stores/useZUserProfile";
import { useEffect } from "react";
import { useUserResources } from "../../../../hooks/useUserResources";

export const ProfileAndNotifications = () => {
  const { mode, theme } = useZTheme();
  const { role } = useZUserProfile();
  const { getSelf } = useUserResources();
  const canSeeNotifications = Boolean(role === "admin" || role === "manager");

  useEffect(() => {
    // Garante que os dados do perfil estejam atualizados ao abrir a aba.
    void getSelf();
  }, [getSelf]);
  return (
    <Stack
      sx={{
        width: "100%",
        gap: "32px",
        background: theme[mode].mainBackground,
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      {/* Personal information  */}
      <PersonalInformation />
      <Divider
        sx={{
          mt: "16px",
          background: theme[mode].grayLight,
        }}
      />
      {canSeeNotifications && (
        <>
          {/* Notifications */}
          <NotificationsContact />
          <Divider
            sx={{
              mt: "16px",
              background: theme[mode].grayLight,
            }}
          />
        </>
      )}
      {/* Save Buttons */}
      <CTAsButtons />
    </Stack>
  );
};
