import React, { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../Store/cart-context';
import Checkout from './Checkout'

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);//sets checkout state so we can use it
  const [isSubmitting, setIsSubmitting] = useState(false);//this is for setting up a loading screen modal and action
  const [didSubmit, setDidSubmit] = useState(false);//final modal with success message and successful transfer of data to backend
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckout(true)//all this does is swtiching isCheckout to true
  };

  const submitOrderHandler = async (userData) => {//userData to be used for sending data to backend
    setIsSubmitting(true);//because we're submitting the cart data to backend
    await fetch('https://react-posting-default-rtdb.firebaseio.com/orders.json', {//posting the data to the backend, we don't set the fetch to a constant because the data shouldn't need a helper constant 
      method: 'POST',
      body: JSON.stringify({//I think you stringify when posting json data to backend
        user: userData,//I'm not too clear here, I think "user" here refers to backend value and we're swapping it for 
        orderedItems: cartCtx.items//need to figure out why this one is here
      })
    });
    setIsSubmitting(false);//bc no longer submitting data
    setDidSubmit(true);//this is true bc an action is called after we submit data, i.e. after this function happens
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (<div className={classes.actions}>{/*moved the order and cancel buttons into their own const for leaner jsx and usability*/}
  <button className={classes['button--alt']} onClick={props.onClose}>
    Close
  </button>
  {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}{/*The function this button relays to turns isCheckout state to true, triggering the Checkout component to show up*/}
  </div>
  );

  const cartModalContent = (<React.Fragment>
    {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose}/>} {/*This tell us that this component is conditional on certain state being true, NOTE: we initially set isCheckout to false in state, but here, isCheckout is truthy because it is in the curlies, this whole segment is depending on the orderHandler function*/}
      {/*For line above, onCancel is props handled in Checkout component, looks like onclick-props.onCancel, so onCancel is the props call here*/}
      {!isCheckout && modalActions}{/*Gets rid of the 'order' and a'clsoe' buttons when isCheckout is false, which in this case is after we click on order...I'm still a little confused on this one*/}
  </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending Order Data...</p>;
  const didSubmitModalContent = <p>Successfully Sent The Order!</p>
  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;