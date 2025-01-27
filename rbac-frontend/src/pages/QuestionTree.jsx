import React, { useState, useEffect } from 'react';

const QuestionTree = ({ items, refreshProblems, addItem, deleteItem, editItem, isChild, parentId = null }) => {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeParentId, setActiveParentId] = useState(null);

  // Effect hook to set newName when editingItem changes
  useEffect(() => {
    if (editingItem) {
      setNewName(editingItem.name);  // Set the current name when editing
    }
  }, [editingItem]); // Dependency on editingItem

  const handleAdd = async () => {
    if (!newName.trim()) {
      alert('Please enter a name');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/problems/add_problem.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName.trim(),
          parent_id: activeParentId,
        })
      });

      const res = await response.json();

      if (res.success) {
        if (typeof refreshProblems === 'function') {
          await refreshProblems();
        }
        setNewName('');
        setShowModal(false);
        setActiveParentId(null);
        alert('Problem added successfully');
      } else {
        alert(res.message);
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error adding problem:', error);
      alert('Error adding problem. Please try again.');
    }
  };

  const handleEdit = async () => {
    // Validate that the new name is not empty
    if (!newName.trim()) {
      alert('Please enter a valid name');
      return;
    }

    try {
      // Call the API to edit the problem
      const response = await fetch(`${process.env.REACT_APP_API_URL}/problems/update_problem_name.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingItem.id,
          name: newName.trim(),
          parent_id: editingItem.parent_id || '$', // Handle parent_id if null
        }),
      });

      const res = await response.json();

      if (response.ok) {
        // If the edit is successful, refresh the problems list
        if (typeof refreshProblems === 'function') {
          await refreshProblems();
        }

        // Reset state variables
        setNewName('');
        setEditingItem(null);
        setShowModal(false);

        alert('Problem edited successfully');
      } else {
        alert('Failed to edit problem: ' + res.message);
      }
    } catch (error) {
      console.error('Error editing problem:', error);
      alert('Error editing problem. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/problems/delete_problem.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: itemToDelete.id,
            parent_id: itemToDelete.parent_id || '$', // If parent_id is null, pass '$'
          })
        });

        const res = await response.json();

        if (response.ok) {
          // If successful, refresh problems
          if (typeof refreshProblems === 'function') {
            await refreshProblems();
          }
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          alert('Problem deleted successfully');
        } else {
          alert('Failed to delete problem: ' + res.message);
        }
      } catch (error) {
        console.error('Error deleting problem:', error);
        alert('Error deleting problem. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {!isChild && (
        <div className="mb-4">
          <button
            onClick={() => {
              setNewName(''); // Reset name when adding
              setEditingItem(null); // Reset editingItem
              setActiveParentId(null);
              setShowModal(true);
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Add Problem
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-xl font-semibold text-center">No Items Added</p>
      ) : (
        <ul className="pl-6 list-none">
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              addItem={addItem}
              deleteItem={deleteItem}
              editItem={editItem}
              setEditingItem={setEditingItem}
              setShowModal={setShowModal}
              setItemToDelete={setItemToDelete}
              setShowDeleteConfirm={setShowDeleteConfirm}
              setActiveParentId={setActiveParentId}
              parentId={item.id}
              refreshProblems={refreshProblems}  // Pass refreshProblems to ListItem
            />
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl text-blue-700 font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add Item'}
            </h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter item name"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={editingItem ? handleEdit : handleAdd}
                className="text-blue-600 py-2 px-4 rounded-md hover:text-blue-700"
              >
                {editingItem ? 'Save Changes' : 'Add Item'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setActiveParentId(null);
                }}
                className="text-gray-400 py-2 px-4 rounded-md hover:text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl text-red-600 font-semibold mb-4">Are you sure?</h2>
            <p className='mb-4'>This will delete all child options as well.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const ListItem = ({
    item,
    addItem,
    deleteItem,
    editItem,
    setEditingItem,
    setShowModal,
    setItemToDelete,
    setShowDeleteConfirm,
    setActiveParentId,
    parentId,
    refreshProblems  // Add refreshProblems to ListItem props
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newName, setNewName] = useState(item.name);
  
    const handleToggle = () => {
      setIsExpanded((prev) => !prev);
    };
  
    return (
      <li className="mb-4">
        <div className="flex items-center justify-between">
          <div
            className="cursor-pointer flex items-center space-x-2 text-lg text-gray-700 hover:text-gray-900"
            onClick={handleToggle}
          >
            <span className="text-xl">{isExpanded ? '▼' : '►'}</span>
            <span>{item.name}</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setNewName(item.name);
                setEditingItem(item);
                setShowModal(true);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setItemToDelete(item);
                setShowDeleteConfirm(true);
              }}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
  
        {isExpanded && item.subOptions && item.subOptions.length > 0 && (
          <div className="pl-8 mt-2">
            <QuestionTree
              items={item.subOptions}
              addItem={addItem}
              deleteItem={deleteItem}
              editItem={editItem}
              isChild={true}
              parentId={item.id}
              refreshProblems={refreshProblems}  // Pass refreshProblems to nested QuestionTree
            />
          </div>
        )}
  
        {isExpanded && (
          <div className="pl-8 mt-2">
            <button
              onClick={() => {
                setNewName('');
                setActiveParentId(item.id);
                setShowModal(true);
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              Add Problem
            </button>
          </div>
        )}
      </li>
    );
  };

export default QuestionTree;
