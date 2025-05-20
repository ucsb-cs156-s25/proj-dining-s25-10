import OurTable, { ButtonColumn } from "../OurTable";
import { hasRole } from "../../utils/currentUser";
import { useNavigate } from "react-router-dom";

export default function MenuItemTable({ menuItems, currentUser }) {
  const testid = "MenuItemTable";
  let navigate;

  try {
    navigate = useNavigate();
  } catch (error) {
    navigate = () => {};
  }

  const reviewCallback = (_cell) => {
    try {
      navigate(`/reviews/${_cell.row.original.id}`);
    } catch (error) {
      console.log(`Would navigate to /reviews/${_cell.row.original.id}`);
    }
  };

  const columns = [
    {
      Header: "Item Name",
      accessor: "name",
    },
    {
      Header: "Station",
      accessor: "station",
    },
  ];

  if (hasRole(currentUser, "ROLE_USER")) {
    columns.push(
      ButtonColumn("Review Item", "warning", reviewCallback, testid),
    );
  }

  return <OurTable columns={columns} data={menuItems} testid={testid} />;
}
