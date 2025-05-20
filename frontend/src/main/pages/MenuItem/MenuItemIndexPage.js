import React, { useEffect, useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { useCurrentUser } from "main/utils/currentUser";

export default function MenuItemIndexPage() {
  const { data: currentUser } = useCurrentUser();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const sampleMenuItems = [
      { id: 1, name: "Pizza", station: "Italian" },
      { id: 2, name: "Hamburger", station: "Grill" },
      { id: 3, name: "Salad", station: "Fresh" },
      { id: 4, name: "Pasta", station: "Italian" },
      { id: 5, name: "Taco", station: "Mexican" }
    ];
    
    setMenuItems(sampleMenuItems);
  }, []);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Menu Items</h1>
        <p>Click on "Review Item" to see or add reviews for each menu item.</p>
        <MenuItemTable menuItems={menuItems} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}