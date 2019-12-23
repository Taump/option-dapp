import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Redirect, NavLink } from "react-router-dom";
const { Sider } = Layout;

export const Sidebar = ({ active }) => {
    const dataMenu = [
        { key: 'dashboard', icon: 'control', title: 'Dashboard', path: '/' },
        { key: 'deploy', icon: 'plus-circle', title: 'Deploy AA', path: '/deploy' },
    ]

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            style={{ background: '#fff' }}
        >
            <div className="logo" style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', alignItems: 'center' }}>
                <img src='/logo.png' style={{ height: '100%', width: '20%', marginRight: 15 }} alt="Obyte" />
                <div style={{ color: '#000', fontWeight: 'bold', fontSize: 19 }} className="brand">
                    Obyte <div className="brand__descr" style={{ fontSize: 10, fontWeight: 'normal' }}>Option contract</div>
                </div>
            </div>
            <Menu theme="light" mode="inline" defaultSelectedKeys={[active]}>
                {dataMenu.map(item => {
                    return (
                        <Menu.Item key={item.key}>
                            <NavLink to={item.path} activeClassName="selected">
                                <Icon type={item.icon} />
                                <span className="nav-text">{item.title}</span>
                            </NavLink>
                        </Menu.Item>
                    )
                })}
            </Menu>
        </Sider>
    )
}