import { Header } from "../../../components/layout/Header";
import { ActionButtons, Cards } from "../components";
import addPackageDolphin from "@/assets/images/add-packages-dolphin.svg";
import { HomeSupportBtn } from "../../../components";
import { useSubscriptions } from "../hooks/useSubscriptions";

export const ManageSubscription = () => {
  const NAVBAR_HEIGHT = 64;
  const MOBILE_BAR_HEIGHT = 56;

  const { items } = useSubscriptions();

  return (
    <>
      <Header title="الباقات والاشتراكات" balance="الرصيد:" />
      <main className="pt-8 flex justify-center flex-col items-center w-[90%] mx-auto">
        <ActionButtons />

        {/* Conditional rendering */}
        {!items.length > 0 ? (
          <div
            className="flex justify-center items-center mt-10"
            style={{
              height: `calc(70svh - ${NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT}px)`,
            }}
          >
            <img
              src={addPackageDolphin}
              alt="Add Packages"
              className="max-h-full w-auto object-contain"
            />
          </div>
        ) : (
          <Cards subscriptions={items} />
        )}

        <HomeSupportBtn />
      </main>
    </>
  );
};

export default ManageSubscription;
