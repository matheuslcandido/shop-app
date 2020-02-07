import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const EditProductScreen = props => {
  const dispatch = useDispatch();

  const productId = props.navigation.getParam('productId');

  const editedProduct = useSelector(state => (
    state.products.userProducts.find(prod => prod.id === productId))
  );

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
  const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

  const submitHandler = useCallback(() => {
    if (editedProduct) {
      dispatch(productsActions.updateProduct(
        productId, 
        title,
        description,
        imageUrl
      ));
    } else {
      dispatch(productsActions.createProduct(
        title,
        description,
        imageUrl,
        +price
      ));
    }

    props.navigation.goBack();
  }, [dispatch, productId, title, description, imageUrl, price]);

  useEffect(() => {
    props.navigation.setParams({ 'submit': submitHandler });
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput 
            value={title} 
            onChangeText={text => setTitle(text)} 
            style={styles.input} 
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput 
            value={imageUrl} 
            onChangeText={text => setImageUrl(text)} 
            style={styles.input} 
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput 
              value={price} 
              onChangeText={text => setPrice(text)} 
              style={styles.input} 
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            value={description} 
            onChangeText={text => setDescription(text)} 
            style={styles.input} 
          />
        </View>
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitHandler = navData.navigation.getParam('submit');

  return {
    headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Save' 
          iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark' } 
          onPress={submitHandler}  
        />
      </HeaderButtons>
    ),
  }
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default EditProductScreen;