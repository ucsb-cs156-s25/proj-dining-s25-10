import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  cellToAxiosParamsPostWithStatus,
  onDeleteSuccess,
  onApproveSuccess,
  onDenySuccess,
} from "main/utils/reviewUtils";
import { useNavigate } from "react-router-dom";

export default function ReviewTable({
  reviews,
  userOptions = false,
  moderatorOptions = false,
  testIdPrefix = "ReviewTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/reviews/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/reviews/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  // Mutation for approve

  // Stryker disable all : hard to test for query caching
  const approveMutation = useBackendMutation(
    (cell) => cellToAxiosParamsPostWithStatus(cell, "Approved"),
    { onSuccess: onApproveSuccess },
    ["/api/reviews/all"],
  );
  // Stryker restore all

  // Stryker disable all : hard to test for query caching
  const denyMutation = useBackendMutation(
    (cell) => cellToAxiosParamsPostWithStatus(cell, "Denied"),
    { onSuccess: onDenySuccess },
    ["/api/reviews/all"],
  );
  // Stryker restore all

  const approveCallback = async (cell) => {
    approveMutation.mutate(cell);
  };

  const denyCallback = async (cell) => {
    denyMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Stars",
      accessor: "itemStars",
    },
    {
      Header: "Comments",
      accessor: "comments",
    },
    {
      Header: "Date Served",
      accessor: "dateServed",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  if (userOptions) {
    columns.push({ Header: "Item Name", accessor: "itemName" });
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  if (moderatorOptions) {
    columns.push(
      ButtonColumn("Approve", "primary", approveCallback, testIdPrefix),
    );
    columns.push(ButtonColumn("Deny", "danger", denyCallback, testIdPrefix));
  }

  return <OurTable columns={columns} data={reviews} testid={testIdPrefix} />;
}
