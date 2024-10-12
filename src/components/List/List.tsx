import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import _debounce from "lodash/debounce";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import Input from "../Input/CommonInput";
import { Empployee } from "../../containers/employee/employeeSlice";
import EMSApi from "../../utils/Api";
import Loader from "../Loader";
import Button from "../button";

interface GenericListGridProps {
  filterFields: string[];
  itemRenderer: (item: Empployee) => React.ReactNode;
  itemsPerPage?: number;
  pathTONavigate: string;
  navigate: (path: string) => void;
  loggedUser: Empployee | null;
}

interface Query {
  params: {
    role?: string;
    page: number;
    fullname?: object;
    dept?: object;
    $or?: Array<{ role: "employee" | "workspace_admin" }>;
  };
}

const GenericListGrid: React.FC<GenericListGridProps> = ({
  filterFields,
  itemRenderer,
  // itemsPerPage = 10,
  pathTONavigate,
  navigate,
  loggedUser,
}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    useInfiniteQuery(
      "employees",
      async ({ pageParam = 0 }) => {
        const query: Query = {
          params: {
            role: "employee",
            page: pageParam + 1,
          },
        };
        if (loggedUser?.role === "super_admin") {
          query.params = {
            $or: [{ role: "employee" }, { role: "workspace_admin" }],
            page: pageParam + 1,
          };
        }
        if (pageParam > 1) {
          query.params.page = pageParam;
        }
        if (!_isEmpty(searchTerm)) {
          query.params.fullname = {
            $regex: `.*${searchTerm}.*`,
            $options: "i",
          };
        }
        if (filters.doj) {
          query.params = { ...query.params, ...filters };
        }
        if (filters.dept) {
          query.params.dept = {
            $regex: `.*${filters.dept}.*`,
            $options: "i",
          };
        }
        const response = await EMSApi.user.getUsers(query);
        console.log("ressssss", response);

        return _get(response, "data.data", {});
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.pagination.hasMore ?? false;
        },
      }
    );

  useEffect(() => {
    refetch();
  }, [filters, searchTerm, refetch, loggedUser]);

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
          type="text"
          label="Search"
          classname="border border-gray-300 rounded-md p-2 w-full"
          // handleBlur={() => {}}
          handleChange={handleSearch}
          htmlfor="search"
          id="search"
          labelClass=""
          name="search"
        />
      </div>

      <div className="mb-4 flex">
        {filterFields.map((field) => (
          <Input
            classname="border border-gray-300 rounded-md p-2 mr-2"
            handleChange={(e) => handleFilterChange(field, e.target.value)}
            htmlfor={field}
            id={field}
            label={field.toUpperCase()}
            labelClass="block"
            name={field}
            type={field === "doj" ? "date" : "text"}
            key={field}
          />
        ))}
      </div>

      <div className="mb-4 flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("list")}
            label="List View"
            variant={viewMode === "list" ? "submit" : "cancel"}
          />
          <Button
            onClick={() => setViewMode("grid")}
            label="Grid View"
            variant={viewMode === "grid" ? "submit" : "cancel"}
          />
        </div>
        <div>
          <Button
            label="Create Employee"
            type="button"
            onClick={() => navigate(pathTONavigate)}
          />
        </div>
      </div>
      {viewMode === "list" && (
        <div className={"flex flex-col"}>
          <div className="flex employee-center">
            <span>Name</span>
            <span>Department</span>
            <span>DOJ</span>
            <span>Role</span>
          </div>
          {data?.pages.length &&
            data?.pages.map((page) => {
              return page?.employees.length
                ? page?.employees?.map((item: Empployee) => (
                    <div key={item._id} className="border p-4 rounded shadow">
                      {itemRenderer(item)}
                    </div>
                  ))
                : [];
            })}
        </div>
      )}
      {viewMode === "list" && hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
          disabled={isFetching || isLoading}
        >
          {isFetching ? "Loading..." : "Load More"}
        </button>
      )}

      {viewMode === "grid" && (
        <div
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (
              scrollTop + clientHeight >= scrollHeight - 5 &&
              hasNextPage &&
              !isFetching
            ) {
              fetchNextPage();
            }
          }}
          className="overflow-y-auto max-h-64"
        >
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col"
            }
          >
            {data?.pages?.length &&
              data?.pages.map((page) => {
                return page?.employees.length
                  ? page.employees.map((item: Empployee) => (
                      <div key={item._id} className="border p-4 rounded shadow">
                        {itemRenderer(item)}
                      </div>
                    ))
                  : [];
              })}
          </div>
        </div>
      )}

      {isLoading && <Loader classNames="border-blue-500 h-20 w-20" />}
    </div>
  );
};

export default GenericListGrid;
