import ProducItem from "app/components/ProducItem";
import {
  addProductInShoppingCart,

  getAllProductsFromApi, getProducts,

  ProductsApi
} from "app/ducks/productsEcommerce";
import React, { useEffect } from "react";
import { Ring } from "react-awesome-spinners";
import { connect } from "react-redux";
import { Grid, Text } from "./style";

function Products(props) {
  useEffect(() => {
    props.getAllProductsFromApi(
      "https://5d6da1df777f670014036125.mockapi.io/api/v1/product"
    );
  }, []);
  return (
    <Grid>
      <div style={{ alignSelf: "center" }}>
        {props.loading && <Ring color={"crimson"} />}
      </div>

      {!props.loading ? (
        props.products.length > 0 ? (
          props.products.map((item, index) => (
            <ProducItem
              key={index}
              image={item.image}
              name={item.name}
              stock={item.stock}
              price={item.price}
              addToCart={(product: ProductsApi) =>
                props.addProductInShoppingCart(product)
              }
            />
          ))
        ) : (
          <Text>{"Nenhum item encontrado"}</Text>
        )
      ) : null}
    </Grid>
  );
}

export default connect(getProducts, (dispatch: any) => ({
  addProductInShoppingCart: (product: ProductsApi) =>
    dispatch(addProductInShoppingCart(product)),
  getAllProductsFromApi: (url: string) => dispatch(getAllProductsFromApi(url)),
}))(Products);
