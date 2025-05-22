import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { menuItemFixtures } from "fixtures/menuItemFixtures";
import { Link } from "react-router-dom";

export default function PlaceholderPostReviewIndexPage() {
  const menuItems = menuItemFixtures.fiveMenuItems;

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Post Reviews Index Page</h1>
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Station</th>
              <th>Link to Reviews</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.station}</td>
                <td>
                  <Link to={`/reviews/post/${item.id}`}>Post Review</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BasicLayout>
  );
}
