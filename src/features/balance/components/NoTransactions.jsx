import React from 'react'
import noTransactions from "@/assets/balance/no-transactions.svg"
const NoTransactions = () => {
  return (
    <div className="my-14 w-[70%] lg:w-[40%] mx-auto flex items-center justify-center">
      <img src={noTransactions} alt="no-transactions" className="w-full" />
    </div>
  )
}

export default NoTransactions
