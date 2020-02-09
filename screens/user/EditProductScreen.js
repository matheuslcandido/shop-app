import React, { useEffect, useCallback, useReducer } from 'react';
import { ScrollView, View, StyleSheet, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';

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

  const inputChangeHandler = useCallback((inputIndetifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE, 
      value: inputValue,
      isValid: inputValidity,
      input: inputIndetifier,
    });
  }, [dispatchFormState]);

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='title'
            label='Title'
            errorText='Please enter a valid title!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorret
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initiallyValid={!!editedProduct}
            required
          />
          <Input
            id='imageUrl'
            label='Image Url'
            errorText='Please enter a valid image url!'
            keyboardType='default'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid={!!editedProduct}
            required
          />
          {editedProduct ? null : (
            <Input
              id='price'
              label='Price'
              errorText='Please enter a valid price!'
              keyboardType='decimal-pad'
              returnKeyType='next'
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id='description'
            label='Description'
            errorText='Please enter a valid description!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorret
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});

export default EditProductScreen;