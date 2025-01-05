import React, { useEffect, useState } from "react";
import useTranslate from "@lang";
import useListener from "@store/useListener";

import Hero from "./components/Hero/Hero";
import Feature from "./components/Feature/Feature";
import FruitsShop from "./components/FruitsShop/FruitsShop";
import FruitsList from "./components/FruitsList/FruitsList";
import VesitableShop from "./components/VesitableShop/VesitableShop";
import Banner from "./components/Banner/Banner";
import Fact from "./components/Fact/Fact";
import Tastimonial from "./components/Tastimonial/Tastimonial";
import BestsalerProduct from "./components/BestsalerProduct/BestsalerProduct";
import ModalSearch from "./components/ModalSearch/ModalSearch";
import useProduct from "@api/useProduct";

import ShopList from "./components/ShopList/ShopList";


const Home = () => {
  // const t = useTranslate();
  // const { subscriber } = useListener();
  // useEffect(() => {
  //   console.log(subscriber);
  // }, [subscriber]);

  const [productbestSale, setProductSale] = useState([]);


  const {geta} = useProduct();
  return (
    <>
      <ShopList />

      {/* <Hero />
      <ModalSearch />
      <Feature />
      <FruitsShop />
      <FruitsList />
      <VesitableShop />
      <Banner />
      <BestsalerProduct />
      <Fact />
      <Tastimonial /> */}
    </>
  );
};

export default Home;
