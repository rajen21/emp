import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import _debounce from 'lodash/debounce';
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import Input from '../Input/CommonInput';
import { Empployee } from '../../containers/employee/employeeSlice';
import EMSApi, { } from '../../utils/Api';
import Loader from '../Loader';

interface GenericListGridProps {
  filterFields: string[];
  itemRenderer: (item: Empployee) => React.ReactNode;
  itemsPerPage?: number;
}

interface Query {
  params: {
    role: string;
    page: number;
    fullname?:object;
    dept?: object;
  }
}

const GenericListGrid: React.FC<GenericListGridProps> = ({
  filterFields,
  itemRenderer,
  itemsPerPage = 10,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    'employees',
    async ({ pageParam = 0 }) => {
      console.log("aaaaa", filters);
      
      const query: Query = {
        params: {
          role: "employee",
          page: 1
        }
      }
      if (pageParam > 1) {
        query.params.page = pageParam;
      }
      if (!_isEmpty(searchTerm)) {
        query.params.fullname = {
          $regex: `.*${searchTerm}.*`,
          $option: "i"
        }
      }
      if (filters.doj) {
        query.params = {...query.params, ...filters};
      }
      if (filters.dept) {
        query.params.dept = {
          $regex: `.*${filters.dept}.*`,
          $option: "i",
        };
      }
      const response = await EMSApi.user.getUsers(query);

      return _get(response, "data.data.employees", []);
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage ?? false;
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [filters, searchTerm, refetch]);

  const handleSearch = _debounce((e: React.ChangeEvent<HTMLInputElement>) => {

    setSearchTerm(e.target.value);
  }, 300);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input
          type='text'
          label='Search'
          classname='border border-gray-300 rounded-md p-2 w-full'
          // handleBlur={() => {}}
          handleChange={handleSearch}
          htmlfor='search'
          id='search'
          labelClass=''
          name='search'
        />
      </div>

      <div className="mb-4">
        {filterFields.map((field) => (
          <Input
            classname='border border-gray-300 rounded-md p-2 mr-2'
            handleChange={(e) => handleFilterChange(field, e.target.value)}
            htmlfor={field}
            id={field}
            label={field.toUpperCase()}
            labelClass='block'
            name={field}
            type={field === "doj" ? "date" : "text"}
          />
        ))}
      </div>

      <div className="mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`mr-2 px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Grid View
        </button>
      </div>
      {viewMode === "list" &&
        <div className={'flex flex-col'}>
          <div className='flex justify-between'>
            <span>Name</span>
            <span>Department</span>
            <span>DOJ</span>
          </div>
          {data?.pages.length && data?.pages.map((page) => {
            return page?.length ? page?.map((item: Empployee) => (
              <div key={item._id} className="border p-4 rounded shadow">
                {itemRenderer(item)}
              </div>
            )) : []
          }
          )}
        </div>
      }

      {viewMode === 'list' && hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
          disabled={isFetching || isLoading}
        >
          {isFetching ? 'Loading...' : 'Load More'}
        </button>
      )}

      {viewMode === 'grid' && (
        <div
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollTop + clientHeight >= scrollHeight - 5 && hasNextPage && !isFetching) {
              fetchNextPage();
            }
          }}
          className="overflow-y-auto h-96"
        >
          <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'flex flex-col'}>
            {data?.pages?.length && data?.pages.map((page) => {
              console.log("111111111111111", page);

              return page?.length ? page.map((item: Empployee) => (
                <div key={item._id} className="border p-4 rounded shadow">
                  {itemRenderer(item)}
                </div>
              )) : []
            }
            )}
          </div>
        </div>
      )}

      {isLoading && <Loader classNames='' />}
    </div>
  );
};

export default GenericListGrid;
