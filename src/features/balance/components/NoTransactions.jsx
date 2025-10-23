import React from 'react'
import noTransactions from "@/assets/balance/no-transactions.webp"
const NoTransactions = () => {
  return (
    <div className="my-14 w-[50%] lg:w-[30%] mx-auto flex items-center justify-center">
      <img src={noTransactions} alt="no-transactions" className="w-full" />
    </div>
  )
}

export default NoTransactions
