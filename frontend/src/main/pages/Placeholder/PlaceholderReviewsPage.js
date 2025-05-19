import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";

export default function PlaceholderReviewsPage() {
  // Get the menu item ID from the URL
  const { itemId } = useParams();
  
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Reviews for Menu Item {itemId}</h1>
        <p>Coming Soon!</p>
      </div>
    </BasicLayout>
  );
}