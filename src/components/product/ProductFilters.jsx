export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  priceRange,
  setPriceRange,
}) {
  return (
    <div className="mb-10 rounded-xl bg-white p-6 shadow-md">

      <div className="grid gap-5 md:grid-cols-4">

        {/* Search */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="rounded-lg border p-3 outline-none focus:border-blue-500"
        />


        {/* Category */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="rounded-lg border p-3 outline-none focus:border-blue-500"
        >

          <option value="All">
            All Categories
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="Fashion">
            Fashion
          </option>

          <option value="Grocery">
            Grocery
          </option>

          <option value="Furniture">
            Furniture
          </option>

          <option value="Sports">
            Sports
          </option>

          <option value="Beauty">
            Beauty
          </option>

        </select>


        {/* Sort */}

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="rounded-lg border p-3 outline-none focus:border-blue-500"
        >

          <option value="">
            Sort By
          </option>

          <option value="low">
            Price: Low to High
          </option>

          <option value="high">
            Price: High to Low
          </option>

          <option value="name">
            Name (A-Z)
          </option>

        </select>


        {/* Price Range */}

        <select
          value={priceRange}
          onChange={(e) =>
            setPriceRange(e.target.value)
          }
          className="rounded-lg border p-3 outline-none focus:border-blue-500"
        >

          <option value="All">
            Price Range
          </option>

          <option value="under50">
            Under $50
          </option>

          <option value="50to100">
            $50 - $100
          </option>

          <option value="100to200">
            $100 - $200
          </option>

          <option value="above200">
            Above $200
          </option>

        </select>

      </div>

    </div>
  );
}