import React, { useState } from 'react';
import { Item } from './Item';  // Import the shared Item type

interface CheckboxListProps {
  items: Item[];
  onSubmit: (selectedItems: Item[], total: number) => void;  // onSubmit now accepts both selected items and total
}

const CheckboxList: React.FC<CheckboxListProps> = ({ items, onSubmit }) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    items.reduce((acc, item) => {
      acc[item.name] = false;  // Initialize all checkboxes as unchecked
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const [totalValue, setTotalValue] = useState<number>(50);

  // Helper function to format the value as currency (GBP)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',  // Use GBP for Pounds Sterling
    }).format(amount);  // Format the value as GBP currency
  };

  const handleCheckboxChange = (item: Item) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [item.name]: !checkedItems[item.name],  // Toggle checkbox state
    };
    setCheckedItems(updatedCheckedItems);

    if (updatedCheckedItems[item.name]) {
      // Add item value to the total
      setTotalValue((prevTotal) => prevTotal + item.value);
    } else {
      // Subtract item value from the total
      setTotalValue((prevTotal) => prevTotal - item.value);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Collect the selected items (those that are checked)
    const selectedItems = items.filter((item) => checkedItems[item.name]);

    // Call onSubmit with both the selected items and the total value
    onSubmit(selectedItems, totalValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select Items:</h3>
      {items.map((item) => (
        <div key={item.name}>
          <label>
            <input
              type="checkbox"
              checked={checkedItems[item.name]}
              onChange={() => handleCheckboxChange(item)}
            />
            {item.name} {formatCurrency(item.value)}  {/* Display value as currency (GBP) */}
          </label>
        </div>
      ))}
      <button type="submit">Submit</button>

      <div>
        <h4>Running Total: {formatCurrency(totalValue)}</h4>  {/* Display the running total as GBP currency */}
      </div>
    </form>
  );
};

export default CheckboxList;
