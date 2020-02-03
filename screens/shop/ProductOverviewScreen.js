import React from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/Shop/ProductItem';
import * as cartActions from '../../store/actions/cart';

const ProductOverViewScreen = props => {
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  return (
    <FlatList 
      data={products} 
      keyExtractor={item => item.id} 
      renderItem={itemData => 
        <ProductItem 
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetail={() => {
            props.navigation.navigate('ProductDetail', { 
              productId: itemData.item.id, 
              productTitle: itemData.item.title 
            });
          }}
          onAddToCard={() => {
            dispatch(
              cartActions.addToCart(itemData.item)
            );
          }}
        />
      }
    />
  );
};

ProductOverViewScreen.navigationOptions = {
  headerTitle: 'All Products',
};

export default ProductOverViewScreen;