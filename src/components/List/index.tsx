import React from 'react';

interface Item {
  id: number;
  name: string;
  description: string;
}

interface ListViewProps {
  items: Item[];
  onDelete: (id: number) => void;
}

const ListView: React.FC<ListViewProps> = ({ items, onDelete }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Item List</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;
