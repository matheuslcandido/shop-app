import React, { useEffect, useCallback, useReducer } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };

    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return { 
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
     };
  };

  return state;
};

const EditProductScreen = props => {
  const productId = props.navigation.getParam('productId');

  const editedProduct = useSelector(state => (
    state.products.userProducts.find(prod => prod.id === productId))
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '',
    }, 
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    }, 
    formIsValid: editedProduct ? true : false,
  });

  const submitHandler = useCallback(() => {
    let { title, description, imageUrl, price } = formState.inputValues;

    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form!', [
        { text: 'Ok' },
      ]);

      return;
    }

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
  }, [formState]);

  useEffect(() => {
    props.navigation.setParams({ 'submit': submitHandler });
  }, [submitHandler]);

  const textChangeHandler = (inputIndetifier, text) => {
    let isValid = false;

    if (text.trim().length > 0) {
      isValid = true;
    }

    dispatchFormState({
      type: FORM_INPUT_UPDATE, 
      value: text,
      isValid: isValid,
      input: inputIndetifier,
    });
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput 
            value={formState.inputValues.title} 
            onChangeText={text => textChangeHandler('title', text)} 
            style={styles.input} 
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect={false}
            returnKeyType='next'
            onEndEditing={() => console.log('onEndEditing')}
            onSubmitEditing={() => console.log('onSubmitEditing')}
          />
          {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput 
            value={formState.inputValues.imageUrl} 
            onChangeText={text => textChangeHandler('imageUrl', text)} 
            style={styles.input} 
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput 
              value={formState.inputValues.price} 
              onChangeText={text => textChangeHandler('price', text)} 
              style={styles.input} 
              keyboardType='decimal-pad'
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            value={formState.inputValues.description} 
            onChangeText={text => textChangeHandler('description', text)} 
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