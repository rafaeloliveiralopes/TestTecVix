import TableBody from "@mui/material/TableBody";
import { useZMyVMsList } from "../../../../stores/useZMyVMsList";
import { RowVM } from "./RowVM";

export const EnhancedTableRows = () => {
  const { vmList } = useZMyVMsList();

  return (
    <TableBody
      key={"table-body-myvms"}
      sx={{
        padding: "20px",
      }}
    >
      {vmList.map((row, index) => (
        <RowVM key={`row-${row.idVM}`} vm={row} index={index} />
      ))}
    </TableBody>
  );
};
