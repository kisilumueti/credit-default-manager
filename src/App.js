import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000";

function App() {
    const [credits, setCredits] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        limit_balance: "",
        age: "",
        sex: "",
        education: "",
        marriage: "",
        pay_0: "",
        pay_2: "",
        pay_3: "",
        pay_4: "",
        pay_5: "",
        pay_6: "",
        bill_amt1: "",
        bill_amt2: "",
        bill_amt3: "",
        bill_amt4: "",
        bill_amt5: "",
        bill_amt6: "",
        pay_amt1: "",
        pay_amt2: "",
        pay_amt3: "",
        pay_amt4: "",
        pay_amt5: "",
        pay_amt6: "",
        default_next_month: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("age");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCredits();
    }, [searchQuery, sortField, sortOrder, currentPage]);

    const fetchCredits = async () => {
        setIsLoading(true);
        try {
            const params = {
                search: searchQuery || undefined,
                sort_by: sortField,
                order: sortOrder,
                page: currentPage,
                limit: recordsPerPage,
            };
            const response = await axios.get(`${API_URL}/credits`, { params });
            setCredits(response.data);
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openModal = (credit = null) => {
        if (credit) {
            // Pre-fill form data with the selected record's details
            setFormData(credit);
            setEditingId(credit.id);
        } else {
            // Reset form data for adding a new record
            setFormData({
                id: credits.length + 1, // Auto-increment ID based on existing records
                limit_balance: "",
                age: "",
                sex: "",
                education: "",
                marriage: "",
                pay_0: "",
                pay_2: "",
                pay_3: "",
                pay_4: "",
                pay_5: "",
                pay_6: "",
                bill_amt1: "",
                bill_amt2: "",
                bill_amt3: "",
                bill_amt4: "",
                bill_amt5: "",
                bill_amt6: "",
                pay_amt1: "",
                pay_amt2: "",
                pay_amt3: "",
                pay_amt4: "",
                pay_amt5: "",
                pay_amt6: "",
                default_next_month: "",
            });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addOrUpdateCredit = async () => {
        try {
            if (editingId) {
                // Update existing record
                await axios.put(`${API_URL}/credit/${editingId}`, formData);
            } else {
                // Add new record
                await axios.post(`${API_URL}/credit`, formData);
            }
            closeModal();
            fetchCredits(); // Refresh data after adding or updating
        } catch (error) {
            console.error("Error saving record:", error);
        }
    };

    const deleteCredit = async (id) => {
        try {
            await axios.delete(`${API_URL}/credit/${id}`);
            fetchCredits(); // Refresh data after deletion
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-dark text-white p-5">
            {/* Header */}
            <motion.h1
                className="text-center mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
            >
                <FaMoneyCheckAlt className="text-success me-2" /> Credit Default Management
            </motion.h1>

            {/* Search Bar and Filters */}
            <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control w-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="form-select w-auto"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                >
                    <option value="age">Sort by Age</option>
                    <option value="limit_balance">Sort by Limit Balance</option>
                </select>
                <select
                    className="form-select w-auto"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="btn btn-primary"
                    onClick={fetchCredits}
                >
                    <FaSearch />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="btn btn-success"
                    onClick={() => openModal()}
                >
                    <FaPlus /> Add Record
                </motion.button>
            </div>

            {/* Loading Animation */}
            {isLoading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Limit Balance</th>
                            <th>Age</th>
                            <th>Sex</th>
                            <th>Education</th>
                            <th>Marriage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {credits.map((credit) => (
                            <motion.tr key={credit.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <td>{credit.id}</td>
                                <td>{credit.limit_balance}</td>
                                <td>{credit.age}</td>
                                <td>{credit.sex}</td>
                                <td>{credit.education}</td>
                                <td>{credit.marriage}</td>
                                <td>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        className="btn btn-warning me-2"
                                        onClick={() => openModal(credit)}
                                    >
                                        <FaEdit />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        className="btn btn-danger"
                                        onClick={() => deleteCredit(credit.id)}
                                    >
                                        <FaTrash />
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-light"
                >
                    Prev
                </button>
                <span>Page {currentPage}</span>
                <button onClick={() => setCurrentPage((prev) => prev + 1)} className="btn btn-light">
                    Next
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-dark text-white p-4 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Record" : "Add Record"}</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <input
                                type="number"
                                name="id"
                                placeholder="ID (Auto-generated)"
                                value={formData.id}
                                readOnly
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded cursor-not-allowed"
                            />
                            <input
                                type="number"
                                name="limit_balance"
                                placeholder="Limit Balance"
                                value={formData.limit_balance}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                            <input
                                type="number"
                                name="sex"
                                placeholder="Sex (1 or 2)"
                                value={formData.sex}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                            <input
                                type="number"
                                name="education"
                                placeholder="Education Level"
                                value={formData.education}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                            <input
                                type="number"
                                name="marriage"
                                placeholder="Marriage Status"
                                value={formData.marriage}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            />
                            {/* Add more fields as needed */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={addOrUpdateCredit}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;