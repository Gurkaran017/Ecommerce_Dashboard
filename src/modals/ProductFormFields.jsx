import Field from "../components/ui/Field";
import { CATEGORY_OPTIONS } from "../lib/categories";

/** Shared by the create and update modals so the two can never drift apart. */
const ProductFormFields = ({ values, onChange, errors = {} }) => {
  const set = (key) => (event) => onChange({ ...values, [key]: event.target.value });

  return (
    <div className="space-y-6">
      <Field
        label="Name"
        value={values.name}
        onChange={set("name")}
        error={errors.name}
        required
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Field
          as="select"
          label="Category"
          value={values.category}
          onChange={set("category")}
          required
        >
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Field>

        <Field
          label="Price"
          type="number"
          min="0"
          inputMode="numeric"
          value={values.price}
          onChange={set("price")}
          error={errors.price}
          hint="In rupees"
          required
        />

        <Field
          label="Stock"
          type="number"
          min="0"
          inputMode="numeric"
          value={values.stock}
          onChange={set("stock")}
          error={errors.stock}
          required
        />
      </div>

      <Field
        as="textarea"
        label="Description"
        rows={4}
        value={values.description}
        onChange={set("description")}
        className="[&_textarea]:border"
        required
      />
    </div>
  );
};

export default ProductFormFields;
