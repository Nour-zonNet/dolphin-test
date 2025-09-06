import { useModal } from "./useModal";

const ModalExamples = () => {
  const {
    openBuyPackageModal,
    openDetailsModal,
    openConfirmModal,
    openChangeGroupModal,
    openReactivateModal,
    openExtendPackageModal,
  } = useModal();

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Modal Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Buy Package Modal */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Buy Package Modal</h3>
          <p className="text-sm text-gray-600 mb-3">
            Opens a modal for purchasing packages with package details and
            pricing.
          </p>
          <button
            onClick={() =>
              openBuyPackageModal({
                name: "باقة الصحة العامة",
                price: 129,
                walletBalance: 0,
                trialDays: 1,
                startDate: "السبت 09-08-2025",
                canUseWallet: false,
              })
            }
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Open Buy Package Modal
          </button>
        </div>

        {/* Details Modal */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Details Modal</h3>
          <p className="text-sm text-gray-600 mb-3">
            Shows detailed information about a package or course.
          </p>
          <button
            onClick={() =>
              openDetailsModal({
                name: "مادة الصحة العامة",
                description:
                  "تهدف هذه المادة إلى تعريف الطالب بأساسيات الوقاية من الأمراض وأهمية اتباع أنماط الحياة الصحية السليمة.",
              })
            }
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Open Details Modal
          </button>
        </div>

        {/* Confirm Modal */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Confirm Modal</h3>
          <p className="text-sm text-gray-600 mb-3">
            Generic confirmation modal for user actions.
          </p>
          <button
            onClick={() =>
              openConfirmModal(
                {
                  title: "تأكيد الحذف",
                  message: "هل أنت متأكد من رغبتك في حذف هذا العنصر؟",
                  confirmText: "حذف",
                  type: "danger",
                },
                () => console.log("Confirmed deletion")
              )
            }
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Open Confirm Modal
          </button>
        </div>

        {/* Change Group Modal */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Change Group Modal</h3>
          <p className="text-sm text-gray-600 mb-3">
            Allows users to switch between different study groups.
          </p>
          <button
            onClick={() =>
              openChangeGroupModal(
                {
                  currentGroupId: 2,
                  groups: [
                    {
                      id: 1,
                      name: "المجموعة 1",
                      instructor: "أنيس",
                      days: "الأحد | الثلاثاء",
                      time: "5:00 مساءً",
                      isCurrent: false,
                    },
                    {
                      id: 2,
                      name: "المجموعة 2",
                      instructor: "أنيس",
                      days: "الأحد | الثلاثاء",
                      time: "5:00 مساءً",
                      isCurrent: true,
                    },
                  ],
                },
                (groupId) => console.log("Changed to group:", groupId)
              )
            }
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Open Change Group Modal
          </button>
        </div>

        {/* Reactivate Modal */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Reactivate Modal</h3>
          <p className="text-sm text-gray-600 mb-3">
            For reactivating expired subscriptions.
          </p>
          <button
            onClick={() =>
              openReactivateModal(
                {
                  packageName: "باقة الصحة العامة",
                },
                () => console.log("Subscription reactivation requested")
              )
            }
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Open Reactivate Modal
          </button>
        </div>

        {/* Extend Package Modal */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-2">Extend Package Modal</h3>
          <p className="text-sm text-gray-600 mb-3">
            For extending package duration.
          </p>
          <button
            onClick={() =>
              openExtendPackageModal(
                {
                  packageName: "باقة الصحة العامة",
                },
                () => console.log("Package extension requested")
              )
            }
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Open Extend Package Modal
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          Usage Instructions:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>
            Import the{" "}
            <code className="bg-blue-100 px-1 rounded">useModal</code> hook in
            your component
          </li>
          <li>Call the appropriate modal function with required data</li>
          <li>Optionally pass a callback function for confirmation actions</li>
          <li>Modals automatically close when actions are completed</li>
        </ol>
      </div>
    </div>
  );
};

export default ModalExamples;
