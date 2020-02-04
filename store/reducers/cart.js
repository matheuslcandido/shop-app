import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from "../actions/orders";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = action.product.price;
      const productTitle = action.product.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {

        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice,
        );

      } else {
        
        updatedOrNewCartItem = new CartItem(
          1, 
          productPrice, 
          productTitle, 
          productPrice
        );

      };

      return {
        ...state,
        items: {...state.items, [addedProduct.id]: updatedOrNewCartItem},
        totalAmount: state.totalAmount + productPrice,
      };

    case REMOVE_FROM_CART: 
      const currentyQuantity = state.items[action.productId].quantity;
      const selectedCartItem = state.items[action.productId];
      let updatedCartItems;

      if (currentyQuantity > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );

        updatedCartItems = { ...state.items, [action.productId]: updatedCartItem }
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.productId];
      }
      
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      }

    case ADD_ORDER: 
      return initialState;
  }
  
  return state;
};