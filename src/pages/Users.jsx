import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import avatarFallback from "../assets/avatar.jpg";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import { formatDate } from "../lib/format";
import { deleteUser, fetchAllUsers } from "../store/slices/adminSlice";

const PAGE_SIZE = 10;

const Users = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  const { loading, users, totalUsers } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  const totalPages = Math.max(Math.ceil(totalUsers / PAGE_SIZE), 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns = [
    {
      key: "avatar",
      header: "",
      width: "3.5rem",
      cell: (user) => (
        <img
          src={user.avatar?.url || avatarFallback}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          className="h-8 w-8 rounded-full object-cover"
        />
      ),
    },
    { key: "name", header: "Name", cell: (user) => user.name },
    {
      key: "email",
      header: "Email",
      cell: (user) => <span className="text-muted">{user.email}</span>,
    },
    {
      key: "created",
      header: "Registered",
      align: "right",
      cell: (user) => (
        <span className="tnum text-muted">{formatDate(user.created_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (user) => (
        <button
          type="button"
          onClick={() => setPendingDelete(user)}
          className="text-xs text-muted transition-colors ease-editorial hover:text-danger"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Users" lead="Everyone registered on the storefront." />

      <DataTable
        caption="All users"
        columns={columns}
        rows={users}
        loading={loading}
        empty={<EmptyState title="No users yet" />}
      />

      {!loading && users.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemLabel="users"
          onChange={setPage}
        />
      )}

      {/* Users previously deleted on a single click, with no prompt. */}
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          dispatch(deleteUser(pendingDelete.id, page));
          setPendingDelete(null);
        }}
        loading={loading}
        title="Delete user"
        body={`${pendingDelete?.name} (${pendingDelete?.email}) will be permanently removed. This cannot be undone.`}
      />
    </div>
  );
};

export default Users;
