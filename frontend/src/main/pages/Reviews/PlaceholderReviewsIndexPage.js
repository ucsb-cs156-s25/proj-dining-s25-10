import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { menuItemFixtures } from "fixtures/menuItemFixtures";
import { Link } from "react-router-dom";

export default function PlaceholderReviewsIndexPage() {
  const menuItems = menuItemFixtures.fiveMenuItems;

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Reviews Index Page</h1>
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
                  <Link to={`/reviews/${item.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BasicLayout>
  );
}
