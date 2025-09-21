
const ActionButtons = ({ canUndo, canRedo, onUndo, onRedo, onClear, isMobile = false }) => {
  return (
    <div 
      className={`flex rounded-lg justify-between flex-row-reverse gap-1 ${
        isMobile ? "p-2" : "p-1"
      }`}
      role="toolbar"
      aria-label="Drawing actions"
    >
      <div className={`${isMobile ? "space-x-2" : "space-x-4"}`}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`rounded-md transition-colors ${
            isMobile ? "p-1" : "p-2"
          } ${
            !canUndo
              ? " text-orange-400 cursor-not-allowed"
              : "bg-orange-300 text-white hover:"
          }`}
          title="Undo (Ctrl+Z or Z)"
          aria-label="Undo last action"
          aria-disabled={!canUndo}
        >
          <span className="text-lg">
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.0651 3.02922C17.0148 2.97147 15.8036 1.59597 13.5971 0.553475C13.2221 0.378725 12.7758 0.536975 12.5981 0.911225C12.4211 1.28622 12.5816 1.73322 12.9558 1.91022C13.4988 2.16672 13.9728 2.44648 14.3741 2.71648C12.2891 2.65272 7.69159 2.59348 4.86259 3.17097C2.86159 3.57973 1.29559 5.07597 0.873336 6.98248C0.707586 7.73023 0.707586 8.48847 0.873336 9.23623C1.29559 11.1435 2.86159 12.6397 4.86259 13.0477C6.39334 13.3605 7.93234 13.5165 9.47209 13.5165C11.6778 13.5165 13.8858 13.1962 16.0758 12.5572C16.4733 12.441 16.7013 12.0247 16.5858 11.6272C16.4703 11.2297 16.0541 11.0025 15.6558 11.1172C12.1736 12.1342 8.64409 12.2895 5.16259 11.5777C3.76309 11.2927 2.62834 10.221 2.33809 8.91148C2.21809 8.37148 2.21809 7.84648 2.33809 7.30648C2.62834 5.99773 3.76309 4.92597 5.16334 4.64022C7.89934 4.08222 12.6018 4.16172 14.5241 4.22247C14.0928 4.52322 13.5686 4.84197 12.9566 5.13072C12.5823 5.30772 12.4218 5.75472 12.5988 6.12972C12.7271 6.40047 12.9963 6.55947 13.2776 6.55947C13.3848 6.55947 13.4943 6.53623 13.5978 6.48748C15.8043 5.44498 17.0148 4.07097 17.0658 4.01247C17.3118 3.73047 17.3118 3.31047 17.0658 3.02848L17.0651 3.02922Z"
                fill="#08233F"
              />
            </svg>
          </span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`rounded-md transition-colors ${
            isMobile ? "p-1" : "p-2"
          } ${
            !canRedo
              ? " text-orange-400 cursor-not-allowed"
              : "bg-orange-300 text-white hover:"
          }`}
          title="Redo (Ctrl+Y or Y)"
          aria-label="Redo last undone action"
          aria-disabled={!canRedo}
        >
          <span className="text-lg">
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.202074 3.12634C0.256887 3.05545 1.57815 1.36695 3.98505 0.0872215C4.3941 -0.127294 4.88088 0.0669669 5.07478 0.526379C5.26785 0.986712 5.09278 1.53543 4.68454 1.7527C4.09222 2.06757 3.57517 2.41098 3.13748 2.74242C5.41184 2.66416 10.4269 2.59143 13.5128 3.30034C15.6956 3.80211 17.4038 5.63883 17.8644 7.97916C18.0452 8.89707 18.0452 9.82786 17.8644 10.7458C17.4038 13.087 15.6956 14.9237 13.5128 15.4246C11.8431 15.8085 10.1643 16 8.48469 16C6.07861 16 3.67007 15.6069 1.28117 14.8225C0.847569 14.6798 0.598862 14.1688 0.724852 13.6808C0.850842 13.1929 1.3049 12.9139 1.73932 13.0548C5.53783 14.3032 9.38789 14.4938 13.1856 13.6201C14.7122 13.2702 15.95 11.9546 16.2666 10.3471C16.3975 9.68424 16.3975 9.03977 16.2666 8.37689C15.95 6.77033 14.7122 5.4547 13.1848 5.10393C10.2003 4.41895 5.07069 4.51654 2.97385 4.59112C3.44427 4.9603 4.01614 5.35159 4.68372 5.70604C5.09196 5.92332 5.26704 6.47203 5.07396 6.93237C4.93406 7.26473 4.64036 7.45991 4.33356 7.45991C4.21657 7.45991 4.09713 7.43137 3.98423 7.37153C1.57733 6.0918 0.256889 4.40514 0.201258 4.33333C-0.0670853 3.98716 -0.0670853 3.47159 0.201258 3.12542L0.202074 3.12634Z"
                fill="#08233F"
              />
            </svg>
          </span>
        </button>
      </div>
      <button
        onClick={onClear}
        className={`border-orangedeep rounded-full border text-navyteal hover:bg-red-600 transition-colors ${
          isMobile 
            ? "py-1 px-2 text-xs" 
            : "py-1 px-4 text-sm"
        }`}
        title="Clear Canvas (Ctrl+N or Delete)"
        aria-label="Clear all drawings from canvas"
      >
        <span className="text-md text-navyteal"></span>
        مسح الكل
      </button>
    </div>
  );
};

export default ActionButtons;
