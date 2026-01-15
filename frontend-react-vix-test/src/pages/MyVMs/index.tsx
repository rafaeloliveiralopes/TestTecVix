import { ScreenFullPage } from "../../components/ScreenFullPage";
import { Stack } from "@mui/material";
import { Title } from "./components/Title";
import { Header } from "./components/Header";
import { TableComponent } from "./components/Table";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { useZMyVMsList } from "../../stores/useZMyVMsList";
import { useMyVMList } from "../../hooks/useMyVMList";
import { useCallback, useEffect, useRef } from "react";
import { useZUserProfile } from "../../stores/useZUserProfile";
import { useZGlobalVar } from "../../stores/useZGlobalVar";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SkeletonTable } from "./components/SkeletonTable";
import { ModalEditVM } from "./components/ModalEditVM";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";

export const MyVMsPage = () => {
  const {
    setCurrentPage,
    setVMList,
    setTotalCount,
    setIsFirstLoading,
    setCurrentVM,
    totalCount,
    currentPage,
    search,
    order,
    orderBy,
    limit,
    status,
    isFirstLoading,
    currentVM,
    vmList,
    onlyMyVMs,
    selectedMSP,
  } = useZMyVMsList();
  const { fetchMyVmsList, isLoading } = useMyVMList();
  const { idBrand } = useZUserProfile();
  const { isOpenSideBar } = useZGlobalVar();
  const { width } = useWindowSize();
  const { updateThisVm, setUpdateThisVm } = useZGlobalVar();
  const { socketRef } = useZGlobalVar();

  // Colocar `isLoading` nas deps dos `useEffect` tem alternado durante fetches e pode
  // causar loop de refetch / "piscada" na UI. Por isso lemos o valor via `ref`.
  const isLoadingRef = useRef(isLoading);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const fetchVMList = useCallback(
    async (pageToFetch: number) => {
      // Função memoizada para poder ser usada com segurança nas deps dos `useEffect`.
      const selectedBrandMasterId = selectedMSP?.idBrandMaster;
      const idBrandMasterToFetch: number | "null" | undefined =
        selectedBrandMasterId != null
          ? selectedBrandMasterId
          : onlyMyVMs
            ? (idBrand ?? "null")
            : undefined;

      const { totalCount, vmList } = await fetchMyVmsList({
      search,
      page: pageToFetch,
      orderBy: orderBy ? `${orderBy}:${order}` : undefined,
      limit,
      idBrandMaster: idBrandMasterToFetch,
      status,
    });
    setVMList(vmList);
    setTotalCount(totalCount);
    setIsFirstLoading(false);
    },
    [
      fetchMyVmsList,
      idBrand,
      limit,
      onlyMyVMs,
      order,
      orderBy,
      search,
      selectedMSP,
      setIsFirstLoading,
      setTotalCount,
      setVMList,
      status,
    ],
  );

  const fetchCurrentPage = useCallback(() => {
    // Centraliza o cálculo de página (API usa índice 0-based).
    return fetchVMList(Math.max(currentPage - 1, 0));
  }, [currentPage, fetchVMList]);

  const onCloseAndEditVM = useCallback(
    (edit: boolean) => {
      if (edit) fetchCurrentPage();
      setCurrentVM(null);
    },
    [fetchCurrentPage, setCurrentVM],
  );

  useEffect(() => {
    // Fetch inicial / refetch ao mudar filtros.
    if (isLoadingRef.current) return;
    setCurrentPage(1);
    fetchVMList(0);
  }, [
    fetchVMList,
    onlyMyVMs,
    order,
    orderBy,
    search,
    selectedMSP,
    setCurrentPage,
    status,
  ]);

  useEffect(() => {
    // Fetch ao paginar.
    if (isOpenSideBar) return;
    if (isLoadingRef.current) return;
    fetchCurrentPage();
  }, [fetchCurrentPage, isOpenSideBar]);

  useEffect(() => {
    // Recarrega a lista após sinal de atualização de VM.
    if (isOpenSideBar) return;
    if (isLoadingRef.current) return;
    if (!updateThisVm) return;
    const vmToUpdate = vmList.find((vm) => vm.idVM === updateThisVm);
    setUpdateThisVm(null);
    if (vmToUpdate) {
      fetchCurrentPage();
    }
  }, [
    fetchCurrentPage,
    isOpenSideBar,
    setUpdateThisVm,
    updateThisVm,
    vmList,
  ]);

  useEffect(() => {
    if (!socketRef.connected) return;
    // Usa handler com referência estável para não acumular listeners em rerenders.
    const onUpdateTask = () => {
      fetchCurrentPage();
    };
    socketRef.on("updateTask", onUpdateTask);
    return () => {
      socketRef.off("updateTask", onUpdateTask);
    };
  }, [fetchCurrentPage, socketRef]);

  return (
    <ScreenFullPage
      title={<Title />}
      sxTitleSubTitle={{ paddingLeft: "40px", paddingRight: "40px" }}
    >
      <Stack
        sx={{
          maxWidth: "100%",
          width: "100%",
          gap: "32px",
          "@media (max-width: 659px)": { gap: "0" },
        }}
      >
        {/* Mobile separator */}
        {width < 660 ? (
          <Stack
            sx={{
              marginTop: "-24px",
              width: "100%",
              padding: "16px",
            }}
          >
            <Header />
          </Stack>
        ) : (
          <Stack
            sx={{
              width: "100%",
              padding: "0 24px",
            }}
          >
            <Header />
          </Stack>
        )}
        {/* Main content */}
        {isFirstLoading ? (
          <SkeletonTable />
        ) : (
          <Stack
            sx={{
              width: "100%",
              "@media (max-width: 1430px)": {
                padding: "16px",
                paddingBottom: "50px",
              },
            }}
          >
            {isLoading && <AbsoluteBackDrop open={isLoading} />}
            {/* Main table */}
            <Stack
              sx={{
                width: "100%",
              }}
            >
              <TableComponent />
            </Stack>
            {/* pagination */}
            <Stack
              sx={{
                width: "100%",
              }}
            >
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalCount}
                onPageChange={(page) => setCurrentPage(page)}
                limit={limit}
              />
            </Stack>
          </Stack>
        )}
        {Boolean(currentVM) && (
          <ModalEditVM open={Boolean(currentVM)} onClose={onCloseAndEditVM} />
        )}
      </Stack>
    </ScreenFullPage>
  );
};
