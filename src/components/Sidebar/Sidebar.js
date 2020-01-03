import React from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "../Sidebar/Sidebar.module.css";

const { Sider } = Layout;

const dataMenu = [
  { key: "dashboard", icon: "control", title: "Dashboard", path: "/" },
  { key: "deploy", icon: "plus-circle", title: "Deploy AA", path: "/deploy" },
  {
    key: "issuing_assets",
    icon: "setting",
    title: "Issuing assets",
    path: "/issuing_assets"
  },
  {
    key: "notifications",
    icon: "bell",
    title: "Notifications",
    path: "/notifications"
  }
];

export const Sidebar = ({ active }) => {
  const isViewedNotifications = useSelector(
    state => state.aa.isViewedNotifications
  );
  return (
    <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
      <div className={styles.logo}>
        <img src="/logo.png" className={styles.logo__img} alt="Obyte" />
        <div className={styles.brand}>
          Obyte <div className={styles.product}>Option contract</div>
        </div>
      </div>
      <Menu theme="light" defaultSelectedKeys={[active]}>
        {dataMenu.map(item => {
          return (
            <Menu.Item key={item.key}>
              <NavLink to={item.path} activeClassName="selected">
                <Icon
                  type={item.icon}
                  theme={item.key === "notifications" ? "filled" : "outlined"}
                  style={
                    item.key === "notifications" && !isViewedNotifications
                      ? { color: "red" }
                      : { color: "ccc" }
                  }
                />
                <span className="nav-text">{item.title}</span>
              </NavLink>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};
