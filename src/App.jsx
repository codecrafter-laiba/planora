import { useState } from 'react'
import './App.css'


function App() {
    const [item, setItem] = useState({
        task: '',
        duedate: '',
        priority: '',
        id: '',
        complete: false
    })

    const [save, setSave] = useState([])
    const [sortBy, setSortBy] = useState('manual')

    const today = new Date().toISOString().split('T')[0]

    const additem = (event) => {
        const { name, value } = event.target

        setItem({
            ...item,
            [name]: value
        })
    }

    const saveTask = (event) => {
        event.preventDefault()

        if (!item.task.trim()) return

        if (item.id !== '') {
            setSave(save.map((task) =>
                task.id === item.id ? item : task
            ))
        } else {
            setSave([
                ...save,
                {
                    ...item,
                    id: crypto.randomUUID()
                }
            ])
        }

        setItem({
            task: '',
            duedate: '',
            priority: '',
            id: '',
            complete: false
        })
    }

    const deleteTask = (id) => {
        setSave(save.filter(task => task.id !== id))
    }

    const editTask = (id) => {
        const edit = save.find(task => task.id === id)

        setItem({
            ...edit
        })
    }

    const completed = (id) => {
        setSave(save.map(task =>
            task.id === id
                ? { ...task, complete: !task.complete }
                : task
        ))
    }

    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    }

    const sortedTasks = [...save].sort((a, b) => {
        if (sortBy === 'priority') {
            return (priorityOrder[a.priority] || 4) -
                (priorityOrder[b.priority] || 4)
        }

        if (sortBy === 'date') {
            if (!a.duedate) return 1
            if (!b.duedate) return -1

            return new Date(a.duedate) - new Date(b.duedate)
        }

        if (sortBy === 'name') {
            return a.task.localeCompare(b.task)
        }

        return 0
    })

    const getPriorityClass = (priority) => {
        if (priority === 'high') return 'bg-danger'
        if (priority === 'medium') return 'bg-warning text-dark'
        if (priority === 'low') return 'bg-success'

        return 'bg-secondary'
    }

    const formatDate = (date) => {
        if (!date) return 'No due date'

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            'en-US',
            {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }
        )
    }

    return (
        <>
            <div className="container-fluid min-vh-100 d-flex justify-content-center task-container align-items-center">
                <div className="row justify-content-center w-100 my-5">
                    <div className="col-12 col-lg-7">
                        <div className="card rounded-4">

                            <div className="card-body px-5">
                                <h5 className="fw-bold fs-1 my-0 text-center">
                                    <i className="fa-solid fa-list me-3"></i>
                                    Planora
                                </h5>

                                <form
                                    onSubmit={saveTask}
                                    className="row g-3 align-items-center my-2"
                                >
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={item.task}
                                                name="task"
                                                onChange={additem}
                                                id="floatingInput"
                                                placeholder="Read books"
                                            />

                                            <label htmlFor="floatingInput">
                                                What is your task for today?
                                            </label>
                                        </div>

                                        <div className="row my-2">
                                            <div className="col-12 col-md-6">
                                                <label
                                                    className="text-muted small mb-1 form-label d-block"
                                                    htmlFor="duedate"
                                                >
                                                    Due date
                                                </label>

                                                <input
                                                    type="date"
                                                    name="duedate"
                                                    className="form-control"
                                                    value={item.duedate}
                                                    min={today}
                                                    onChange={additem}
                                                    id="duedate"
                                                />
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <label
                                                    className="form-label small text-muted mb-1"
                                                    htmlFor="priorityInput"
                                                >
                                                    Priority
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={item.priority}
                                                    name="priority"
                                                    onChange={additem}
                                                    id="priorityInput"
                                                >
                                                    <option value="">
                                                        Select priority
                                                    </option>

                                                    <option value="low">
                                                        Low
                                                    </option>

                                                    <option value="medium">
                                                        Medium
                                                    </option>

                                                    <option value="high">
                                                        High
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-dark w-100"
                                        >
                                            <i className="fa-solid fa-plus me-2"></i>

                                            {item.id !== ''
                                                ? 'Update Task'
                                                : 'Add Task'}
                                        </button>
                                    </div>
                                </form>

                                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                                    <h5 className="fw-bold mb-0">
                                        Task List
                                    </h5>

                                    <select
                                        className="form-select w-auto"
                                        value={sortBy}
                                        onChange={(event) =>
                                            setSortBy(event.target.value)
                                        }
                                    >
                                        <option value="manual">
                                            Manual
                                        </option>

                                        <option value="priority">
                                            Priority
                                        </option>

                                        <option value="date">
                                            Due Date
                                        </option>

                                        <option value="name">
                                            Name
                                        </option>
                                    </select>
                                </div>

                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Task</th>
                                                <th>Due Date</th>
                                                <th>Priority</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {sortedTasks.length !== 0 ? (
                                                sortedTasks.map((listItem) => (
                                                    <tr key={listItem.id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={listItem.complete}
                                                                onChange={() =>
                                                                    completed(
                                                                        listItem.id
                                                                    )
                                                                }
                                                            />
                                                        </td>

                                                        <td>
                                                            {listItem.complete ? (
                                                                <del>
                                                                    {listItem.task}
                                                                </del>
                                                            ) : (
                                                                listItem.task
                                                            )}
                                                        </td>

                                                        <td>
                                                            <small className="text-muted">
                                                                <i className="fa-regular fa-calendar me-1"></i>
                                                                {formatDate(
                                                                    listItem.duedate
                                                                )}
                                                            </small>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`badge ${getPriorityClass(
                                                                    listItem.priority
                                                                )}`}
                                                            >
                                                                {listItem.priority
                                                                    ? listItem.priority
                                                                        .charAt(0)
                                                                        .toUpperCase() +
                                                                      listItem.priority.slice(
                                                                          1
                                                                      )
                                                                    : 'None'}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-light rounded-circle"
                                                                    onClick={() =>
                                                                        editTask(
                                                                            listItem.id
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-light rounded-circle"
                                                                    onClick={() =>
                                                                        deleteTask(
                                                                            listItem.id
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="text-center py-4"
                                                    >
                                                        No Task Added Yet!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App

