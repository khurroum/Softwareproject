import { useEffect, useState } from "react";
import api from "../../services/api";

const MESSAGE_STATUSES = [
  "New",
  "Read",
  "Replied",
];

export default function Messages() {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  // =========================
  // GET MESSAGES
  // =========================

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/contact");

      setMessages(
        response.data.messages || []
      );
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);

      const response =
        await api.put(
          `/contact/${id}/status`,
          {
            status,
          }
        );

      const updatedMessage =
        response.data.contactMessage;

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === id
            ? {
                ...message,
                ...updatedMessage,
              }
            : message
        )
      );
    } catch (error) {
      console.error(
        "Failed to update message:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update message."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // DELETE MESSAGE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(
        `/contact/${id}`
      );

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Read":
        return "bg-blue-100 text-blue-700";

      case "Replied":
        return "bg-green-100 text-green-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="p-6 md:p-10">

        <h1 className="text-4xl font-bold">
          Messages
        </h1>

        <p className="mt-6 text-gray-500">
          Loading messages...
        </p>

      </section>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <section className="p-6 md:p-10">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h1 className="text-2xl font-bold text-red-700">
            Messages Error
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <button
            onClick={fetchMessages}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </section>
    );
  }

  return (
    <section className="p-6 md:p-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Contact Messages
          </h1>

          <p className="mt-2 text-gray-600">
            Manage messages submitted by
            customers.
          </p>

        </div>

        <div className="rounded-lg bg-gray-100 px-4 py-3">

          <span className="font-semibold">
            Total:
          </span>{" "}

          {messages.length}

        </div>

      </div>


      {/* =========================
          NO MESSAGES
      ========================= */}

      {messages.length === 0 ? (

        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">

          <h2 className="text-2xl font-bold">
            No Messages
          </h2>

          <p className="mt-3 text-gray-500">
            Customer contact messages will
            appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {messages.map((message) => (

            <div
              key={message._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >

              {/* =========================
                  TOP
              ========================= */}

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    {message.subject}
                  </h2>

                  <div className="mt-2 text-sm text-gray-600">

                    <p>
                      <span className="font-semibold">
                        From:
                      </span>{" "}
                      {message.name}
                    </p>

                    <p className="mt-1">
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {message.email}
                    </p>

                  </div>

                </div>


                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    message.status
                  )}`}
                >
                  {message.status}
                </span>

              </div>


              {/* =========================
                  MESSAGE
              ========================= */}

              <div className="mt-5 rounded-lg bg-gray-50 p-5">

                <p className="whitespace-pre-wrap text-gray-700">
                  {message.message}
                </p>

              </div>


              {/* =========================
                  DATE + ACTIONS
              ========================= */}

              <div className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">

                  {message.createdAt
                    ? new Date(
                        message.createdAt
                      ).toLocaleString()
                    : "-"}

                </p>


                <div className="flex flex-wrap items-center gap-3">

                  {/* STATUS */}

                  <select
                    value={
                      message.status ||
                      "New"
                    }
                    disabled={
                      updatingId ===
                      message._id
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        message._id,
                        event.target.value
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${getStatusClass(
                      message.status
                    )}`}
                  >

                    {MESSAGE_STATUSES.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}

                  </select>


                  {/* EMAIL */}

                  <a
                    href={`mailto:${message.email}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Reply
                  </a>


                  {/* DELETE */}

                  <button
                    type="button"
                    disabled={
                      deletingId ===
                      message._id
                    }
                    onClick={() =>
                      handleDelete(
                        message._id
                      )
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {deletingId ===
                    message._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}