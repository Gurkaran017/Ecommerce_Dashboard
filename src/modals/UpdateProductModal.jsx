import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProductFormFields from "./ProductFormFields";
import { CATEGORY_OPTIONS } from "../lib/categories";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";
import { updateProduct } from "../store/slices/productsSlice";

const UpdateProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORY_OPTIONS[0],
    stock: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!selectedProduct) return;
    setValues({
      name: selectedProduct.name ?? "",
      description: selectedProduct.description ?? "",
      price: selectedProduct.price ?? "",
      category: selectedProduct.category || CATEGORY_OPTIONS[0],
      stock: selectedProduct.stock ?? "",
    });
  }, [selectedProduct]);

  const close = () => dispatch(toggleUpdateProductModal());

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Give the product a name.";
    if (values.price === "" || Number(values.price) < 0)
      next.price = "Enter a price of zero or more.";
    if (values.stock === "" || Number(values.stock) < 0)
      next.stock = "Enter a stock count of zero or more.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    dispatch(updateProduct(values, selectedProduct.id));
  };

  if (!selectedProduct) return null;

  return (
    <Modal
      open
      onClose={close}
      title="Edit product"
      description={selectedProduct.name}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ProductFormFields values={values} onChange={setValues} errors={errors} />

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="quiet" onClick={close} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProductModal;
