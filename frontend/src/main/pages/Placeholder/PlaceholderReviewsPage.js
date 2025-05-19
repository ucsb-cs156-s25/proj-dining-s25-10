import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParam } from "react-router-dom";

export default function PlaceholderReviewsPage() {
  // Stryker disable all : placeholder for future implementation
  const { itemId } = useParams();

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Reviews for Menu Item {itemId}</h1>
        <p>Coming soon!</p>
      </div>
    </BasicLayout>
  );
}