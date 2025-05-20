import React, { useState, useEffect } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { useCurrentUser } from "main/utils/currentUser";
import { menuItemFixtures } from "fixtures/menuItemFixtures";

export default function MenuItemIndexPage() {
  const { data: currentUser } = useCurrentUser();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    setMenuItems(menuItemFixtures.fiveMenuItems);
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
