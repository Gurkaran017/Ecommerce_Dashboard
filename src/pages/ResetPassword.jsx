import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { resetPassword } from "../store/slices/authSlice";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  if (isAuthenticated && user?.role === "Admin") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    dispatch(resetPassword(data, token));
  };

  return (
    <AuthLayout
      title="Choose a new password"
      footer={
        <Link to="/login" className="link text-muted">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={(event) =>
            setFormData({ ...formData, password: event.target.value })
          }
          required
        />
        <Field
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={(event) =>
            setFormData({ ...formData, confirmPassword: event.target.value })
          }
          required
        />

        <Button type="submit" size="lg" full loading={loading}>
          {loading ? "Saving" : "Save password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
