import React, { useState } from "react";
import logdark from '../Dashboard/assets/images/logos/dark-logo.svg'
import { Link, useLocation } from "react-router-dom";
import product from '../Dashboard/assets/images/logos/product.png'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {IconLayoutDashboard, IconBookUpload,IconLogout2,IconDeviceDesktopCog    } from '@tabler/icons-react'
const SidebarDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('');
  const location = useLocation();

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };
  const isActiveMenu = (menuName) => {
    return activeMenu == menuName;
  };
  return (
    <>
      <aside class="left-sidebar">
        <div>
          <div class="brand-logo d-flex align-items-center justify-content-between">
            <a href="./index.html" class="text-nowrap logo-img">
              <img
                src={logdark}
                width="180"
                alt=""
              />
            </a>
            <div
              class="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
              id="sidebarCollapse"
            >
              <i class="ti ti-x fs-8"></i>
            </div>
          </div>
          <nav class="sidebar-nav" data-simplebar="">
            <Sidebar>
              <Menu>
                <MenuItem
                  component={<Link to={'/dashboard'} className="sidebar-link" aria-expanded="false" ></Link>}
                  onClick={() => handleMenuClick('dashboard')}
                  className={isActiveMenu('dashboard') ? 'selected-item' : ''}
                  active={isActiveMenu('dashboard')}
                  icon={<IconLayoutDashboard stroke={2}/>}
                  > Trang chủ </MenuItem>
                <MenuItem   icon={<IconBookUpload stroke={2}/>}> Bán hàng tại quầy </MenuItem>
                <SubMenu label="Thống kê" icon={<IconDeviceDesktopCog stroke={2}/>}>
                <MenuItem
                    component={<Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('product')}
                    className={isActiveMenu('product') ? 'selected-item' : ''}
                    active={isActiveMenu('product')}> Đơn hàng </MenuItem>
                     <MenuItem
                    component={<Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('product')}
                    className={isActiveMenu('product') ? 'selected-item' : ''}
                    active={isActiveMenu('product')}> Đánh giá sản phẩm </MenuItem>
                </SubMenu>
                <SubMenu label="Quản lý sản phẩm" icon={<IconDeviceDesktopCog stroke={2}/>}>
                  <MenuItem
                    component={<Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('product')}
                    className={isActiveMenu('product') ? 'selected-item' : ''}
                    active={isActiveMenu('product')}> Danh sách sản phẩm </MenuItem>
                  <MenuItem
                    component={<Link to={'/dashboard/branch'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('branch')}
                    className={isActiveMenu('branch') ? 'selected-item' : ''}
                    active={isActiveMenu('branch')}> Danh sách loại </MenuItem>
                   <MenuItem
                    component={<Link to={'/dashboard/type'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('type')}
                    className={isActiveMenu('type') ? 'selected-item' : ''}
                    active={isActiveMenu('type')}> Danh sách gói </MenuItem>
                    <MenuItem
                    component={<Link to={'/dashboard/catalog'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('catalog')}
                    className={isActiveMenu('catalog') ? 'selected-item' : ''}
                    active={isActiveMenu('catalog')}> Danh mục </MenuItem>
                </SubMenu>
                <SubMenu label="Quản lý tài khoản" icon={<IconDeviceDesktopCog stroke={2}/>}>
                  <MenuItem
                    component={<Link to={'/dashboard/accounts'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('accounts')}
                    className={isActiveMenu('accounts') ? 'selected-item' : ''}
                    active={isActiveMenu('accounts')}> Khách hàng </MenuItem>
                  <MenuItem
                    component={<Link to={'/dashboard/accounts'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('accounts')}
                    className={isActiveMenu('accounts') ? 'selected-item' : ''}
                    active={isActiveMenu('dashboard')}> Nhân viên </MenuItem>
                </SubMenu>
                <SubMenu label="Quản lý khuyến mại" icon={<IconDeviceDesktopCog stroke={2}/>}>
                  <MenuItem
                    component={<Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('product')}
                    className={isActiveMenu('product') ? 'selected-item' : ''}
                    active={isActiveMenu('product')}> Coupon </MenuItem>
                  <MenuItem
                    component={<Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('product')}
                    className={isActiveMenu('product') ? 'selected-item' : ''}
                    active={isActiveMenu('product')}> Discount </MenuItem>
                </SubMenu>
                <SubMenu label="Quản lý đơn hàng" icon={<IconDeviceDesktopCog stroke={2}/>}>
                  <MenuItem
                    component={<Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('order')}
                    className={isActiveMenu('order') ? 'selected-item' : ''}
                    active={isActiveMenu('order')}> Đơn hàng </MenuItem>
                  <MenuItem
                    component={<Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('order')}
                    className={isActiveMenu('order') ? 'selected-item' : ''}
                    active={isActiveMenu('order')}> Danh sách hoàn đơn </MenuItem>
                </SubMenu>
                <SubMenu label="Quản lý cấu hình" icon={<IconDeviceDesktopCog stroke={2}/>}>
                  <MenuItem
                    component={<Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('order')}
                    className={isActiveMenu('order') ? 'selected-item' : ''}
                    active={isActiveMenu('order')}> Phân quyền </MenuItem>
                  <MenuItem
                    component={<Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('order')}
                    className={isActiveMenu('order') ? 'selected-item' : ''}
                    active={isActiveMenu('order')}> Thanh toán </MenuItem>
                    <MenuItem
                    component={<Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('order')}
                    className={isActiveMenu('order') ? 'selected-item' : ''}
                    active={isActiveMenu('order')}> Vận chuyển </MenuItem>
                </SubMenu>
                <MenuItem
                  component={<Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false" ></Link>}
                  onClick={() => handleMenuClick('dashboard')}
                  className={isActiveMenu('dashboard') ? 'selected-item' : ''}
                  active={isActiveMenu('dashboard')}
                  icon={<IconLogout2 stroke={2} />}
                  > Đăng xuất </MenuItem>
              </Menu>
            </Sidebar>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarDashboard;
