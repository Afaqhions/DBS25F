import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/tables/ProductTable';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { STOCK_STATUS } from '../utils/constants';
import toast from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination({ totalCount, pageSize: 10 });

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data.data || res.data || []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: 10,
        sortColumn,
        sortDirection,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (stockFilter) params.stockStatus = stockFilter;
      const res = await productsAPI.getAll(params);
      const data = res.data.data || res.data;
      setProducts(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, debouncedSearch, categoryFilter, stockFilter, sortColumn, sortDirection]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productsAPI.delete(deleteTarget.productId);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchProducts} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 transition" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button onClick={() => navigate('/products/add')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium border border-primary hover:bg-primary-dark transition">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); pagination.goToPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:border-primary outline-none transition sm:w-56"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-0.5 border border-gray-300 dark:border-gray-600">
            {STOCK_STATUS.map((s) => (
              <label key={s.value} className={`px-3 py-1.5 text-sm cursor-pointer transition ${stockFilter === s.value ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                <input
                  type="radio"
                  name="stockStatus"
                  value={s.value}
                  checked={stockFilter === s.value}
                  onChange={(e) => { setStockFilter(e.target.value); pagination.goToPage(1); }}
                  className="sr-only"
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <ProductTable
        products={products}
        loading={loading}
        onEdit={(row) => navigate(`/products/edit/${row.productId}`)}
        onDelete={setDeleteTarget}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        paginationRange={pagination.paginationRange}
        onPageChange={pagination.goToPage}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
