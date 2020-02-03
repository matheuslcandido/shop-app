import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
  const produtcId = props.navigation.getParam('productId');
  const dispacth = useDispatch();

  const selectedProduct = useSelector(state => 
    state.products.availableProducts.find(prod => prod.id === produtcId)
  );

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button 
          color={Colors.primary} 
          title="Add To Cart" 
          onPress={() => {
            dispacth(
              cartActions.addToCart(selectedProduct)
            );
          }} 
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
  };  
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  price: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default ProductDetailScreen;