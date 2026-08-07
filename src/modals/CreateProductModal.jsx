import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import ImagePicker from "../components/ui/ImagePicker";
import Modal from "../components/ui/Modal";
import ProductFormFields from "./ProductFormFields";
import { CATEGORY_OPTIONS } from "../lib/categories";
import { toggleCreateProductModal } from "../store/slices/extraSlice";
import { createNewProduct } from "../store/slices/productsSlice";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: CATEGORY_OPTIONS[0],
  stock: "",
};

const CreateProductModal = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [values, setValues] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const close = () => dispatch(toggleCreateProductModal());

  /* The old form had no required attributes and no validation at all — an
     empty product could be submitted straight to the API. */
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

    const data = new FormData();
    data.append("name", values.name);
    data.append("description", values.description);
    data.append("price", values.price);
    data.append("category", values.category);
    data.append("stock", values.stock);
    images.forEach((image) => data.append("images", image));

    dispatch(createNewProduct(data));
  };

  return (
    <Modal open onClose={close} title="New product" size="lg">
      <form onSubmit={handleSubmit}>
        <ProductFormFields values={values} onChange={setValues} errors={errors} />

        <div className="mt-6">
          <ImagePicker files={images} onChange={setImages} />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="quiet" onClick={close} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create product
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProductModal;
