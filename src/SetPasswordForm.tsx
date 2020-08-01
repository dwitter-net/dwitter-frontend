import React, { useState } from "react";
import { setPassword } from "./api";
import { SubmitButton } from "./SubmitButton";

export const SetPasswordForm: React.FC = () => {
  const [error, setError] = useState<{
    old_password?: string[];
    new_password?: string[];
    non_field_errors?: string[];
  } | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [isNewPasswordValidated, setIsNewPasswordValidated] = useState(false);
  const [isNewPassword2Validated, setIsNewPassword2Validated] = useState(false);
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isNewPasswordInvalid = isNewPasswordValidated && !!error?.new_password;
  const isNewPassword2Invalid = isNewPassword2Validated && passwordsDoNotMatch;

  const [success, setSuccess] = useState(false);

  const disabled =
    !oldPassword ||
    !newPassword ||
    !newPassword2 ||
    success ||
    isLoading ||
    isNewPasswordInvalid ||
    isNewPassword2Invalid ||
    Object.keys(error || {}).length > 0;

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
          await setPassword(oldPassword, newPassword);
          setOldPassword("");
          setNewPassword("");
          setNewPassword2("");
          setIsNewPasswordValidated(false);
          setIsNewPassword2Validated(false);
          setPasswordsDoNotMatch(false);
          setError(null);
          setSuccess(true);
        } catch (e) {
          setError(e);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 16 }}>
        Change password
      </div>
      <label htmlFor="old_password">Old password</label>
      <input
        id="old_password"
        name="old_password"
        type="password"
        style={{ maxWidth: 16 * 18 }}
        disabled={isLoading}
        className={
          "form-control mb-3 " + (error?.old_password ? "is-invalid" : "")
        }
        value={oldPassword}
        required={true}
        onChange={(e) => {
          setOldPassword(e.target.value);
          if (error?.old_password) {
            delete error["old_password"];
            setError({ ...error });
          }
        }}
      />
      {error && (
        <div
          className="invalid-feedback"
          style={{ marginTop: -8, marginBottom: 8 }}
        >
          {error.old_password}
        </div>
      )}
      <div
        className={
          isNewPasswordValidated
            ? isNewPasswordInvalid
              ? "needs-validation"
              : "was-validated"
            : ""
        }
      >
        <label htmlFor="new_password">New password</label>
        <input
          id="new_password"
          style={{ maxWidth: 16 * 18 }}
          name="new_password"
          type="password"
          disabled={isLoading}
          className={
            "form-control mb-3 " + (isNewPasswordInvalid ? "is-invalid" : "")
          }
          value={newPassword}
          required={true}
          formNoValidate={false}
          onChange={(e) => {
            setPasswordsDoNotMatch(false);
            setNewPassword(e.target.value);
            setIsNewPasswordValidated(false);
            setIsNewPassword2Validated(false);
            if (error) {
              delete error["new_password"];
              setError({ ...error });
            }
          }}
          onBlur={() => {
            setIsNewPasswordValidated(true);
            if (newPassword && newPassword.length < 8) {
              setError({
                new_password: ["Password must be 8 characters or longer."],
              });
            }
            if (newPassword2) {
              setIsNewPassword2Validated(true);
              if (newPassword !== newPassword2) {
                setPasswordsDoNotMatch(true);
              }
            }
          }}
        />
        {error && (
          <div
            className="invalid-feedback"
            style={{ marginTop: -8, marginBottom: 8 }}
          >
            {error.new_password}
          </div>
        )}
      </div>
      <div
        className={
          isNewPasswordValidated &&
          !isNewPasswordInvalid &&
          !isNewPassword2Invalid &&
          isNewPassword2Validated
            ? isNewPassword2Invalid
              ? "needs-validation"
              : "was-validated"
            : ""
        }
      >
        <label htmlFor="new_password2">New password (again)</label>
        <input
          id="new_password2"
          style={{ maxWidth: 16 * 18 }}
          name="new_password2"
          type="password"
          disabled={isLoading}
          value={newPassword2}
          required={true}
          formNoValidate={false}
          className={
            "form-control mb-3 " + (isNewPassword2Invalid ? "is-invalid" : "")
          }
          onChange={(e) => {
            setIsNewPassword2Validated(false);
            setPasswordsDoNotMatch(false);
            setNewPassword2(e.target.value);
          }}
          onBlur={() => {
            setIsNewPassword2Validated(true);
            if (newPassword !== newPassword2) {
              setPasswordsDoNotMatch(true);
            }
          }}
        />
        {passwordsDoNotMatch && (
          <div
            className="invalid-feedback"
            style={{ marginTop: -8, marginBottom: 8 }}
          >
            Passwords do not match.
          </div>
        )}
      </div>
      {error && error.non_field_errors && (
        <div className="alert alert-danger">{error.non_field_errors}</div>
      )}
      <SubmitButton
        disabled={disabled}
        text="Change password"
        success={success}
        successText="Password changed."
      />
    </form>
  );
};

