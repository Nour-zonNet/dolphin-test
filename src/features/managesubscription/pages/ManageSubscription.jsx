import React, { useState } from 'react';
import { Header } from '../../../components/layout/Header';
import { ActionButtons, Cards } from '../components';
import addPackageDolphin from '@/assets/images/add-packages-dolphin.svg'
import { HomeSupportBtn } from "../../../components";

export const ManageSubscription = () => {
  const NAVBAR_HEIGHT = 64; // px
  const MOBILE_BAR_HEIGHT = 56; // px

  const [subscriptions, setSubscriptions] = useState( [{ id: 1, name: "Premium Plan" }]);

  // useEffect(() => {
  //   const fetchSubscriptions = async () => {
  //     const response = [];

  //     setSubscriptions(response);
  //   };
  //   fetchSubscriptions();
  // }, []);

  const hasSubscriptions = subscriptions.length > 0; 

  return (
    <>
      <Header title="الباقات والاشتراكات" balance="الرصيد:" />    
    <main className="pt-8 flex justify-center flex-col items-center w-[%] mx-auto">
      <ActionButtons />

      {/* Conditional rendering */}
      {!hasSubscriptions ? (
        <div
          className="flex justify-center items-center mt-10"
          style={{ height: `calc(70svh - ${NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT}px)` }}
        >
          <img
            src={addPackageDolphin}
            alt="Add Packages"
            className="max-h-full w-auto object-contain"
          />
        </div>
      ) : (
        <Cards subscriptions={subscriptions} />
      )}

      <HomeSupportBtn />
  </main>
</>
  );
};

export default ManageSubscription