import React from 'react';
import { Workspaces } from '../../containers/workspaces/workspaceSliice';
import Button from '../button';

interface ListViewProps {
  items: Workspaces[] | null;
  onClick: () => void;
  onListClick: (id: string) => void;
  buttonLable: string;
}

const ListView: React.FC<ListViewProps> = ({ items, onClick, onListClick, buttonLable }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className='flex items-center justify-between'>
        <h2 className="text-2xl font-semibold mb-4">Workspaces</h2>
        <Button onClick={onClick} isLoading={false} label={buttonLable} />
      </div>
      <ul className="space-y-4">
        {items?.map((item) => (
          <li key={item._id} className="flex justify-between items-center border-b pb-2" onClick={() => onListClick(item._id)}>
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
