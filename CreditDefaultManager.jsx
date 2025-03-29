import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const CreditDefaultManager = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minBalance, setMinBalance] = useState("");
  const [maxBalance, setMaxBalance] = useState("");
  const [sortField, setSortField] = useState("age");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [formData, setFormData] = useState({ limit_balance: "", age: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [searchQuery, minBalance, maxBalance, sortField, sortOrder, currentPage]);

  const fetchData = async () => {
    try {
      const params = {
        search: searchQuery || undefined,
        min_balance: minBalance || undefined,
        max_balance: maxBalance || undefined,
        sort: sortField,
        order: sortOrder,
        page: currentPage,
        limit: recordsPerPage,
      };

      const response = await axios.get("http://localhost:5000/credits", { params });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async () => {
    try {
      const response = await axios.post("http://localhost:5000/credits", formData);
      setData([...data, response.data]);
      setFormData({ limit_balance: "", age: "" });
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({ limit_balance: record.limit_balance, age: record.age });
  };

  const handleUpdateRecord = async () => {
    try {
      await axios.put(`http://localhost:5000/credit/${editingId}`, formData);
      setData(data.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
      setEditingId(null);
      setFormData({ limit_balance: "", age: "" });
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/credit/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Credit Default Manager</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border rounded w-full sm:w-auto"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Balance"
          className="p-2 border rounded w-full sm:w-auto"
          value={minBalance}
          onChange={(e) => setMinBalance(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Balance"
          className="p-2 border rounded w-full sm:w-auto"
          value={maxBalance}
          onChange={(e) => setMaxBalance(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full sm:w-auto"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="age">Sort by Age</option>
          <option value="limit_balance">Sort by Limit Balance</option>
        </select>
        <select
          className="p-2 border rounded w-full sm:w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={fetchData} className="p-2 bg-blue-500 text-white rounded">
          <FaSearch />
        </button>
      </div>

      {/* Add / Edit Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          name="limit_balance"
          placeholder="Limit Balance"
          className="p-2 border rounded w-full"
          value={formData.limit_balance}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="p-2 border rounded w-full"
          value={formData.age}
          onChange={handleInputChange}
        />
        {editingId ? (
          <button onClick={handleUpdateRecord} className="p-2 bg-green-500 text-white rounded">
            Update
          </button>
        ) : (
          <button onClick={handleAddRecord} className="p-2 bg-blue-500 text-white rounded">
            <FaPlus />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Limit Balance</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <motion.tr
                key={record.id}
                className="border hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="p-2 border">{record.id}</td>
                <td className="p-2 border">{record.limit_balance}</td>
                <td className="p-2 border">{record.age}</td>
                <td className="p-2 border flex gap-2">
                  <button onClick={() => handleEdit(record)} className="text-yellow-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(record.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="p-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreditDefaultManager;
