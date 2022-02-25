import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../Store/cart-context';
import Checkout from './Checkout'

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
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
  }

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

  const modalActions = <div className={classes.actions}>
  <button className={classes['button--alt']} onClick={props.onClose}>
    Close
  </button>
  {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}{/*The function this button relays to turns isCheckout state to true, triggering the Checkout component to show up*/}
  </div>

  return (
    <Modal onClose={props.onClose}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onCancel={props.onClose}/>} {/*This tell us that this component is conditional on certain state being true, NOTE: we initially set isCheckout to false in state, but here, isCheckout is truthy because it is in the curlies, this whole segment is depending on the orderHandler function*/}
      {/*For line above, onCancel is props handled in Checkout component, looks like onclick-props.onCancel, so onCancel is the props call here*/}
      {!isCheckout && modalActions}{/*Gets rid of the 'order' and a'clsoe' buttons when isCheckout is false, which in this case is after we click on order...I'm still a little confused on this one*/}
    </Modal>
  );
};

export default Cart;