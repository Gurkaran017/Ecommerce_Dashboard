import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import { forgotPassword } from "../store/slices/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    /* The endpoint takes a JSON body, not FormData — unchanged from before. */
    dispatch(forgotPassword({ email }));
  };

  return (
    <AuthLayout
      title="Reset password"
      lead="We'll email you a link to choose a new one."
      footer={
        <Link to="/login" className="link text-muted">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <Button type="submit" size="lg" full loading={loading}>
          {loading ? "Sending" : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
