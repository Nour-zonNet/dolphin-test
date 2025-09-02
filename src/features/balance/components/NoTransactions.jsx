import React from 'react'
import noTransactions from "@/assets/balance/no-transactions.svg"
const NoTransactions = () => {
  return (
    <div className="my-20 w-[90%] mx-auto flex items-center justify-center">
      <img src={noTransactions} alt="no-transactions" />
    </div>
  )
}

export default NoTransactions
