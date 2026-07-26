import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import CreateProductModal from "../modals/CreateProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import { cn } from "../lib/cn";
import { formatPrice, stockState } from "../lib/format";
import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
  toggleViewProductModal,
} from "../store/slices/extraSlice";
import { deleteProduct, fetchAllProducts } from "../store/slices/productsSlice";

const PAGE_SIZE = 10;

const TONE = {
  positive: "text-positive",
  notice: "text-notice",
  danger: "text-danger",
};

const Products = () => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [page, setPage] = useState(1);

  const {
    isViewProductModalOpened,
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
  } = useSelector((state) => state.extra);
  const { loading, products, totalProducts, fetchingProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchAllProducts(page));
  }, [dispatch, page]);

  const totalPages = Math.max(Math.ceil(totalProducts / PAGE_SIZE), 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns = [
    {
      key: "image",
      header: "",
      width: "3.5rem",
      cell: (product) => (
        <div className="plate h-10 w-10">
          <img
            src={product.images?.[0]?.url}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-1"
          />
        </div>
      ),
    },
    { key: "name", header: "Product", cell: (product) => product.name },
    {
      key: "category",
      header: "Category",
      cell: (product) => <span className="text-muted">{product.category}</span>,
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      cell: (product) => (
        <span className="tnum">{formatPrice(product.price)}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      cell: (product) => {
        const state = stockState(product.stock);
        return (
          <span className="tnum inline-flex items-center gap-2">
            {product.stock}
            <span className={cn("meta", TONE[state.tone])}>{state.label}</span>
          </span>
        );
      },
    },
    {
      key: "ratings",
      header: "Rating",
      align: "right",
      cell: (product) => (
        <span className="tnum">{Number(product.ratings).toFixed(1)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (product) => (
        <span className="flex justify-end gap-4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedProduct(product);
              dispatch(toggleUpdateProductModal());
            }}
            className="text-xs text-muted transition-colors ease-editorial hover:text-ink"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setPendingDelete(product);
            }}
            className="text-xs text-muted transition-colors ease-editorial hover:text-danger"
          >
            Delete
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        lead="Create, edit and retire catalogue items."
        actions={
          <Button size="sm" onClick={() => dispatch(toggleCreateProductModal())}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            New product
          </Button>
        }
      />

      <DataTable
        caption="All products"
        columns={columns}
        rows={products}
        loading={fetchingProducts}
        onRowActivate={(product) => {
          setSelectedProduct(product);
          dispatch(toggleViewProductModal());
        }}
        empty={
          <EmptyState
            title="No products yet"
            body="Create the first catalogue item to get started."
            action={
              <Button
                variant="outline"
                onClick={() => dispatch(toggleCreateProductModal())}
              >
                New product
              </Button>
            }
          />
        }
      />

      {!fetchingProducts && products.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalProducts}
          itemLabel="products"
          onChange={setPage}
        />
      )}

      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && (
        <UpdateProductModal selectedProduct={selectedProduct} />
      )}
      {isViewProductModalOpened && (
        <ViewProductModal selectedProduct={selectedProduct} />
      )}

      {/* Products previously deleted on a single click, with no prompt. */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          dispatch(deleteProduct(pendingDelete.id, page));
          setPendingDelete(null);
        }}
        loading={loading}
        title="Delete product"
        body={`"${pendingDelete?.name}" will be removed from the catalogue. This cannot be undone.`}
      />
    </div>
  );
};

export default Products;
