import { Riyal } from "./Illustrations";

const FormatWithCurrency = ({
    amount,
    showSymbol = true,
    className = "",
    symbolClass = "",
    symbolFill = "#E89B32",
    fractionDigits = 0,
    locale = "en-US",
    useGrouping = true,
    }) => {
    if (amount == null || isNaN(amount)) return "0";

    return (
        <span className={`flex items-center gap-1 ${className}`}>
        {Number(amount).toLocaleString(locale, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
            useGrouping,
        })}
        {showSymbol && <Riyal className={symbolClass} fill={symbolFill} />}
        </span>
    );
};


export default FormatWithCurrency;
