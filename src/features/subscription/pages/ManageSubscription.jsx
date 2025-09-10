import { Header, HomeSupportBtn } from "@/components";
import { ActionButtons, Cards, EmptySubscriptions } from "../components";
import { useSubscriptions } from "../hooks/useSubscriptions";

 const ManageSubscription = () => {
  const { items } = useSubscriptions();

  return (
    <>
      <Header title="الباقات والاشتراكات" onBack={"/subscriptions"} balance="0" showBalanceSection={false} />
      <main className="pt-8 flex justify-center flex-col items-center w-[90%] mx-auto">
        <ActionButtons />

        {items.length === 0 ? <EmptySubscriptions /> : <Cards subscriptions={items} />}

        <HomeSupportBtn />
      </main>
    </>
  );
};

export default ManageSubscription;
