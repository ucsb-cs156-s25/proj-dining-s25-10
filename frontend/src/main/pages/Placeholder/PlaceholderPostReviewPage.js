import { useParams } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function PlaceholderPostReviewPage() {
  const { itemid } = useParams();

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Review Posting Page for Menu Item {itemid}</h1>
        <p>Coming Soon!</p>
      </div>
    </BasicLayout>
  );
}
