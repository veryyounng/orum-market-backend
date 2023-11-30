import ProductEntry, { ProductItem } from "../../components/product/ProductListTypeEntry";
import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = 'https://localhost/api';

interface ProductRes {
  ok: 0 | 1,
  item: [
    ProductItem
  ]
}

const ProductList = function(){
  const [list, setList] = useState<ProductItem[]>([]);

  useEffect(() => {
    console.log('Home 마운트');
    return ()=>console.log('Home 언마운트');
  });

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get<ProductRes>(`/products?extra={"extra.today": true}`);
      console.log(res);
      setList(res.data.item);
    }
    fetchData();
  }, []);

  const itemList = list.map(product => {
    return <ProductEntry key={product._id} product={product} />;
  });
  
  return (
    <main>
      <h1>오늘의 토이</h1>
      <ul>
        { itemList }
      </ul>
    </main>
    
  );
};

export default ProductList;