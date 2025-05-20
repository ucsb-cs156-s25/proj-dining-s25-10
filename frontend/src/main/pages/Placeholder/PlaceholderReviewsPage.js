import React, { useState, useEffect } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";

export default function PlaceholderReviewsPage() {
  const { itemid } = useParams();
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    const fetchMenuItem = () => {
      const sampleMenuItems = [
        { id: "1", name: "Pizza", station: "Italian" },
        { id: "2", name: "Hamburger", station: "Grill" },
        { id: "3", name: "Salad", station: "Fresh" },
        { id: "4", name: "Pasta", station: "Italian" },
        { id: "5", name: "Taco", station: "Mexican" },
      ];

      // Find the menu item with the matching ID
      const foundItem = sampleMenuItems.find((item) => item.id === itemid);
      setMenuItem(foundItem || { name: `Menu Item ${itemid}` });
    };

    fetchMenuItem();
  }, [itemid]);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Reviews for {menuItem?.name || `Menu Item ${itemid}`}</h1>
        <p>Coming Soon!</p>
      </div>
    </BasicLayout>
  );
}
