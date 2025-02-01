import React, { useState } from 'react';
import { Card, CardContent } from './UI/Card';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import { motion } from 'framer-motion';

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [newRegimeTax, setNewRegimeTax] = useState(null);
  const [oldRegimeTax, setOldRegimeTax] = useState(null);
  const [deductions, setDeductions] = useState({ new: 0, old: 0 });

  const oldRegimeRates = [
    { limit: 800000, rate: 3.75 },
    { limit: 900000, rate: 4.44 },
    { limit: 1000000, rate: 5 },
    { limit: 1100000, rate: 5.91 },
    { limit: 1200000, rate: 6.67 },
    { limit: 1300000, rate: 7.69 },
    { limit: 1400000, rate: 8.57 },
    { limit: 1500000, rate: 9.33 },
    { limit: Infinity, rate: 30 }
  ];

  const newRegimeRates = [
    { limit: 1200000, rate: 0 },
    { limit: 1300000, rate: 5.77 },
    { limit: 1400000, rate: 6.43 },
    { limit: 1500000, rate: 7 },
    { limit: Infinity, rate: 30 }
  ];

  const calculateTax = (income, regimeRates) => {
    let tax = 0;
    let remainingIncome = income;
    let previousLimit = 0;

    for (const slab of regimeRates) {
      const slabAmount = Math.min(remainingIncome, slab.limit - previousLimit);
      if (slabAmount > 0) {
        tax += (slabAmount * slab.rate) / 100;
        remainingIncome -= slabAmount;
      }
      previousLimit = slab.limit;
      if (remainingIncome <= 0) break;
    }

    return tax;
  };

  const handleCalculate = () => {
    const incomeValue = parseFloat(income);
    if (!isNaN(incomeValue)) {
      const oldTax = calculateTax(incomeValue, oldRegimeRates);
      const newTax = calculateTax(incomeValue, newRegimeRates);

      setOldRegimeTax(oldTax);
      setNewRegimeTax(newTax);
      setDeductions({ new: incomeValue - newTax, old: incomeValue - oldTax });
    }
  };

  const taxDifference = newRegimeTax !== null && oldRegimeTax !== null
    ? Math.abs(newRegimeTax - oldRegimeTax)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 shadow-xl rounded-2xl">
          <CardContent>
            <h1 className="text-2xl font-bold text-center mb-4">India Tax Calculator</h1>
            <Input
              type="number"
              placeholder="Enter your yearly income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleCalculate} className="w-full">
              Calculate Tax
            </Button>
            {newRegimeTax !== null && oldRegimeTax !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 space-y-3"
              >
                <div className="bg-green-100 p-3 rounded-xl text-center">
                  <p className="font-medium">New Regime Tax: ₹{newRegimeTax.toFixed(2)}</p>
                  <p>Salary After Tax: ₹{(income - newRegimeTax).toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl text-center">
                  <p className="font-medium">Old Regime Tax: ₹{oldRegimeTax.toFixed(2)}</p>
                  <p>Salary After Tax: ₹{(income - oldRegimeTax).toFixed(2)}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl text-center">
                  <p className="font-bold">Tax Difference: ₹{taxDifference.toFixed(2)}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TaxCalculator;
