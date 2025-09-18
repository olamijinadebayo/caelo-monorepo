import React from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'inflow' | 'outflow';
}

export const TransactionsTable: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-12-09',
      description: 'Customer Payment - Invoice #1234',
      category: 'Revenue',
      amount: 2500.00,
      type: 'inflow'
    },
    {
      id: '2',
      date: '2024-12-08',
      description: 'Office Supplies - Staples',
      category: 'Operating Expenses',
      amount: 150.75,
      type: 'outflow'
    },
    {
      id: '3',
      date: '2024-12-08',
      description: 'Utility Payment - Electric',
      category: 'Utilities',
      amount: 350.00,
      type: 'outflow'
    },
    {
      id: '4',
      date: '2024-12-07',
      description: 'Service Revenue - Contract ABC',
      category: 'Revenue',
      amount: 5000.00,
      type: 'inflow'
    },
    {
      id: '5',
      date: '2024-12-07',
      description: 'Uncategorized Transaction',
      category: 'Uncategorized',
      amount: 1250.00,
      type: 'outflow'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white border border-[#eaecf0] rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-[#eaecf0]">
        <h3 className="text-lg font-semibold text-[#020617]">Recent Transactions</h3>
        <p className="text-sm text-[#667085] mt-1">Last 30 days of business transactions</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 border-b border-[#eaecf0]">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">Date</div>
              </th>
              <th className="text-left px-6 py-3 border-b border-[#eaecf0]">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">Description</div>
              </th>
              <th className="text-left px-6 py-3 border-b border-[#eaecf0]">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">Category</div>
              </th>
              <th className="text-right px-6 py-3 border-b border-[#eaecf0]">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">Amount</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-[#eaecf0] hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-[#667085] text-sm font-normal">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[#101828] text-sm font-medium">
                    {transaction.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    transaction.category === 'Uncategorized'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : transaction.category === 'Revenue'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`text-sm font-medium ${
                    transaction.type === 'inflow' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'inflow' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-[#eaecf0] bg-gray-50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#667085]">Showing 5 of 156 transactions</span>
          <button className="text-[#1a2340] hover:text-[#111629] font-medium">
            View all transactions →
          </button>
        </div>
      </div>
    </div>
  );
};
