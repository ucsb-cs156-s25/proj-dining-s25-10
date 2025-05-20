import React from "react";
import OurTable, { ButtonColumn } from "../OurTable";
import { hasRole } from "../../utils/currentUser";
import { Link } from "react-router-dom";

export default function MenuItemTable({ menuItems, currentUser }) {
  const testid = "MenuItemTable";

  const reviewCallback = async (_cell) => {
    alert("Reviews coming soon!");
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
    {
      Header: () => (
        <span data-testid="MenuItemTable-header-Reviews">Reviews</span>
      ),
      accessor: "id",
      Cell: ({ value }) => <Link to={`/reviews/${value}`}>View</Link>,
    },
  ];

  if (hasRole(currentUser, "ROLE_USER")) {
    columns.push(
      ButtonColumn("Review Item", "warning", reviewCallback, testid),
    );
  }

  return <OurTable columns={columns} data={menuItems} testid={testid} />;
}
