import { useDispatch } from "react-redux";
import Modal from "../components/ui/Modal";
import { cn } from "../lib/cn";
import { formatDate, formatPrice, stockState } from "../lib/format";
import { toggleViewProductModal } from "../store/slices/extraSlice";

const TONE = {
  positive: "text-positive",
  notice: "text-notice",
  danger: "text-danger",
};

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();

  if (!selectedProduct) return null;

  const stock = stockState(selectedProduct.stock);

  const facts = [
    { label: "ID", value: selectedProduct.id },
    { label: "Category", value: selectedProduct.category },
    /* formatPrice coerces — the old modal called price.toLocaleString()
       directly, which throws when the API sends a string. */
    { label: "Price", value: formatPrice(selectedProduct.price) },
    { label: "Rating", value: Number(selectedProduct.ratings).toFixed(1) },
    {
      label: "Stock",
      value: (
        <span className={cn(TONE[stock.tone])}>
          {selectedProduct.stock} · {stock.label}
        </span>
      ),
    },
    { label: "Created", value: formatDate(selectedProduct.created_at) },
  ];

  return (
    <Modal
      open
      onClose={() => dispatch(toggleViewProductModal())}
      /* The old modal read `selectedProduct.title`; the field is `name`, so the
         heading was always blank. */
      title={selectedProduct.name}
      size="lg"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-2">
          {selectedProduct.images?.map((image, index) => (
            <div key={image?.url ?? index} className="plate aspect-square">
              <img
                src={image?.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain p-2"
              />
            </div>
          ))}
        </div>

        <div>
          <dl>
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-2.5"
              >
                <dt className="meta">{fact.label}</dt>
                <dd className="tnum text-[0.8125rem]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <p className="meta mb-2 mt-6">Description</p>
          <p className="text-[0.8125rem] leading-relaxed text-muted">
            {selectedProduct.description || "No description provided."}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
