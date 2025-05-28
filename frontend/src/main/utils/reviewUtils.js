import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  toast(message);
}

export function onApproveSuccess(message) {
  toast(message);
}

export function onDenySuccess(message) {
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/reviews",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}

export function cellToAxiosParamsPostWithStatus(cell, status) {
  const updatedReview = {
    ...cell.row.values,
    status,
  };

  return {
    url: `/api/reviews/${cell.row.values.id}`,
    method: "PUT",
    data: {
      itemName: updatedReview.itemName,
      itemStars: updatedReview.itemStars,
      comments: updatedReview.comments,
      dateServed: updatedReview.dateServed,
      status: updatedReview.status,
    },
  };
}
