import React from "react";
import { Layout, Menu, Icon } from "antd";
import { NavLink, Link } from "react-router-dom";

import styles from "../Sidebar/Sidebar.module.css";

const { Sider } = Layout;

const dataMenu = [
	{ key: "home", icon: "home", title: "Home", path: "/" },
	{
		key: "search",
		icon: "search",
		title: "Search markets",
		path: "/search"
	},
	{ key: "deploy", icon: "plus-circle", title: "Create", path: "/deploy" },
	{
		key: "about",
		icon: "info-circle",
		title: "About",
		path: "/about"
	}
];

export const Sidebar = ({ active }) => {
	return (
		<Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
			<Link to="/">
				<div className={styles.logo}>
					<img src="/logo.png" className={styles.logo__img} alt="Obyte" />
					<div className={styles.brand}>
						Obyte <div className={styles.product}>Prediction markets</div>
					</div>
				</div>
			</Link>
			<Menu theme="light" defaultSelectedKeys={[active]}>
				{dataMenu.map(item => {
					return (
						<Menu.Item key={item.key}>
							<NavLink to={item.path} activeClassName="selected">
								<Icon type={item.icon} />
								<span className="nav-text">{item.title}</span>
							</NavLink>
						</Menu.Item>
					);
				})}
			</Menu>
		</Sider>
	);
};
