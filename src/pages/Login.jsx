import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role === "Admin") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    dispatch(login(data));
  };

  return (
    <AuthLayout
      title="Sign in"
      lead="Admin access only."
      footer={
        <Link to="/password/forgot" className="link text-muted">
          Forgotten your password?
        </Link>
      }
    >
      {/* The old form carried a "Remember me" checkbox that was wired to
          nothing at all, so it is gone rather than restyled. */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
          required
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={(event) =>
            setFormData({ ...formData, password: event.target.value })
          }
          required
        />

        <Button type="submit" size="lg" full loading={loading}>
          {loading ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
