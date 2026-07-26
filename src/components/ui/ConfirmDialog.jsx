import Button from "./Button";
import Modal from "./Modal";

/**
 * One confirmation for every destructive action. Products and users previously
 * deleted on a single click with no prompt; only orders asked.
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  body,
  confirmLabel = "Delete",
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    {body && (
      <p className="text-[0.8125rem] leading-relaxed text-muted">{body}</p>
    )}

    <div className="mt-8 flex justify-end gap-3">
      <Button variant="quiet" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
