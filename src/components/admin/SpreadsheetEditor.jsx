import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Save, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * EditableCell Component
 * Handles inline editing for different field types
 */
const EditableCell = ({ value, onChange, type, options, isEditing, onStartEdit, onFinishEdit, onCancelEdit, fieldKey }) => {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(editValue);
    onFinishEdit();
  };

  const handleCancel = () => {
    setEditValue(value);
    onCancelEdit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Display mode
  if (!isEditing) {
    const displayValue = (() => {
      if (value === null || value === undefined) return <span className="text-green-400/60">—</span>;

      switch (type) {
        case 'boolean':
          return (
            <Badge variant={value ? 'default' : 'outline'} className="text-xs bg-green-400/20 text-green-400 border-green-400">
              {value ? 'Yes' : 'No'}
            </Badge>
          );
        case 'array':
          return Array.isArray(value) && value.length > 0
            ? <span className="text-xs text-green-400">{value.join(', ')}</span>
            : <span className="text-green-400/60">—</span>;
        case 'date':
          return value ? <span className="text-green-400">{new Date(value).toLocaleDateString()}</span> : <span className="text-green-400/60">—</span>;
        case 'number':
          return value !== null && value !== undefined ? <span className="text-green-400">{value}</span> : <span className="text-green-400/60">—</span>;
        case 'textarea':
          const textValue = typeof value === 'string' ? value : String(value || '');
          return (
            <div className="line-clamp-2 text-xs text-green-400">
              {textValue.substring(0, 100) || <span className="text-green-400/60">—</span>}
            </div>
          );
        case 'image':
          return value ? (
            <div className="flex items-center space-x-2">
              <img src={value} alt="" className="w-8 h-8 object-cover rounded" />
              <span className="text-xs truncate max-w-[100px] text-green-400">{value}</span>
            </div>
          ) : <span className="text-green-400/60">—</span>;
        default:
          const stringValue = typeof value === 'string' ? value : String(value || '');
          return <span className="truncate text-green-400">{stringValue}</span>;
      }
    })();

    return (
      <div
        className="p-2 min-h-[40px] cursor-pointer hover:bg-green-400/20 rounded flex items-center justify-between group transition-colors"
        onClick={onStartEdit}
      >
        <div className="flex-1 min-w-0">{displayValue}</div>
        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-green-400" />
      </div>
    );
  }

  // Edit mode
  return (
    <div className="p-1 border-2 border-green-400 rounded bg-black/50">
      {type === 'select' && options ? (
        <Select value={editValue || ''} onValueChange={setEditValue}>
          <SelectTrigger className="w-full bg-black border-green-400/30 text-green-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-green-400/30">
            {options.map((option) => (
              <SelectItem key={option} value={option} className="text-green-400">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === 'textarea' ? (
        <Textarea
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px] bg-black border-green-400/30 text-green-400 font-mono"
          autoFocus
        />
      ) : type === 'boolean' ? (
        <Select value={editValue?.toString() || 'false'} onValueChange={(val) => setEditValue(val === 'true')}>
          <SelectTrigger className="w-full bg-black border-green-400/30 text-green-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-green-400/30">
            <SelectItem value="true" className="text-green-400">Yes</SelectItem>
            <SelectItem value="false" className="text-green-400">No</SelectItem>
          </SelectContent>
        </Select>
      ) : type === 'date' ? (
        <Input
          type="date"
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-black border-green-400/30 text-green-400 font-mono"
          autoFocus
        />
      ) : type === 'array' ? (
        <Input
          value={Array.isArray(editValue) ? editValue.join(', ') : editValue || ''}
          onChange={(e) => setEditValue(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          onKeyDown={handleKeyDown}
          placeholder="Comma-separated values"
          className="bg-black border-green-400/30 text-green-400 font-mono"
          autoFocus
        />
      ) : (
        <Input
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-black border-green-400/30 text-green-400 font-mono"
          autoFocus
        />
      )}
      <div className="flex space-x-1 mt-1">
        <Button
          size="sm"
          onClick={handleSave}
          className="bg-green-400 text-black hover:bg-green-300 h-7 px-2"
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          className="border-red-400 text-red-400 hover:bg-red-400/20 h-7 px-2"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

/**
 * SpreadsheetEditor Component
 * Main spreadsheet interface for table editing
 */
const SpreadsheetEditor = ({
  tableName,
  columns,
  data,
  onUpdate,
  onCreate,
  onDelete,
  isLoading,
  error
}) => {
  const [rows, setRows] = useState(data || []);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(columns.map(c => c.key)));
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setRows(data || []);
  }, [data]);

  const handleCellEdit = (rowId, columnKey, newValue) => {
    const updatedRow = rows.find(r => r.id === rowId);
    if (updatedRow) {
      const updated = { ...updatedRow, [columnKey]: newValue };
      onUpdate(rowId, { [columnKey]: newValue });

      // Optimistic update
      setRows(prev => prev.map(r => r.id === rowId ? updated : r));
    }
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach(col => {
      if (col.key !== 'id' && col.key !== 'created_at' && col.key !== 'updated_at') {
        newRow[col.key] = col.type === 'boolean' ? false : col.type === 'array' ? [] : '';
      }
    });
    onCreate(newRow);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) return;
    if (!confirm(`Delete ${selectedRows.size} row(s)?`)) return;

    selectedRows.forEach(rowId => onDelete(rowId));
    setSelectedRows(new Set());
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(columnKey)) {
        next.delete(columnKey);
      } else {
        next.add(columnKey);
      }
      return next;
    });
  };

  const filteredRows = rows.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    return aVal > bVal ? direction : -direction;
  });

  const visibleColumnsList = columns.filter(c => visibleColumns.has(c.key));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-black/50 border border-green-400/30 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleAddRow}
            className="bg-green-400 text-black hover:bg-green-300"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
          <Button
            onClick={handleDeleteSelected}
            disabled={selectedRows.size === 0}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400/20 disabled:opacity-50"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete ({selectedRows.size})
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-black border-green-400/30 text-green-400 font-mono"
          />
          <Badge variant="outline" className="text-green-400 border-green-400">
            {sortedRows.length} rows
          </Badge>
        </div>
      </div>

      {/* Column Visibility Toggle */}
      <details className="bg-black/50 border border-green-400/30 rounded-lg p-4">
        <summary className="cursor-pointer text-green-400 font-mono text-sm flex items-center">
          <EyeOff className="w-4 h-4 mr-2" />
          Column Visibility ({visibleColumnsList.length}/{columns.length})
        </summary>
        <div className="flex flex-wrap gap-2 mt-4">
          {columns.map(col => (
            <Badge
              key={col.key}
              variant={visibleColumns.has(col.key) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleColumnVisibility(col.key)}
            >
              {visibleColumns.has(col.key) ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
              {col.label}
            </Badge>
          ))}
        </div>
      </details>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-400 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {/* Table */}
      <div className="border border-green-400/30 rounded-lg overflow-hidden bg-black/90">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-400/20 border-b border-green-400/30">
              <tr>
                <th className="p-2 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === sortedRows.length && sortedRows.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(new Set(sortedRows.map(r => r.id)));
                      } else {
                        setSelectedRows(new Set());
                      }
                    }}
                    className="rounded border-green-400"
                  />
                </th>
                {visibleColumnsList.map((col) => (
                  <th
                    key={col.key}
                    className="p-2 text-left text-green-400 font-mono cursor-pointer hover:bg-green-400/20 transition-colors"
                    style={{ minWidth: col.minWidth || 100, width: col.width || 'auto' }}
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {sortColumn === col.key && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-2 text-left w-20 text-green-400 font-mono">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-black/70">
              {isLoading ? (
                <tr>
                  <td colSpan={visibleColumnsList.length + 2} className="p-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-green-400" />
                    <div className="text-green-400 mt-2">Loading...</div>
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumnsList.length + 2} className="p-8 text-center text-green-400/60">
                    No data found
                  </td>
                </tr>
              ) : (
                sortedRows.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    className={`border-b border-green-400/10 hover:bg-green-400/10 transition-colors ${
                      selectedRows.has(row.id) ? 'bg-green-400/15' : 'bg-black/50'
                    }`}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={(e) => {
                          setSelectedRows(prev => {
                            const next = new Set(prev);
                            if (e.target.checked) {
                              next.add(row.id);
                            } else {
                              next.delete(row.id);
                            }
                            return next;
                          });
                        }}
                        className="rounded border-green-400"
                      />
                    </td>
                    {visibleColumnsList.map((col) => (
                      <td key={col.key} className="p-0">
                        <EditableCell
                          value={row[col.key]}
                          onChange={(newValue) => handleCellEdit(row.id, col.key, newValue)}
                          type={col.type}
                          options={col.options}
                          fieldKey={col.key}
                          isEditing={editingCell === `${row.id}-${col.key}`}
                          onStartEdit={() => setEditingCell(`${row.id}-${col.key}`)}
                          onFinishEdit={() => setEditingCell(null)}
                          onCancelEdit={() => setEditingCell(null)}
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Delete this row?')) {
                            onDelete(row.id);
                          }
                        }}
                        className="border-red-400/50 text-red-400 hover:bg-red-400/20 h-7 px-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-xs text-green-400/60 font-mono">
        <div>Table: {tableName}</div>
        <div>
          Showing {sortedRows.length} of {rows.length} rows
          {searchTerm && ` (filtered)`}
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
