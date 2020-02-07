import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';

const EditProductScreen = props => {
  const productId = props.navigation.getParam('productId');

  const editedProduct = useSelector(state => (
    state.products.userProducts.find(prod => prod.id === productId))
  );

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
  const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

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
  return {
    headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Save' 
          iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark' } 
          onPress={() => {
            
          }}  
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