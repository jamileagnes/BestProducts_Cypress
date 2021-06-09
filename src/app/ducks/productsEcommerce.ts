import { hen, Hen } from "app/utility/createReducer";
import axios from "axios";
import { RootState } from "ducks";
import { ThunkAction } from "redux-thunk";
import { createSelector } from "reselect";

//Objeto retornado da api consultada
export type ProductsApi = {
  image: string;
  name: string;
  price: number;
  stock: number;
  createdAt: number;
};

//Possiveis estados que o objeto da api pode se tornar dentro da aplicação
export interface ProductState {
  products: Array<ProductsApi>;
  allProducts: Array<ProductsApi>;
  shoppingCart: Array<ProductsApi>;
  openCart: boolean;
  finishCheckout: boolean;
  totalItems: number;
  loading: boolean;
}

export type InitialState = ProductState;

const initialState: InitialState = {
  products: [],
  allProducts: [],
  shoppingCart: [],
  totalItems: 0.0,
  finishCheckout: false,
  openCart: false,
  loading: false,
};

const mainSelector = (state: RootState) => state.products;

export const getProducts = createSelector(mainSelector, (state) => {
  return {
    loading: state.loading,
    products: state.products,
    allProducts: state.allProducts,
  };
});

export const getShoppingCart = createSelector(mainSelector, (state) => {
  return {
    loading: state.loading,
    shoppingCart: state.shoppingCart,
    openCart: state.openCart,
    totalItems: state.totalItems,
  };
});

export const getOpenCart = createSelector(mainSelector, (state) => {
  return {
    loading: state.loading,
    openCart: state.openCart,
    numberItems: state.shoppingCart.length,
  };
});

export const getCheckout = createSelector(mainSelector, (state) => {
  return {
    loading: state.loading,
    finishCheckout: state.finishCheckout,
  };
});

class EditorReactions extends Hen<InitialState> {
  setLoading(a: boolean) {
    this.state.loading = a;
  }

  listProducts(product: ProductsApi) {
    this.state.products = [...this.state.products, product];
  }

  addProductShoppingCart(product: ProductsApi) {
    this.state.shoppingCart = [...this.state.shoppingCart, product];
  }

  removeProductShoppingCart(index: number) {
    const cart = this.state.shoppingCart;
    cart.splice(index, 1);
    this.state.shoppingCart = cart;
  }

  openCart(param?: boolean) {
    this.state.openCart = !this.state.openCart;
  }

  //Metodo responsavel pelo calculo do total de itens
  totalItems() {
    const prices = this.state.shoppingCart.map((item) => item.price);
    let total = 0;
    if (prices.length > 0) {
      total = prices.reduce((accumulator, item) => accumulator + item);
    }

    this.state.totalItems = total;
  }

  setAllProducts(product: ProductsApi) {
    this.state.allProducts = [...this.state.allProducts, product];
  }

  //Metodo responsavel pela busca de produtos
  searchProduct(word: string) {
    if (word === "") {
      this.state.products = this.state.allProducts;
    } else {
      this.state.products = this.state.allProducts.filter(
        (item) => item.name.toUpperCase().indexOf(word.toUpperCase()) > -1
      );
    }
  }

  finishCheckout() {
    this.state.finishCheckout = !this.state.finishCheckout;
  }

  removeAllProductsFromShoppingCart() {
    this.state.shoppingCart = [];
  }
}

//Reducers
export const [menuReducer, actions] = hen(new EditorReactions(initialState));
export default menuReducer;

export function removeAllProductsFromShoppingCart(): ThunkAction<
  Promise<void>,
  RootState,
  any,
  any
> {
  return async (dispatch: any) => {
    dispatch(actions.openCart(false));
    dispatch(actions.removeAllProductsFromShoppingCart());
    dispatch(actions.totalItems());
  };
}

export function addProductInShoppingCart(
  product: ProductsApi
): ThunkAction<Promise<void>, RootState, any, any> {
  return async (dispatch: any) => {
    dispatch(actions.addProductShoppingCart(product));
    dispatch(actions.totalItems());
  };
}

export function removeProductFromShoppingCart(
  index
): ThunkAction<Promise<void>, RootState, any, any> {
  return async (dispatch: any) => {
    dispatch(actions.removeProductShoppingCart(index));
    dispatch(actions.totalItems());
  };
}

export function getAllProductsFromApi(
  url: string
): ThunkAction<Promise<void>, RootState, any, any> {
  return async (dispatch) => {
    dispatch(actions.setLoading(true));
    return axios
      .get(url)
      .then((productsReturnedApi: any) => {
        productsReturnedApi.data.forEach((productApi) => {
          dispatch(
            actions.listProducts({
              name: productApi.name,
              image: productApi.image,
              price: Number(productApi.price),
              stock: productApi.stock,
              createdAt: productApi.createdAt,
            })
          );
          dispatch(
            actions.setAllProducts({
              name: productApi.name,
              image: productApi.image,
              price: Number(productApi.price),
              stock: productApi.stock,
              createdAt: productApi.createdAt,
            })
          );
        });
        dispatch(actions.setLoading(false));
      })
      .catch((e) => {
        dispatch(actions.setLoading(false));
      });
  };
}
