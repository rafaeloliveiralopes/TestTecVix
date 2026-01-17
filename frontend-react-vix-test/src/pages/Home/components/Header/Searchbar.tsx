import { IconButton, InputBase, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useEffect, useState } from "react";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZGlobalVar } from "../../../../stores/useZGlobalVar";
import { useLocation } from "react-router-dom";
import { useZMyVMsList } from "../../../../stores/useZMyVMsList";

export const Searchbar = () => {
  const [search, setSearch] = useState("");
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { setSearchGlobalHeader } = useZGlobalVar();
  const { pathname } = useLocation();
  const { setSearch: setMyVMsSearch } = useZMyVMsList();

  const goSearch = useCallback(() => {
    const normalized = search.trim();
    setSearchGlobalHeader(normalized);
    if (pathname === "/my-virtual-machines") {
      setMyVMsSearch(normalized.length ? normalized : null);
    }
  }, [pathname, search, setMyVMsSearch, setSearchGlobalHeader]);

  useEffect(() => {
    const timer = setTimeout(goSearch, 500);
    return () => clearTimeout(timer);
  }, [goSearch]);

  useEffect(() => {
    return () => {
      const timer = setTimeout(() => {
        setSearchGlobalHeader("");
        clearTimeout(timer);
      }, 500);
    };
  }, [setSearchGlobalHeader]);

  return (
    <Stack
      sx={{
        width: "80%",
        flexDirection: "row",
        borderRadius: "3px",
        justifyContent: "flex-start",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          maxWidth: "460px",
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            border: "none",
            backgroundColor: theme[mode].light,
            borderRadius: "16px",
            height: "48px",
            color: theme[mode].primary,
          }}
          placeholder={t("home.search")}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          inputProps={{
            sx: {
              "&::placeholder": {
                color: theme[mode].tertiary,
                opacity: 1,
              },
            },
          }}
          startAdornment={
            <IconButton
              type="button"
              sx={{
                p: 1,
                marginRight: 0.5,
                marginLeft: 0.5,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              onClick={goSearch}
            >
              <SearchIcon sx={{ color: theme[mode].tertiary }} />
            </IconButton>
          }
        />
      </Stack>
    </Stack>
  );
};
