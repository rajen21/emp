import React from 'react';
import { Workspaces } from '../../containers/workspaces/workspaceSliice';

interface ListViewProps {
  items: Workspaces[] | null;
}

const ListView: React.FC<ListViewProps> = ({ items }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Workspaces</h2>
      <ul className="space-y-4">
        {items?.map((item) => (
          <li key={item._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <h3 className="text-lg font-bold">{item.name}</h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;
