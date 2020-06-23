import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: payment => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      // Calculate milliseconds left
      const millisecondsLeft = new Date(order.expiresAt) - new Date();

      // Update state for the time left
      setTimeLeft(Math.round(millisecondsLeft / 1000));
    };

    // Manually invoke findTimeLeft because setInterval invokes 1 sec late
    findTimeLeft();

    // Now invoke findTimeLeft for every sec
    const timerId = setInterval(findTimeLeft, 1000);

    // Stop as soon as we navigate from this component
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds until order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51GwoZQHoTeqrXIOU76H3UV0giirlDmroxlFrY0P4qPTARdHqrPP37ekbveuRBN1cOTs8aq3EnQGl8vj4XGJbd0hX001A3p4VVl"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
