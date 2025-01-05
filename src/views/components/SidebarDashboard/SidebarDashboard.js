import React from "react";
import logdark from '../Dashboard/assets/images/logos/dark-logo.svg'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product from '../Dashboard/assets/images/logos/product.png'
import branch from '../Dashboard/assets/images/logos/nullability.png'
import dashboard from '../Dashboard/assets/images/logos/dashboard.png'
import order from '../Dashboard/assets/images/logos/order.png'
const SidebarDashboard = () => {
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

          <nav class="sidebar-nav scroll-sidebar" data-simplebar="">
            <ul id="sidebarnav">
              <li class="sidebar-item">
                <Link to={'/dashboard'} className="sidebar-link" aria-expanded="false" >
                <span>
                    <img src={dashboard}/>
                  </span>
                  <span class="hide-menu" style={{fontSize:"16px", color:"black", fontWeight:"500"}}>Dashboard</span>
                </Link>
              </li>

              <li class="sidebar-item">
                <Link to={'/dashboard/product'} className="sidebar-link" aria-expanded="false">
                  <span>
                  <img src={product} />
                    </span>
                    <span class="hide-menu" style={{fontSize:"16px", color:"black", fontWeight:"500"}}>Sản phẩm</span>
                </Link>
              </li>           
              <li class="sidebar-item">
                <Link to={'/dashboard/branch'} className="sidebar-link" aria-expanded="false">
                  <span>
                      <img src={branch}/>
                    </span>
                    <span class="hide-menu" style={{fontSize:"16px", color:"black", fontWeight:"500"}}>Danh mục</span>
                </Link>
              </li>           
              <li class="sidebar-item">
                <Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false">
                  <span>
                      <img src={order}/>
                    </span>
                    <span class="hide-menu" style={{fontSize:"16px", color:"black", fontWeight:"500"}}>Đơn hàng</span>
                </Link>
              </li>           
              <li class="sidebar-item">
                <Link to={'/dashboard/accounts'} className="sidebar-link" aria-expanded="false">
                  <span>
                      <img src={order}/>
                    </span>
                    <span class="hide-menu" style={{fontSize:"16px", color:"black", fontWeight:"500"}}>Tài khoản</span>
                </Link>
              </li>           
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarDashboard;
