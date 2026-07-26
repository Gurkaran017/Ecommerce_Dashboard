import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import avatarFallback from "../assets/avatar.jpg";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import PageHeader from "../components/ui/PageHeader";
import {
  updateAdminPassword,
  updateAdminProfile,
} from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({ name: "", email: "" });
  /* Named `avatarFile`, not `avatar` — the old component shadowed the imported
     fallback image with this state, so the default avatar never rendered. */
  const [avatarFile, setAvatarFile] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [section, setSection] = useState("");

  useEffect(() => {
    setProfile({ name: user?.name ?? "", email: user?.email ?? "" });
  }, [user]);

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    /* Only send the file when one was actually chosen; the old code appended
       the string "null" on every save. */
    if (avatarFile) formData.append("avatar", avatarFile);
    setSection("profile");
    dispatch(updateAdminProfile(formData));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("currentPassword", passwords.currentPassword);
    formData.append("newPassword", passwords.newPassword);
    formData.append("confirmNewPassword", passwords.confirmNewPassword);
    setSection("password");
    dispatch(updateAdminPassword(formData));
  };

  return (
    <div className="space-y-10">
      <PageHeader title="Profile" lead="Your admin account." />

      <section className="flex items-center gap-5 border-b border-line pb-8">
        <img
          src={user?.avatar?.url || avatarFallback}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <p className="text-[0.9375rem]">{user?.name ?? "—"}</p>
          <p className="text-xs text-muted">{user?.email ?? "—"}</p>
          <p className="meta mt-1.5">{user?.role}</p>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <form onSubmit={handleProfileSubmit} className="max-w-md space-y-6">
          <h2 className="meta-ink">Update profile</h2>

          <Field
            label="Full name"
            autoComplete="name"
            value={profile.name}
            onChange={(event) =>
              setProfile({ ...profile, name: event.target.value })
            }
            required
          />
          <Field
            label="Email address"
            type="email"
            autoComplete="email"
            value={profile.email}
            onChange={(event) =>
              setProfile({ ...profile, email: event.target.value })
            }
            required
          />

          <div>
            <span className="meta mb-1.5 block">Avatar</span>
            <label className="link cursor-pointer text-[0.8125rem]">
              {avatarFile ? avatarFile.name : "Choose an image"}
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setAvatarFile(event.target.files?.[0] ?? null)
                }
                className="sr-only"
              />
            </label>
          </div>

          <Button
            type="submit"
            variant="outline"
            loading={loading && section === "profile"}
          >
            Save changes
          </Button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-6">
          <h2 className="meta-ink">Update password</h2>

          <Field
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, currentPassword: event.target.value })
            }
            required
          />
          <Field
            label="New password"
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, newPassword: event.target.value })
            }
            required
          />
          <Field
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={passwords.confirmNewPassword}
            onChange={(event) =>
              setPasswords({
                ...passwords,
                confirmNewPassword: event.target.value,
              })
            }
            required
          />

          <Button
            type="submit"
            variant="outline"
            loading={loading && section === "password"}
          >
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
