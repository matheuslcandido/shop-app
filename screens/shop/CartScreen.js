import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';
import CartItem from '../../components/Shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';

const CartScreen = props => {
  const [isLoading, setIsLoading] = useState(false);

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

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.sumary}>
        <Text style={styles.sumaryText}>
          Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2)) * 100 / 100}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size='large' color={Colors.primary} /> 
        ) : (
          <Button
            title='Order Now'
            color={Colors.primary}
            onPress={sendOrderHandler} 
            disabled={cartItems.length === 0}
          /> 
        )}
      </Card>
      <FlatList 
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => {
          return (
            <CartItem 
              deletable
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

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart',
}

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