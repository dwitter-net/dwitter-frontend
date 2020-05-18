import React, { useContext, useState } from "react";
import { setEmail as apiSetEmail } from "./api";
import { SubmitButton } from "./SubmitButton";
import { Context } from "./Context";

export const SetEmailForm: React.FC = () => {
  const [context, setContext] = useContext(Context);
  const [error, setError] = useState<{
    email?: string[];
    non_field_errors?: string[];
  } | null>(null);
  const [email, setEmail] = useState(context.user?.email || "");
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isEmailInvalid = isEmailValidated && !!error?.email;
  const [success, setSuccess] = useState(false);
  const disabled =
    isLoading ||
    isEmailInvalid ||
    Object.keys(error || {}).length > 0 ||
    email === context.user?.email;

  return (
    <form
      noValidate={true}
      style={{ flex: 1 }}
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
          const user = await apiSetEmail(email);
          setContext({ user });
          setSuccess(true);
          setEmail(user.email);
          setIsEmailValidated(false);
          setError(null);
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 16 }}>Change email</div>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        style={{ maxWidth: 16 * 18 }}
        type="email"
        disabled={isLoading}
        className={"form-control mb-3 " + (error?.email ? "is-invalid" : "")}
        value={email}
        required={true}
        onChange={(e) => {
          setEmail(e.target.value);
          setSuccess(false);
          if (error?.email) {
            delete error["email"];
            setError({ ...error });
          }
        }}
      />
      {error && (
        <div
          className="invalid-feedback"
          style={{ marginTop: -8, marginBottom: 8 }}
        >
          {error.email}
        </div>
      )}

      {error && error.non_field_errors && (
        <div className="alert alert-danger">{error.non_field_errors}</div>
      )}

      <SubmitButton
        disabled={disabled}
        text="Save"
        success={success}
        successText="Saved."
      />
    </form>
  );
};
