import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Platform, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/Shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';

const ProductOverViewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      await dispatch(productActions.fetchProducts());
    } catch(error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadProducts();
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', { 
      productId: id, 
      productTitle: title 
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button 
          title='Try again' 
          onPress={loadProducts} 
          color={Colors.primary} 
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator 
          size='large' 
          color={Colors.primary}
        />
      </View>
    );
  };

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={products} 
      keyExtractor={item => item.id} 
      renderItem={itemData => 
        <ProductItem 
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button 
            color={Colors.primary} 
            title='View Details' 
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }} 
          />
          <Button 
            color={Colors.primary} 
            title='To Cart' 
            onPress={() => {
              dispatch(
                cartActions.addToCart(itemData.item)
              );
            }} 
          />
        </ProductItem>
      }
    />
  );
};

ProductOverViewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Menu' 
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' } 
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}  
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Cart' 
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart' } 
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}  
        />
      </HeaderButtons>
    ),
  }
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductOverViewScreen;