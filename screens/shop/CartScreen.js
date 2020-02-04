import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/Shop/CartItem';
import * as cartActions from '../../store/actions/cart';

const CartScreen = props => {
  const dispatch = useDispatch();
  
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  const cartItems = useSelector(state => {
    const trasformedCartItems = [];
    
    for (const key in state.cart.items) {
      trasformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }

    return trasformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
  });

  return (
    <View style={styles.screen}>
      <View style={styles.sumary}>
        <Text style={styles.sumaryText}>
          Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        <Button
          title='Order Now'
          color={Colors.primary}
          onPress={() => {}} 
          disabled={cartItems.length === 0}
        />
      </View>
      <FlatList 
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => {
          return (
            <CartItem 
              quantity={itemData.item.quantity} 
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              onRemove={() => {
                dispatch(cartActions.removeFromCart(itemData.item.productId));
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  sumary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  sumaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  }, 
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;